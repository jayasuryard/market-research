const ITEMS = [
  'Demand signals', 'Competitor mapping', 'ICP prioritization', 'Risk vectors',
  'Pain intensity', 'Pricing gaps', 'Search intent', 'Niche discovery',
  'Verdict scoring', 'Strategic pivots',
];

export function MarqueeBar() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="hairline-t hairline-b overflow-hidden" style={{ background: 'hsl(var(--amie-surface))' }}>
      <div className="flex amie-marquee whitespace-nowrap py-3.5">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-6 ticker" style={{ color: 'hsl(var(--amie-ink-soft))' }}>
            <span>{t}</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'hsl(var(--amie-signal))' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
