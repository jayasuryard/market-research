import prisma from '../../../config/dbconnect.js';

/**
 * Demand Analysis Service
 * Extracts and analyzes demand signals from multiple sources
 */

class DemandAnalysisService {
  /**
   * Analyze demand for the idea
   */
  async analyzeDemand(analysisId, structuredIdea) {
    try {
      const { problemStatement, primaryUseCases, targetSegments } = structuredIdea;
      
      console.log('[DemandAnalysis] Starting demand signal extraction...');
      
      // Extract signals from various sources
      const allSignals = [];
      
      // Source 1: Reddit/Forum discussions
      const redditSignals = await this.extractRedditSignals(problemStatement, targetSegments);
      allSignals.push(...redditSignals);
      
      // Source 2: Product reviews analysis
      const reviewSignals = await this.extractReviewSignals(primaryUseCases);
      allSignals.push(...reviewSignals);
      
      // Source 3: Search intent patterns
      const searchSignals = await this.extractSearchSignals(problemStatement);
      allSignals.push(...searchSignals);
      
      // Source 4: Content demand analysis
      const contentSignals = await this.extractContentSignals(problemStatement);
      allSignals.push(...contentSignals);
      
      // Store signals in database
      for (const signal of allSignals) {
        await prisma.demandSignal.create({
          data: {
            analysisId,
            source: signal.source,
            problem: signal.problem,
            frequency: signal.frequency,
            painIntensity: signal.painIntensity,
            recencyWeight: signal.recencyWeight,
            evidencePatterns: signal.evidencePatterns,
            sourceUrl: signal.sourceUrl
          }
        });
      }
      
      console.log(`[DemandAnalysis] Extracted ${allSignals.length} demand signals`);
      
      return {
        success: true,
        signalsCount: allSignals.length
      };
    } catch (error) {
      console.error('Analyze demand error:', error);
      throw error;
    }
  }

  /**
   * Extract signals from Reddit and similar forums
   * In production: Use Reddit API, HackerNews API, etc.
   */
  async extractRedditSignals(problemStatement, targetSegments) {
    // PRODUCTION TODO: Integrate with Reddit API
    // For now, simulate signal extraction
    
    const signals = [];
    
    // Simulate finding relevant discussions
    const simulatedSignals = [
      {
        source: 'reddit',
        problem: `Users struggling with ${problemStatement.substring(0, 50)}...`,
        frequency: Math.floor(Math.random() * 100) + 20,
        painIntensity: Math.random() * 5 + 5, // 5-10 scale
        recencyWeight: Math.random() * 0.5 + 0.5, // 0.5-1.0
        evidencePatterns: [
          {
            quote: 'This is such a pain point for me',
            upvotes: 45,
            date: '2024-03-15'
          },
          {
            quote: 'I wish there was a better solution for this',
            upvotes: 32,
            date: '2024-04-01'
          }
        ],
        sourceUrl: 'https://reddit.com/r/relevant_subreddit'
      }
    ];
    
    signals.push(...simulatedSignals);
    
    // IMPLEMENTATION NOTE:
    // Real implementation would:
    // 1. Search relevant subreddits using keywords from problemStatement
    // 2. Scrape or use API to get posts/comments
    // 3. Filter by relevance using NLP
    // 4. Extract pain intensity from language analysis
    // 5. Calculate recency weight based on post dates
    
    return signals;
  }

  /**
   * Extract signals from product reviews
   * In production: Scrape G2, Capterra, Trustpilot, etc.
   */
  async extractReviewSignals(primaryUseCases) {
    const signals = [];
    
    // Simulate review analysis
    const simulatedSignals = [
      {
        source: 'reviews',
        problem: 'Existing solutions lack key features users need',
        frequency: Math.floor(Math.random() * 50) + 10,
        painIntensity: Math.random() * 3 + 6, // 6-9 scale (negative reviews have high intensity)
        recencyWeight: Math.random() * 0.4 + 0.6, // 0.6-1.0
        evidencePatterns: [
          {
            quote: 'Missing critical feature X',
            rating: 2,
            platform: 'G2'
          },
          {
            quote: 'Too expensive for what it offers',
            rating: 3,
            platform: 'Capterra'
          }
        ],
        sourceUrl: 'https://g2.com/products/competitor/reviews'
      }
    ];
    
    signals.push(...simulatedSignals);
    
    // IMPLEMENTATION NOTE:
    // Real implementation would:
    // 1. Identify competitor products from use cases
    // 2. Scrape reviews from multiple platforms
    // 3. Use sentiment analysis to find negative patterns
    // 4. Extract specific complaints and feature requests
    // 5. Weight negative reviews higher (as per requirement)
    
    return signals;
  }

  /**
   * Extract search intent patterns
   * In production: Use Google Trends API, keyword tools
   */
  async extractSearchSignals(problemStatement) {
    const signals = [];
    
    // Simulate search pattern analysis
    const simulatedSignals = [
      {
        source: 'search',
        problem: 'High search volume for problem-oriented queries',
        frequency: Math.floor(Math.random() * 200) + 50,
        painIntensity: Math.random() * 2 + 7, // 7-9 scale (active search = high intent)
        recencyWeight: 0.9, // Search data is usually recent
        evidencePatterns: [
          {
            query: 'how to solve X problem',
            volume: 1200,
            trend: 'increasing'
          },
          {
            query: 'best tool for Y',
            volume: 850,
            trend: 'stable'
          }
        ],
        sourceUrl: 'https://trends.google.com'
      }
    ];
    
    signals.push(...simulatedSignals);
    
    // IMPLEMENTATION NOTE:
    // Real implementation would:
    // 1. Extract keywords from problem statement
    // 2. Use Google Trends API or similar
    // 3. Analyze "how to", "best", "alternative" queries
    // 4. Track search volume trends over time
    // 5. Identify problem-oriented vs solution-oriented searches
    
    return signals;
  }

  /**
   * Extract content demand signals
   * In production: Analyze YouTube, Medium, blogs, tutorials
   */
  async extractContentSignals(problemStatement) {
    const signals = [];
    
    // Simulate content demand analysis
    const simulatedSignals = [
      {
        source: 'content',
        problem: 'High volume of educational content around this topic',
        frequency: Math.floor(Math.random() * 80) + 20,
        painIntensity: Math.random() * 2 + 5, // 5-7 scale (educational content = medium-high interest)
        recencyWeight: 0.8,
        evidencePatterns: [
          {
            type: 'youtube_video',
            title: 'How to solve X in 2024',
            views: 45000,
            engagement: 'high'
          },
          {
            type: 'blog_post',
            title: 'Complete guide to Y',
            traffic: 12000,
            engagement: 'medium'
          }
        ],
        sourceUrl: 'https://youtube.com/results'
      }
    ];
    
    signals.push(...simulatedSignals);
    
    // IMPLEMENTATION NOTE:
    // Real implementation would:
    // 1. Search YouTube, Medium, dev.to for relevant content
    // 2. Analyze view counts, engagement metrics
    // 3. Track tutorial/guide content volume
    // 4. High educational content = high problem awareness
    // 5. Recent content weighted higher
    
    return signals;
  }

  /**
   * Calculate buying intent score
   * Based on signals that indicate readiness to purchase
   */
  async calculateBuyingIntent(analysisId) {
    try {
      const signals = await prisma.demandSignal.findMany({
        where: { analysisId }
      });
      
      // Buying intent indicators
      const buyingIndicators = [
        { source: 'search', keywords: ['best', 'top', 'vs', 'alternative', 'pricing'], weight: 1.0 },
        { source: 'reddit', keywords: ['looking for', 'recommend', 'which tool', 'switch from'], weight: 0.9 },
        { source: 'reviews', keywords: ['switching', 'better option', 'disappointed'], weight: 0.8 }
      ];
      
      let totalIntent = 0;
      let maxPossible = 0;
      
      signals.forEach(signal => {
        const indicator = buyingIndicators.find(i => i.source === signal.source);
        if (indicator) {
          // Check if signal contains buying-intent keywords
          const hasIntent = signal.evidencePatterns.some(evidence => {
            const text = JSON.stringify(evidence).toLowerCase();
            return indicator.keywords.some(keyword => text.includes(keyword));
          });
          
          if (hasIntent) {
            totalIntent += signal.frequency * signal.painIntensity * indicator.weight;
          }
          maxPossible += signal.frequency * 10 * indicator.weight; // Max intensity is 10
        }
      });
      
      // Normalize to 0-100
      const buyingIntentScore = maxPossible > 0 ? (totalIntent / maxPossible) * 100 : 0;
      
      return Math.min(100, Math.max(0, buyingIntentScore));
    } catch (error) {
      console.error('Calculate buying intent error:', error);
      return 0;
    }
  }
}

export default new DemandAnalysisService();
