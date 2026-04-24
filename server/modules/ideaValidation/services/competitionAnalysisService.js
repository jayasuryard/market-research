import prisma from '../../../config/dbconnect.js';
import { chatJSON, MODELS, msg } from '../../../services/groqService.js';
import { googleSearch } from '../../../services/apifyService.js';

/**
 * Competition Analysis Service  —  Apify + Groq powered
 */
class CompetitionAnalysisService {
  async analyzeCompetition(analysisId, structuredIdea) {
    const { problemStatement, keywords = [], problemCategory = 'other' } = structuredIdea;
    console.log('[CompetitionAnalysis] Identifying competitors via Apify...');

    const searchQueries = [
      `${keywords[0] || problemStatement} software tool alternatives`,
      `best ${keywords[0] || problemStatement} tools 2024`,
      `${problemCategory} startups ${keywords[0] || ''}`,
    ].join('\n');

    const results = await googleSearch(searchQueries, 15);

    const competitors = results.length
      ? await this._extractCompetitorsWithGroq(problemStatement, keywords, results)
      : this._fallbackCompetitors(problemStatement);

    for (const c of competitors) {
      await prisma.competitor.create({
        data: {
          analysisId,
          name: c.name,
          type: c.type,
          coreOffering: c.coreOffering,
          pricingModel: c.pricingModel || 'Unknown',
          positioning: c.positioning || '',
          weaknessSignals: c.weaknessSignals || [],
          userFrustrations: c.userFrustrations || [],
          featureGaps: c.featureGaps || [],
          marketShare: c.marketShare || 'minor',
          userBase: c.userBase || null,
        },
      });
    }

    console.log(`[CompetitionAnalysis] Identified ${competitors.length} competitors`);
    return { success: true, competitorsCount: competitors.length };
  }

  async _extractCompetitorsWithGroq(problemStatement, keywords, results) {
    const resultsText = results
      .slice(0, 20)
      .map(r => `- ${r.title}: ${r.description} (${r.url})`)
      .join('\n');

    try {
      const resp = await chatJSON(msg(
        'You are a competitive intelligence analyst. Extract competitor info from search results.',
        `Problem space: "${problemStatement}"
Keywords: ${keywords.join(', ')}

Search results:
${resultsText}

Extract 3-5 real competitors. Return JSON:
{
  "competitors": [
    {
      "name": "Product/Company name",
      "type": "direct|indirect|alternative",
      "coreOffering": "What they do in one sentence",
      "pricingModel": "e.g. $49/month or Freemium or Unknown",
      "positioning": "Their market position statement",
      "marketShare": "dominant|major|minor|emerging",
      "userBase": "estimated users as string or null",
      "weaknessSignals": [{"complaint": "User complaint", "frequency": 20, "severity": "high|medium|low", "source": "reviews"}],
      "userFrustrations": [{"frustration": "Pain users have", "mentions": 15}],
      "featureGaps": [{"gap": "Missing feature users want", "requestCount": 25, "opportunity": true}]
    }
  ]
}`
      ), { model: MODELS.strong, maxTokens: 2000 });

      return Array.isArray(resp.competitors) && resp.competitors.length
        ? resp.competitors : this._fallbackCompetitors(problemStatement);
    } catch (err) {
      console.error('[CompetitionAnalysis] Groq failed:', err.message);
      return this._fallbackCompetitors(problemStatement);
    }
  }

  _fallbackCompetitors(problemStatement) {
    return [
      {
        name: 'Market Incumbent',
        type: 'direct',
        coreOffering: `Solution for: ${problemStatement.substring(0, 50)}`,
        pricingModel: '$49/month',
        positioning: 'Established enterprise solution',
        marketShare: 'major',
        userBase: '10k+ users',
        weaknessSignals: [{ complaint: 'Too complex for small teams', frequency: 20, severity: 'high', source: 'reviews' }],
        userFrustrations: [{ frustration: 'Steep learning curve', mentions: 15 }],
        featureGaps: [{ gap: 'Mobile support', requestCount: 25, opportunity: true }],
      },
    ];
  }

  async identifyGaps(analysisId) {
    const competitors = await prisma.competitor.findMany({ where: { analysisId } });
    if (!competitors.length) return;

    const weaknesses = competitors.flatMap(c =>
      (Array.isArray(c.weaknessSignals) ? c.weaknessSignals : []).map(w => ({
        competitor: c.name,
        complaint: w.complaint,
        frequency: w.frequency,
        severity: w.severity,
      }))
    );

    const gaps = weaknesses.length
      ? await this._generateGapsWithGroq(weaknesses, competitors)
      : this._fallbackGaps();

    for (const [i, gap] of gaps.entries()) {
      await prisma.gapOpportunity.create({
        data: {
          analysisId,
          rank: i + 1,
          type: gap.type,
          description: gap.description,
          impactPotential: gap.impactPotential,
          effortToAddress: gap.effortToAddress,
          competitiveAdvantage: gap.competitiveAdvantage ?? false,
          validationEvidence: gap.validationEvidence || [],
        },
      });
    }
  }

  async _generateGapsWithGroq(weaknesses, competitors) {
    const weaknessText = weaknesses
      .map(w => `${w.competitor}: "${w.complaint}" (×${w.frequency}, ${w.severity})`)
      .join('\n');

    try {
      const resp = await chatJSON(msg(
        'You are a product strategist identifying market opportunity gaps from competitor weaknesses.',
        `Competitor weaknesses:\n${weaknessText}\n\nExtract 3-5 opportunity gaps. Return JSON:
{
  "gaps": [
    {
      "type": "feature_gap|ux_gap|pricing_gap|market_gap|service_gap",
      "description": "Clear opportunity description",
      "impactPotential": "HIGH|MEDIUM|LOW",
      "effortToAddress": "LOW|MEDIUM|HIGH",
      "competitiveAdvantage": true,
      "validationEvidence": [{"type": "user_complaints", "mentions": 30, "competitors": ["Name"]}]
    }
  ]
}`
      ), { model: MODELS.fast, maxTokens: 1200 });

      return Array.isArray(resp.gaps) && resp.gaps.length ? resp.gaps : this._fallbackGaps();
    } catch (err) {
      console.error('[CompetitionAnalysis] Gap generation failed:', err.message);
      return this._fallbackGaps();
    }
  }

  _fallbackGaps() {
    return [
      {
        type: 'feature_gap',
        description: 'Missing integration capabilities frequently requested by users',
        impactPotential: 'HIGH',
        effortToAddress: 'MEDIUM',
        competitiveAdvantage: true,
        validationEvidence: [{ type: 'user_complaints', mentions: 30 }],
      },
    ];
  }
}

export default new CompetitionAnalysisService();
