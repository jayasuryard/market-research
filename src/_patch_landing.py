"""Patch index.css and write Landing.jsx for AMIE redesign."""
import re

BASE = '/Users/jayasurya/Desktop/R-D/Mark/market-research/src'

# ── 1. Patch index.css ──────────────────────────────────────────────────────
with open(f'{BASE}/index.css', 'r') as f:
    css = f.read()

# Replace Google Fonts import to add Instrument Serif + Inter Tight
old_import = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');"
new_import = "@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');"
css = css.replace(old_import, new_import)

# Inject --font-display into @theme block (before closing })
css = css.replace(
    "  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;",
    "  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;\n  --font-display: 'Instrument Serif', Georgia, serif;"
)

# Append AMIE additions at the end
AMIE_CSS = r"""
/* ── AMIE Paper Theme ──────────────────────────────────────────────── */
:root {
  /* Paper background & ink */
  --amie-bg:           40 20% 97%;
  --amie-fg:           220 15% 9%;
  --amie-signal:       72 95% 55%;
  /* Surfaces */
  --amie-surface:      38 18% 94%;
  --amie-surface-2:    36 14% 90%;
  --amie-border:       220 10% 86%;
  /* Ink tones */
  --amie-ink-soft:     220 10% 30%;
  --amie-ink-muted:    220 8% 45%;
  /* Verdict colours */
  --amie-verdict-strong: 142 60% 38%;
  --amie-verdict-risky:  38 92% 50%;
  --amie-verdict-dead:   8 70% 50%;
  --amie-destructive:    8 70% 50%;
}

/* ── AMIE Utilities ────────────────────────────────────────────────── */
.container-edge {
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1.25rem, 4vw, 4rem);
  padding-right: clamp(1.25rem, 4vw, 4rem);
}

/* Hairline borders (1px solid border token) */
.hairline-t { border-top:    1px solid hsl(var(--amie-border)); }
.hairline-b { border-bottom: 1px solid hsl(var(--amie-border)); }
.hairline-l { border-left:   1px solid hsl(var(--amie-border)); }
.hairline-r { border-right:  1px solid hsl(var(--amie-border)); }
.md\:hairline-r { border-right: 1px solid hsl(var(--amie-border)); }
.lg\:hairline-r { border-right: 1px solid hsl(var(--amie-border)); }

/* Eyebrow label */
.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: hsl(var(--amie-ink-muted));
}

/* Signal dot */
.signal-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: hsl(var(--amie-signal));
  flex-shrink: 0;
}

/* Ticker / mono-small */
.ticker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

/* Ink helpers */
.ink-soft { color: hsl(var(--amie-ink-soft)); }

/* Grid rule overlay */
.grid-rule {
  background-image:
    linear-gradient(to right, hsl(var(--amie-fg) / 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--amie-fg) / 0.04) 1px, transparent 1px);
  background-size: calc(100% / 12) 80px;
}

/* Paper page wrapper */
.paper {
  background-color: hsl(var(--amie-bg));
  color: hsl(var(--amie-fg));
  font-family: 'Inter Tight', 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* AMIE marquee */
@keyframes amie-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.amie-marquee {
  animation: amie-marquee 28s linear infinite;
}

/* AMIE cursor blink (separate from dark cursor-blink) */
@keyframes amie-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.amie-cursor-blink::after {
  content: '|';
  margin-left: 2px;
  animation: amie-blink 1s step-end infinite;
}

/* Animate-fade-up (needed in Hero) */
@keyframes amie-fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: amie-fade-up 0.45s ease forwards;
}
"""

css = css + AMIE_CSS

with open(f'{BASE}/index.css', 'w') as f:
    f.write(css)
print('index.css patched')

# ── 2. Rewrite Landing.jsx ─────────────────────────────────────────────────
LANDING = """import { useEffect } from 'react';
import { Nav }             from '../components/amie/Nav.jsx';
import { Hero }            from '../components/amie/Hero.jsx';
import { MarqueeBar }      from '../components/amie/MarqueeBar.jsx';
import { Problem }         from '../components/amie/Problem.jsx';
import { HowItWorks }      from '../components/amie/HowItWorks.jsx';
import { Validation }      from '../components/amie/Validation.jsx';
import { Engine }          from '../components/amie/Engine.jsx';
import { Report }          from '../components/amie/Report.jsx';
import { Differentiation } from '../components/amie/Differentiation.jsx';
import { Audience }        from '../components/amie/Audience.jsx';
import { FAQ }             from '../components/amie/FAQ.jsx';
import { Waitlist }        from '../components/amie/Waitlist.jsx';
import { Footer }          from '../components/amie/Footer.jsx';

export default function Landing() {
  useEffect(() => {
    document.title = 'MarketIQ.ai \u2014 Autonomous Market Intelligence Engine';
  }, []);

  return (
    <div className="paper">
      <Nav />
      <main>
        <Hero />
        <MarqueeBar />
        <Problem />
        <HowItWorks />
        <Validation />
        <Engine />
        <Report />
        <Differentiation />
        <Audience />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
"""

with open(f'{BASE}/pages/Landing.jsx', 'w') as f:
    f.write(LANDING)
print('Landing.jsx written')

print('All done.')
