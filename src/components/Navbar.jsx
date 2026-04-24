import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 hairline-b"
      style={{ background: 'hsl(var(--amie-bg) / 0.88)', backdropFilter: 'blur(12px)' }}
    >
      <div className="container-edge flex h-14 items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="signal-dot" />
          <span className="font-mono text-[13px] tracking-[0.18em] uppercase">MarketIQ.ai</span>
          <span
            className="hidden md:inline font-mono text-[11px] tracking-[0.18em] uppercase"
            style={{ color: 'hsl(var(--amie-ink-muted))' }}
          >/ market intel engine</span>
        </Link>

        {/* Landing nav links */}
        {isLanding && (
          <nav
            className="hidden md:flex items-center gap-8 text-[13px]"
            style={{ color: 'hsl(var(--amie-ink-soft))' }}
          >
            {[['#how', 'How it works'], ['#engine', 'Engine'], ['#report', 'Report'], ['#audience', 'For']].map(([h, l]) => (
              <a key={h} href={h} className="transition-opacity hover:opacity-60">{l}</a>
            ))}
          </nav>
        )}

        {/* App breadcrumb */}
        {!isLanding && (
          <div className="hidden md:flex items-center gap-2 eyebrow">
            {location.pathname.startsWith('/submit') && <span>Submit idea</span>}
            {location.pathname.startsWith('/status') && <span>Analysis running</span>}
            {location.pathname.startsWith('/report') && <span>Validation report</span>}
          </div>
        )}

        {/* CTA */}
        <Link
          to="/submit"
          className="group inline-flex items-center gap-2 px-4 h-9 font-mono text-[12px] uppercase tracking-[0.16em] transition-opacity hover:opacity-80"
          style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
        >
          Validate idea
          <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </header>
  );
}
