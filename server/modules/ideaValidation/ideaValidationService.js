import prisma from '../../config/dbconnect.js';
import { chatJSON, MODELS, msg } from '../../services/groqService.js';
import ideaStructuringService from './services/ideaStructuringService.js';
import demandAnalysisService from './services/demandAnalysisService.js';
import competitionAnalysisService from './services/competitionAnalysisService.js';
import scoringEngineService from './services/scoringEngineService.js';
import reportGeneratorService from './services/reportGeneratorService.js';

class IdeaValidationService {
  // ── Submit ──────────────────────────────────────────────────────────────
  async submitIdea(data) {
    try {
      const { userId, ideaDescription, targetAudience, geography, pricingAssumption, stage } = data;

      // Ensure the user row exists (upsert guest user or any unregistered caller)
      const resolvedUserId = (userId && userId !== 'guest') ? userId : 'guest_anon';
      await prisma.user.upsert({
        where: { id: resolvedUserId },
        create: { id: resolvedUserId, email: `${resolvedUserId}@marketiq.local`, name: 'Guest' },
        update: {},
      });

      const submission = await prisma.ideaSubmission.create({
        data: { userId: resolvedUserId, ideaDescription, targetAudience, geography, pricingAssumption, stage, status: 'pending' },
      });

      const clarification = await this.checkClarificationNeeded(submission);
      if (clarification.needed) {
        await prisma.ideaSubmission.update({
          where: { id: submission.id },
          data: { clarificationAsked: clarification.questions },
        });
        return { success: true, data: { submissionId: submission.id, status: 'clarification_needed', questions: clarification.questions } };
      }
      return { success: true, data: { submissionId: submission.id, status: 'ready_for_analysis' } };
    } catch (err) {
      console.error('Submit idea error:', err);
      return { success: false, error: err.message };
    }
  }

  // ── Groq-powered clarification check ────────────────────────────────────
  async checkClarificationNeeded(submission) {
    try {
      const resp = await chatJSON(msg(
        'You are a market research assistant. Determine if a startup idea needs clarification before analysis.',
        `Idea: "${submission.ideaDescription}"
Already provided:
- Target audience: ${submission.targetAudience || 'not provided'}
- Geography: ${submission.geography || 'not provided'}
- Pricing assumption: ${submission.pricingAssumption || 'not provided'}

Determine if any critical information is missing that would significantly affect market analysis accuracy.
Only ask if genuinely missing and analytically important. Max 3 questions.

Return JSON:
{
  "needed": true|false,
  "questions": [
    { "id": "unique_snake_case_id", "question": "Clear, specific question?", "type": "text" }
  ]
}`
      ), { model: MODELS.fast, maxTokens: 400 });

      return {
        needed: !!resp.needed && Array.isArray(resp.questions) && resp.questions.length > 0,
        questions: (resp.questions || []).slice(0, 3),
      };
    } catch (err) {
      console.error('[Validation] Clarification check failed, using fallback:', err.message);
      return this._fallbackClarification(submission);
    }
  }

  _fallbackClarification(submission) {
    const questions = [];
    if (!submission.targetAudience?.trim())
      questions.push({ id: 'target_audience', question: 'Who is your primary target audience?', type: 'text' });
    if (!submission.geography?.trim())
      questions.push({ id: 'geography', question: 'What is your target geography?', type: 'text' });
    if (!submission.pricingAssumption?.trim())
      questions.push({ id: 'pricing', question: 'What is your pricing assumption?', type: 'text' });
    return { needed: questions.length > 0, questions: questions.slice(0, 3) };
  }

  // ── Clarification answers ────────────────────────────────────────────────
  async provideClarification(submissionId, answers) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({ where: { id: submissionId } });
      if (!submission) return { success: false, error: 'Submission not found' };
      await prisma.ideaSubmission.update({
        where: { id: submissionId },
        data: {
          clarificationAnswers: answers,
          targetAudience: answers.find(a => a.id === 'target_audience')?.answer || submission.targetAudience,
          geography: answers.find(a => a.id === 'geography')?.answer || submission.geography,
          pricingAssumption: answers.find(a => a.id === 'pricing')?.answer || submission.pricingAssumption,
        },
      });
      return { success: true, data: { submissionId, status: 'ready_for_analysis' } };
    } catch (err) {
      console.error('Clarification error:', err);
      return { success: false, error: err.message };
    }
  }

  // ── Start Analysis ───────────────────────────────────────────────────────
  async startAnalysis(submissionId) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({ where: { id: submissionId } });
      if (!submission) return { success: false, error: 'Submission not found' };

      const analysis = await prisma.ideaAnalysis.create({
        data: { submissionId, status: 'processing', startedAt: new Date() },
      });

      // Run in background — don't await
      this._runAnalysisPipeline(analysis.id, submission).catch(err => {
        console.error('[Analysis] Pipeline error:', err);
        prisma.ideaAnalysis.update({ where: { id: analysis.id }, data: { status: 'failed' } }).catch(() => {});
      });

      await prisma.ideaSubmission.update({ where: { id: submissionId }, data: { status: 'analyzing' } });

      return { success: true, data: { analysisId: analysis.id, status: 'processing' } };
    } catch (err) {
      console.error('Start analysis error:', err);
      return { success: false, error: err.message };
    }
  }

  async _runAnalysisPipeline(analysisId, submission) {
    console.log(`[Pipeline] Starting for analysisId=${analysisId}`);
    const structuredIdea = await ideaStructuringService.structureIdea(submission);
    console.log('[Pipeline] Idea structured');

    await demandAnalysisService.analyzeDemand(analysisId, structuredIdea);
    console.log('[Pipeline] Demand analyzed');

    await competitionAnalysisService.analyzeCompetition(analysisId, structuredIdea);
    console.log('[Pipeline] Competition analyzed');

    const scores = await scoringEngineService.calculateScores(analysisId);
    console.log('[Pipeline] Scores calculated');

    await prisma.ideaAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        structuredIdea,
        demandScore: scores.demandScore,
        buyingIntentScore: scores.buyingIntentScore,
        saturationIndex: scores.saturationIndex,
        validationScore: scores.validationScore,
        verdict: scores.verdict,
        confidenceLevel: scores.confidenceLevel,
      },
    });

    await reportGeneratorService.generateReport(analysisId);
    await prisma.ideaSubmission.update({ where: { id: submission.id }, data: { status: 'completed' } });
    console.log(`[Pipeline] Completed for analysisId=${analysisId}`);
  }

  // ── Get Status ───────────────────────────────────────────────────────────
  async getStatus(submissionId) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({
        where: { id: submissionId },
        include: { analyses: { orderBy: { createdAt: 'desc' }, take: 1 } },
      });
      if (!submission) return { success: false, error: 'Submission not found' };
      const analysis = submission.analyses[0];
      return {
        success: true,
        data: {
          submissionId,
          status: analysis?.status || submission.status,
          analysisId: analysis?.id,
          progress: this._statusToProgress(analysis?.status || submission.status),
          startedAt: analysis?.startedAt,
          completedAt: analysis?.completedAt,
        },
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  _statusToProgress(status) {
    return { pending: 10, analyzing: 50, processing: 50, completed: 100, failed: 0 }[status] ?? 0;
  }

  // ── Get Report ───────────────────────────────────────────────────────────
  async getReport(submissionId) {
    try {
      const analysis = await prisma.ideaAnalysis.findFirst({
        where: { submissionId },
        include: { report: true },
        orderBy: { createdAt: 'desc' },
      });
      if (!analysis) return { success: false, error: 'Analysis not found' };
      if (!analysis.report) return { success: false, error: 'Report not yet generated' };
      return { success: true, data: analysis.report };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // ── Get User Submissions ─────────────────────────────────────────────────
  async getUserSubmissions(userId) {
    try {
      const submissions = await prisma.ideaSubmission.findMany({
        where: { userId },
        include: { analyses: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, data: submissions };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // ── Predict Context (AI target audience + pricing) ───────────────────────
  async predictContext(ideaDescription) {
    try {
      const resp = await chatJSON(msg(
        'You are a startup market analyst. Given a startup idea, predict the most likely target audience, pricing model, and primary geography. Be specific and realistic.',
        `Startup idea: "${ideaDescription}"

Predict in JSON format:
{
  "targetAudience": "Specific customer segment (e.g., 'B2B SaaS founders at early-stage startups with <$1M ARR')",
  "pricingAssumption": "Realistic pricing model + price point (e.g., '$29/month per seat, free trial 14 days')",
  "geographySuggestion": "Primary target geography (e.g., 'US, Canada' or 'Global' or 'Southeast Asia')",
  "reasoning": "2-sentence reasoning for these predictions"
}`
      ), { model: MODELS.fast, maxTokens: 500 });

      return {
        success: true,
        data: {
          targetAudience: resp.targetAudience || '',
          pricingAssumption: resp.pricingAssumption || '',
          geographySuggestion: resp.geographySuggestion || 'US',
          reasoning: resp.reasoning || '',
        },
      };
    } catch (err) {
      console.error('[Validation] predictContext failed:', err.message);
      return { success: false, error: 'AI prediction failed. Please fill manually.' };
    }
  }
}

export default new IdeaValidationService();
