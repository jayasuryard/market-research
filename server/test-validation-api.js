/**
 * Example Test Script for Market Validation API
 * 
 * This demonstrates the complete flow of idea validation
 */

const API_BASE = 'http://localhost:3000/api/validation';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  return await response.json();
}

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test Flow
async function runValidationTest() {
  console.log('🚀 Starting Market Validation Test\n');
  
  try {
    // Step 1: Submit idea
    console.log('Step 1: Submitting idea...');
    const ideaData = {
      ideaDescription: 'A tool that helps indie developers track time spent on different projects and automatically generate invoices based on hourly rates. Also includes expense tracking and project profitability analysis.',
      targetAudience: 'freelance developers, indie hackers, solo consultants',
      geography: 'Global, primarily US and Europe',
      pricingAssumption: '$19/month for individuals, $49/month for teams',
      stage: 'idea'
    };
    
    const submitResponse = await apiCall('/submit', 'POST', ideaData);
    console.log('✅ Idea submitted:', submitResponse.data);
    
    const submissionId = submitResponse.data.submissionId;
    console.log(`\nSubmission ID: ${submissionId}\n`);
    
    // Step 2: Check if clarification is needed
    if (submitResponse.data.status === 'clarification_needed') {
      console.log('Step 2: Clarification needed');
      console.log('Questions:', submitResponse.data.questions);
      
      // Provide answers
      const answers = submitResponse.data.questions.map(q => ({
        id: q.id,
        answer: q.id === 'target_audience' 
          ? 'Freelance software developers earning $50-150k/year'
          : q.id === 'geography'
          ? 'United States, Canada, UK, Australia'
          : q.id === 'pricing'
          ? '$19/month with annual discount'
          : q.id === 'problem_detail'
          ? 'Developers waste 5-10 hours per month tracking time manually and creating invoices'
          : 'Help developers accurately bill clients without manual time tracking'
      }));
      
      const clarifyResponse = await apiCall(`/${submissionId}/clarify`, 'POST', { answers });
      console.log('✅ Clarification provided:', clarifyResponse.data);
      console.log('');
    }
    
    // Step 3: Start analysis
    console.log('Step 3: Starting analysis...');
    const analyzeResponse = await apiCall(`/${submissionId}/analyze`, 'POST');
    console.log('✅ Analysis started:', analyzeResponse.data);
    console.log('⏳ Waiting for analysis to complete...\n');
    
    // Step 4: Poll for completion
    let status;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      await sleep(3000); // Wait 3 seconds between checks
      
      const statusResponse = await apiCall(`/${submissionId}/status`);
      status = statusResponse.data.status;
      
      console.log(`Status check ${attempts + 1}: ${status}`);
      
      if (status === 'completed') {
        console.log('✅ Analysis completed!\n');
        break;
      }
      
      if (status === 'failed') {
        console.log('❌ Analysis failed');
        return;
      }
      
      attempts++;
    }
    
    if (status !== 'completed') {
      console.log('⏱️  Analysis still processing. Check back later.');
      console.log(`Use: GET ${API_BASE}/${submissionId}/report`);
      return;
    }
    
    // Step 5: Get full report
    console.log('Step 5: Fetching validation report...\n');
    const reportResponse = await apiCall(`/${submissionId}/report`);
    const report = reportResponse.data;
    
    // Display report
    console.log('='.repeat(80));
    console.log('📊 MARKET VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log('');
    
    // Verdict
    console.log('1️⃣  VERDICT');
    console.log('─'.repeat(80));
    console.log(`Decision: ${report.verdict.decision}`);
    console.log(`Validation Score: ${report.verdict.validationScore}/100`);
    console.log(`Confidence: ${report.verdict.confidenceLevel}`);
    console.log(`Reasoning: ${report.verdict.reasoning}`);
    console.log('');
    console.log('Score Breakdown:');
    console.log(`  - Demand Score: ${report.verdict.scoreBreakdown.demandScore}/100`);
    console.log(`  - Buying Intent: ${report.verdict.scoreBreakdown.buyingIntentScore}/100`);
    console.log(`  - Saturation Index: ${report.verdict.scoreBreakdown.saturationIndex}/100`);
    console.log('');
    
    // Market Demand
    console.log('2️⃣  MARKET DEMAND');
    console.log('─'.repeat(80));
    console.log(`Demand Score: ${report.marketDemand.demandScore}/100`);
    console.log(`Interpretation: ${report.marketDemand.interpretation}`);
    console.log(`Signals Analyzed: ${report.marketDemand.totalSignalsAnalyzed}`);
    console.log('');
    console.log('Top Problems:');
    report.marketDemand.topProblems.slice(0, 3).forEach(p => {
      console.log(`  ${p.rank}. ${p.problem}`);
      console.log(`     Frequency: ${p.frequency} | Pain: ${p.painIntensity}/10`);
    });
    console.log('');
    
    // Competition
    console.log('3️⃣  COMPETITION');
    console.log('─'.repeat(80));
    console.log(`Saturation: ${report.competition.saturationLevel}`);
    console.log(`Total Competitors: ${report.competition.totalCompetitors}`);
    console.log('');
    console.log('Key Players:');
    report.competition.keyPlayers.slice(0, 3).forEach(c => {
      console.log(`  • ${c.name} (${c.type}, ${c.marketShare})`);
      console.log(`    Positioning: ${c.positioning}`);
    });
    console.log('');
    
    // Opportunity Gaps
    console.log('4️⃣  OPPORTUNITY GAPS');
    console.log('─'.repeat(80));
    console.log(`Total Gaps: ${report.opportunityGaps.totalGapsIdentified}`);
    console.log(`High Impact: ${report.opportunityGaps.highImpactGaps}`);
    console.log('');
    if (report.opportunityGaps.opportunityGaps.length > 0) {
      console.log('Top Opportunities:');
      report.opportunityGaps.opportunityGaps.slice(0, 3).forEach(g => {
        console.log(`  ${g.rank}. ${g.description}`);
        console.log(`     Impact: ${g.impactPotential} | Effort: ${g.effortToAddress}`);
      });
    } else {
      console.log('No significant gaps identified.');
    }
    console.log('');
    
    // Risks
    console.log('5️⃣  RISKS');
    console.log('─'.repeat(80));
    console.log(`Overall Risk: ${report.risks.overallRiskLevel}`);
    console.log(`Total Risks: ${report.risks.totalRisks} (Critical: ${report.risks.criticalRisks}, High: ${report.risks.highRisks})`);
    console.log('');
    if (report.risks.risks.length > 0) {
      console.log('Key Risks:');
      report.risks.risks.slice(0, 3).forEach(r => {
        console.log(`  ${r.rank}. [${r.severity}] ${r.description}`);
        console.log(`     Failure Probability: ${r.probabilityOfFailure}`);
      });
    }
    console.log('');
    
    // Strategic Direction
    console.log('6️⃣  STRATEGIC DIRECTION');
    console.log('─'.repeat(80));
    console.log(`Recommendation: ${report.strategicDirection.recommendation}`);
    console.log('');
    if (report.strategicDirection.refinedApproach) {
      console.log('Refined Approach:');
      console.log(`  Target: ${report.strategicDirection.refinedApproach.targetSegment}`);
    }
    console.log('');
    console.log('Actions:');
    report.strategicDirection.specificActions.slice(0, 5).forEach((action, i) => {
      console.log(`  ${i + 1}. [${action.priority.toUpperCase()}] ${action.action}`);
    });
    console.log('');
    
    // Validation Plan
    console.log('7️⃣  VALIDATION PLAN');
    console.log('─'.repeat(80));
    console.log(`Test Type: ${report.validationPlan.test.type}`);
    console.log(`Description: ${report.validationPlan.test.description}`);
    console.log('');
    console.log('Steps:');
    report.validationPlan.test.steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step}`);
    });
    console.log('');
    console.log('Success Metrics:');
    Object.entries(report.validationPlan.successMetrics).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });
    console.log('');
    
    console.log('='.repeat(80));
    console.log('✅ Validation Complete!');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Run the test
runValidationTest();
