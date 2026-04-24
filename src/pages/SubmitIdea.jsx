import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import GeographyPicker from '../components/GeographyPicker.jsx';
import { validationApi } from '../../api.js';

const STAGES = [
  { value: 'idea', label: 'Idea', desc: 'Just a concept, nothing built' },
  { value: 'mvp', label: 'MVP', desc: 'Basic version exists' },
  { value: 'live', label: 'Live', desc: 'Product is in market' },
];

export default function SubmitIdea() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiNote, setAiNote] = useState('');

  const [form, setForm] = useState({
    ideaDescription: '',
    targetAudience: '',
    geography: '',
    pricingAssumption: '',
    stage: 'idea',
  });

  // Clarification state
  const [clarificationState, setClarificationState] = useState(null);
  const [clarificationAnswers, setClarificationAnswers] = useState({});

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'ideaDescription') {
      setCharCount(value.length);
      setAiNote(''); // clear AI note when user edits description
    }
  }

  // ── AI Suggest ─────────────────────────────────────────────────────────
  async function handleAiSuggest() {
    if (form.ideaDescription.trim().length < 50) return;
    setAiSuggesting(true);
    setAiNote('');
    try {
      const result = await validationApi.predictContext(form.ideaDescription.trim());
      if (result.success && result.data) {
        const { targetAudience, pricingAssumption, geographySuggestion, reasoning } = result.data;
        setForm(prev => ({
          ...prev,
          targetAudience: targetAudience || prev.targetAudience,
          pricingAssumption: pricingAssumption || prev.pricingAssumption,
          geography: geographySuggestion || prev.geography,
        }));
        setAiNote(reasoning || 'AI predictions applied. Edit as needed.');
      } else {
        setAiNote('AI suggestion unavailable. Please fill manually.');
      }
    } catch {
      setAiNote('AI suggestion failed. Please fill manually.');
    } finally {
      setAiSuggesting(false);
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.ideaDescription.trim()) { setError('Idea description is required.'); return; }
    setLoading(true);
    try {
      const result = await validationApi.submitIdea({ ...form, userId: 'guest' });
      if (result.data?.status === 'clarification_needed') {
        setClarificationState({ submissionId: result.data.submissionId, questions: result.data.questions });
        const initial = {};
        result.data.questions.forEach(q => { initial[q.id] = ''; });
        setClarificationAnswers(initial);
      } else {
        await startAnalysis(result.data.submissionId);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleClarify(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const answers = Object.entries(clarificationAnswers).map(([id, answer]) => ({ id, answer }));
      await validationApi.provideClarification(clarificationState.submissionId, answers);
      await startAnalysis(clarificationState.submissionId);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function startAnalysis(submissionId) {
    await validationApi.startAnalysis(submissionId);
    navigate(`/status/${submissionId}`);
  }

  // ── Clarification screen ────────────────────────────────────────────────
  if (clarificationState) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
          <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>STEP 02 · REFINEMENT</div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>A few quick follow-ups</h1>
          <p className="text-sm mb-10" style={{ color: 'var(--color-text-2)' }}>
            The engine needs these to remove ambiguity before scanning. Answer briefly.
          </p>
          <form onSubmit={handleClarify} className="space-y-5">
            {clarificationState.questions.map(q => (
              <div key={q.id}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>{q.question}</label>
                <input
                  type="text"
                  value={clarificationAnswers[q.id] || ''}
                  onChange={e => setClarificationAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Your answer..."
                  className="w-full px-4 py-3 rounded-lg text-sm font-mono outline-none transition-all"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', color: 'var(--color-text)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--color-border-2)')}
                />
              </div>
            ))}
            {error && <p className="text-xs font-mono" style={{ color: 'var(--color-error)' }}>&#x2715; {error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setClarificationState(null)}
                className="flex-1 py-3 rounded-lg text-sm font-mono transition-all"
                style={{ background: 'transparent', border: '1px solid var(--color-border-2)', color: 'var(--color-text-2)' }}>
                BACK
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3 rounded-lg text-sm font-mono font-medium transition-all"
                style={{ background: loading ? 'var(--color-border)' : 'var(--color-accent)', color: loading ? 'var(--color-text-3)' : '#000' }}>
                {loading ? 'STARTING ANALYSIS...' : 'RUN ANALYSIS \u2192'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────
  const canSuggest = form.ideaDescription.trim().length >= 50 && !aiSuggesting;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>STEP 01 · SUBMIT IDEA</div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>What are you building?</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
            Drop the idea. The engine handles the rest.
          </p>
        </div>

        {/* Pipeline breadcrumb */}
        <div className="rounded-xl p-4 mb-8 font-mono text-xs"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            {['SUBMIT', '\u2192', 'AI REFINE', '\u2192', 'SCAN DATA', '\u2192', 'SCORE & VERDICT'].map((step, i) => (
              <span key={i} style={{ color: step === 'SUBMIT' ? 'var(--color-accent)' : 'var(--color-text-3)' }}>{step}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Idea Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Idea description <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <div className="relative">
              <textarea
                rows={5}
                value={form.ideaDescription}
                onChange={e => update('ideaDescription', e.target.value)}
                placeholder="Describe the idea — what it does, who it's for, the problem it solves. One paragraph is enough."
                maxLength={2000}
                className="w-full px-4 py-3 rounded-lg text-sm leading-relaxed outline-none transition-all resize-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', color: 'var(--color-text)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border-2)')}
              />
              <span className="absolute bottom-3 right-3 font-mono text-xs"
                style={{ color: charCount > 1800 ? 'var(--color-warning)' : 'var(--color-text-3)' }}>
                {charCount}/2000
              </span>
            </div>

            {/* AI Suggest button */}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={!canSuggest}
                className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: canSuggest ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                  border: `1px solid ${canSuggest ? 'var(--color-accent-muted)' : 'var(--color-border)'}`,
                  color: canSuggest ? 'var(--color-accent)' : 'var(--color-text-3)',
                  cursor: canSuggest ? 'pointer' : 'not-allowed',
                }}
              >
                {aiSuggesting ? (
                  <><span className="animate-spin inline-block w-3 h-3 border border-current rounded-full border-t-transparent" />PREDICTING...</>
                ) : (
                  <>\u2728 AI SUGGEST AUDIENCE &amp; PRICING</>
                )}
              </button>
              {!canSuggest && !aiSuggesting && (
                <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
                  Type 50+ chars to unlock
                </span>
              )}
            </div>

            {/* AI note */}
            {aiNote && (
              <div className="mt-2 px-3 py-2 rounded-lg font-mono text-xs"
                style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-muted)', color: 'var(--color-text-2)' }}>
                \u2728 {aiNote}
              </div>
            )}
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>Stage</label>
            <div className="grid grid-cols-3 gap-2">
              {STAGES.map(s => (
                <button key={s.value} type="button" onClick={() => update('stage', s.value)}
                  className="px-4 py-3 rounded-lg text-left transition-all"
                  style={{
                    background: form.stage === s.value ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                    border: `1px solid ${form.stage === s.value ? 'var(--color-accent)' : 'var(--color-border-2)'}`,
                    color: form.stage === s.value ? 'var(--color-accent)' : 'var(--color-text-2)',
                  }}>
                  <div className="font-mono text-xs font-medium">{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional context */}
          <div className="rounded-xl p-5 space-y-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
              CONTEXT — speeds up analysis, improves accuracy
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-2)' }}>
                Target audience
                {form.targetAudience && aiNote && (
                  <span className="ml-2 font-mono text-xs" style={{ color: 'var(--color-accent)', opacity: 0.7 }}>\u2728 AI predicted</span>
                )}
              </label>
              <input
                type="text"
                value={form.targetAudience}
                onChange={e => update('targetAudience', e.target.value)}
                placeholder='e.g. "B2B SaaS founders", "freelance developers"'
                className="w-full px-4 py-2.5 rounded-lg text-sm font-mono outline-none transition-all"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Geography — Leaflet Map Picker */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-2)' }}>
                Geography
                {form.geography && aiNote && (
                  <span className="ml-2 font-mono text-xs" style={{ color: 'var(--color-accent)', opacity: 0.7 }}>\u2728 AI predicted</span>
                )}
              </label>
              <GeographyPicker
                value={form.geography}
                onChange={val => update('geography', val)}
              />
            </div>

            {/* Pricing Assumption */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-2)' }}>
                Pricing assumption
                {form.pricingAssumption && aiNote && (
                  <span className="ml-2 font-mono text-xs" style={{ color: 'var(--color-accent)', opacity: 0.7 }}>\u2728 AI predicted</span>
                )}
              </label>
              <input
                type="text"
                value={form.pricingAssumption}
                onChange={e => update('pricingAssumption', e.target.value)}
                placeholder='e.g. "$29/month", "free + premium", "one-time $99"'
                className="w-full px-4 py-2.5 rounded-lg text-sm font-mono outline-none transition-all"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg px-4 py-3 font-mono text-xs"
              style={{ background: 'rgba(229,56,59,0.08)', border: '1px solid rgba(229,56,59,0.2)', color: 'var(--color-error)' }}>
              &#x2715; {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.ideaDescription.trim()}
            className="w-full py-4 rounded-lg font-mono text-sm font-medium transition-all"
            style={{
              background: (loading || !form.ideaDescription.trim()) ? 'var(--color-border)' : 'var(--color-accent)',
              color: (loading || !form.ideaDescription.trim()) ? 'var(--color-text-3)' : '#000',
              cursor: (loading || !form.ideaDescription.trim()) ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'SUBMITTING...' : 'SUBMIT & VALIDATE \u2192'}
          </button>

          <p className="text-center font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
            No account required. Results in under 5 minutes.
          </p>
        </form>
      </div>
    </div>
  );
}
