import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ── Quick-select presets ──────────────────────────────────────────────────
const PRESETS = [
  { label: 'Global', value: 'Global' },
  { label: 'United States', value: 'US' },
  { label: 'India', value: 'India' },
  { label: 'Europe', value: 'Europe' },
  { label: 'UK', value: 'UK' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Southeast Asia', value: 'Southeast Asia' },
  { label: 'LATAM', value: 'Latin America' },
  { label: 'MENA', value: 'Middle East & Africa' },
];

// ── Map click handler (must be inside MapContainer) ──────────────────────
function MapClickHandler({ onCountrySelect }) {
  useMapEvents({
    click: async e => {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
          { headers: { 'User-Agent': 'MarketResearch/1.0' } }
        );
        const data = await res.json();
        const country = data.address?.country || data.address?.city || 'Unknown location';
        if (country && country !== 'Unknown location') onCountrySelect(country, [lat, lng]);
      } catch {
        // silently ignore geocode failure
      }
    },
  });
  return null;
}

// ── Main Component ────────────────────────────────────────────────────────
export default function GeographyPicker({ value, onChange }) {
  const [selected, setSelected] = useState([]);
  const [markers, setMarkers] = useState([]); // [{pos:[lat,lng], label}]
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sync from parent value on mount
  useEffect(() => {
    if (value) {
      const parts = value.split(',').map(s => s.trim()).filter(Boolean);
      setSelected(parts);
    }
    // Delay map mount slightly (avoids SSR/hydration flash)
    const t = setTimeout(() => setMapLoaded(true), 50);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function emit(next) {
    onChange(next.join(', '));
  }

  function addItem(loc) {
    if (loc === 'Global') {
      setSelected(['Global']);
      setMarkers([]);
      emit(['Global']);
      return;
    }
    if (selected.includes('Global') || selected.includes(loc)) return;
    const next = [...selected, loc];
    setSelected(next);
    emit(next);
  }

  function addMarker(loc, pos) {
    addItem(loc);
    setMarkers(prev => {
      if (prev.find(m => m.label === loc)) return prev;
      return [...prev, { pos, label: loc }];
    });
  }

  function removeItem(loc) {
    const next = selected.filter(s => s !== loc);
    setMarkers(prev => prev.filter(m => m.label !== loc));
    setSelected(next);
    emit(next);
  }

  function clearAll() {
    setSelected([]);
    setMarkers([]);
    emit([]);
  }

  return (
    <div>
      {/* Quick-select chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PRESETS.map(p => {
          const active = selected.includes(p.value);
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => active ? removeItem(p.value) : addItem(p.value)}
              className="font-mono text-xs px-2.5 py-1 rounded-md transition-all"
              style={{
                background: active ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border-2)'}`,
                color: active ? 'var(--color-accent)' : 'var(--color-text-2)',
              }}
            >
              {active ? '✓ ' : ''}{p.label}
            </button>
          );
        })}
      </div>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {selected.map(s => (
            <span
              key={s}
              className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded"
              style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-muted)', color: 'var(--color-accent)' }}
            >
              {s}
              <button
                type="button"
                onClick={() => removeItem(s)}
                className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="font-mono text-xs px-2 py-0.5 rounded opacity-50 hover:opacity-80 transition-opacity"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-3)' }}
          >
            clear all
          </button>
        </div>
      )}

      {/* Leaflet map — dark CartoDB tiles to match UI */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--color-border-2)', height: '200px' }}
      >
        {mapLoaded && (
          <MapContainer
            center={[20, 0]}
            zoom={1}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', background: 'hsl(var(--amie-surface))' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              subdomains="abcd"
            />
            <MapClickHandler onCountrySelect={addMarker} />
            {markers.map((m, i) => (
              <CircleMarker
                key={i}
                center={m.pos}
                radius={6}
                pathOptions={{
                  color: '#7bc400',
                  fillColor: '#a4e000',
                  fillOpacity: 0.7,
                  weight: 1.5,
                }}
              />
            ))}
          </MapContainer>
        )}
      </div>
      <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-text-3)' }}>
        Click the map to pin a location, or use the quick-select buttons above.
      </p>
    </div>
  );
}
