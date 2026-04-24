export function Footer() {
  return (
    <footer className="hairline-t py-10">
      <div className="container-edge flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="signal-dot" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">MarketIQ.ai · Autonomous Market Intelligence Engine</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'hsl(var(--amie-ink-muted))' }}>
          © {new Date().getFullYear()} · Data-backed answers, not opinions.
        </div>
      </div>
    </footer>
  );
}
