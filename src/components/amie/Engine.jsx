import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const CAPS = [
  { t: 'Idea decomposition',    d: 'Splits a one-liner into ICP, problems, and use-cases the engine can test independently.' },
  { t: 'Demand aggregation',    d: 'Pulls intent signals from search, social, forums, reviews, and adjacent product traction.' },
  { t: 'Pain clustering',       d: 'Groups raw user complaints into themes and scores intensity by frequency and language.' },
  { t: 'Segment ranking',       d: 'Detects all viable ICPs, ranks by urgency, accessibility, and willingness to pay.' },
  { t: 'Market classification', d: 'Tags the space as new, growing, saturated, or dead — with the data to back it.' },
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
      lede="Every report runs the same pipeline. No cherry-picking, no narrative fitting — just structured signal extraction."
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
