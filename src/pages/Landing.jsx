import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

// ─── Data ────────────────────────────────────────────────────────────
const FAILURE_MODES = [
  {
    num: '01',
    label: 'FAILURE MODE',
    title: 'Friends-and-family bias',
    desc: 'Polite feedback masquerading as validation. Nobody who loves you will tell you it won\'t sell.',
  },
  {
    num: '02',
    label: 'FAILURE MODE',
    title: 'AI opinion machines',
    desc: 'Generic LLM output that hallucinates demand. Confident text, zero evidence, no buyers.',
  },
  {
    num: '03',
    label: 'FAILURE MODE',
    title: 'Weeks of manual research',
    desc: '30 tabs, 5 spreadsheets, no synthesis. By the time you decide, the window is closed.',
  },
  {
    num: '04',
    label: 'FAILURE MODE',
    title: 'What exists ≠ who pays',
    desc: 'Most research maps competitors. None of it tells you which segment will actually open a wallet.',
  },
];

const HOW_STEPS = [
  {
    num: '01',
    title: 'Submit the idea',
    desc: 'Drop a one-line concept with optional context — target users, assumptions, constraints.',
    terminal: `MARKETIQ / STEP.01\n› submit "AI scheduling for solo dentists"\n  context: north america, b2b, $50-200/mo`,
  },
  {
    num: '02',
    title: 'Adaptive refinement',
    desc: 'The engine asks the right follow-ups, decomposing the idea into testable hypotheses.',
    terminal: `MARKETIQ / STEP.02\n? geography focus  → US + CA\n? primary problem  → no-show rate\n? assumed buyer   → practice owner`,
  },
  {
    num: '03',
    title: 'Multi-source scan',
    desc: 'Search intent, social signals, competitor stack, pricing pages, review mining — in parallel.',
    terminal: `MARKETIQ / STEP.03\n▸ scanning  4 surfaces · 1,247 signals\n▸ clustering pain points  ████████ 100%\n▸ mapping competitive landscape  OK`,
  },
  {
    num: '04',
    title: 'Score, rank, decide',
    desc: 'Quantitative validation score. Ranked ICPs. Risks called out. Strategy recommended.',
    terminal: `MARKETIQ / STEP.04\nverdict   : STRONG OPPORTUNITY\nicp.primary : solo practice, 1-3 chairs\nrisk.top    : long sales cycle (mitigated)`,
  },
];

const MODULES = [
  { code: 'M.01', title: 'Idea decomposition', desc: 'Splits a one-liner into ICP, problems, and use-cases the engine can test independently.' },
  { code: 'M.02', title: 'Demand aggregation', desc: 'Pulls intent signals from search, social, forums, reviews, and adjacent product traction.' },
  { code: 'M.03', title: 'Pain clustering', desc: 'Groups raw user complaints into themes and scores intensity by frequency and language.' },
  { code: 'M.04', title: 'Segment ranking', desc: 'Detects all viable ICPs, ranks by urgency, accessibility, and willingness to pay.' },
  { code: 'M.05', title: 'Market classification', desc: 'Tags the space as new, growing, saturated, or dead — with the data to back it.' },
  { code: 'M.06', title: 'Competitive mapping', desc: 'Maps incumbents, pricing tiers, positioning, and the gaps no one is currently serving.' },
  { code: 'M.07', title: 'Validation scoring', desc: 'Synthesizes demand, intent, and competitive density into a single decision-grade score.' },
  { code: 'M.08', title: 'Risk analysis', desc: 'Surfaces failure vectors and the load-bearing assumptions that, if wrong, kill the idea.' },
  { code: 'M.09', title: 'Strategic recs', desc: 'Suggests pivots, niche cuts, and positioning angles based on what the data actually shows.' },
];

const COMPARISON = [
  { dim: 'Source of truth', typical: 'AI opinions / vibes', ours: 'Real-world demand signals' },
  { dim: 'Bias control', typical: 'Confirmation bias built-in', ours: 'Truth layer rejects weak ideas' },
  { dim: 'Customer focus', typical: 'What competitors built', ours: 'Who actually pays' },
  { dim: 'Output', typical: 'Long, hedged narrative', ours: 'Verdict + ranked actions' },
  { dim: 'Time to decision', typical: 'Days to weeks', ours: 'Minutes' },
];

const AUDIENCE = [
  { code: 'U.01', title: 'Indie hackers', desc: 'Validating side projects without burning weekends on dead ends.' },
  { code: 'U.02', title: 'Solo founders', desc: 'Choosing the right wedge before quitting the day job.' },
  { code: 'U.03', title: 'Early-stage teams', desc: 'Pressure-testing the next bet before a board meeting.' },
  { code: 'U.04', title: 'Product managers', desc: 'Killing or greenlighting features with evidence, not opinions.' },
];

const FAQS = [
  { q: 'How do I validate a startup idea before building an MVP?', a: 'Run a quantitative signal scan across search intent, forums, and reviews. MarketIQ extracts 1,000+ signals to score demand before you write a line of code.' },
  { q: 'What makes MarketIQ different from generic AI tools?', a: 'Generic AI tools hallucinate demand from training data. MarketIQ scans live data sources — real user complaints, real search volume, real review patterns — and has a built-in truth layer that kills weak ideas.' },
  { q: 'How does MarketIQ find target customers?', a: 'The segment ranking module detects viable ICPs from demand signals, then scores each by urgency, accessibility, spend behavior, and reach — giving you a ranked, evidence-backed priority list.' },
  { q: 'How long does a full market validation report take?', a: 'Under 5 minutes for most ideas. The engine runs all 9 modules in parallel across 4 data surfaces.' },
  { q: 'What does the validation report include?', a: 'Validation score (0-100), demand signal breakdown, competitive map, ranked customer segments, risk vectors, and a specific strategic direction — not generic advice.' },
];

// ─── Subcomponents ────────────────────────────────────────────────────
function SectionTag({ num, label }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>{num}</span>
      <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--color-text-3)' }}>· {label}</span>
    </div>
  );
}

function Terminal({ code }) {
  return (
    <div
      className="rounded-lg p-4 font-mono text-xs leading-relaxed whitespace-pre"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-2)',
      }}
    >
      {code.split('\n').map((line, i) => (
        <div key={i}>
          {line.startsWith('MARKETIQ') ? (
            <span style={{ color: 'var(--color-accent)' }}>{line}</span>
          ) : line.startsWith('?') ? (
            <span style={{ color: 'var(--color-warning)' }}>{line}</span>
          ) : line.startsWith('▸') ? (
            <span style={{ color: 'var(--color-accent)' }}>{line}</span>
          ) : line.startsWith('verdict') || line.startsWith('icp') || line.startsWith('risk') ? (
            <span>
              <span style={{ color: 'var(--color-text-3)' }}>{line.split(':')[0]}:</span>
              <span style={{ color: 'var(--color-text)' }}>{line.includes(':') ? line.slice(line.indexOf(':') + 1) : ''}</span>
            </span>
          ) : (
            <span>{line}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="cursor-pointer"
      style={{ borderBottom: '1px solid var(--color-border)' }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between py-5 gap-4">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{q}</span>
        <span
          className="font-mono text-lg shrink-0 transition-transform duration-200"
          style={{ color: 'var(--color-accent)', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >+</span>
      </div>
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ color: 'var(--color-text-2)' }}>{a}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [terminalText, setTerminalText] = useState('');
  const placeholder = '› idea: Spreadsheet replacement for film producers';
  const [email, setEmail] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(placeholder.slice(0, i));
      i++;
      if (i > placeholder.length) {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full font-mono text-xs"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--color-accent)', boxShadow: '0 0 6px var(--color-accent)' }} />
            SYSTEM: ONLINE · V0.9 · PRIVATE BETA
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight mb-6" style={{ color: 'var(--color-text)' }}>
            Stop building blind.<br />
            <span style={{ color: 'var(--color-accent)' }}>Validate before you ship.</span>
          </h1>

          <p className="text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--color-text-2)' }}>
            An autonomous market intelligence engine that turns a raw startup idea into
            an evidence-backed verdict — demand signals, competitive gaps, prioritized
            customer segments, and a clear go / no-go.
          </p>

          {/* Terminal Input */}
          <div
            className="max-w-2xl mx-auto rounded-xl p-4 mb-6 text-left"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#E5383B' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#00E879' }} />
              <span className="font-mono text-xs ml-2" style={{ color: 'var(--color-text-3)' }}>MARKETIQ.AI — INPUT</span>
            </div>
            <div className="font-mono text-sm" style={{ color: 'var(--color-accent)', minHeight: '24px' }}>
              {terminalText}
              <span className="cursor-blink inline-block w-0.5 h-4 align-text-bottom ml-0.5" style={{ background: 'var(--color-accent)' }} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/submit')}
              className="font-mono text-sm font-medium px-6 py-3 rounded-lg transition-all"
              style={{ background: 'var(--color-accent)', color: '#000' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              VALIDATE MY IDEA →
            </button>
            <a
              href="#how"
              className="font-mono text-sm px-6 py-3 rounded-lg transition-all"
              style={{ background: 'transparent', color: 'var(--color-text-2)', border: '1px solid var(--color-border-2)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-2)')}
              onMouseLeave={e => {}}
            >
              SEE HOW IT WORKS
            </a>
          </div>

          {/* Score Preview */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { label: 'Demand index', val: '87' },
              { label: 'Intent signal', val: '72' },
              { label: 'Competition gap', val: '64' },
              { label: 'Pay willingness', val: '81' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-lg p-3 text-center"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="font-mono text-2xl font-semibold mb-1" style={{ color: 'var(--color-accent)' }}>{item.val}</div>
                <div className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ────────────────────────────── */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionTag num="002" label="THE PROBLEM" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 max-w-2xl" style={{ color: 'var(--color-text)' }}>
            Why startup idea validation usually fails
          </h2>
          <p className="text-sm mb-16 max-w-xl" style={{ color: 'var(--color-text-2)' }}>
            Founders confuse feedback with evidence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAILURE_MODES.map(item => (
              <div
                key={item.num}
                className="rounded-xl p-6"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{item.num}✕</span>
                  <div>
                    <div className="font-mono text-xs mb-2 tracking-widest" style={{ color: 'var(--color-error)' }}>{item.label}</div>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-2)' }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────── */}
      <section id="how" className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionTag num="003" label="HOW IT WORKS" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            From a one-line idea to a decision-grade verdict
          </h2>
          <p className="text-sm mb-16" style={{ color: 'var(--color-text-2)' }}>in minutes.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOW_STEPS.map(step => (
              <div
                key={step.num}
                className="rounded-xl p-6"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="font-mono text-xs mb-4 tracking-widest" style={{ color: 'var(--color-text-3)' }}>
                  {step.num}
                </div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{step.title}</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-text-2)' }}>{step.desc}</p>
                <Terminal code={step.terminal} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ICP Scoring ───────────────────────── */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionTag num="004" label="VALIDATION ENGINE" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 max-w-xl" style={{ color: 'var(--color-text)' }}>
            Don't just ask if people want it.<br />Find out exactly who will pay.
          </h2>
          <p className="text-sm mb-16 max-w-xl" style={{ color: 'var(--color-text-2)' }}>
            The customer prioritization layer ranks segments by four factors and tells you
            who to target first — and who to avoid.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scoring Vectors */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="font-mono text-xs mb-5 tracking-widest" style={{ color: 'var(--color-text-3)' }}>SCORING VECTORS</div>
              {[
                { n: '/01', label: 'Urgency', desc: 'How acute is the pain, today?' },
                { n: '/02', label: 'Frequency', desc: 'How often does it occur?' },
                { n: '/03', label: 'Spend behavior', desc: 'Are they already paying for adjacent tools?' },
                { n: '/04', label: 'Reach', desc: 'Can you actually distribute to them?' },
              ].map(v => (
                <div key={v.n} className="mb-4 last:mb-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>{v.n}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{v.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>{v.desc}</p>
                </div>
              ))}
            </div>

            {/* Ranked Segments */}
            <div
              className="md:col-span-2 rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="font-mono text-xs mb-5 tracking-widest" style={{ color: 'var(--color-text-3)' }}>RANKED CUSTOMER SEGMENTS · LIVE PREVIEW</div>
              {[
                { rank: '01', segment: 'Solo practice owners (1–3 chairs)', badge: 'PRIMARY ICP', urg: 92, pay: 88, reach: 74, color: 'accent' },
                { rank: '02', segment: 'DSO ops managers, < 20 locations', badge: 'SECONDARY', urg: 71, pay: 84, reach: 62, color: 'text-2' },
                { rank: '03', segment: 'Front-desk staff (end-users)', badge: 'INFLUENCER', urg: 64, pay: 22, reach: 80, color: 'text-3' },
                { rank: '04', segment: 'Dental schools / education', badge: 'AVOID', urg: 38, pay: 18, reach: 41, color: 'error' },
              ].map(seg => (
                <div
                  key={seg.rank}
                  className="flex items-center justify-between py-3 gap-4"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs shrink-0" style={{ color: 'var(--color-text-3)' }}>{seg.rank}</span>
                    <span className="text-xs truncate" style={{ color: 'var(--color-text)' }}>{seg.segment}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{
                        background: seg.badge === 'AVOID' ? 'rgba(229,56,59,0.12)' : 'var(--color-accent-dim)',
                        color: seg.badge === 'AVOID' ? 'var(--color-error)' : 'var(--color-accent)',
                        border: `1px solid ${seg.badge === 'AVOID' ? 'rgba(229,56,59,0.25)' : 'var(--color-accent-muted)'}`,
                      }}
                    >
                      {seg.badge}
                    </span>
                    <div className="hidden sm:flex font-mono text-xs gap-2" style={{ color: 'var(--color-text-3)' }}>
                      <span>Urg<span style={{ color: 'var(--color-text)' }}>{seg.urg}</span></span>
                      <span>Pay<span style={{ color: 'var(--color-text)' }}>{seg.pay}</span></span>
                      <span>Reach<span style={{ color: 'var(--color-text)' }}>{seg.reach}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Engine Modules ────────────────────── */}
      <section id="engine" className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionTag num="005" label="CORE CAPABILITIES" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Nine modules. One verdict.
          </h2>
          <p className="text-sm mb-16 max-w-lg" style={{ color: 'var(--color-text-2)' }}>
            Every report runs the same pipeline. No cherry-picking, no narrative fitting — just structured signal extraction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map(mod => (
              <div
                key={mod.code}
                className="rounded-xl p-5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-accent)' }}>{mod.code}</div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{mod.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-2)' }}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Output Preview ────────────────────── */}
      <section id="report" className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionTag num="006" label="OUTPUT PREVIEW" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 max-w-xl" style={{ color: 'var(--color-text)' }}>
            The artifact: a decision-grade report.
          </h2>
          <p className="text-sm mb-16 max-w-lg" style={{ color: 'var(--color-text-2)' }}>
            Not a slide deck. Not a chat transcript. A structured document built for fast judgment.
          </p>

          <div
            className="rounded-2xl p-6 max-w-3xl"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)' }}
          >
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>REPORT #0427 · GENERATED 00:01:47</span>
              <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-muted)' }}>MARKETIQ.AI</span>
            </div>

            <div className="mb-6">
              <div className="font-mono text-xs mb-2" style={{ color: 'var(--color-text-3)' }}>IDEA</div>
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>AI-powered scheduling tool for solo dental practices.</h3>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex-1 min-w-32 rounded-lg p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>MARKET VERDICT</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>Strong opportunity · build it</div>
              </div>
              <div className="flex-1 min-w-32 rounded-lg p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>VALIDATION SCORE</div>
                <div className="text-2xl font-mono font-semibold" style={{ color: 'var(--color-accent)' }}>82<span className="text-xs" style={{ color: 'var(--color-text-3)' }}>/100</span></div>
              </div>
              <div className="flex-1 min-w-32 rounded-lg p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>TIME TO DECISION</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>3m 12s <span className="text-xs font-normal" style={{ color: 'var(--color-text-3)' }}>vs ~3 weeks manual</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-accent)' }}>DEMAND INSIGHTS</div>
                {[
                  { label: 'SEARCH VOLUME', val: '+42% YoY for \'no-show\' tooling' },
                  { label: 'FORUM MENTIONS', val: '3,200+ unique pain posts / 90d' },
                  { label: 'ADJACENT TRACTION', val: 'Calendly clones in dental: 4 funded' },
                  { label: 'REVIEW MINING', val: '8 of top 10 PMS scored < 3.0★' },
                ].map(item => (
                  <div key={item.label} className="mb-2 last:mb-0">
                    <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>{item.label} </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-2)' }}>{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-error)' }}>RISK VECTORS</div>
                {[
                  '✕ Long enterprise sales cycle if targeting DSOs',
                  '✕ Integration debt — 14+ legacy PMS systems',
                  '▲ Compliance: PHI handling adds 3–6mo runway',
                  '▲ CAC sensitivity in solo segment',
                ].map((risk, i) => (
                  <div key={i} className="text-xs mb-1.5 last:mb-0" style={{ color: risk.startsWith('✕') ? 'var(--color-error)' : 'var(--color-warning)' }}>{risk}</div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <div className="font-mono text-xs mb-2" style={{ color: 'var(--color-accent)' }}>STRATEGIC DIRECTION</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-2)' }}>
                Lead with no-show recovery for 1–3 chair practices in US/CA. Bypass PMS integration in v1 with calendar overlay + SMS layer. Price $79/mo, sell direct via dental subreddit and state-level associations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison ───────────────────────── */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionTag num="007" label="WHY MARKETIQ.AI" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 max-w-xl" style={{ color: 'var(--color-text)' }}>
            Built to disagree with you.
          </h2>
          <p className="text-sm mb-16 max-w-xl" style={{ color: 'var(--color-text-2)' }}>
            Most tools tell you what you want to hear. MarketIQ.ai has a built-in truth layer
            designed to kill weak ideas before they cost you twelve months.
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left px-5 py-3 font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>DIMENSION</th>
                  <th className="text-left px-5 py-3 font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>TYPICAL TOOLS</th>
                  <th className="text-left px-5 py-3 font-mono text-xs" style={{ color: 'var(--color-accent)' }}>MARKETIQ.AI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.dim} style={{ background: i % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                    <td className="px-5 py-3 text-xs font-medium" style={{ color: 'var(--color-text)' }}>{row.dim}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'var(--color-text-3)' }}>{row.typical}</td>
                    <td className="px-5 py-3 text-xs font-medium" style={{ color: 'var(--color-accent)' }}>{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Audience ─────────────────────────── */}
      <section id="audience" className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionTag num="008" label="BUILT FOR" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-16 max-w-xl" style={{ color: 'var(--color-text)' }}>
            For builders who'd rather know than guess.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUDIENCE.map(a => (
              <div
                key={a.code}
                className="rounded-xl p-5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-accent)' }}>{a.code}</div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{a.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-2)' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────── */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-3xl mx-auto">
          <SectionTag num="009" label="FAQ" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-16" style={{ color: 'var(--color-text)' }}>
            Questions founders ask before validating an idea.
          </h2>

          <div>
            {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────── */}
      <section className="py-32 px-6 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="font-mono text-xs mb-6" style={{ color: 'var(--color-text-3)' }}>009 · FINAL CALL</div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            From idea to decision —<br />
            <span style={{ color: 'var(--color-accent)' }}>in minutes.</span>
          </h2>
          <p className="text-sm mb-12" style={{ color: 'var(--color-text-2)' }}>
            Validate your next idea before you write a single line of code.
          </p>

          <button
            onClick={() => navigate('/submit')}
            className="font-mono text-sm font-medium px-8 py-4 rounded-lg transition-all inline-flex items-center gap-2"
            style={{ background: 'var(--color-accent)', color: '#000' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            VALIDATE MY IDEA →
          </button>

          <p className="mt-4 font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>NO SIGNUP REQUIRED · RESULTS IN MINUTES</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
          MARKETIQ.AI · AUTONOMOUS MARKET INTELLIGENCE ENGINE · © 2026 · DATA-BACKED ANSWERS, NOT OPINIONS.
        </p>
      </footer>
    </div>
  );
}
