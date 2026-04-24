import { motion } from 'framer-motion';
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
