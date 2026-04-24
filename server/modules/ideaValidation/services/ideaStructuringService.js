import { chatJSON, MODELS, msg } from '../../../services/groqService.js';

/**
 * Idea Structuring Service - Groq-powered
 */
class IdeaStructuringService {
  async structureIdea(submission) {
    const { ideaDescription, targetAudience, geography, pricingAssumption, clarificationAnswers } = submission;

    let fullContext = ideaDescription;
    if (Array.isArray(clarificationAnswers) && clarificationAnswers.length) {
      fullContext += '\n\nAdditional clarification:\n' +
        clarificationAnswers.map(a => `- ${a.id}: ${a.answer}`).join('\n');
    }

    const extras = [
      targetAudience ? `Target audience: ${targetAudience}` : null,
      geography ? `Geography: ${geography}` : null,
      pricingAssumption ? `Pricing: ${pricingAssumption}` : null,
    ].filter(Boolean).join('\n');

    const schemaExample = `{
  "problemStatement": "Core problem in one sentence",
  "targetSegments": [{"name":"segment","rank":1,"confidence":"high","characteristics":["trait"]}],
  "jobToBeDone": "Primary job users hire product for",
  "primaryUseCases": [{"id":"uc_1","description":"use case","priority":1}],
  "substituteSolutions": [{"category":"cat","description":"what users do today","type":"tool"}],
  "keywords": ["kw1","kw2","kw3","kw4","kw5"],
  "problemCategory": "SaaS|marketplace|productivity|developer tool|fintech|healthtech|other"
}`;

    try {
      const userMsg = `Startup idea: "${fullContext}"` +
        (extras ? `\nAdditional context:\n${extras}` : '') +
        `\n\nReturn JSON matching this schema exactly:\n${schemaExample}`;

      const result = await chatJSON(msg(
        'You are a startup analyst. Structure the idea description into clean analytical components. Respond with valid JSON only.',
        userMsg
      ), { model: MODELS.strong, maxTokens: 1200 });

      return this._sanitize(result);
    } catch (err) {
      console.error('[IdeaStructuring] Groq failed:', err.message);
      return this._fallback(ideaDescription, targetAudience);
    }
  }

  _sanitize(r) {
    return {
      problemStatement: r.problemStatement || 'Problem not extracted',
      targetSegments: Array.isArray(r.targetSegments) ? r.targetSegments.slice(0, 4)
        : [{ name: 'General users', rank: 1, confidence: 'low', characteristics: [] }],
      jobToBeDone: r.jobToBeDone || 'Help users accomplish a task',
      primaryUseCases: Array.isArray(r.primaryUseCases) ? r.primaryUseCases.slice(0, 5) : [],
      substituteSolutions: Array.isArray(r.substituteSolutions) ? r.substituteSolutions : [],
      keywords: Array.isArray(r.keywords) ? r.keywords.slice(0, 8) : [],
      problemCategory: r.problemCategory || 'other',
    };
  }

  _fallback(description, targetAudience) {
    return {
      problemStatement: `Users face challenges with: ${description.substring(0, 60)}`,
      targetSegments: [{ name: targetAudience || 'General users', rank: 1, confidence: 'low', characteristics: [] }],
      jobToBeDone: 'Help users accomplish a specific task',
      primaryUseCases: [{ id: 'uc_1', description: description.substring(0, 120), priority: 1 }],
      substituteSolutions: [
        { category: 'Manual Process', description: 'Spreadsheets or manual workflows', type: 'behavior' },
        { category: 'Generic Tool', description: 'General-purpose software', type: 'tool' },
      ],
      keywords: description.split(' ').slice(0, 6).map(w => w.replace(/[^a-zA-Z]/g, '')).filter(Boolean),
      problemCategory: 'other',
    };
  }
}

export default new IdeaStructuringService();
