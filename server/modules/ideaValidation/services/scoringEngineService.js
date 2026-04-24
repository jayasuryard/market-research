import prisma from '../../../config/dbconnect.js';
import demandAnalysisService from './demandAnalysisService.js';
import competitionAnalysisService from './competitionAnalysisService.js';

/**
 * Scoring Engine Service
 * Calculates all scores and makes the final verdict
 */

class ScoringEngineService {
  /**
   * Calculate all scores for an analysis
   */
  async calculateScores(analysisId) {
    try {
      console.log('[ScoringEngine] Calculating scores...');
      
      // Get demand score
      const demandScore = await this.calculateDemandScore(analysisId);
      console.log(`[ScoringEngine] Demand Score: ${demandScore.toFixed(2)}`);
      
      // Get buying intent score
      const buyingIntentScore = await demandAnalysisService.calculateBuyingIntent(analysisId);
      console.log(`[ScoringEngine] Buying Intent Score: ${buyingIntentScore.toFixed(2)}`);
      
      // Get saturation index
      const saturationIndex = await this.calculateSaturationIndex(analysisId);
      console.log(`[ScoringEngine] Saturation Index: ${saturationIndex.toFixed(2)}`);
      
      // Calculate validation score
      const validationScore = this.calculateValidationScore(
        demandScore, 
        buyingIntentScore, 
        saturationIndex
      );
      console.log(`[ScoringEngine] Validation Score: ${validationScore.toFixed(2)}`);
      
      // Determine verdict
      const { verdict, confidenceLevel } = this.determineVerdict(validationScore, demandScore, saturationIndex);
      console.log(`[ScoringEngine] Verdict: ${verdict} (${confidenceLevel} confidence)`);
      
      // Identify gaps for strategic recommendations
      await competitionAnalysisService.identifyGaps(analysisId);
      
      // Generate risks
      await this.generateRiskFactors(analysisId, {
        demandScore,
        buyingIntentScore,
        saturationIndex,
        validationScore
      });
      
      // Generate strategic recommendations
      await this.generateStrategicRecommendations(analysisId, {
        verdict,
        validationScore,
        demandScore,
        saturationIndex
      });
      
      return {
        demandScore,
        buyingIntentScore,
        saturationIndex,
        validationScore,
        verdict,
        confidenceLevel
      };
    } catch (error) {
      console.error('Calculate scores error:', error);
      throw error;
    }
  }

  /**
   * Calculate Demand Score
   * Formula: (Problem Frequency × Pain Intensity × Recency Weight)
   * Normalized to 0-100
   */
  async calculateDemandScore(analysisId) {
    try {
      const signals = await prisma.demandSignal.findMany({
        where: { analysisId }
      });
      
      if (signals.length === 0) {
        return 0;
      }
      
      let totalScore = 0;
      let maxPossible = 0;
      
      signals.forEach(signal => {
        // Calculate individual signal score
        const signalScore = signal.frequency * signal.painIntensity * signal.recencyWeight;
        totalScore += signalScore;
        
        // Max possible: highest frequency × max intensity (10) × perfect recency (1.0)
        const maxForSignal = signal.frequency * 10 * 1.0;
        maxPossible += maxForSignal;
      });
      
      // Normalize to 0-100
      const normalizedScore = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;
      
      return Math.min(100, Math.max(0, normalizedScore));
    } catch (error) {
      console.error('Calculate demand score error:', error);
      return 0;
    }
  }

  /**
   * Calculate Saturation Index
   * Formula: (Number of Competitors × Market Maturity × Feature Overlap)
   * Normalized to 0-100
   * Low (0-33): Greenfield
   * Medium (34-66): Competitive
   * High (67-100): Red Ocean
   */
  async calculateSaturationIndex(analysisId) {
    try {
      const competitors = await prisma.competitor.findMany({
        where: { analysisId }
      });
      
      if (competitors.length === 0) {
        return 0; // No competition = Greenfield
      }
      
      // Number of competitors factor (more competitors = higher saturation)
      const competitorCount = competitors.length;
      const competitorFactor = Math.min(competitorCount / 10, 1.0); // Normalize to 0-1
      
      // Market maturity factor
      const maturityFactor = this.calculateMaturityFactor(competitors);
      
      // Feature overlap factor
      const overlapFactor = this.calculateFeatureOverlap(competitors);
      
      // Calculate saturation index
      const saturationIndex = (competitorFactor + maturityFactor + overlapFactor) / 3 * 100;
      
      return Math.min(100, Math.max(0, saturationIndex));
    } catch (error) {
      console.error('Calculate saturation index error:', error);
      return 50; // Default to medium saturation on error
    }
  }

  /**
   * Calculate market maturity factor
   */
  calculateMaturityFactor(competitors) {
    // Check for dominant players (indicates mature market)
    const hasDominantPlayer = competitors.some(c => c.marketShare === 'dominant');
    const majorPlayers = competitors.filter(c => c.marketShare === 'major').length;
    
    if (hasDominantPlayer && majorPlayers >= 2) {
      return 1.0; // Very mature
    }
    if (hasDominantPlayer || majorPlayers >= 3) {
      return 0.7; // Mature
    }
    if (majorPlayers >= 1) {
      return 0.4; // Growing
    }
    return 0.2; // Early stage
  }

  /**
   * Calculate feature overlap factor
   */
  calculateFeatureOverlap(competitors) {
    // If competitors have many feature gaps, it means less overlap
    let totalGaps = 0;
    competitors.forEach(c => {
      if (Array.isArray(c.featureGaps)) {
        totalGaps += c.featureGaps.length;
      }
    });
    
    const avgGaps = competitors.length > 0 ? totalGaps / competitors.length : 0;
    
    // More gaps = less overlap = lower saturation
    // Less gaps = more overlap = higher saturation
    if (avgGaps > 5) return 0.3; // Low overlap
    if (avgGaps > 3) return 0.5; // Medium overlap
    if (avgGaps > 1) return 0.7; // High overlap
    return 0.9; // Very high overlap
  }

  /**
   * Calculate Validation Score (FINAL CORE METRIC)
   * Formula: (Demand Score × Buying Intent Score) ÷ Saturation Index (normalized)
   * Output: 0-100
   */
  calculateValidationScore(demandScore, buyingIntentScore, saturationIndex) {
    // Handle edge cases
    if (demandScore === 0 || buyingIntentScore === 0) {
      return 0;
    }
    
    if (saturationIndex === 0) {
      // No competition is best case
      return Math.min(100, (demandScore + buyingIntentScore) / 2);
    }
    
    // Calculate validation score
    // Higher saturation reduces the score more significantly
    const saturationPenalty = 1 + (saturationIndex / 100); // 1.0 to 2.0
    const rawScore = (demandScore * buyingIntentScore) / (saturationPenalty * 100);
    const validationScore = rawScore * 100;
    
    return Math.min(100, Math.max(0, validationScore));
  }

  /**
   * Determine verdict based on Validation Score
   */
  determineVerdict(validationScore, demandScore, saturationIndex) {
    let verdict;
    let confidenceLevel;
    
    if (validationScore >= 80) {
      verdict = 'BUILD';
      confidenceLevel = 'HIGH';
    } else if (validationScore >= 60) {
      verdict = 'PIVOT';
      confidenceLevel = demandScore >= 70 ? 'MEDIUM' : 'LOW';
    } else if (validationScore >= 40) {
      verdict = 'PIVOT';
      confidenceLevel = 'LOW';
    } else {
      verdict = 'KILL';
      confidenceLevel = saturationIndex >= 70 ? 'HIGH' : 'MEDIUM';
    }
    
    return { verdict, confidenceLevel };
  }

  /**
   * Generate risk factors for the analysis
   */
  async generateRiskFactors(analysisId, scores) {
    try {
      const { demandScore, buyingIntentScore, saturationIndex, validationScore } = scores;
      
      const risks = [];
      
      // Risk: Low demand
      if (demandScore < 40) {
        risks.push({
          riskType: 'weak_demand',
          description: 'Market demand signals are weak. Limited evidence of users actively seeking solutions for this problem.',
          severity: demandScore < 20 ? 'CRITICAL' : 'HIGH',
          evidence: [{
            type: 'demand_score',
            value: demandScore,
            threshold: 40
          }],
          probabilityOfFailure: 1 - (demandScore / 100)
        });
      }
      
      // Risk: High saturation
      if (saturationIndex >= 67) {
        risks.push({
          riskType: 'market_saturation',
          description: 'Market is highly saturated with existing solutions. Red ocean with intense competition.',
          severity: saturationIndex >= 80 ? 'CRITICAL' : 'HIGH',
          evidence: [{
            type: 'saturation_index',
            value: saturationIndex,
            classification: 'red_ocean'
          }],
          probabilityOfFailure: saturationIndex / 100
        });
      }
      
      // Risk: Dominant player exists
      const competitors = await prisma.competitor.findMany({
        where: { analysisId, marketShare: 'dominant' }
      });
      
      if (competitors.length > 0) {
        risks.push({
          riskType: 'dominant_player',
          description: `Dominant players exist in this space: ${competitors.map(c => c.name).join(', ')}. Switching costs and brand loyalty are high barriers.`,
          severity: 'HIGH',
          evidence: competitors.map(c => ({
            name: c.name,
            marketShare: c.marketShare,
            positioning: c.positioning
          })),
          probabilityOfFailure: 0.7
        });
      }
      
      // Risk: Low buying intent
      if (buyingIntentScore < 40) {
        risks.push({
          riskType: 'low_buying_intent',
          description: 'Users are not actively looking to purchase solutions. Problem awareness exists but purchase intent is weak.',
          severity: 'MEDIUM',
          evidence: [{
            type: 'buying_intent_score',
            value: buyingIntentScore,
            threshold: 40
          }],
          probabilityOfFailure: 0.6
        });
      }
      
      // Risk: Overall validation failure
      if (validationScore < 40) {
        risks.push({
          riskType: 'validation_failure',
          description: 'Overall validation metrics indicate high probability of failure. Multiple red flags present.',
          severity: 'CRITICAL',
          evidence: [{
            validationScore,
            demandScore,
            buyingIntentScore,
            saturationIndex
          }],
          probabilityOfFailure: 0.8
        });
      }
      
      // Store risks in database
      for (const risk of risks) {
        await prisma.riskFactor.create({
          data: {
            analysisId,
            ...risk
          }
        });
      }
      
      return risks;
    } catch (error) {
      console.error('Generate risk factors error:', error);
      return [];
    }
  }

  /**
   * Generate strategic recommendations
   */
  async generateStrategicRecommendations(analysisId, context) {
    try {
      const { verdict, validationScore, demandScore, saturationIndex } = context;
      
      const recommendations = [];
      
      // Get gaps to base recommendations on
      const gaps = await prisma.gapOpportunity.findMany({
        where: { analysisId, impactPotential: { in: ['HIGH', 'MEDIUM'] } },
        orderBy: { impactPotential: 'desc' }
      });
      
      if (verdict === 'KILL') {
        // Provide clear reasons why not to build
        recommendations.push({
          recommendationType: 'alternative_direction',
          description: 'This idea has critical validation issues and should not be pursued in its current form. Consider pivoting to a different problem space.',
          specificActions: [
            {
              action: 'Research adjacent problems with better validation metrics',
              priority: 'high'
            },
            {
              action: 'Interview target users to discover their actual pain points',
              priority: 'high'
            },
            {
              action: 'Analyze successful products in related spaces',
              priority: 'medium'
            }
          ],
          refinedICP: null,
          basedOnGaps: [],
          expectedOutcome: 'Find a problem worth solving with better market potential'
        });
      } else if (verdict === 'PIVOT') {
        // Suggest niche targeting or differentiation
        if (gaps.length > 0) {
          const topGaps = gaps.slice(0, 3);
          recommendations.push({
            recommendationType: 'differentiation',
            description: 'Market has potential but requires strategic differentiation. Focus on identified gaps.',
            specificActions: topGaps.map((gap, index) => ({
              action: `Address ${gap.description}`,
              priority: index === 0 ? 'high' : 'medium',
              effort: gap.effortToAddress
            })),
            refinedICP: {
              description: 'Users frustrated with current solutions who need specific gaps addressed',
              characteristics: topGaps.map(g => g.description)
            },
            basedOnGaps: topGaps.map(g => g.id),
            expectedOutcome: 'Carve out a defensible niche by addressing unmet needs'
          });
        }
        
        // Niche targeting recommendation
        if (saturationIndex >= 50) {
          recommendations.push({
            recommendationType: 'niche_target',
            description: 'Market is competitive. Success requires laser-focused niche targeting.',
            specificActions: [
              {
                action: 'Identify the most underserved segment',
                priority: 'high'
              },
              {
                action: 'Build for that segment exclusively (initially)',
                priority: 'high'
              },
              {
                action: 'Dominate the niche before expanding',
                priority: 'medium'
              }
            ],
            refinedICP: {
              description: 'Smallest viable segment with highest pain and lowest competition',
              approach: 'niche_first'
            },
            basedOnGaps: gaps.map(g => g.id),
            expectedOutcome: 'Establish market presence in underserved niche'
          });
        }
      } else if (verdict === 'BUILD') {
        // Strong build signal - provide execution guidance
        recommendations.push({
          recommendationType: 'positioning',
          description: 'Strong validation signals. Focus on rapid execution and market positioning.',
          specificActions: [
            {
              action: 'Build MVP focusing on core value proposition',
              priority: 'high'
            },
            {
              action: 'Target early adopters in highest-demand segment',
              priority: 'high'
            },
            {
              action: 'Establish differentiation through identified gaps',
              priority: 'medium'
            },
            {
              action: 'Move fast before market window closes',
              priority: 'high'
            }
          ],
          refinedICP: {
            description: 'Early adopters with highest pain intensity',
            characteristics: ['High problem awareness', 'Active solution seekers', 'Willing to switch']
          },
          basedOnGaps: gaps.slice(0, 2).map(g => g.id),
          expectedOutcome: 'Rapid market entry and user acquisition'
        });
      }
      
      // Store recommendations
      for (const rec of recommendations) {
        await prisma.strategicRecommendation.create({
          data: {
            analysisId,
            ...rec
          }
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Generate strategic recommendations error:', error);
      return [];
    }
  }
}

export default new ScoringEngineService();
