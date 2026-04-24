import { motion } from 'framer-motion';
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
      title={<>A startup validation tool for builders who’d rather <em className="font-display italic">know</em> than guess.</>}
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
