import { motion } from 'framer-motion';
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
            <span className="eyebrow">Report #0427 · Generated 00:01:47</span>
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
            { label: 'Market verdict',    val: <span className="font-display text-5xl" style={{ color: 'hsl(var(--amie-verdict-strong))' }}>Strong</span>, sub: 'opportunity · build it' },
            { label: 'Validation score',  val: <span className="font-display text-5xl">82<span className="text-2xl" style={{ color: 'hsl(var(--amie-ink-muted))' }}>/100</span></span>, sub: 'demand · intent · gap composite' },
            { label: 'Time to decision',  val: <span className="font-display text-5xl">3<span className="text-2xl" style={{ color: 'hsl(var(--amie-ink-muted))' }}>m 12s</span></span>, sub: 'vs. ~ 3 weeks manual' },
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
                ['Search volume',    '+42% YoY for ‘no-show’ tooling'],
                ['Forum mentions',   '3,200+ unique pain posts / 90d'],
                ['Adjacent traction','Calendly clones in dental: 4 funded'],
                ['Review mining',    '8 of top 10 PMS scored < 3.0★'],
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
                ['✕', 'Long enterprise sales cycle if targeting DSOs'],
                ['✕', 'Integration debt — 14+ legacy PMS systems'],
                ['▲', 'Compliance: PHI handling adds 3–6mo runway'],
                ['▲', 'CAC sensitivity in solo segment'],
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
            Lead with no-show recovery for 1–3 chair practices in US/CA.
            Bypass PMS integration in v1 with calendar overlay + SMS layer.
            Price <em className="italic"> $79/mo</em>, sell direct via dental subreddit and state-level associations.
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
