/**
 * Idea Structuring Service
 * Converts raw idea input into structured format
 */

class IdeaStructuringService {
  /**
   * Structure the idea into core components
   */
  async structureIdea(submission) {
    try {
      const { ideaDescription, targetAudience, geography, pricingAssumption, clarificationAnswers } = submission;
      
      // Combine original description with clarification answers
      let fullContext = ideaDescription;
      if (clarificationAnswers) {
        const answers = Array.isArray(clarificationAnswers) ? clarificationAnswers : [];
        answers.forEach(answer => {
          fullContext += ` ${answer.answer}`;
        });
      }
      
      // Extract problem statement
      const problemStatement = this.extractProblemStatement(fullContext, targetAudience);
      
      // Identify target segments
      const targetSegments = this.identifyTargetSegments(fullContext, targetAudience);
      
      // Define job-to-be-done
      const jobToBeDone = this.defineJobToBeDone(fullContext);
      
      // Extract primary use cases
      const primaryUseCases = this.extractUseCases(fullContext);
      
      // Identify substitute solutions
      const substituteSolutions = this.identifySubstitutes(fullContext);
      
      return {
        problemStatement,
        targetSegments,
        jobToBeDone,
        primaryUseCases,
        substituteSolutions
      };
    } catch (error) {
      console.error('Structure idea error:', error);
      throw error;
    }
  }

  /**
   * Extract core problem statement
   */
  extractProblemStatement(description, targetAudience) {
    // Look for problem indicators
    const problemKeywords = ['problem', 'issue', 'challenge', 'pain', 'struggle', 'difficult', 'hard', 'cant', 'unable'];
    const lowerDesc = description.toLowerCase();
    
    // Simple extraction logic (in production, use NLP)
    let statement = description.split('.')[0]; // First sentence often contains the problem
    
    if (targetAudience) {
      statement = `${targetAudience} face challenges where ${statement}`;
    }
    
    return statement;
  }

  /**
   * Identify and rank target customer segments
   */
  identifyTargetSegments(description, targetAudience) {
    const segments = [];
    
    if (targetAudience) {
      // Parse target audience into segments
      const audienceParts = targetAudience.split(',').map(s => s.trim());
      audienceParts.forEach((segment, index) => {
        segments.push({
          name: segment,
          rank: index + 1,
          confidence: 'high'
        });
      });
    } else {
      // Extract from description (basic implementation)
      const commonSegments = [
        'small businesses', 'startups', 'founders', 'developers', 
        'marketers', 'designers', 'freelancers', 'agencies',
        'enterprises', 'SMBs', 'consumers', 'students'
      ];
      
      const lowerDesc = description.toLowerCase();
      commonSegments.forEach((segment, index) => {
        if (lowerDesc.includes(segment)) {
          segments.push({
            name: segment,
            rank: index + 1,
            confidence: 'medium'
          });
        }
      });
    }
    
    // If no segments found, add a generic one
    if (segments.length === 0) {
      segments.push({
        name: 'General users',
        rank: 1,
        confidence: 'low'
      });
    }
    
    return segments;
  }

  /**
   * Define the job-to-be-done
   */
  defineJobToBeDone(description) {
    // Look for action verbs and outcomes
    const actionVerbs = ['create', 'build', 'manage', 'track', 'analyze', 'automate', 
                         'connect', 'share', 'organize', 'find', 'discover', 'learn'];
    
    const lowerDesc = description.toLowerCase();
    const words = lowerDesc.split(' ');
    
    // Find verbs in description
    const foundVerbs = actionVerbs.filter(verb => lowerDesc.includes(verb));
    
    if (foundVerbs.length > 0) {
      return `Help users ${foundVerbs[0]} ${description.split(' ').slice(0, 10).join(' ')}...`;
    }
    
    return `Enable users to accomplish tasks related to: ${description.substring(0, 100)}...`;
  }

  /**
   * Extract primary use cases
   */
  extractUseCases(description) {
    // In production, use NLP to extract use cases
    // For now, create basic use cases from description
    
    const useCases = [];
    
    // Split by common separators
    const sentences = description.split(/[.;,]/).filter(s => s.trim().length > 10);
    
    sentences.slice(0, 5).forEach((sentence, index) => {
      useCases.push({
        id: `uc_${index + 1}`,
        description: sentence.trim(),
        priority: index + 1
      });
    });
    
    return useCases;
  }

  /**
   * Identify substitute solutions (existing behaviors/tools)
   */
  identifySubstitutes(description) {
    const substitutes = [];
    
    // Look for mentions of existing tools or methods
    const toolKeywords = ['using', 'currently', 'instead of', 'replace', 'alternative to'];
    const lowerDesc = description.toLowerCase();
    
    // Common substitute categories
    const commonSubstitutes = [
      {
        category: 'Manual Process',
        description: 'Manual spreadsheets or documents',
        type: 'behavior'
      },
      {
        category: 'Email/Communication',
        description: 'Using email or messaging apps',
        type: 'behavior'
      },
      {
        category: 'Generic Tools',
        description: 'General-purpose software',
        type: 'tool'
      },
      {
        category: 'Doing Nothing',
        description: 'Living with the problem',
        type: 'behavior'
      }
    ];
    
    // In production, extract actual mentioned tools
    // For now, return common substitutes
    substitutes.push(...commonSubstitutes);
    
    return substitutes;
  }
}

export default new IdeaStructuringService();
