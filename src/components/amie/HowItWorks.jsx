import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const STEPS = [
  {
    n: '01', t: 'Submit the idea',
    d: 'Drop a one-line concept with optional context — target users, assumptions, constraints.',
    code: '› submit "AI scheduling for solo dentists"\n  context: north america, b2b, $50-200/mo',
  },
  {
    n: '02', t: 'Adaptive refinement',
    d: 'The engine asks the right follow-ups, decomposing the idea into testable hypotheses.',
    code: '? geography focus  → US + CA\n? primary problem  → no-show rate\n? assumed buyer    → practice owner',
  },
  {
    n: '03', t: 'Multi-source scan',
    d: 'Search intent, social signals, competitor stack, pricing pages, review mining — in parallel.',
    code: '▸ scanning  4 surfaces · 1,247 signals\n▸ clustering pain points  ████████ 100%\n▸ mapping competitive landscape    OK',
  },
  {
    n: '04', t: 'Score, rank, decide',
    d: 'Quantitative validation score. Ranked ICPs. Risks called out. Strategy recommended.',
    code: 'verdict    : STRONG OPPORTUNITY\nicp.primary : solo practice, 1-3 chairs\nrisk.top    : long sales cycle (mitigated)',
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how"
      index="003"
      eyebrow="How it works"
      title={<>From a one-line idea to a decision-grade verdict — <em className="font-display italic">in minutes.</em></>}
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
