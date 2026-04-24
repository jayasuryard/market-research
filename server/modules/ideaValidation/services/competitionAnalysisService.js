import prisma from '../../../config/dbconnect.js';

/**
 * Competition Analysis Service
 * Identifies and analyzes competitors and alternatives
 */

class CompetitionAnalysisService {
  /**
   * Analyze competition for the idea
   */
  async analyzeCompetition(analysisId, structuredIdea) {
    try {
      const { problemStatement, primaryUseCases, substituteSolutions } = structuredIdea;
      
      console.log('[CompetitionAnalysis] Starting competitor identification...');
      
      // Identify different types of competitors
      const directCompetitors = await this.identifyDirectCompetitors(problemStatement);
      const indirectCompetitors = await this.identifyIndirectCompetitors(primaryUseCases);
      const alternatives = await this.identifyAlternatives(substituteSolutions);
      
      const allCompetitors = [
        ...directCompetitors,
        ...indirectCompetitors,
        ...alternatives
      ];
      
      // Store competitors in database
      for (const competitor of allCompetitors) {
        await prisma.competitor.create({
          data: {
            analysisId,
            name: competitor.name,
            type: competitor.type,
            coreOffering: competitor.coreOffering,
            pricingModel: competitor.pricingModel,
            positioning: competitor.positioning,
            weaknessSignals: competitor.weaknessSignals,
            userFrustrations: competitor.userFrustrations,
            featureGaps: competitor.featureGaps,
            marketShare: competitor.marketShare,
            userBase: competitor.userBase
          }
        });
      }
      
      console.log(`[CompetitionAnalysis] Identified ${allCompetitors.length} competitors`);
      
      return {
        success: true,
        competitorsCount: allCompetitors.length
      };
    } catch (error) {
      console.error('Analyze competition error:', error);
      throw error;
    }
  }

  /**
   * Identify direct competitors
   * In production: Use ProductHunt, Crunchbase, G2, etc. APIs
   */
  async identifyDirectCompetitors(problemStatement) {
    // PRODUCTION TODO: Integrate with:
    // - ProductHunt API
    // - Crunchbase API
    // - G2/Capterra APIs
    // - Google search for "[problem] software" or "[problem] tool"
    
    const competitors = [];
    
    // Simulate competitor discovery
    const simulatedCompetitors = [
      {
        name: 'CompetitorA',
        type: 'direct',
        coreOffering: 'Similar solution addressing the same problem space',
        pricingModel: '$49/month with 3 tiers (Starter, Pro, Enterprise)',
        positioning: 'All-in-one solution for mid-market companies',
        weaknessSignals: [
          {
            complaint: 'Too complicated for small teams',
            frequency: 23,
            severity: 'high',
            source: 'G2 reviews'
          },
          {
            complaint: 'Pricing is too expensive for startups',
            frequency: 18,
            severity: 'medium',
            source: 'Capterra reviews'
          }
        ],
        userFrustrations: [
          {
            frustration: 'Steep learning curve',
            mentions: 15
          },
          {
            frustration: 'Poor customer support',
            mentions: 12
          }
        ],
        featureGaps: [
          {
            feature: 'Mobile app',
            demandLevel: 'high',
            userRequests: 34
          },
          {
            feature: 'API access in lower tiers',
            demandLevel: 'medium',
            userRequests: 19
          }
        ],
        marketShare: 'major',
        userBase: '10,000 - 50,000 users'
      },
      {
        name: 'CompetitorB',
        type: 'direct',
        coreOffering: 'Focused solution for specific use case',
        pricingModel: '$29/month flat pricing',
        positioning: 'Simple, affordable solution for solopreneurs',
        weaknessSignals: [
          {
            complaint: 'Lacks advanced features',
            frequency: 31,
            severity: 'medium',
            source: 'ProductHunt comments'
          }
        ],
        userFrustrations: [
          {
            frustration: 'Limited integrations',
            mentions: 22
          }
        ],
        featureGaps: [
          {
            feature: 'Team collaboration',
            demandLevel: 'high',
            userRequests: 45
          }
        ],
        marketShare: 'niche',
        userBase: '1,000 - 10,000 users'
      }
    ];
    
    competitors.push(...simulatedCompetitors);
    
    // IMPLEMENTATION NOTE:
    // Real implementation would:
    // 1. Extract keywords from problem statement
    // 2. Search ProductHunt, AlternativeTo, etc.
    // 3. Scrape competitor websites for positioning/pricing
    // 4. Analyze reviews for weakness patterns
    // 5. Use Crunchbase for funding/traction data
    
    return competitors;
  }

  /**
   * Identify indirect competitors
   */
  async identifyIndirectCompetitors(primaryUseCases) {
    const competitors = [];
    
    // Simulate indirect competitor discovery
    const simulatedCompetitors = [
      {
        name: 'GenericTool',
        type: 'indirect',
        coreOffering: 'General-purpose tool that can be adapted',
        pricingModel: '$15/month with limited free tier',
        positioning: 'Swiss army knife for multiple use cases',
        weaknessSignals: [
          {
            complaint: 'Not optimized for specific use cases',
            frequency: 27,
            severity: 'medium',
            source: 'User forums'
          }
        ],
        userFrustrations: [
          {
            frustration: 'Requires too much customization',
            mentions: 19
          }
        ],
        featureGaps: [
          {
            feature: 'Purpose-built workflows',
            demandLevel: 'high',
            userRequests: 28
          }
        ],
        marketShare: 'dominant',
        userBase: '100,000+ users'
      }
    ];
    
    competitors.push(...simulatedCompetitors);
    
    return competitors;
  }

  /**
   * Identify alternative solutions (behaviors, not just tools)
   */
  async identifyAlternatives(substituteSolutions) {
    const alternatives = [];
    
    // Convert substitute behaviors into competitor entries
    substituteSolutions.forEach(substitute => {
      if (substitute.type === 'tool') {
        alternatives.push({
          name: substitute.description,
          type: 'alternative',
          coreOffering: `Existing approach: ${substitute.category}`,
          pricingModel: 'Varies or free',
          positioning: 'Current solution users are adopting',
          weaknessSignals: [
            {
              complaint: 'Not purpose-built for this use case',
              frequency: 10,
              severity: 'low',
              source: 'general_observation'
            }
          ],
          userFrustrations: [
            {
              frustration: 'Inefficient workflow',
              mentions: 8
            }
          ],
          featureGaps: [
            {
              feature: 'Specialized functionality',
              demandLevel: 'medium',
              userRequests: 12
            }
          ],
          marketShare: 'widespread',
          userBase: 'Unknown'
        });
      }
    });
    
    return alternatives;
  }

  /**
   * Identify gap opportunities from competitor analysis
   */
  async identifyGaps(analysisId) {
    try {
      const competitors = await prisma.competitor.findMany({
        where: { analysisId }
      });
      
      const gaps = [];
      
      // Aggregate feature gaps across competitors
      const featureGapMap = new Map();
      competitors.forEach(competitor => {
        if (Array.isArray(competitor.featureGaps)) {
          competitor.featureGaps.forEach(gap => {
            const key = gap.feature;
            if (featureGapMap.has(key)) {
              const existing = featureGapMap.get(key);
              existing.userRequests += gap.userRequests || 0;
              existing.competitors.push(competitor.name);
            } else {
              featureGapMap.set(key, {
                feature: gap.feature,
                demandLevel: gap.demandLevel,
                userRequests: gap.userRequests || 0,
                competitors: [competitor.name]
              });
            }
          });
        }
      });
      
      // Create gap opportunities from aggregated data
      featureGapMap.forEach((gapData, feature) => {
        const impactPotential = gapData.userRequests > 30 ? 'HIGH' : 
                               gapData.userRequests > 15 ? 'MEDIUM' : 'LOW';
        
        gaps.push({
          gapType: 'feature_gap',
          description: `Missing feature: ${feature}`,
          validationEvidence: [
            {
              type: 'user_requests',
              count: gapData.userRequests,
              competitors: gapData.competitors
            }
          ],
          impactPotential,
          effortToAddress: this.estimateEffort(feature),
          competitiveAdvantage: gapData.competitors.length > 1
        });
      });
      
      // Identify underserved segments
      const frustrationMap = new Map();
      competitors.forEach(competitor => {
        if (Array.isArray(competitor.userFrustrations)) {
          competitor.userFrustrations.forEach(frustration => {
            const key = frustration.frustration;
            if (frustrationMap.has(key)) {
              frustrationMap.get(key).mentions += frustration.mentions || 0;
            } else {
              frustrationMap.set(key, { ...frustration });
            }
          });
        }
      });
      
      frustrationMap.forEach((data, frustration) => {
        if (data.mentions > 10) {
          gaps.push({
            gapType: 'ux_gap',
            description: `UX improvement opportunity: Address "${frustration}"`,
            validationEvidence: [
              {
                type: 'user_complaints',
                mentions: data.mentions
              }
            ],
            impactPotential: data.mentions > 20 ? 'HIGH' : 'MEDIUM',
            effortToAddress: 'MEDIUM',
            competitiveAdvantage: true
          });
        }
      });
      
      // Store gaps in database
      for (const gap of gaps) {
        await prisma.gapOpportunity.create({
          data: {
            analysisId,
            ...gap
          }
        });
      }
      
      return gaps;
    } catch (error) {
      console.error('Identify gaps error:', error);
      return [];
    }
  }

  /**
   * Estimate effort to address a gap
   */
  estimateEffort(feature) {
    const lowEffortKeywords = ['ui', 'ux', 'design', 'template', 'filter'];
    const highEffortKeywords = ['ai', 'ml', 'blockchain', 'real-time', 'integration'];
    
    const featureLower = feature.toLowerCase();
    
    if (lowEffortKeywords.some(kw => featureLower.includes(kw))) {
      return 'LOW';
    }
    if (highEffortKeywords.some(kw => featureLower.includes(kw))) {
      return 'HIGH';
    }
    return 'MEDIUM';
  }
}

export default new CompetitionAnalysisService();
