import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const FAILURES = [
  { n: '01', t: 'Friends-and-family bias', d: "Polite feedback masquerading as validation. Nobody who loves you will tell you it won't sell." },
  { n: '02', t: 'AI opinion machines', d: 'Generic LLM output that hallucinates demand. Confident text, zero evidence, no buyers.' },
  { n: '03', t: 'Weeks of manual research', d: '30 tabs, 5 spreadsheets, no synthesis. By the time you decide, the window is closed.' },
  { n: '04', t: 'What exists ≠ who pays', d: 'Most research maps competitors. None of it tells you which segment will actually open a wallet.' },
];

export function Problem() {
  return (
    <Section
      id="problem"
      index="002"
      eyebrow="The problem"
      title={<>Why startup idea validation usually fails — and founders confuse <em className="font-display italic" style={{ color: 'hsl(var(--amie-ink-soft))' }}>feedback</em> with <em className="font-display italic">evidence</em>.</>}
      lede="Today’s validation methods — friend surveys, generic AI prompts, weeks of manual research — are slow, biased, or hallucinated. You ship a SaaS nobody wanted and call it a learning."
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
              <span className="font-mono text-xs" style={{ color: 'hsl(var(--amie-destructive))' }}>✕ failure mode</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-3">{f.t}</h3>
            <p className="leading-relaxed" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{f.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
