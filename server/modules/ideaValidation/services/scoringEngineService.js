import prisma from '../../../config/dbconnect.js';
import { chatJSON, MODELS, msg } from '../../../services/groqService.js';
import demandAnalysisService from './demandAnalysisService.js';
import competitionAnalysisService from './competitionAnalysisService.js';

/**
 * Scoring Engine Service
 * Numerical scoring formulas unchanged; risk descriptions + recommendations now Groq-powered.
 */
class ScoringEngineService {
  async calculateScores(analysisId) {
    console.log('[ScoringEngine] Calculating scores...');
    const demandScore = await this.calculateDemandScore(analysisId);
    const buyingIntentScore = await demandAnalysisService.calculateBuyingIntent(analysisId);
    const saturationIndex = await this.calculateSaturationIndex(analysisId);
    const validationScore = this.calculateValidationScore(demandScore, buyingIntentScore, saturationIndex);
    const { verdict, confidenceLevel } = this.determineVerdict(validationScore, demandScore, saturationIndex);

    console.log(`[ScoringEngine] D=${demandScore.toFixed(0)} BI=${buyingIntentScore.toFixed(0)} SI=${saturationIndex.toFixed(0)} VS=${validationScore.toFixed(0)} => ${verdict}`);

    await competitionAnalysisService.identifyGaps(analysisId);
    await this.generateRiskFactors(analysisId, { demandScore, buyingIntentScore, saturationIndex, validationScore });
    await this.generateStrategicRecommendations(analysisId, { verdict, validationScore, demandScore, saturationIndex });

    return { demandScore, buyingIntentScore, saturationIndex, validationScore, verdict, confidenceLevel };
  }

  async calculateDemandScore(analysisId) {
    const signals = await prisma.demandSignal.findMany({ where: { analysisId } });
    if (!signals.length) return 0;
    let total = 0, max = 0;
    signals.forEach(s => {
      total += s.frequency * s.painIntensity * s.recencyWeight;
      max += s.frequency * 10 * 1.0;
    });
    return Math.min(100, Math.max(0, max > 0 ? (total / max) * 100 : 0));
  }

  async calculateSaturationIndex(analysisId) {
    const competitors = await prisma.competitor.findMany({ where: { analysisId } });
    if (!competitors.length) return 0;
    const cFactor = Math.min(competitors.length / 10, 1.0);
    const mFactor = this._maturityFactor(competitors);
    const oFactor = this._overlapFactor(competitors);
    return Math.min(100, Math.max(0, ((cFactor + mFactor + oFactor) / 3) * 100));
  }

  _maturityFactor(competitors) {
    const dominant = competitors.some(c => c.marketShare === 'dominant');
    const major = competitors.filter(c => c.marketShare === 'major').length;
    if (dominant && major >= 2) return 1.0;
    if (dominant || major >= 3) return 0.7;
    if (major >= 1) return 0.4;
    return 0.2;
  }

  _overlapFactor(competitors) {
    const avg = competitors.reduce((s, c) => s + (Array.isArray(c.featureGaps) ? c.featureGaps.length : 0), 0) / competitors.length;
    if (avg > 5) return 0.3;
    if (avg > 3) return 0.5;
    if (avg > 1) return 0.7;
    return 0.9;
  }

  calculateValidationScore(demandScore, buyingIntentScore, saturationIndex) {
    if (!demandScore || !buyingIntentScore) return 0;
    if (!saturationIndex) return Math.min(100, (demandScore + buyingIntentScore) / 2);
    const penalty = 1 + saturationIndex / 100;
    return Math.min(100, Math.max(0, (demandScore * buyingIntentScore) / (penalty * 100) * 100));
  }

  determineVerdict(validationScore, demandScore, saturationIndex) {
    if (validationScore >= 80) return { verdict: 'BUILD', confidenceLevel: 'HIGH' };
    if (validationScore >= 60) return { verdict: 'PIVOT', confidenceLevel: demandScore >= 70 ? 'MEDIUM' : 'LOW' };
    if (validationScore >= 40) return { verdict: 'PIVOT', confidenceLevel: 'LOW' };
    return { verdict: 'KILL', confidenceLevel: saturationIndex >= 70 ? 'HIGH' : 'MEDIUM' };
  }

  // ── Risk Factors (Groq-enriched descriptions) ─────────────────────────────
  async generateRiskFactors(analysisId, scores) {
    const { demandScore, buyingIntentScore, saturationIndex, validationScore } = scores;

    // Fetch idea context for Groq
    const analysis = await prisma.ideaAnalysis.findUnique({
      where: { id: analysisId },
      include: { submission: true },
    });
    const ideaDescription = analysis?.submission?.ideaDescription || '';

    // Determine which risks apply (rule-based)
    const riskTemplates = [];
    if (demandScore < 40)
      riskTemplates.push({ type: 'weak_demand', severity: demandScore < 20 ? 'CRITICAL' : 'HIGH', pof: 1 - demandScore / 100 });
    if (saturationIndex >= 67)
      riskTemplates.push({ type: 'market_saturation', severity: saturationIndex >= 80 ? 'CRITICAL' : 'HIGH', pof: saturationIndex / 100 });
    if (buyingIntentScore < 40)
      riskTemplates.push({ type: 'low_buying_intent', severity: 'MEDIUM', pof: 0.6 });
    if (validationScore < 40)
      riskTemplates.push({ type: 'validation_failure', severity: 'CRITICAL', pof: 0.8 });

    const dominants = await prisma.competitor.findMany({ where: { analysisId, marketShare: 'dominant' } });
    if (dominants.length)
      riskTemplates.push({ type: 'dominant_player', severity: 'HIGH', pof: 0.7, competitors: dominants.map(c => c.name) });

    if (!riskTemplates.length) return [];

    // Use Groq to write idea-specific descriptions
    let enriched = riskTemplates;
    if (ideaDescription) {
      try {
        const resp = await chatJSON(msg(
          'You are a startup risk analyst. Write specific, actionable risk descriptions for a startup idea.',
          `Startup idea: "${ideaDescription.substring(0, 300)}"
Scores: demand=${demandScore.toFixed(0)}, buyingIntent=${buyingIntentScore.toFixed(0)}, saturation=${saturationIndex.toFixed(0)}, validation=${validationScore.toFixed(0)}

Risk types identified: ${riskTemplates.map(r => r.type).join(', ')}

For each risk type, write a specific 2-sentence description relevant to THIS idea. Return JSON:
{
  "risks": [
    { "type": "risk_type", "description": "2-sentence specific risk description for this idea" }
  ]
}`
        ), { model: MODELS.fast, maxTokens: 800 });

        if (Array.isArray(resp.risks)) {
          const descMap = Object.fromEntries(resp.risks.map(r => [r.type, r.description]));
          enriched = riskTemplates.map(r => ({ ...r, description: descMap[r.type] || null }));
        }
      } catch (err) {
        console.error('[ScoringEngine] Risk Groq enrichment failed:', err.message);
      }
    }

    // Fallback descriptions
    const fallbackDesc = {
      weak_demand: 'Market demand signals are weak. Limited evidence of users actively seeking solutions.',
      market_saturation: 'Market is highly saturated. Red ocean with intense competition.',
      low_buying_intent: 'Users are not actively seeking to purchase new solutions.',
      validation_failure: 'Multiple validation red flags present. High probability of failure.',
      dominant_player: `Dominant players exist. Switching costs and brand loyalty are high barriers.`,
    };

    const risks = enriched.map((r, i) => ({
      rank: i + 1,
      riskType: r.type,
      severity: r.severity,
      description: r.description || fallbackDesc[r.type] || 'Risk identified.',
      probabilityOfFailure: `${Math.round(r.pof * 100)}%`,
      evidence: r.competitors ? r.competitors.map(name => ({ name })) : [],
    }));

    for (const risk of risks) {
      await prisma.riskFactor.create({ data: { analysisId, ...risk } });
    }

    return risks;
  }

  // ── Strategic Recommendations (Groq-powered) ──────────────────────────────
  async generateStrategicRecommendations(analysisId, context) {
    const { verdict, validationScore, demandScore, saturationIndex } = context;

    const [analysis, gaps] = await Promise.all([
      prisma.ideaAnalysis.findUnique({ where: { id: analysisId }, include: { submission: true } }),
      prisma.gapOpportunity.findMany({ where: { analysisId, impactPotential: { in: ['HIGH', 'MEDIUM'] } }, orderBy: { rank: 'asc' } }),
    ]);

    const ideaDescription = analysis?.submission?.ideaDescription || '';
    const targetAudience = analysis?.submission?.targetAudience || '';
    const gapText = gaps.map(g => `- ${g.description} (${g.impactPotential} impact, ${g.effortToAddress} effort)`).join('\n');

    let recommendation = {};

    try {
      const resp = await chatJSON(msg(
        'You are a startup strategist. Generate specific, actionable recommendations for a startup idea.',
        `Startup idea: "${ideaDescription.substring(0, 400)}"
Target audience: ${targetAudience || 'not specified'}
Verdict: ${verdict} (validation score: ${validationScore.toFixed(0)}/100)
Demand score: ${demandScore.toFixed(0)}, Saturation: ${saturationIndex.toFixed(0)}

Identified market gaps:
${gapText || 'None identified'}

Generate strategic recommendation. Return JSON:
{
  "recommendationType": "positioning|differentiation|niche_target|alternative_direction",
  "description": "2-3 sentence strategic recommendation specific to this idea",
  "refinedICP": {
    "targetSegment": "Very specific customer segment description",
    "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3"]
  },
  "specificActions": [
    { "action": "Specific actionable step", "priority": "high|medium|low", "effort": "LOW|MEDIUM|HIGH" }
  ],
  "expectedOutcome": "What success looks like in 90 days"
}`
      ), { model: MODELS.strong, maxTokens: 1200 });
      recommendation = resp;
    } catch (err) {
      console.error('[ScoringEngine] Recommendation Groq failed:', err.message);
      recommendation = this._fallbackRecommendation(verdict, gaps);
    }

    await prisma.strategicRecommendation.create({
      data: {
        analysisId,
        recommendationType: recommendation.recommendationType || 'positioning',
        description: recommendation.description || 'Proceed with caution and validate further.',
        refinedICP: recommendation.refinedICP || {},
        specificActions: recommendation.specificActions || [],
        basedOnGaps: gaps.map(g => g.id),
        expectedOutcome: recommendation.expectedOutcome || 'Gain market traction',
      },
    });

    return [recommendation];
  }

  _fallbackRecommendation(verdict, gaps) {
    if (verdict === 'BUILD') {
      return {
        recommendationType: 'positioning',
        description: 'Strong validation. Execute rapidly and capture early adopters.',
        refinedICP: { targetSegment: 'Early adopters with highest pain intensity', characteristics: ['High problem awareness', 'Active solution seeker', 'Willing to switch'] },
        specificActions: [
          { action: 'Build MVP focused on core value prop', priority: 'high', effort: 'MEDIUM' },
          { action: 'Target early adopters first', priority: 'high', effort: 'LOW' },
        ],
        expectedOutcome: 'First paying customers within 60 days',
      };
    }
    if (verdict === 'PIVOT') {
      return {
        recommendationType: 'differentiation',
        description: 'Market exists but needs strategic differentiation. Focus on gaps.',
        specificActions: gaps.slice(0, 3).map((g, i) => ({ action: `Address: ${g.description}`, priority: i === 0 ? 'high' : 'medium', effort: g.effortToAddress })),
        refinedICP: { targetSegment: 'Users frustrated with current solutions', characteristics: ['Aware of problem', 'Tried alternatives'] },
        expectedOutcome: 'Validated niche within 30 days',
      };
    }
    return {
      recommendationType: 'alternative_direction',
      description: 'Current validation fails. Explore adjacent problem spaces.',
      specificActions: [
        { action: 'Interview 20 target users about their actual pain', priority: 'high', effort: 'LOW' },
        { action: 'Validate problem-solution fit before building', priority: 'high', effort: 'LOW' },
      ],
      refinedICP: null,
      expectedOutcome: 'Discover a better problem worth solving',
    };
  }
}

export default new ScoringEngineService();
