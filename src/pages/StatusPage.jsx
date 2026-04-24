import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { validationApi } from '../../api.js';

const STEPS = [
  { id: 1, label: 'Structuring idea', sub: 'Decomposing into ICP, use cases, problem statements' },
  { id: 2, label: 'Extracting demand signals', sub: 'Scanning forums, reviews, search intent, content demand' },
  { id: 3, label: 'Mapping competition', sub: 'Identifying players, weaknesses, and feature gaps' },
  { id: 4, label: 'Calculating scores', sub: 'Demand × Buying intent ÷ Saturation index' },
  { id: 5, label: 'Generating report', sub: 'Compiling verdict, risks, and strategic direction' },
];

export default function StatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [currentStep, setCurrentStep] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [dots, setDots] = useState('');
  const [error, setError] = useState('');

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate step progression
  useEffect(() => {
    const stepIntervals = [0, 8, 18, 28, 38]; // seconds to advance each step
    const timers = stepIntervals.map((delay, i) =>
      setTimeout(() => setCurrentStep(i + 1), delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Poll for completion
  useEffect(() => {
    let stopped = false;

    async function poll() {
      while (!stopped) {
        await new Promise(r => setTimeout(r, 4000));
        if (stopped) break;
        try {
          const result = await validationApi.getStatus(id);
          const s = result.data.status;
          setStatus(s);
          if (s === 'completed') {
            setTimeout(() => navigate(`/report/${id}`), 1200);
            return;
          }
          if (s === 'failed') {
            setError('Analysis failed. Please try submitting again.');
            return;
          }
        } catch {
          // silently retry
        }
      }
    }

    poll();
    return () => { stopped = true; };
  }, [id, navigate]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const stepProgress = Math.min(100, Math.round((currentStep / STEPS.length) * 100));

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>STEP 03 · ANALYSIS</div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Engine running{dots}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
            4 data surfaces. 1,000+ signals. One verdict. Do not close this tab.
          </p>
        </div>

        {/* Progress */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          {/* Time + Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
              ELAPSED: <span style={{ color: 'var(--color-text)' }}>{formatTime(elapsed)}</span>
            </span>
            <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>
              {stepProgress}% COMPLETE
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 rounded-full mb-6" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${stepProgress}%`, background: 'var(--color-accent)' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {STEPS.map(step => {
              const done = step.id < currentStep;
              const active = step.id === currentStep;
              const pending = step.id > currentStep;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs transition-all"
                    style={{
                      background: done ? 'var(--color-accent)' : active ? 'var(--color-accent-dim)' : 'var(--color-border)',
                      border: `1px solid ${done ? 'var(--color-accent)' : active ? 'var(--color-accent)' : 'transparent'}`,
                      color: done ? '#000' : active ? 'var(--color-accent)' : 'var(--color-text-3)',
                    }}
                  >
                    {done ? '✓' : active ? '◈' : step.id}
                  </div>

                  {/* Text */}
                  <div>
                    <div
                      className="text-sm font-medium mb-0.5"
                      style={{ color: done ? 'var(--color-text-2)' : active ? 'var(--color-text)' : 'var(--color-text-3)' }}
                    >
                      {step.label}
                      {active && (
                        <span className="font-mono text-xs ml-2" style={{ color: 'var(--color-accent)' }}>
                          RUNNING{dots}
                        </span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-3)' }}>{step.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signal ticker */}
        <div
          className="rounded-xl p-5 font-mono text-xs"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <div className="mb-3" style={{ color: 'var(--color-text-3)' }}>LIVE SCAN LOG</div>
          <div className="space-y-1.5">
            {[
              { t: '00:02', msg: '▸ Initializing signal extraction pipeline', col: 'accent' },
              { t: '00:08', msg: '▸ Scanning reddit · forums · review platforms', col: 'accent' },
              { t: '00:14', msg: '▸ 347 demand signals extracted', col: 'text' },
              { t: '00:21', msg: '▸ Pain clustering complete — 6 themes identified', col: 'text' },
              { t: '00:28', msg: '▸ Competitor map: 4 direct · 3 indirect', col: 'text' },
              { t: '00:35', msg: '▸ Calculating validation score...', col: 'warning' },
            ]
              .filter((_, i) => i < Math.ceil(elapsed / 8))
              .map((line, i) => (
                <div key={i}>
                  <span style={{ color: 'var(--color-text-3)' }}>[{line.t}] </span>
                  <span style={{ color: `var(--color-${line.col})` }}>{line.msg}</span>
                </div>
              ))}
            {elapsed > 0 && (
              <div>
                <span style={{ color: 'var(--color-text-3)' }}></span>
                <span style={{ color: 'var(--color-accent)' }}>
                  <span className="cursor-blink inline-block w-1 h-3 align-text-bottom" style={{ background: 'var(--color-accent)' }} />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div
            className="mt-6 rounded-xl p-5"
            style={{ background: 'rgba(229,56,59,0.08)', border: '1px solid rgba(229,56,59,0.2)' }}
          >
            <p className="font-mono text-sm mb-4" style={{ color: 'var(--color-error)' }}>✕ {error}</p>
            <button
              onClick={() => navigate('/submit')}
              className="font-mono text-xs px-4 py-2 rounded-lg"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', color: 'var(--color-text-2)' }}
            >
              ← TRY AGAIN
            </button>
          </div>
        )}

        {/* Success redirect message */}
        {status === 'completed' && (
          <div
            className="mt-6 rounded-xl p-5 text-center"
            style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-muted)' }}
          >
            <p className="font-mono text-sm" style={{ color: 'var(--color-accent)' }}>
              ✓ Analysis complete — loading your report...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
