"""Generate all AMIE landing page component files."""
import os

ROOT = '/Users/jayasurya/Desktop/R-D/Mark/market-research/src'
AMIE = os.path.join(ROOT, 'components', 'amie')
os.makedirs(AMIE, exist_ok=True)

files = {}

# ── Section ─────────────────────────────────────────────────────────────────
files['Section.jsx'] = """import { motion } from 'framer-motion';

export function Section({ id, index, eyebrow, title, lede, children, className = '' }) {
  return (
    <section id={id} className={`relative py-24 md:py-32 hairline-t ${className}`}>
      <div className="container-edge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          <div className="lg:col-span-3 flex lg:flex-col items-start justify-between gap-4">
            <span className="eyebrow">{index}</span>
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <div className="lg:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] max-w-4xl"
            >
              {title}
            </motion.h2>
            {lede && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mt-6 text-lg ink-soft max-w-2xl leading-relaxed"
              >
                {lede}
              </motion.p>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
"""

# ── Nav ──────────────────────────────────────────────────────────────────────
files['Nav.jsx'] = """import { motion } from 'framer-motion';

export function Nav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 hairline-b"
      style={{ background: 'hsl(var(--amie-bg) / 0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div className="container-edge flex h-14 items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="signal-dot" />
          <span className="font-mono text-[13px] tracking-[0.18em] uppercase">MarketIQ.ai</span>
          <span className="hidden md:inline font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: 'hsl(var(--amie-ink-muted))' }}>/ market intel engine</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[13px]" style={{ color: 'hsl(var(--amie-ink-soft))' }}>
          {[['#how', 'How it works'], ['#engine', 'Engine'], ['#report', 'Report'], ['#audience', 'For']].map(([h, l]) => (
            <a key={h} href={h} className="transition-colors hover:text-current">{l}</a>
          ))}
        </nav>
        <a
          href="#waitlist"
          className="group inline-flex items-center gap-2 px-4 h-9 text-[12px] font-mono uppercase tracking-[0.16em] transition-opacity hover:opacity-80"
          style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
        >
          Join waitlist
          <span className="inline-block transition-transform group-hover:translate-x-0.5">\u2192</span>
        </a>
      </div>
    </motion.header>
  );
}
"""

# ── Hero ─────────────────────────────────────────────────────────────────────
files['Hero.jsx'] = """import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PHRASES = [
  'AI scheduling tool for solo dentists',
  'Spreadsheet replacement for film producers',
  'Inventory OS for indie cosmetic brands',
  'Compliance copilot for fintech founders',
];

const METRICS = [
  { l: 'Demand index',    v: 87, tone: 'strong' },
  { l: 'Intent signal',   v: 72, tone: 'strong' },
  { l: 'Competition gap', v: 64, tone: 'risky'  },
  { l: 'Pay willingness', v: 81, tone: 'strong' },
];

export function Hero() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PHRASES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-rule pointer-events-none" style={{ opacity: 0.35 }} />
      <div className="container-edge relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 eyebrow">
            <span className="signal-dot" />
            <span>System: Online</span>
            <span style={{ color: 'hsl(var(--amie-fg) / 0.3)' }}>·</span>
            <span>v0.9 · Private Beta</span>
          </div>
          <div className="hidden md:block eyebrow">001 / Hero</div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">
          {/* Headline */}
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display leading-[1.02] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(36px, 7vw, 88px)' }}
            >
              Stop building blind.{' '}
              <span className="italic" style={{ color: 'hsl(var(--amie-ink-soft))' }}>Validate</span>{' '}
              before you ship.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed"
              style={{ color: 'hsl(var(--amie-ink-soft))' }}
            >
              An autonomous market intelligence engine that turns a raw startup idea into an
              evidence-backed verdict — demand signals, competitive gaps, prioritized customer
              segments, and a clear go / no-go.
            </motion.p>

            {/* Live input mock */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-12 hairline-t hairline-b hairline-l hairline-r"
              style={{ background: 'hsl(var(--amie-surface))' }}
            >
              <div className="flex items-center justify-between px-4 h-9 hairline-b" style={{ background: 'hsl(var(--amie-bg) / 0.4)' }}>
                <div className="flex items-center gap-3 eyebrow">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(var(--amie-verdict-strong) / 0.8)' }} />
                  marketiq.ai — input
                </div>
                <span className="eyebrow" style={{ color: 'hsl(var(--amie-fg) / 0.4)' }}>\u21b5 to validate</span>
              </div>
              <div className="px-5 py-6 font-mono text-[15px] md:text-base">
                <span style={{ color: 'hsl(var(--amie-ink-muted))' }}>\u203a idea: </span>
                <span key={idx} className="amie-cursor-blink animate-fade-up">{PHRASES[idx]}</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <button
                onClick={() => navigate('/submit')}
                className="group inline-flex items-center gap-3 px-6 h-12 font-mono text-[12px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
                style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
              >
                Validate your idea
                <span className="inline-block transition-transform group-hover:translate-x-1">\u2192</span>
              </button>
              <a
                href="#how"
                className="group inline-flex items-center gap-2 px-2 h-12 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors"
                style={{ color: 'hsl(var(--amie-ink-soft))' }}
              >
                <span className="w-6 h-px transition-all group-hover:w-10" style={{ background: 'hsl(var(--amie-fg))' }} />
                See how it works
              </a>
            </motion.div>
          </div>

          {/* Verdict card */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-4 lg:pl-8 lg:border-l"
            style={{ borderColor: 'hsl(var(--amie-border))' }}
          >
            <div className="hairline-t hairline-b hairline-l hairline-r" style={{ background: 'hsl(var(--amie-bg))' }}>
              <div className="flex items-center justify-between px-4 h-9 hairline-b">
                <span className="eyebrow">Report · Specimen</span>
                <span className="eyebrow" style={{ color: 'hsl(var(--amie-fg) / 0.4)' }}>#0427</span>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <div className="eyebrow mb-2">Market verdict</div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl">Strong</span>
                    <span className="font-mono text-xs" style={{ color: 'hsl(var(--amie-verdict-strong))' }}>\u25b2 opportunity</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {METRICS.map(m => (
                    <div key={m.l}>
                      <div className="flex justify-between text-xs font-mono mb-1" style={{ color: 'hsl(var(--amie-ink-soft))' }}>
                        <span>{m.l}</span>
                        <span>{m.v}</span>
                      </div>
                      <div className="h-[3px]" style={{ background: 'hsl(var(--amie-surface-2))' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.v}%` }}
                          transition={{ duration: 1.2, delay: 0.8 }}
                          className="h-full"
                          style={{ background: `hsl(var(--amie-verdict-${m.tone}))` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 hairline-t">
                  <div className="eyebrow mb-2">Primary ICP</div>
                  <div className="text-sm">
                    Solo founders shipping their <em className="font-display not-italic italic">first</em> SaaS,
                    annual rev &lt; $50K.
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
"""

# ── Marquee ──────────────────────────────────────────────────────────────────
files['MarqueeBar.jsx'] = """const ITEMS = [
  'Demand signals', 'Competitor mapping', 'ICP prioritization', 'Risk vectors',
  'Pain intensity', 'Pricing gaps', 'Search intent', 'Niche discovery',
  'Verdict scoring', 'Strategic pivots',
];

export function MarqueeBar() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="hairline-t hairline-b overflow-hidden" style={{ background: 'hsl(var(--amie-surface))' }}>
      <div className="flex amie-marquee whitespace-nowrap py-3.5">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-6 ticker" style={{ color: 'hsl(var(--amie-ink-soft))' }}>
            <span>{t}</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'hsl(var(--amie-signal))' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
"""

# ── Problem ──────────────────────────────────────────────────────────────────
files['Problem.jsx'] = """import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const FAILURES = [
  { n: '01', t: 'Friends-and-family bias', d: "Polite feedback masquerading as validation. Nobody who loves you will tell you it won't sell." },
  { n: '02', t: 'AI opinion machines', d: 'Generic LLM output that hallucinates demand. Confident text, zero evidence, no buyers.' },
  { n: '03', t: 'Weeks of manual research', d: '30 tabs, 5 spreadsheets, no synthesis. By the time you decide, the window is closed.' },
  { n: '04', t: 'What exists \u2260 who pays', d: 'Most research maps competitors. None of it tells you which segment will actually open a wallet.' },
];

export function Problem() {
  return (
    <Section
      id="problem"
      index="002"
      eyebrow="The problem"
      title={<>Why startup idea validation usually fails \u2014 and founders confuse <em className="font-display italic" style={{ color: 'hsl(var(--amie-ink-soft))' }}>feedback</em> with <em className="font-display italic">evidence</em>.</>}
      lede="Today\u2019s validation methods \u2014 friend surveys, generic AI prompts, weeks of manual research \u2014 are slow, biased, or hallucinated. You ship a SaaS nobody wanted and call it a learning."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px hairline-t hairline-l hairline-r" style={{ background: 'hsl(var(--amie-border))' }}>
        {FAILURES.map((f, i) => (
          <motion.div
            key={f.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className="p-8 md:p-10"
            style={{ background: 'hsl(var(--amie-bg))' }}
          >
            <div className="flex items-baseline justify-between mb-6">
              <span className="eyebrow">{f.n}</span>
              <span className="font-mono text-xs" style={{ color: 'hsl(var(--amie-destructive))' }}>\u2715 failure mode</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-3">{f.t}</h3>
            <p className="leading-relaxed" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{f.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
"""

# ── HowItWorks ───────────────────────────────────────────────────────────────
files['HowItWorks.jsx'] = """import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const STEPS = [
  {
    n: '01', t: 'Submit the idea',
    d: 'Drop a one-line concept with optional context \u2014 target users, assumptions, constraints.',
    code: '\u203a submit "AI scheduling for solo dentists"\\n  context: north america, b2b, $50-200/mo',
  },
  {
    n: '02', t: 'Adaptive refinement',
    d: 'The engine asks the right follow-ups, decomposing the idea into testable hypotheses.',
    code: '? geography focus  \u2192 US + CA\\n? primary problem  \u2192 no-show rate\\n? assumed buyer    \u2192 practice owner',
  },
  {
    n: '03', t: 'Multi-source scan',
    d: 'Search intent, social signals, competitor stack, pricing pages, review mining \u2014 in parallel.',
    code: '\u25b8 scanning  4 surfaces \u00b7 1,247 signals\\n\u25b8 clustering pain points  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 100%\\n\u25b8 mapping competitive landscape    OK',
  },
  {
    n: '04', t: 'Score, rank, decide',
    d: 'Quantitative validation score. Ranked ICPs. Risks called out. Strategy recommended.',
    code: 'verdict    : STRONG OPPORTUNITY\\nicp.primary : solo practice, 1-3 chairs\\nrisk.top    : long sales cycle (mitigated)',
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how"
      index="003"
      eyebrow="How it works"
      title={<>From a one-line idea to a decision-grade verdict \u2014 <em className="font-display italic">in minutes.</em></>}
      lede="The engine runs four sequential passes. You write nothing. You read a report."
    >
      <div className="space-y-px hairline-t hairline-l hairline-r" style={{ background: 'hsl(var(--amie-border))' }}>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 md:p-10"
            style={{ background: 'hsl(var(--amie-bg))' }}
          >
            <div className="md:col-span-1 eyebrow">{s.n}</div>
            <div className="md:col-span-4">
              <h3 className="font-display text-3xl md:text-4xl leading-tight">{s.t}</h3>
              <p className="mt-3" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{s.d}</p>
            </div>
            <div className="md:col-span-7 hairline-t hairline-b hairline-l hairline-r" style={{ background: 'hsl(var(--amie-surface))' }}>
              <div className="flex items-center gap-2 px-4 h-8 hairline-b">
                <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(var(--amie-verdict-strong) / 0.7)' }} />
                <span className="eyebrow" style={{ color: 'hsl(var(--amie-fg) / 0.5)' }}>marketiq.ai / step.{s.n}</span>
              </div>
              <pre className="font-mono text-[13px] leading-relaxed p-5 whitespace-pre-wrap" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{s.code}</pre>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
"""

# ── Validation ───────────────────────────────────────────────────────────────
files['Validation.jsx'] = """import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const SEGMENTS = [
  { rank: '01', name: 'Solo practice owners (1\u20133 chairs)', urgency: 92, pay: 88, reach: 74, tag: 'PRIMARY ICP', tone: 'strong' },
  { rank: '02', name: 'DSO ops managers, < 20 locations',     urgency: 71, pay: 84, reach: 62, tag: 'Secondary',   tone: 'strong' },
  { rank: '03', name: 'Front-desk staff (end-users)',          urgency: 64, pay: 22, reach: 80, tag: 'Influencer',  tone: 'risky'  },
  { rank: '04', name: 'Dental schools / education',           urgency: 38, pay: 18, reach: 41, tag: 'Avoid',       tone: 'dead'   },
];
const FACTORS = [
  { l: 'Urgency',        d: 'How acute is the pain, today?' },
  { l: 'Frequency',      d: 'How often does it occur?' },
  { l: 'Spend behavior', d: 'Are they already paying for adjacent tools?' },
  { l: 'Reach',          d: 'Can you actually distribute to them?' },
];

export function Validation() {
  return (
    <Section
      id="validation"
      index="004"
      eyebrow="Validation engine"
      title={<>Don\u2019t just ask <em className="font-display italic">if</em> people want it. Find out exactly <em className="font-display italic">who</em> will pay.</>}
      lede="The customer prioritization layer ranks segments by four factors and tells you who to target first \u2014 and who to avoid."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px hairline-t hairline-l hairline-r" style={{ background: 'hsl(var(--amie-border))' }}>
        {/* Scoring factors */}
        <div className="lg:col-span-4 p-8 md:p-10" style={{ background: 'hsl(var(--amie-bg))' }}>
          <div className="eyebrow mb-6">Scoring vectors</div>
          <div className="space-y-6">
            {FACTORS.map((f, i) => (
              <motion.div
                key={f.l}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="pb-5 last:border-0 hairline-b"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs" style={{ color: 'hsl(var(--amie-signal))' }}>/{(i+1).toString().padStart(2,'0')}</span>
                  <span className="font-display text-2xl">{f.l}</span>
                </div>
                <p className="text-sm mt-1" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ranked segments */}
        <div className="lg:col-span-8" style={{ background: 'hsl(var(--amie-bg))' }}>
          <div className="flex items-center justify-between px-6 md:px-8 h-12 hairline-b">
            <span className="eyebrow">Ranked customer segments \u00b7 live preview</span>
            <span className="ticker" style={{ color: 'hsl(var(--amie-ink-muted))' }}>N=4</span>
          </div>
          {SEGMENTS.map((s, i) => (
            <motion.div
              key={s.rank}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-6 hairline-b last:border-0 transition-colors"
              style={{ cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--amie-surface) / 0.6)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <div className="col-span-1 font-mono text-sm" style={{ color: 'hsl(var(--amie-ink-muted))' }}>{s.rank}</div>
              <div className="col-span-11 md:col-span-5">
                <div className="font-display text-xl md:text-2xl leading-tight">{s.name}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: `hsl(var(--amie-verdict-${s.tone}))` }}>{s.tag}</div>
              </div>
              <div className="col-span-12 md:col-span-6 grid grid-cols-3 gap-3">
                {[{l:'Urg',v:s.urgency},{l:'Pay',v:s.pay},{l:'Reach',v:s.reach}].map(m => (
                  <div key={m.l}>
                    <div className="flex justify-between text-[11px] font-mono mb-1" style={{ color: 'hsl(var(--amie-ink-muted))' }}>
                      <span>{m.l}</span><span>{m.v}</span>
                    </div>
                    <div className="h-[2px]" style={{ background: 'hsl(var(--amie-surface-2))' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.v}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                        className="h-full"
                        style={{ background: `hsl(var(--amie-verdict-${s.tone}))` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
"""

# ── Engine ───────────────────────────────────────────────────────────────────
files['Engine.jsx'] = """import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const CAPS = [
  { t: 'Idea decomposition',    d: 'Splits a one-liner into ICP, problems, and use-cases the engine can test independently.' },
  { t: 'Demand aggregation',    d: 'Pulls intent signals from search, social, forums, reviews, and adjacent product traction.' },
  { t: 'Pain clustering',       d: 'Groups raw user complaints into themes and scores intensity by frequency and language.' },
  { t: 'Segment ranking',       d: 'Detects all viable ICPs, ranks by urgency, accessibility, and willingness to pay.' },
  { t: 'Market classification', d: 'Tags the space as new, growing, saturated, or dead \u2014 with the data to back it.' },
  { t: 'Competitive mapping',   d: 'Maps incumbents, pricing tiers, positioning, and the gaps no one is currently serving.' },
  { t: 'Validation scoring',    d: 'Synthesizes demand, intent, and competitive density into a single decision-grade score.' },
  { t: 'Risk analysis',         d: 'Surfaces failure vectors and the load-bearing assumptions that, if wrong, kill the idea.' },
  { t: 'Strategic recs',        d: 'Suggests pivots, niche cuts, and positioning angles based on what the data actually shows.' },
];

export function Engine() {
  return (
    <Section
      id="engine"
      index="005"
      eyebrow="Core capabilities"
      title={<>Nine modules. <em className="font-display italic">One verdict.</em></>}
      lede="Every report runs the same pipeline. No cherry-picking, no narrative fitting \u2014 just structured signal extraction."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px hairline-t hairline-l hairline-r" style={{ background: 'hsl(var(--amie-border))' }}>
        {CAPS.map((c, i) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            className="p-7 md:p-8 group relative"
            style={{ background: 'hsl(var(--amie-bg))' }}
          >
            <div className="flex items-baseline justify-between mb-5">
              <span className="font-mono text-[11px]" style={{ color: 'hsl(var(--amie-ink-muted))' }}>M.{(i+1).toString().padStart(2,'0')}</span>
              <span className="w-1.5 h-1.5 rounded-full transition-opacity opacity-30 group-hover:opacity-100" style={{ background: 'hsl(var(--amie-signal))' }} />
            </div>
            <h3 className="font-display text-2xl mb-2">{c.t}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{c.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
"""

# ── Report ───────────────────────────────────────────────────────────────────
files['Report.jsx'] = """import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

export function Report() {
  return (
    <Section
      id="report"
      index="006"
      eyebrow="Output preview"
      title={<>The artifact: a <em className="font-display italic">decision-grade</em> report.</>}
      lede="Not a slide deck. Not a chat transcript. A structured document built for fast judgment."
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9 }}
        className="hairline-t hairline-b hairline-l hairline-r"
        style={{ background: 'hsl(var(--amie-surface))' }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 md:px-10 py-4 hairline-b gap-2">
          <div className="flex items-center gap-3">
            <span className="signal-dot" />
            <span className="eyebrow">Report #0427 \u00b7 Generated 00:01:47</span>
          </div>
          <div className="ticker" style={{ color: 'hsl(var(--amie-ink-muted))' }}>MarketIQ.ai / Validation Layer</div>
        </div>

        {/* Idea */}
        <div className="px-6 md:px-10 py-10 hairline-b">
          <div className="eyebrow mb-3">Idea</div>
          <h3 className="font-display text-3xl md:text-5xl leading-tight max-w-3xl">
            AI-powered scheduling tool for solo dental practices.
          </h3>
        </div>

        {/* Verdict row */}
        <div className="grid grid-cols-1 md:grid-cols-3 hairline-b">
          {[
            { label: 'Market verdict',    val: <span className="font-display text-5xl" style={{ color: 'hsl(var(--amie-verdict-strong))' }}>Strong</span>, sub: 'opportunity \u00b7 build it' },
            { label: 'Validation score',  val: <span className="font-display text-5xl">82<span className="text-2xl" style={{ color: 'hsl(var(--amie-ink-muted))' }}>/100</span></span>, sub: 'demand \u00b7 intent \u00b7 gap composite' },
            { label: 'Time to decision',  val: <span className="font-display text-5xl">3<span className="text-2xl" style={{ color: 'hsl(var(--amie-ink-muted))' }}>m 12s</span></span>, sub: 'vs. ~\u202f3 weeks manual' },
          ].map((item, i) => (
            <div key={item.label} className={`p-6 md:p-10 ${i < 2 ? 'md:hairline-r' : ''}`}>
              <div className="eyebrow mb-3">{item.label}</div>
              {item.val}
              <div className="font-mono text-xs mt-2" style={{ color: 'hsl(var(--amie-ink-muted))' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Demand + Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 md:p-10 lg:hairline-r hairline-b lg:border-b-0">
            <div className="eyebrow mb-4">Demand insights</div>
            <ul className="space-y-3 text-sm">
              {[
                ['Search volume',    '+42% YoY for \u2018no-show\u2019 tooling'],
                ['Forum mentions',   '3,200+ unique pain posts / 90d'],
                ['Adjacent traction','Calendly clones in dental: 4 funded'],
                ['Review mining',    '8 of top 10 PMS scored < 3.0\u2605'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-start gap-3 hairline-b pb-3 last:border-0">
                  <span className="font-mono text-[11px] w-32 shrink-0 uppercase tracking-wider" style={{ color: 'hsl(var(--amie-ink-muted))' }}>{k}</span>
                  <span style={{ color: 'hsl(var(--amie-ink-soft))' }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 md:p-10 hairline-b" style={{ borderBottom: 0 }}>
            <div className="eyebrow mb-4">Risk vectors</div>
            <ul className="space-y-3 text-sm">
              {[
                ['\u2715', 'Long enterprise sales cycle if targeting DSOs'],
                ['\u2715', 'Integration debt \u2014 14+ legacy PMS systems'],
                ['\u25b2', 'Compliance: PHI handling adds 3\u20136mo runway'],
                ['\u25b2', 'CAC sensitivity in solo segment'],
              ].map(([icon, v], i) => (
                <li key={i} className="flex items-start gap-3 hairline-b pb-3 last:border-0">
                  <span className="font-mono w-6 shrink-0" style={{ color: 'hsl(var(--amie-destructive))' }}>{icon}</span>
                  <span style={{ color: 'hsl(var(--amie-ink-soft))' }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategic direction */}
        <div className="px-6 md:px-10 py-8 hairline-t" style={{ background: 'hsl(var(--amie-bg))' }}>
          <div className="eyebrow mb-3">Strategic direction</div>
          <p className="font-display text-2xl md:text-3xl leading-snug max-w-4xl">
            Lead with no-show recovery for 1\u20133 chair practices in US/CA.
            Bypass PMS integration in v1 with calendar overlay + SMS layer.
            Price <em className="italic">\u202f$79/mo</em>, sell direct via dental subreddit and state-level associations.
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
"""

# ── Differentiation ──────────────────────────────────────────────────────────
files['Differentiation.jsx'] = """import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const ROWS = [
  ['Source of truth',   'AI opinions / vibes',                 'Real-world demand signals'],
  ['Bias control',      'Confirmation bias built-in',          'Truth layer rejects weak ideas'],
  ['Customer focus',    'What competitors built',              'Who actually pays'],
  ['Output',            'Long, hedged narrative',              'Verdict + ranked actions'],
  ['Time to decision',  'Days to weeks',                       'Minutes'],
];

export function Differentiation() {
  return (
    <Section
      index="007"
      eyebrow="Why MarketIQ.ai"
      title={<>Built to <em className="font-display italic">disagree</em> with you.</>}
      lede="Most tools tell you what you want to hear. MarketIQ.ai has a built-in truth layer designed to kill weak ideas before they cost you twelve months."
    >
      <div className="hairline-t hairline-b hairline-l hairline-r" style={{ background: 'hsl(var(--amie-bg))' }}>
        <div className="grid grid-cols-12 px-6 md:px-10 h-12 items-center hairline-b">
          <div className="col-span-4 eyebrow">Dimension</div>
          <div className="col-span-4 eyebrow">Typical tools</div>
          <div className="col-span-4 eyebrow flex items-center gap-2" style={{ color: 'hsl(var(--amie-signal))' }}>
            <span className="signal-dot" /> MarketIQ.ai
          </div>
        </div>
        {ROWS.map(([k, a, b], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="grid grid-cols-12 px-6 md:px-10 py-6 hairline-b last:border-0 items-baseline"
          >
            <div className="col-span-12 md:col-span-4 font-display text-2xl mb-2 md:mb-0">{k}</div>
            <div className="col-span-6 md:col-span-4 text-sm line-through" style={{ color: 'hsl(var(--amie-ink-muted))', textDecorationColor: 'hsl(var(--amie-destructive) / 0.5)' }}>{a}</div>
            <div className="col-span-6 md:col-span-4 text-sm font-medium">{b}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
"""

# ── Audience ─────────────────────────────────────────────────────────────────
files['Audience.jsx'] = """import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const USERS = [
  { t: 'Indie hackers',       d: 'Validating side projects without burning weekends on dead ends.' },
  { t: 'Solo founders',       d: 'Choosing the right wedge before quitting the day job.' },
  { t: 'Early-stage teams',   d: 'Pressure-testing the next bet before a board meeting.' },
  { t: 'Product managers',    d: 'Killing or greenlighting features with evidence, not opinions.' },
];

export function Audience() {
  return (
    <Section
      id="audience"
      index="008"
      eyebrow="Built for"
      title={<>A startup validation tool for builders who\u2019d rather <em className="font-display italic">know</em> than guess.</>}
      lede="From indie hackers running pre-launch validation to product managers pressure-testing roadmap bets, MarketIQ.ai replaces guesswork with decision-grade market research."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px hairline-t hairline-l hairline-r" style={{ background: 'hsl(var(--amie-border))' }}>
        {USERS.map((u, i) => (
          <motion.div
            key={u.t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="p-8 min-h-[220px] flex flex-col justify-between"
            style={{ background: 'hsl(var(--amie-bg))' }}
          >
            <span className="eyebrow">U.{(i+1).toString().padStart(2,'0')}</span>
            <div>
              <h3 className="font-display text-3xl mb-2">{u.t}</h3>
              <p className="text-sm" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{u.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
"""

# ── FAQ ──────────────────────────────────────────────────────────────────────
files['FAQ.jsx'] = """import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from './Section.jsx';

const FAQS = [
  { q: 'How do I validate a startup idea before building an MVP?', a: 'Validate by measuring real demand instead of asking opinions. MarketIQ.ai scans search intent, social signals, competitor pricing pages, and review data to quantify whether a market exists, who actually pays, and what gaps remain \u2014 so you can decide before you write a line of code.' },
  { q: 'What makes MarketIQ.ai different from generic AI tools for market research?', a: 'Most AI tools generate confident opinions from training data. MarketIQ.ai is a decision engine grounded in real-world signals. It runs adaptive questioning, multi-source scans, and a built-in truth layer that rejects weak ideas instead of flattering them.' },
  { q: 'How does MarketIQ.ai find target customers for my startup?', a: 'The customer prioritization engine clusters pain points by urgency, frequency, existing spending behavior, and ease of reach. It returns a ranked list of ICPs \u2014 primary buyer, expansion segments, and segments to avoid \u2014 so you know exactly who to target first.' },
  { q: 'Can I use MarketIQ.ai for SaaS idea validation specifically?', a: 'Yes. MarketIQ.ai is built for SaaS and product idea validation. It maps the competitive landscape, surfaces pricing benchmarks, identifies underserved niches, and produces a quantified validation score for your concept.' },
  { q: 'How long does a full market validation report take?', a: 'Minutes, not weeks. A typical report \u2014 demand insights, competitor map, ranked customer segments, risk vectors, and strategic recommendations \u2014 is delivered in a single autonomous run.' },
  { q: 'What does the validation report include?', a: 'A market verdict (strong / risky / not viable), demand signals with sources, competitive landscape and gaps, prioritized customer segments, a risk assessment with critical failure factors, and strategic positioning guidance.' },
  { q: 'Who is MarketIQ.ai for?', a: 'Indie hackers, solo founders, early-stage startup teams, and product managers who need decision-grade evidence before committing engineering cycles to a new product or feature.' },
];

function AccordionItem({ q, a, open, onClick }) {
  return (
    <div className="hairline-b last:border-0">
      <button
        onClick={onClick}
        className="w-full text-left font-display text-xl md:text-2xl py-6 flex items-start justify-between gap-4 transition-opacity hover:opacity-70"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="font-mono text-lg mt-1 shrink-0 transition-transform" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 max-w-3xl text-base leading-relaxed" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <Section
      id="faq"
      index="009"
      eyebrow="FAQ"
      title={<>Questions founders ask before <em className="font-display italic">validating</em> an idea.</>}
      lede="Straight answers on startup idea validation, customer discovery, and how an autonomous market research engine actually works."
    >
      <div className="hairline-t hairline-b hairline-l hairline-r px-6 md:px-10" style={{ background: 'hsl(var(--amie-bg))' }}>
        {FAQS.map((f, i) => (
          <AccordionItem
            key={i}
            q={f.q}
            a={f.a}
            open={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </Section>
  );
}
"""

# ── Waitlist ─────────────────────────────────────────────────────────────────
files['Waitlist.jsx'] = """import { motion } from 'framer-motion';
import { useState } from 'react';

export function Waitlist() {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState('');

  function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!name.trim())           { setErr('Name is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Enter a valid email.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 700);
  }

  return (
    <section
      id="waitlist"
      className="relative py-28 md:py-40 hairline-t overflow-hidden"
      style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
    >
      {/* Faint column grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage: 'linear-gradient(to right, hsl(var(--amie-bg)) 1px, transparent 1px)',
          backgroundSize: 'calc(100%/12) 100%',
        }}
      />
      <div className="container-edge relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'hsl(var(--amie-bg) / 0.6)' }}>
              <span className="signal-dot" />
              010 \u00b7 Final call
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display leading-[1] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
            >
              From idea to <em className="italic" style={{ color: 'hsl(var(--amie-signal))' }}>decision</em> \u2014 in minutes.
            </motion.h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: 'hsl(var(--amie-bg) / 0.7)' }}>
              Join the waitlist. Get early access to the autonomous market intelligence engine.
              Validate your next idea before you write a single line of code.
            </p>
          </div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="p-8 md:p-10" style={{ background: 'hsl(var(--amie-bg))', color: 'hsl(var(--amie-fg))' }}>
              <div className="flex items-center justify-between mb-8">
                <span className="eyebrow">Request access</span>
                <span className="eyebrow" style={{ color: 'hsl(var(--amie-fg) / 0.4)' }}>Q.027 spots</span>
              </div>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'hsl(var(--amie-verdict-strong))' }}>\u25b2 confirmed</div>
                  <div className="font-display text-3xl mb-2">You're on the list.</div>
                  <p className="text-sm" style={{ color: 'hsl(var(--amie-ink-soft))' }}>
                    We\u2019ll be in touch at <span className="font-mono">{email}</span>.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  {[
                    { label: 'Name',  value: name,  set: setName,  type: 'text',  ph: 'Ada Lovelace',        max: 80  },
                    { label: 'Email', value: email, set: setEmail, type: 'email', ph: 'ada@yourstartup.com', max: 180 },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block eyebrow mb-2">{f.label}</label>
                      <input
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        type={f.type}
                        maxLength={f.max}
                        placeholder={f.ph}
                        className="w-full bg-transparent py-3 text-lg focus:outline-none hairline-b"
                        style={{ borderColor: 'hsl(var(--amie-border))', caretColor: 'hsl(var(--amie-signal))' }}
                        onFocus={e => (e.target.style.borderColor = 'hsl(var(--amie-fg))')}
                        onBlur={e => (e.target.style.borderColor = 'hsl(var(--amie-border))')}
                      />
                    </div>
                  ))}
                  {err && <p className="font-mono text-xs" style={{ color: 'hsl(var(--amie-destructive))' }}>{err}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full h-12 font-mono text-[12px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80 disabled:opacity-50 inline-flex items-center justify-center gap-3"
                    style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
                  >
                    {loading ? 'Submitting\u2026' : 'Reserve access'}
                    {!loading && <span className="transition-transform group-hover:translate-x-1">\u2192</span>}
                  </button>
                  <p className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'hsl(var(--amie-ink-muted))' }}>
                    No spam. One email when access opens.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
"""

# ── Footer ───────────────────────────────────────────────────────────────────
files['Footer.jsx'] = """export function Footer() {
  return (
    <footer className="hairline-t py-10">
      <div className="container-edge flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="signal-dot" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">MarketIQ.ai \u00b7 Autonomous Market Intelligence Engine</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'hsl(var(--amie-ink-muted))' }}>
          \u00a9 {new Date().getFullYear()} \u00b7 Data-backed answers, not opinions.
        </div>
      </div>
    </footer>
  );
}
"""

# ── Write all files ──────────────────────────────────────────────────────────
for name, content in files.items():
    path = os.path.join(AMIE, name)
    with open(path, 'w') as f:
        f.write(content)
    print(f'Written: src/components/amie/{name}')

print('Done.')
