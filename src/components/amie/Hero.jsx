import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PHRASES = [
  'AI scheduling tool for solo dentists',
  'Spreadsheet replacement for film producers',
  'Inventory OS for indie cosmetic brands',
  'Compliance copilot for fintech founders',
];

const METRICS = [
  { l: 'Demand index',    v: 87, tone: 'strong' },
  { l: 'Intent signal',   v: 72, tone: 'strong' },
  { l: 'Competition gap', v: 64, tone: 'risky'  },
  { l: 'Pay willingness', v: 81, tone: 'strong' },
];

export function Hero() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PHRASES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-rule pointer-events-none" style={{ opacity: 0.35 }} />
      <div className="container-edge relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 eyebrow">
            <span className="signal-dot" />
            <span>System: Online</span>
            <span style={{ color: 'hsl(var(--amie-fg) / 0.3)' }}>·</span>
            <span>v0.9 · Private Beta</span>
          </div>
          <div className="hidden md:block eyebrow">001 / Hero</div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">
          {/* Headline */}
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display leading-[1.02] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(36px, 7vw, 88px)' }}
            >
              Stop building blind.{' '}
              <span className="italic" style={{ color: 'hsl(var(--amie-ink-soft))' }}>Validate</span>{' '}
              before you ship.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed"
              style={{ color: 'hsl(var(--amie-ink-soft))' }}
            >
              An autonomous market intelligence engine that turns a raw startup idea into an
              evidence-backed verdict — demand signals, competitive gaps, prioritized customer
              segments, and a clear go / no-go.
            </motion.p>

            {/* Live input mock */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-12 hairline-t hairline-b hairline-l hairline-r"
              style={{ background: 'hsl(var(--amie-surface))' }}
            >
              <div className="flex items-center justify-between px-4 h-9 hairline-b" style={{ background: 'hsl(var(--amie-bg) / 0.4)' }}>
                <div className="flex items-center gap-3 eyebrow">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(var(--amie-verdict-strong) / 0.8)' }} />
                  marketiq.ai — input
                </div>
                <span className="eyebrow" style={{ color: 'hsl(var(--amie-fg) / 0.4)' }}>↵ to validate</span>
              </div>
              <div className="px-5 py-6 font-mono text-[15px] md:text-base">
                <span style={{ color: 'hsl(var(--amie-ink-muted))' }}>› idea: </span>
                <span key={idx} className="amie-cursor-blink animate-fade-up">{PHRASES[idx]}</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <button
                onClick={() => navigate('/submit')}
                className="group inline-flex items-center gap-3 px-6 h-12 font-mono text-[12px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
                style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
              >
                Validate your idea
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <a
                href="#how"
                className="group inline-flex items-center gap-2 px-2 h-12 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors"
                style={{ color: 'hsl(var(--amie-ink-soft))' }}
              >
                <span className="w-6 h-px transition-all group-hover:w-10" style={{ background: 'hsl(var(--amie-fg))' }} />
                See how it works
              </a>
            </motion.div>
          </div>

          {/* Verdict card */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-4 lg:pl-8 lg:border-l"
            style={{ borderColor: 'hsl(var(--amie-border))' }}
          >
            <div className="hairline-t hairline-b hairline-l hairline-r" style={{ background: 'hsl(var(--amie-bg))' }}>
              <div className="flex items-center justify-between px-4 h-9 hairline-b">
                <span className="eyebrow">Report · Specimen</span>
                <span className="eyebrow" style={{ color: 'hsl(var(--amie-fg) / 0.4)' }}>#0427</span>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <div className="eyebrow mb-2">Market verdict</div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl">Strong</span>
                    <span className="font-mono text-xs" style={{ color: 'hsl(var(--amie-verdict-strong))' }}>▲ opportunity</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {METRICS.map(m => (
                    <div key={m.l}>
                      <div className="flex justify-between text-xs font-mono mb-1" style={{ color: 'hsl(var(--amie-ink-soft))' }}>
                        <span>{m.l}</span>
                        <span>{m.v}</span>
                      </div>
                      <div className="h-[3px]" style={{ background: 'hsl(var(--amie-surface-2))' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.v}%` }}
                          transition={{ duration: 1.2, delay: 0.8 }}
                          className="h-full"
                          style={{ background: `hsl(var(--amie-verdict-${m.tone}))` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 hairline-t">
                  <div className="eyebrow mb-2">Primary ICP</div>
                  <div className="text-sm">
                    Solo founders shipping their <em className="font-display not-italic italic">first</em> SaaS,
                    annual rev &lt; $50K.
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
