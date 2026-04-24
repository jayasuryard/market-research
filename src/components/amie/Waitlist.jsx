import { motion } from 'framer-motion';
import { useState } from 'react';

export function Waitlist() {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState('');

  function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!name.trim())           { setErr('Name is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Enter a valid email.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 700);
  }

  return (
    <section
      id="waitlist"
      className="relative py-28 md:py-40 hairline-t overflow-hidden"
      style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
    >
      {/* Faint column grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage: 'linear-gradient(to right, hsl(var(--amie-bg)) 1px, transparent 1px)',
          backgroundSize: 'calc(100%/12) 100%',
        }}
      />
      <div className="container-edge relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'hsl(var(--amie-bg) / 0.6)' }}>
              <span className="signal-dot" />
              010 · Final call
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display leading-[1] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
            >
              From idea to <em className="italic" style={{ color: 'hsl(var(--amie-signal))' }}>decision</em> — in minutes.
            </motion.h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: 'hsl(var(--amie-bg) / 0.7)' }}>
              Join the waitlist. Get early access to the autonomous market intelligence engine.
              Validate your next idea before you write a single line of code.
            </p>
          </div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="p-8 md:p-10" style={{ background: 'hsl(var(--amie-bg))', color: 'hsl(var(--amie-fg))' }}>
              <div className="flex items-center justify-between mb-8">
                <span className="eyebrow">Request access</span>
                <span className="eyebrow" style={{ color: 'hsl(var(--amie-fg) / 0.4)' }}>Q.027 spots</span>
              </div>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'hsl(var(--amie-verdict-strong))' }}>▲ confirmed</div>
                  <div className="font-display text-3xl mb-2">You're on the list.</div>
                  <p className="text-sm" style={{ color: 'hsl(var(--amie-ink-soft))' }}>
                    We’ll be in touch at <span className="font-mono">{email}</span>.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  {[
                    { label: 'Name',  value: name,  set: setName,  type: 'text',  ph: 'Ada Lovelace',        max: 80  },
                    { label: 'Email', value: email, set: setEmail, type: 'email', ph: 'ada@yourstartup.com', max: 180 },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block eyebrow mb-2">{f.label}</label>
                      <input
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        type={f.type}
                        maxLength={f.max}
                        placeholder={f.ph}
                        className="w-full bg-transparent py-3 text-lg focus:outline-none hairline-b"
                        style={{ borderColor: 'hsl(var(--amie-border))', caretColor: 'hsl(var(--amie-signal))' }}
                        onFocus={e => (e.target.style.borderColor = 'hsl(var(--amie-fg))')}
                        onBlur={e => (e.target.style.borderColor = 'hsl(var(--amie-border))')}
                      />
                    </div>
                  ))}
                  {err && <p className="font-mono text-xs" style={{ color: 'hsl(var(--amie-destructive))' }}>{err}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full h-12 font-mono text-[12px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80 disabled:opacity-50 inline-flex items-center justify-center gap-3"
                    style={{ background: 'hsl(var(--amie-fg))', color: 'hsl(var(--amie-bg))' }}
                  >
                    {loading ? 'Submitting…' : 'Reserve access'}
                    {!loading && <span className="transition-transform group-hover:translate-x-1">→</span>}
                  </button>
                  <p className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'hsl(var(--amie-ink-muted))' }}>
                    No spam. One email when access opens.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
