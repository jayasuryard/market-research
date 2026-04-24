import { motion } from 'framer-motion';
import { Section } from './Section.jsx';

const SEGMENTS = [
  { rank: '01', name: 'Solo practice owners (1–3 chairs)', urgency: 92, pay: 88, reach: 74, tag: 'PRIMARY ICP', tone: 'strong' },
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
      title={<>Don’t just ask <em className="font-display italic">if</em> people want it. Find out exactly <em className="font-display italic">who</em> will pay.</>}
      lede="The customer prioritization layer ranks segments by four factors and tells you who to target first — and who to avoid."
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
            <span className="eyebrow">Ranked customer segments · live preview</span>
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
