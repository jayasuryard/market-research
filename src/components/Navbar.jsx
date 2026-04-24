import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav
      style={{ borderBottom: '1px solid var(--color-border)' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div style={{ background: 'rgba(8,8,10,0.85)' }} className="absolute inset-0" />
      <div className="relative max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="font-mono text-sm font-medium tracking-wider"
            style={{ color: 'var(--color-accent)' }}
          >
            MARKETIQ.AI
          </span>
          <span
            className="font-mono text-xs px-1.5 py-0.5 rounded"
            style={{
              background: 'var(--color-accent-dim)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-accent-muted)',
            }}
          >
            BETA
          </span>
        </Link>

        {/* Desktop Nav */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-8">
            {['#how', '#engine', '#report', '#audience'].map((href, i) => (
              <a
                key={href}
                href={href}
                className="font-mono text-xs tracking-widest transition-colors"
                style={{ color: 'var(--color-text-2)' }}
                onMouseEnter={e => (e.target.style.color = 'var(--color-text)')}
                onMouseLeave={e => (e.target.style.color = 'var(--color-text-2)')}
              >
                {['HOW', 'ENGINE', 'REPORT', 'WHO'][i]}
              </a>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          to="/submit"
          className="font-mono text-xs font-medium px-4 py-2 rounded transition-all"
          style={{
            background: 'var(--color-accent)',
            color: '#000',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          VALIDATE IDEA →
        </Link>
      </div>
    </nav>
  );
}
