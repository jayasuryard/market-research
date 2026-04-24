import { motion } from 'framer-motion';

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
          <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </motion.header>
  );
}
