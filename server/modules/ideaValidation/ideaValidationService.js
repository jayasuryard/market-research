import prisma from '../../config/dbconnect.js';
import ideaStructuringService from './services/ideaStructuringService.js';
import demandAnalysisService from './services/demandAnalysisService.js';
import competitionAnalysisService from './services/competitionAnalysisService.js';
import scoringEngineService from './services/scoringEngineService.js';
import reportGeneratorService from './services/reportGeneratorService.js';

/**
 * Idea Validation Service
 * Main orchestrator for the market validation process
 */

class IdeaValidationService {
  /**
   * Submit a new idea for validation
   */
  async submitIdea(data) {
    try {
      const { userId, ideaDescription, targetAudience, geography, pricingAssumption, stage } = data;
      
      // Create submission
      const submission = await prisma.ideaSubmission.create({
        data: {
          userId,
          ideaDescription,
          targetAudience,
          geography,
          pricingAssumption,
          stage,
          status: 'pending'
        }
      });
      
      // Check if clarification is needed
      const clarificationNeeded = await this.checkClarificationNeeded(submission);
      
      if (clarificationNeeded.needed) {
        await prisma.ideaSubmission.update({
          where: { id: submission.id },
          data: {
            clarificationAsked: clarificationNeeded.questions
          }
        });
        
        return {
          success: true,
          data: {
            submissionId: submission.id,
            status: 'clarification_needed',
            questions: clarificationNeeded.questions
          }
        };
      }
      
      // If no clarification needed, can start analysis directly
      return {
        success: true,
        data: {
          submissionId: submission.id,
          status: 'ready_for_analysis',
          message: 'Idea submitted successfully. Ready for analysis.'
        }
      };
    } catch (error) {
      console.error('Submit idea error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if clarification questions are needed
   */
  async checkClarificationNeeded(submission) {
    const questions = [];
    
    // Max 5 questions as per requirement
    if (!submission.targetAudience || submission.targetAudience.trim() === '') {
      questions.push({
        id: 'target_audience',
        question: 'Who is your primary target audience? (e.g., "B2B SaaS founders", "E-commerce store owners")',
        type: 'text'
      });
    }
    
    if (!submission.geography || submission.geography.trim() === '') {
      questions.push({
        id: 'geography',
        question: 'What is your target geography? (e.g., "US", "Global", "Southeast Asia")',
        type: 'text'
      });
    }
    
    if (!submission.pricingAssumption || submission.pricingAssumption.trim() === '') {
      questions.push({
        id: 'pricing',
        question: 'What is your pricing assumption? (e.g., "$29/month", "Free with premium", "One-time $99")',
        type: 'text'
      });
    }
    
    // Analyze idea description for ambiguity
    const descriptionLength = submission.ideaDescription.split(' ').length;
    if (descriptionLength < 20) {
      questions.push({
        id: 'problem_detail',
        question: 'Can you describe the specific problem this solves in more detail?',
        type: 'text'
      });
    }
    
    // Check if use case is clear
    const hasUseCaseKeywords = /\b(for|helps|enables|allows|solves)\b/i.test(submission.ideaDescription);
    if (!hasUseCaseKeywords && questions.length < 5) {
      questions.push({
        id: 'use_case',
        question: 'What is the primary use case? What specific task or job does this help users accomplish?',
        type: 'text'
      });
    }
    
    return {
      needed: questions.length > 0,
      questions: questions.slice(0, 5) // Max 5 questions
    };
  }

  /**
   * Provide clarification answers
   */
  async provideClarification(submissionId, answers) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({
        where: { id: submissionId }
      });
      
      if (!submission) {
        return { success: false, error: 'Submission not found' };
      }
      
      // Update submission with clarification answers
      await prisma.ideaSubmission.update({
        where: { id: submissionId },
        data: {
          clarificationAnswers: answers,
          // Update fields based on answers
          targetAudience: answers.find(a => a.id === 'target_audience')?.answer || submission.targetAudience,
          geography: answers.find(a => a.id === 'geography')?.answer || submission.geography,
          pricingAssumption: answers.find(a => a.id === 'pricing')?.answer || submission.pricingAssumption
        }
      });
      
      return {
        success: true,
        data: {
          submissionId,
          status: 'ready_for_analysis',
          message: 'Clarification received. Ready for analysis.'
        }
      };
    } catch (error) {
      console.error('Provide clarification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Start the full analysis process
   */
  async startAnalysis(submissionId) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({
        where: { id: submissionId }
      });
      
      if (!submission) {
        return { success: false, error: 'Submission not found' };
      }
      
      // Update status to processing
      await prisma.ideaSubmission.update({
        where: { id: submissionId },
        data: { status: 'processing' }
      });
      
      // Run analysis in background (in production, use queue)
      this.runAnalysis(submissionId).catch(error => {
        console.error('Analysis error:', error);
        prisma.ideaSubmission.update({
          where: { id: submissionId },
          data: { status: 'failed' }
        });
      });
      
      return {
        success: true,
        data: {
          submissionId,
          status: 'processing',
          message: 'Analysis started. This may take a few minutes.'
        }
      };
    } catch (error) {
      console.error('Start analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Run the complete analysis process
   */
  async runAnalysis(submissionId) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({
        where: { id: submissionId }
      });
      
      console.log(`[Analysis] Starting for submission ${submissionId}`);
      
      // STEP 1: Structure the idea
      console.log('[Analysis] Step 1: Structuring idea...');
      const structuredIdea = await ideaStructuringService.structureIdea(submission);
      
      // Create analysis record
      const analysis = await prisma.ideaAnalysis.create({
        data: {
          submissionId,
          problemStatement: structuredIdea.problemStatement,
          targetSegments: structuredIdea.targetSegments,
          jobToBeDone: structuredIdea.jobToBeDone,
          primaryUseCases: structuredIdea.primaryUseCases,
          substituteSolutions: structuredIdea.substituteSolutions,
          demandScore: 0,
          buyingIntentScore: 0,
          saturationIndex: 0,
          validationScore: 0,
          verdict: 'PENDING',
          confidenceLevel: 'LOW'
        }
      });
      
      // STEP 2: Demand signal extraction and scoring
      console.log('[Analysis] Step 2: Extracting demand signals...');
      const demandResult = await demandAnalysisService.analyzeDemand(analysis.id, structuredIdea);
      
      // STEP 3: Competition analysis
      console.log('[Analysis] Step 3: Analyzing competition...');
      const competitionResult = await competitionAnalysisService.analyzeCompetition(analysis.id, structuredIdea);
      
      // STEP 4: Calculate all scores
      console.log('[Analysis] Step 4: Calculating scores...');
      const scores = await scoringEngineService.calculateScores(analysis.id);
      
      // Update analysis with scores
      await prisma.ideaAnalysis.update({
        where: { id: analysis.id },
        data: {
          demandScore: scores.demandScore,
          buyingIntentScore: scores.buyingIntentScore,
          saturationIndex: scores.saturationIndex,
          validationScore: scores.validationScore,
          verdict: scores.verdict,
          confidenceLevel: scores.confidenceLevel
        }
      });
      
      // STEP 5: Generate final report
      console.log('[Analysis] Step 5: Generating report...');
      await reportGeneratorService.generateReport(analysis.id);
      
      // Update submission status
      await prisma.ideaSubmission.update({
        where: { id: submissionId },
        data: { status: 'completed' }
      });
      
      console.log(`[Analysis] Completed for submission ${submissionId}`);
      
      return { success: true };
    } catch (error) {
      console.error('Run analysis error:', error);
      throw error;
    }
  }

  /**
   * Get analysis status
   */
  async getStatus(submissionId) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({
        where: { id: submissionId },
        include: {
          analysis: {
            select: {
              validationScore: true,
              verdict: true
            }
          }
        }
      });
      
      if (!submission) {
        return { success: false, error: 'Submission not found' };
      }
      
      return {
        success: true,
        data: {
          submissionId: submission.id,
          status: submission.status,
          analysis: submission.analysis
        }
      };
    } catch (error) {
      console.error('Get status error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get the final validation report
   */
  async getReport(submissionId) {
    try {
      const submission = await prisma.ideaSubmission.findUnique({
        where: { id: submissionId },
        include: {
          analysis: {
            include: {
              report: true
            }
          }
        }
      });
      
      if (!submission) {
        return { success: false, error: 'Submission not found' };
      }
      
      if (submission.status !== 'completed') {
        return { success: false, error: `Analysis not ready. Status: ${submission.status}` };
      }
      
      if (!submission.analysis?.report) {
        return { success: false, error: 'Report not found' };
      }
      
      return {
        success: true,
        data: submission.analysis.report
      };
    } catch (error) {
      console.error('Get report error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all submissions for a user
   */
  async getUserSubmissions(userId) {
    try {
      const submissions = await prisma.ideaSubmission.findMany({
        where: { userId },
        include: {
          analysis: {
            select: {
              validationScore: true,
              verdict: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return {
        success: true,
        data: submissions
      };
    } catch (error) {
      console.error('Get user submissions error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new IdeaValidationService();
