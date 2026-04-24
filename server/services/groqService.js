import Groq from 'groq-sdk';

/**
 * Groq LLM Service
 * Centralised wrapper for all Groq API calls.
 * Env note: GROQ_API_URL actually holds the API key (gsk_...).
 */

const groq = new Groq({ apiKey: process.env.GROQ_API_URL });

export const MODELS = {
  fast: 'llama-3.1-8b-instant',        // fastest — quick predictions, clarification
  strong: 'llama-3.3-70b-versatile',   // full analysis, competition, demand scoring
};

/**
 * Core chat completion call.
 * @param {Array} messages   - OpenAI-style message array
 * @param {Object} opts      - { model, temperature, maxTokens, json }
 * @returns {string} LLM response text
 */
export async function chat(messages, opts = {}) {
  const completion = await groq.chat.completions.create({
    model: opts.model || MODELS.strong,
    messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens ?? 2048,
    ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
  });
  return completion.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Returns a parsed JSON object from a Groq response.
 * Always uses json_object response format + parses safely.
 */
export async function chatJSON(messages, opts = {}) {
  const raw = await chat(messages, { ...opts, json: true });
  try {
    return JSON.parse(raw);
  } catch {
    // Fallback: extract first {...} block from text
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Groq returned non-JSON: ${raw.slice(0, 200)}`);
  }
}

/**
 * Helper: system + user message shorthand.
 */
export function msg(system, user) {
  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}
