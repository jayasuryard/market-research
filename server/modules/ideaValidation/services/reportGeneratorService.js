import prisma from '../../../config/dbconnect.js';

/**
 * Report Generator Service
 * Generates the final validation report in the required format
 */

class ReportGeneratorService {
  /**
   * Generate the complete validation report
   */
  async generateReport(analysisId) {
    try {
      console.log('[ReportGenerator] Generating final report...');
      
      // Get analysis with all relations
      const analysis = await prisma.ideaAnalysis.findUnique({
        where: { id: analysisId },
        include: {
          submission: true,
          demandSignals: true,
          competitors: true,
          gaps: true,
          risks: true,
          recommendations: true
        }
      });
      
      if (!analysis) {
        throw new Error('Analysis not found');
      }
      
      // Build report sections
      const report = {
        // Section 1: Verdict
        verdict: this.generateVerdictSection(analysis),
        
        // Section 2: Market Demand
        marketDemand: this.generateMarketDemandSection(analysis),
        
        // Section 3: Competition
        competition: this.generateCompetitionSection(analysis),
        
        // Section 4: Opportunity Gaps
        opportunityGaps: this.generateOpportunityGapsSection(analysis),
        
        // Section 5: Risks
        risks: this.generateRisksSection(analysis),
        
        // Section 6: Strategic Direction
        strategicDirection: this.generateStrategicDirectionSection(analysis),
        
        // Section 7: Validation Plan
        validationPlan: this.generateValidationPlanSection(analysis)
      };
      
      // Store report
      await prisma.validationReport.create({
        data: {
          analysisId,
          verdict: report.verdict,
          marketDemand: report.marketDemand,
          competition: report.competition,
          opportunityGaps: report.opportunityGaps,
          risks: report.risks,
          strategicDirection: report.strategicDirection,
          validationPlan: report.validationPlan,
          reportVersion: '1.0'
        }
      });
      
      console.log('[ReportGenerator] Report generated successfully');
      
      return report;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  }

  /**
   * Section 1: Verdict
   */
  generateVerdictSection(analysis) {
    const { verdict, validationScore, confidenceLevel } = analysis;
    
    let decision, reasoning;
    
    if (verdict === 'BUILD') {
      decision = '✅ BUILD';
      reasoning = 'Strong market validation signals detected. High demand with manageable competition. This idea shows significant potential.';
    } else if (verdict === 'PIVOT') {
      decision = '⚠️ PIVOT';
      reasoning = 'Market shows interest but requires strategic refinement. Current approach has validation issues that can be addressed through pivoting.';
    } else {
      decision = '❌ DO NOT BUILD';
      reasoning = 'Critical validation failures detected. Market signals indicate high probability of failure in current form.';
    }
    
    return {
      decision,
      validationScore: Math.round(validationScore),
      confidenceLevel,
      reasoning,
      scoreBreakdown: {
        demandScore: Math.round(analysis.demandScore),
        buyingIntentScore: Math.round(analysis.buyingIntentScore),
        saturationIndex: Math.round(analysis.saturationIndex)
      }
    };
  }

  /**
   * Section 2: Market Demand
   */
  generateMarketDemandSection(analysis) {
    const { demandSignals, demandScore } = analysis;
    
    // Group signals by problem
    const problemMap = new Map();
    demandSignals.forEach(signal => {
      if (problemMap.has(signal.problem)) {
        const existing = problemMap.get(signal.problem);
        existing.frequency += signal.frequency;
        existing.sources.push(signal.source);
        existing.evidence.push(...signal.evidencePatterns);
      } else {
        problemMap.set(signal.problem, {
          problem: signal.problem,
          frequency: signal.frequency,
          painIntensity: signal.painIntensity,
          sources: [signal.source],
          evidence: signal.evidencePatterns
        });
      }
    });
    
    // Sort by frequency and get top problems
    const topProblems = Array.from(problemMap.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
      .map((p, index) => ({
        rank: index + 1,
        problem: p.problem,
        frequency: p.frequency,
        painIntensity: Math.round(p.painIntensity * 10) / 10,
        sources: [...new Set(p.sources)],
        evidencePatterns: p.evidence.slice(0, 3) // Top 3 pieces of evidence
      }));
    
    return {
      demandScore: Math.round(demandScore),
      interpretation: this.interpretDemandScore(demandScore),
      topProblems,
      totalSignalsAnalyzed: demandSignals.length
    };
  }

  /**
   * Section 3: Competition
   */
  generateCompetitionSection(analysis) {
    const { competitors, saturationIndex } = analysis;
    
    const keyPlayers = competitors
      .filter(c => c.type === 'direct' || c.marketShare === 'dominant' || c.marketShare === 'major')
      .map(c => ({
        name: c.name,
        type: c.type,
        marketShare: c.marketShare,
        positioning: c.positioning,
        pricingModel: c.pricingModel,
        keyWeaknesses: this.extractKeyWeaknesses(c),
        userFrustrationCount: Array.isArray(c.userFrustrations) ? c.userFrustrations.length : 0
      }));
    
    const saturationLevel = this.classifySaturation(saturationIndex);
    
    return {
      keyPlayers,
      totalCompetitors: competitors.length,
      competitorBreakdown: {
        direct: competitors.filter(c => c.type === 'direct').length,
        indirect: competitors.filter(c => c.type === 'indirect').length,
        alternatives: competitors.filter(c => c.type === 'alternative').length
      },
      saturationLevel,
      saturationIndex: Math.round(saturationIndex),
      marketAnalysis: this.generateMarketAnalysis(competitors, saturationIndex)
    };
  }

  /**
   * Section 4: Opportunity Gaps
   */
  generateOpportunityGapsSection(analysis) {
    const { gaps } = analysis;
    
    const opportunityGaps = gaps
      .filter(g => g.impactPotential === 'HIGH' || g.impactPotential === 'MEDIUM')
      .sort((a, b) => {
        const impactOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return impactOrder[b.impactPotential] - impactOrder[a.impactPotential];
      })
      .map((gap, index) => ({
        rank: index + 1,
        type: gap.gapType,
        description: gap.description,
        impactPotential: gap.impactPotential,
        effortToAddress: gap.effortToAddress,
        competitiveAdvantage: gap.competitiveAdvantage,
        validationEvidence: gap.validationEvidence
      }));
    
    return {
      totalGapsIdentified: gaps.length,
      highImpactGaps: gaps.filter(g => g.impactPotential === 'HIGH').length,
      opportunityGaps,
      summary: opportunityGaps.length > 0 
        ? `${opportunityGaps.length} validated opportunity gaps identified with evidence-backed potential`
        : 'No significant opportunity gaps detected - market is well-served'
    };
  }

  /**
   * Section 5: Risks
   */
  generateRisksSection(analysis) {
    const { risks } = analysis;
    
    const criticalRisks = risks
      .sort((a, b) => {
        const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .map((risk, index) => ({
        rank: index + 1,
        type: risk.riskType,
        severity: risk.severity,
        description: risk.description,
        probabilityOfFailure: Math.round(risk.probabilityOfFailure * 100) + '%',
        evidence: risk.evidence
      }));
    
    const overallRiskLevel = this.calculateOverallRiskLevel(risks);
    
    return {
      overallRiskLevel,
      totalRisks: risks.length,
      criticalRisks: risks.filter(r => r.severity === 'CRITICAL').length,
      highRisks: risks.filter(r => r.severity === 'HIGH').length,
      risks: criticalRisks,
      riskSummary: this.generateRiskSummary(risks, analysis.verdict)
    };
  }

  /**
   * Section 6: Strategic Direction
   */
  generateStrategicDirectionSection(analysis) {
    const { recommendations, verdict } = analysis;
    
    if (recommendations.length === 0) {
      return {
        recommendation: 'No strategic direction available',
        actions: []
      };
    }
    
    const primaryRecommendation = recommendations[0];
    
    return {
      recommendation: primaryRecommendation.description,
      refinedApproach: primaryRecommendation.refinedICP 
        ? {
            targetSegment: primaryRecommendation.refinedICP.description,
            characteristics: primaryRecommendation.refinedICP.characteristics || []
          }
        : null,
      specificActions: primaryRecommendation.specificActions,
      expectedOutcome: primaryRecommendation.expectedOutcome,
      alternativeRecommendations: recommendations.slice(1).map(r => ({
        type: r.recommendationType,
        description: r.description
      }))
    };
  }

  /**
   * Section 7: Validation Plan
   */
  generateValidationPlanSection(analysis) {
    const { verdict, validationScore, gaps } = analysis;
    
    let test, successMetrics, timeline;
    
    if (verdict === 'BUILD') {
      test = {
        type: 'MVP Pre-sale',
        description: 'Build a landing page describing your solution. Offer early bird pricing and see if people actually sign up.',
        steps: [
          'Create compelling landing page with clear value proposition',
          'Set up payment collection (Stripe, Gumroad)',
          'Drive targeted traffic (Reddit, forums, direct outreach)',
          'Track conversion rate'
        ]
      };
      successMetrics = {
        target: '50 sign-ups or $2,500 in pre-sales',
        conversionRate: '2-5% landing page to sign-up',
        timeline: '2-4 weeks'
      };
      timeline = '2-4 weeks';
    } else if (verdict === 'PIVOT') {
      test = {
        type: 'Problem Validation',
        description: 'Validate the refined problem/niche before building anything. Conduct user interviews and test messaging.',
        steps: [
          'Create a problem-focused landing page (not solution-focused)',
          'Run targeted ads or outreach to refined ICP',
          'Offer to notify when solution is ready',
          'Conduct 10-15 user interviews with sign-ups'
        ]
      };
      successMetrics = {
        target: '100+ email sign-ups showing clear interest',
        interviewInsights: 'Consistent pain point validation in 80%+ of interviews',
        timeline: '3-4 weeks'
      };
      timeline = '3-4 weeks';
    } else {
      test = {
        type: 'Alternative Research',
        description: 'Do NOT build this. Instead, research alternative problems in the same space.',
        steps: [
          'Interview 20 people in target audience',
          'Map their actual pain points (not your assumptions)',
          'Look for problems with high frequency + high pain',
          'Run validation tests on newly discovered problems'
        ]
      };
      successMetrics = {
        target: 'Discovery of a different problem worth solving',
        validation: 'Problems mentioned by 50%+ of interviewees',
        timeline: '2-3 weeks'
      };
      timeline = '2-3 weeks';
    }
    
    return {
      test,
      successMetrics,
      timeline,
      nextSteps: this.generateNextSteps(verdict)
    };
  }

  // Helper methods

  interpretDemandScore(score) {
    if (score >= 80) return 'Exceptionally strong demand signals';
    if (score >= 60) return 'Strong demand signals detected';
    if (score >= 40) return 'Moderate demand signals present';
    if (score >= 20) return 'Weak demand signals';
    return'Very weak or no demand signals detected';
  }

  classifySaturation(index) {
    if (index >= 67) return 'RED OCEAN - Highly Saturated';
    if (index >= 34) return 'COMPETITIVE - Medium Saturation';
    return 'GREENFIELD - Low Saturation';
  }

  extractKeyWeaknesses(competitor) {
    const weaknesses = [];
    if (Array.isArray(competitor.weaknessSignals)) {
      competitor.weaknessSignals
        .filter(w => w.severity === 'high' || w.frequency > 15)
        .slice(0, 3)
        .forEach(w => {
          weaknesses.push({
            complaint: w.complaint,
            frequency: w.frequency,
            severity: w.severity
          });
        });
    }
    return weaknesses;
  }

  generateMarketAnalysis(competitors, saturationIndex) {
    const dominant = competitors.filter(c => c.marketShare === 'dominant').length;
    const major = competitors.filter(c => c.marketShare === 'major').length;
    
    if (saturationIndex >= 67) {
      return `Red ocean market with ${dominant + major} established players. High barriers to entry. Success requires exceptional differentiation or niche focus.`;
    }
    if (saturationIndex >= 34) {
      return `Competitive market with ${competitors.length} players. Opportunities exist through differentiation and targeting underserved segments.`;
    }
    return `Greenfield opportunity with limited competition. First-mover advantages available if executed quickly.`;
  }

  calculateOverallRiskLevel(risks) {
    const critical = risks.filter(r => r.severity === 'CRITICAL').length;
    const high = risks.filter(r => r.severity === 'HIGH').length;
    
    if (critical >= 2 || (critical >= 1 && high >= 2)) return 'CRITICAL';
    if (critical >= 1 || high >= 2) return 'HIGH';
    if (high >= 1 || risks.length >= 3) return 'MEDIUM';
    return 'LOW';
  }

  generateRiskSummary(risks, verdict) {
    if (verdict === 'KILL') {
      return 'Multiple critical risk factors detected. Building this idea has high probability of failure. Do not proceed without significant pivoting.';
    }
    if (verdict === 'PIVOT') {
      return 'Significant risks present but addressable through strategic pivoting. Refinement required before proceeding.';
    }
    return 'Risks are manageable with proper execution and market positioning. Proceed with awareness of identified challenges.';
  }

  generateNextSteps(verdict) {
    if (verdict === 'BUILD') {
      return [
        'Launch validation test within 1 week',
        'Aim for first paying customer within 30 days',
        'Build MVP based on validation results',
        'Focus on early adopter segment first'
      ];
    }
    if (verdict === 'PIVOT') {
      return [
        'Refine ICP based on identified gaps',
        'Run validation test on refined positioning',
        'Conduct user interviews to validate pivot direction',
        'Reassess after validation test results'
      ];
    }
    return [
      'Do NOT build in current form',
      'Research alternative problems in this space',
      'Interview target users to discover real pain points',
      'Run analysis on newly discovered opportunities'
    ];
  }
}

export default new ReportGeneratorService();
