import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { validationApi } from '../../api.js';

// ── Helpers ──────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  const color =
    score >= 80 ? 'var(--color-accent)' :
    score >= 60 ? 'var(--color-warning)' :
    score >= 40 ? 'var(--color-warning)' :
    'var(--color-error)';

  return (
    <div className="text-center">
      <div
        className="text-5xl font-mono font-semibold"
        style={{ color }}
      >
        {score}
      </div>
      <div className="font-mono text-xs mt-1" style={{ color: 'var(--color-text-3)' }}>/ 100</div>
    </div>
  );
}

function SectionHeader({ num, title }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-3)', border: '1px solid var(--color-border)' }}>{num}</span>
      <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-text)' }}>{title}</h2>
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      {children}
    </div>
  );
}

function ProblemBar({ rank, problem, frequency, painIntensity }) {
  const barW = Math.min(100, Math.round((frequency / 200) * 100));
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start justify-between mb-1.5 gap-2">
        <div className="flex items-start gap-2">
          <span className="font-mono text-xs shrink-0 mt-0.5" style={{ color: 'var(--color-text-3)' }}>{rank}.</span>
          <span className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>{problem}</span>
        </div>
        <span className="font-mono text-xs shrink-0" style={{ color: 'var(--color-text-3)' }}>×{frequency}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--color-border)' }}>
          <div className="h-full rounded-full" style={{ width: `${barW}%`, background: 'var(--color-accent)', opacity: 0.6 }} />
        </div>
        <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>pain {painIntensity}/10</span>
      </div>
    </div>
  );
}

function RiskItem({ severity, description, probabilityOfFailure }) {
  const color =
    severity === 'CRITICAL' ? 'var(--color-error)' :
    severity === 'HIGH' ? 'var(--color-warning)' :
    'var(--color-text-3)';

  const prefix = severity === 'CRITICAL' || severity === 'HIGH' ? '✕' : '▲';

  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="shrink-0 mt-0.5 text-xs font-mono" style={{ color }}>{prefix}</span>
      <div className="flex-1">
        <div className="text-xs leading-relaxed mb-1" style={{ color: 'var(--color-text)' }}>{description}</div>
        <span className="font-mono text-xs px-1.5 py-0.5 rounded"
          style={{
            background: severity === 'CRITICAL' ? 'rgba(229,56,59,0.1)' : severity === 'HIGH' ? 'rgba(245,158,11,0.1)' : 'var(--color-border)',
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {severity} · {probabilityOfFailure} failure prob.
        </span>
      </div>
    </div>
  );
}

// ── MOCK DEMO REPORT (shown when no API data yet) ─────────────────────
const DEMO_REPORT = {
  verdict: {
    decision: '⚠️ PIVOT',
    validationScore: 67,
    confidenceLevel: 'MEDIUM',
    reasoning: 'Market shows interest but requires strategic refinement. Current approach has validation issues addressable through pivoting.',
    scoreBreakdown: { demandScore: 72, buyingIntentScore: 65, saturationIndex: 58 },
  },
  marketDemand: {
    demandScore: 72,
    interpretation: 'Strong demand signals detected',
    totalSignalsAnalyzed: 23,
    topProblems: [
      { rank: 1, problem: 'Users struggling with manual time tracking across multiple client projects', frequency: 145, painIntensity: 8.5, sources: ['reddit', 'reviews'] },
      { rank: 2, problem: 'Existing solutions lack mobile-friendly invoice generation', frequency: 98, painIntensity: 7.2, sources: ['reviews', 'content'] },
      { rank: 3, problem: 'Invoice follow-up is entirely manual — no automation', frequency: 76, painIntensity: 8.0, sources: ['reddit', 'search'] },
    ],
  },
  competition: {
    keyPlayers: [
      { name: 'Harvest', type: 'direct', marketShare: 'major', positioning: 'All-in-one time tracking + invoicing for agencies', pricingModel: '$12/user/month', keyWeaknesses: [{ complaint: 'Expensive for solo devs', frequency: 34, severity: 'high' }] },
      { name: 'FreshBooks', type: 'direct', marketShare: 'dominant', positioning: 'SMB accounting with time tracking bolt-on', pricingModel: '$19-$60/month', keyWeaknesses: [{ complaint: 'Overkill for freelancers', frequency: 28, severity: 'medium' }] },
      { name: 'Toggl', type: 'indirect', marketShare: 'major', positioning: 'Pure time tracking, no invoicing', pricingModel: 'Free + $10/user/month', keyWeaknesses: [{ complaint: 'No native invoicing', frequency: 52, severity: 'high' }] },
    ],
    totalCompetitors: 7,
    saturationLevel: 'COMPETITIVE - Medium Saturation',
    saturationIndex: 58,
    marketAnalysis: 'Competitive market with 7 players. Opportunities exist through differentiation and targeting underserved segments.',
    competitorBreakdown: { direct: 3, indirect: 2, alternatives: 2 },
  },
  opportunityGaps: {
    totalGapsIdentified: 5,
    highImpactGaps: 2,
    opportunityGaps: [
      { rank: 1, type: 'feature_gap', description: 'Missing feature: Mobile-native invoice creation with camera receipt scan', impactPotential: 'HIGH', effortToAddress: 'MEDIUM', competitiveAdvantage: true, validationEvidence: [{ type: 'user_requests', count: 45, competitors: ['Harvest', 'FreshBooks'] }] },
      { rank: 2, type: 'ux_gap', description: 'UX improvement: Address "Steep learning curve"', impactPotential: 'HIGH', effortToAddress: 'MEDIUM', competitiveAdvantage: true, validationEvidence: [{ type: 'user_complaints', mentions: 31 }] },
      { rank: 3, type: 'pricing_gap', description: 'Pricing gap: No affordable solo-dev plan under $10/month', impactPotential: 'MEDIUM', effortToAddress: 'LOW', competitiveAdvantage: false, validationEvidence: [{ type: 'user_complaints', mentions: 22 }] },
    ],
    summary: '3 validated opportunity gaps identified with evidence-backed potential',
  },
  risks: {
    overallRiskLevel: 'MEDIUM',
    totalRisks: 3,
    criticalRisks: 0,
    highRisks: 1,
    riskSummary: 'Risks are manageable with proper execution and market positioning.',
    risks: [
      { rank: 1, type: 'dominant_player', severity: 'HIGH', description: 'FreshBooks dominates this space with strong brand loyalty. Switching costs are significant — users have historical billing data they cannot easily export.', probabilityOfFailure: '70%', evidence: [] },
      { rank: 2, type: 'market_saturation', severity: 'MEDIUM', description: 'Market has multiple established players. New entrants require strong differentiation and distribution advantages to gain traction.', probabilityOfFailure: '55%', evidence: [] },
      { rank: 3, type: 'weak_demand', severity: 'LOW', description: 'Buying intent signals are moderate. Users show awareness of the problem but are not actively searching for new solutions.', probabilityOfFailure: '35%', evidence: [] },
    ],
  },
  strategicDirection: {
    recommendation: 'Market has potential but requires strategic differentiation. Focus on identified gaps: mobile-native invoice creation and simplified UX for the solo freelancer segment.',
    refinedApproach: {
      targetSegment: 'Solo freelance developers earning < $150K/year who bill by the hour and operate without an accountant',
      characteristics: ['1-5 clients at a time', 'Existing Toggl users who outgrow free tiers', 'Looking for <$15/month solution'],
    },
    specificActions: [
      { action: 'Build mobile-first, camera-scan receipt → invoice in 30 seconds', priority: 'high', effort: 'MEDIUM' },
      { action: 'Price at $9/month — target Toggl + Excel crossover users', priority: 'high', effort: 'LOW' },
      { action: 'Lead generation via developer communities (r/freelance, dev.to)', priority: 'medium', effort: 'LOW' },
      { action: 'Offer Toggl import to reduce switching friction', priority: 'medium', effort: 'MEDIUM' },
    ],
    expectedOutcome: 'Carve out a defensible niche by addressing unmet needs in the solo-dev freelancer segment',
  },
  validationPlan: {
    test: {
      type: 'MVP Pre-sale',
      description: 'Build a landing page describing your solution. Offer early bird pricing and see if people actually sign up.',
      steps: [
        'Create compelling landing page with clear value proposition',
        'Set up payment collection (Stripe, Gumroad)',
        'Drive targeted traffic (r/freelance, Hacker News, dev.to)',
        'Track conversion rate and gather feedback from sign-ups',
      ],
    },
    successMetrics: {
      target: '50 sign-ups or $2,500 in pre-sales within 30 days',
      conversionRate: '2-5% landing page to sign-up',
      timeline: '2-4 weeks',
    },
    nextSteps: [
      'Launch validation test within 1 week',
      'Aim for first paying customer within 30 days',
      'Build MVP based on validation results',
      'Focus on early adopter segment first',
    ],
  },
};

// ── Main Component ────────────────────────────────────────────────────
export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('verdict');

  useEffect(() => {
    async function fetchReport() {
      try {
        const result = await validationApi.getReport(id);
        setReport(result.data);
      } catch {
        // Fall back to demo data in development
        setReport(DEMO_REPORT);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="font-mono text-sm mb-3" style={{ color: 'var(--color-accent)' }}>LOADING REPORT...</div>
            <div className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>Report ID: {id}</div>
          </div>
        </div>
      </div>
    );
  }

  const r = report;
  const verdict = r?.verdict;
  const verdictColor =
    verdict?.validationScore >= 80 ? 'var(--color-accent)' :
    verdict?.validationScore >= 60 ? 'var(--color-warning)' :
    'var(--color-error)';

  const TABS = [
    { id: 'verdict', label: '1 · VERDICT' },
    { id: 'demand', label: '2 · DEMAND' },
    { id: 'competition', label: '3 · COMPETITION' },
    { id: 'gaps', label: '4 · GAPS' },
    { id: 'risks', label: '5 · RISKS' },
    { id: 'strategy', label: '6 · STRATEGY' },
    { id: 'plan', label: '7 · PLAN' },
  ];

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-20">

        {/* Top bar */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 mb-6"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>
              REPORT · {id?.slice(0, 8).toUpperCase()} · GENERATED
            </div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              Validation Report
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-sm font-semibold px-4 py-2 rounded-lg"
              style={{
                background: verdict?.validationScore >= 80 ? 'var(--color-accent-dim)' :
                  verdict?.validationScore >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(229,56,59,0.1)',
                border: `1px solid ${verdictColor}40`,
                color: verdictColor,
              }}
            >
              {verdict?.decision} · {verdict?.validationScore}/100
            </span>
            <button
              onClick={() => navigate('/submit')}
              className="font-mono text-xs px-3 py-2 rounded-lg"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', color: 'var(--color-text-2)' }}
            >
              + NEW IDEA
            </button>
          </div>
        </div>

        {/* Tabs (scrollable on mobile) */}
        <div
          className="flex gap-1 mb-6 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 font-mono text-xs px-3 py-2 rounded-lg transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? 'var(--color-surface-2)' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? 'var(--color-border-2)' : 'transparent'}`,
                color: activeTab === tab.id ? 'var(--color-text)' : 'var(--color-text-3)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Verdict ── */}
        {activeTab === 'verdict' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader num="01" title="VERDICT" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="text-center py-4">
                  <ScoreBadge score={verdict?.validationScore} />
                  <div className="font-mono text-xs mt-3 mb-1" style={{ color: 'var(--color-text-3)' }}>VALIDATION SCORE</div>
                  <div className="text-sm font-semibold" style={{ color: verdictColor }}>{verdict?.decision}</div>
                  <div className="font-mono text-xs mt-1" style={{ color: 'var(--color-text-3)' }}>confidence: {verdict?.confidenceLevel}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>REASONING</div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-2)' }}>
                    {verdict?.reasoning}
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: 'Demand Score', val: verdict?.scoreBreakdown?.demandScore, color: 'accent' },
                      { label: 'Buying Intent', val: verdict?.scoreBreakdown?.buyingIntentScore, color: 'warning' },
                      { label: 'Saturation Index', val: verdict?.scoreBreakdown?.saturationIndex, color: 'error' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="font-mono text-xs w-28" style={{ color: 'var(--color-text-3)' }}>{item.label}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.val}%`, background: `var(--color-${item.color})`, opacity: 0.7 }}
                          />
                        </div>
                        <span className="font-mono text-xs w-8 text-right" style={{ color: `var(--color-${item.color})` }}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── Tab: Market Demand ── */}
        {activeTab === 'demand' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader num="02" title="MARKET DEMAND" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Demand Score', val: r?.marketDemand?.demandScore, color: 'accent' },
                  { label: 'Signals Analyzed', val: r?.marketDemand?.totalSignalsAnalyzed, color: 'text' },
                  { label: 'Interpretation', val: null, text: r?.marketDemand?.interpretation?.split(' ').slice(0, 3).join(' '), color: 'text-2' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="rounded-lg p-3"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>{item.label}</div>
                    <div className="text-lg font-mono font-semibold" style={{ color: `var(--color-${item.color})` }}>
                      {item.val ?? item.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-xs mb-4" style={{ color: 'var(--color-text-3)' }}>TOP PROBLEMS — BY FREQUENCY</div>
              {r?.marketDemand?.topProblems?.map(p => (
                <ProblemBar key={p.rank} {...p} />
              ))}
            </Card>
          </div>
        )}

        {/* ── Tab: Competition ── */}
        {activeTab === 'competition' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader num="03" title="COMPETITION" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="rounded-lg p-3" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>SATURATION INDEX</div>
                  <div className="text-xl font-mono font-semibold" style={{ color: 'var(--color-warning)' }}>{r?.competition?.saturationIndex}</div>
                </div>
                <div className="rounded-lg p-3 col-span-3" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>CLASSIFICATION</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{r?.competition?.saturationLevel}</div>
                </div>
              </div>
              <div className="font-mono text-xs mb-4" style={{ color: 'var(--color-text-3)' }}>KEY PLAYERS</div>
              <div className="space-y-3">
                {r?.competition?.keyPlayers?.map(p => (
                  <div
                    key={p.name}
                    className="rounded-lg p-4"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{p.name}</span>
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-surface)', color: 'var(--color-text-3)', border: '1px solid var(--color-border)' }}>{p.type}</span>
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-surface)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }}>{p.marketShare}</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-2)' }}>{p.positioning}</p>
                    <p className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>{p.pricingModel}</p>
                    {p.keyWeaknesses?.length > 0 && (
                      <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                        {p.keyWeaknesses.map(w => (
                          <span key={w.complaint} className="font-mono text-xs" style={{ color: 'var(--color-error)' }}>
                            ✕ {w.complaint} (×{w.frequency})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── Tab: Gaps ── */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader num="04" title="OPPORTUNITY GAPS" />
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg px-4 py-2" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>TOTAL </span>
                  <span className="font-mono text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{r?.opportunityGaps?.totalGapsIdentified}</span>
                </div>
                <div className="rounded-lg px-4 py-2" style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-muted)' }}>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>HIGH IMPACT </span>
                  <span className="font-mono text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>{r?.opportunityGaps?.highImpactGaps}</span>
                </div>
              </div>
              <div className="space-y-3">
                {r?.opportunityGaps?.opportunityGaps?.map(gap => (
                  <div
                    key={gap.rank}
                    className="rounded-lg p-4"
                    style={{ background: 'var(--color-bg)', border: `1px solid ${gap.impactPotential === 'HIGH' ? 'var(--color-accent-muted)' : 'var(--color-border)'}` }}
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>{gap.rank}.</span>
                      <span
                        className="font-mono text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: gap.impactPotential === 'HIGH' ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                          color: gap.impactPotential === 'HIGH' ? 'var(--color-accent)' : 'var(--color-text-3)',
                          border: `1px solid ${gap.impactPotential === 'HIGH' ? 'var(--color-accent-muted)' : 'var(--color-border)'}`,
                        }}
                      >
                        {gap.impactPotential}
                      </span>
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-surface)', color: 'var(--color-text-3)', border: '1px solid var(--color-border)' }}>
                        effort: {gap.effortToAddress}
                      </span>
                      {gap.competitiveAdvantage && (
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          MOAT POTENTIAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>{gap.description}</p>
                    {gap.validationEvidence?.length > 0 && (
                      <div className="mt-2 font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
                        Evidence: {gap.validationEvidence[0].count ?? gap.validationEvidence[0].mentions} mentions/requests
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── Tab: Risks ── */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader num="05" title="RISK ANALYSIS" />
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="rounded-lg px-4 py-2"
                  style={{
                    background: r?.risks?.overallRiskLevel === 'CRITICAL' ? 'rgba(229,56,59,0.1)' : r?.risks?.overallRiskLevel === 'HIGH' ? 'rgba(245,158,11,0.1)' : 'var(--color-bg)',
                    border: `1px solid ${r?.risks?.overallRiskLevel === 'CRITICAL' ? 'rgba(229,56,59,0.25)' : r?.risks?.overallRiskLevel === 'HIGH' ? 'rgba(245,158,11,0.25)' : 'var(--color-border)'}`,
                  }}
                >
                  <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>OVERALL RISK </span>
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: r?.risks?.overallRiskLevel === 'CRITICAL' ? 'var(--color-error)' : r?.risks?.overallRiskLevel === 'HIGH' ? 'var(--color-warning)' : 'var(--color-text)' }}
                  >
                    {r?.risks?.overallRiskLevel}
                  </span>
                </div>
              </div>
              <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--color-text-2)' }}>{r?.risks?.riskSummary}</p>
              <div>
                {r?.risks?.risks?.map(risk => <RiskItem key={risk.rank} {...risk} />)}
              </div>
            </Card>
          </div>
        )}

        {/* ── Tab: Strategy ── */}
        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader num="06" title="STRATEGIC DIRECTION" />
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
                {r?.strategicDirection?.recommendation}
              </p>

              {r?.strategicDirection?.refinedApproach && (
                <div className="mb-6">
                  <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>REFINED TARGET</div>
                  <div
                    className="rounded-lg p-4"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-accent-muted)' }}
                  >
                    <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>{r.strategicDirection.refinedApproach.targetSegment}</p>
                    {r.strategicDirection.refinedApproach.characteristics?.map((c, i) => (
                      <div key={i} className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-2)' }}>· {c}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>SPECIFIC ACTIONS</div>
              <div className="space-y-2">
                {r?.strategicDirection?.specificActions?.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg p-3"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                      style={{
                        background: action.priority === 'high' ? 'rgba(229,56,59,0.1)' : 'var(--color-surface)',
                        color: action.priority === 'high' ? 'var(--color-error)' : 'var(--color-text-3)',
                        border: `1px solid ${action.priority === 'high' ? 'rgba(229,56,59,0.25)' : 'var(--color-border)'}`,
                      }}
                    >
                      {action.priority?.toUpperCase()}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>{action.action}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── Tab: Validation Plan ── */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader num="07" title="VALIDATION PLAN" />
              <div className="mb-6">
                <div
                  className="inline-block font-mono text-xs px-3 py-1.5 rounded-lg mb-3"
                  style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-muted)' }}
                >
                  {r?.validationPlan?.test?.type?.toUpperCase()}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {r?.validationPlan?.test?.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>STEPS</div>
                <div className="space-y-2">
                  {r?.validationPlan?.test?.steps?.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-muted)' }}>
                        {i + 1}
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-lg p-4"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>SUCCESS METRICS</div>
                {Object.entries(r?.validationPlan?.successMetrics || {}).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-3 mb-2 last:mb-0">
                    <span className="font-mono text-xs capitalize" style={{ color: 'var(--color-text-3)' }}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                    <span className="text-xs" style={{ color: 'var(--color-text)' }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-3)' }}>NEXT STEPS</div>
                {r?.validationPlan?.nextSteps?.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>→</span>
                    <p className="text-xs" style={{ color: 'var(--color-text)' }}>{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => navigate('/submit')}
                  className="font-mono text-sm font-medium px-6 py-3 rounded-lg transition-all"
                  style={{ background: 'var(--color-accent)', color: '#000' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  VALIDATE ANOTHER IDEA →
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
