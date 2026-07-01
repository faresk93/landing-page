import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, RefreshCw } from 'lucide-react';

/* ===================================================================
   Map projection (equirectangular, corrected for latitude)
   =================================================================== */

const LON_MIN = -5.2;
const LAT_MAX = 51.3;
const COSLAT = Math.cos((46.2 * Math.PI) / 180);
const S = 52; // pixels per degree-equivalent
const PAD = 30;

type Pt = { x: number; y: number };
const project = (lon: number, lat: number): Pt => ({
  x: PAD + (lon - LON_MIN) * COSLAT * S,
  y: PAD + (LAT_MAX - lat) * S,
});

/**
 * Catmull-Rom → cubic Bézier, closed, for an organic coastline.
 * `tension` < 1 tightens the curve toward the waypoints to avoid
 * overshoot "spikes" at France's sharp corners.
 */
function smoothClosed(pts: Pt[], tension = 0.42): string {
  const n = pts.length;
  const k = tension / 6;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) * k;
    const c1y = p1.y + (p2.y - p0.y) * k;
    const c2x = p2.x - (p3.x - p1.x) * k;
    const c2y = p2.y - (p3.y - p1.y) * k;
    d += `C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;
  }
  return d + 'Z';
}

// Metropolitan France border (clockwise, lon/lat) — recognizable "Hexagone".
const FRANCE_LL: [number, number][] = [
  [2.55, 51.05], [4.2, 50.17], [5.67, 49.79], [6.37, 49.46], [8.23, 49.0],
  [7.79, 48.58], [7.56, 48.32], [7.56, 47.44], [6.87, 46.37], [6.8, 45.92],
  [6.65, 45.1], [7.0, 44.1], [7.44, 43.76], [7.02, 43.55], [5.93, 43.12],
  [4.85, 43.4], [3.7, 43.28], [3.04, 42.52], [2.55, 42.47], [1.45, 42.5],
  [0.65, 42.7], [-1.4, 42.8], [-1.55, 43.55], [-1.16, 44.66], [-1.06, 45.57],
  [-1.15, 46.16], [-2.55, 47.28], [-4.28, 47.99], [-4.49, 48.39], [-2.02, 48.64],
  [-1.61, 48.84], [-1.94, 49.72], [-1.28, 49.65], [0.11, 49.49], [1.08, 49.93],
  [1.85, 50.95],
];

const CORSICA_LL: [number, number][] = [
  [9.35, 43.0], [9.55, 42.7], [9.55, 41.92], [9.4, 41.38], [8.8, 41.92],
  [8.65, 42.4], [9.1, 42.62],
];

const FRANCE_PATH = smoothClosed(FRANCE_LL.map(([lon, lat]) => project(lon, lat)));
const CORSICA_PATH = smoothClosed(CORSICA_LL.map(([lon, lat]) => project(lon, lat)));

/* ===================================================================
   Cities
   =================================================================== */

interface City {
  name: string;
  lon: number;
  lat: number;
  label?: boolean; // show a permanent label
}

const CITIES: City[] = [
  { name: 'Paris', lon: 2.3522, lat: 48.8566, label: true },
  { name: 'Lille', lon: 3.0573, lat: 50.6292 },
  { name: 'Strasbourg', lon: 7.7521, lat: 48.5734 },
  { name: 'Brest', lon: -4.4861, lat: 48.3904 },
  { name: 'Rennes', lon: -1.6778, lat: 48.1173 },
  { name: 'Nantes', lon: -1.5536, lat: 47.2184 },
  { name: 'Bordeaux', lon: -0.5792, lat: 44.8378, label: true },
  { name: 'Toulouse', lon: 1.4442, lat: 43.6047 },
  { name: 'Montpellier', lon: 3.8772, lat: 43.6109 },
  { name: 'Marseille', lon: 5.3698, lat: 43.2965, label: true },
  { name: 'Nice', lon: 7.262, lat: 43.7102 },
  { name: 'Lyon', lon: 4.8357, lat: 45.764, label: true },
  { name: 'Clermont', lon: 3.087, lat: 45.7772 },
  { name: 'Dijon', lon: 5.0415, lat: 47.322 },
  { name: 'Limoges', lon: 1.2611, lat: 45.8336 },
  { name: 'Ajaccio', lon: 8.7386, lat: 41.9192 },
];

/* ===================================================================
   Heat colour scale + building thermal-stress label
   =================================================================== */

const STOPS: { t: number; c: [number, number, number] }[] = [
  { t: 0, c: [79, 134, 214] },
  { t: 8, c: [67, 192, 192] },
  { t: 15, c: [108, 194, 74] },
  { t: 22, c: [255, 200, 40] },
  { t: 28, c: [255, 106, 44] },
  { t: 34, c: [226, 59, 59] },
];

function heatColor(t: number): string {
  if (t <= STOPS[0].t) return `rgb(${STOPS[0].c.join(',')})`;
  if (t >= STOPS[STOPS.length - 1].t) return `rgb(${STOPS[STOPS.length - 1].c.join(',')})`;
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const k = (t - a.t) / (b.t - a.t);
      const c = a.c.map((v, j) => Math.round(v + (b.c[j] - v) * k));
      return `rgb(${c.join(',')})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1].c.join(',')})`;
}

function stressLabel(t: number): string {
  if (t < 12) return 'Frais';
  if (t < 22) return 'Confort';
  if (t < 28) return 'Tiède';
  if (t < 34) return 'Vigilance';
  return 'Surchauffe';
}

/* ===================================================================
   Component
   =================================================================== */

interface CityTemp extends City {
  pt: Pt;
  temp: number;
}

const FranceHeatMap: React.FC = () => {
  const [temps, setTemps] = useState<number[] | null>(null);
  const [source, setSource] = useState<'live' | 'estimate'>('estimate');
  const [hovered, setHovered] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTemps = useMemo(
    () =>
      async (signal?: AbortSignal) => {
        setLoading(true);
        const lats = CITIES.map((c) => c.lat).join(',');
        const lons = CITIES.map((c) => c.lon).join(',');
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m&timezone=Europe%2FParis`,
            { signal },
          );
          if (!res.ok) throw new Error('heatmap http');
          const json = await res.json();
          const arr = Array.isArray(json) ? json : [json];
          const t = CITIES.map((_, i) => Math.round(arr[i]?.current?.temperature_2m ?? NaN));
          if (t.some((v) => Number.isNaN(v))) throw new Error('bad data');
          setTemps(t);
          setSource('live');
        } catch {
          // Seasonal fallback: warmer toward the south.
          const month = new Date().getMonth();
          const base = [7, 8, 12, 16, 20, 23, 25, 25, 21, 16, 11, 8][month];
          setTemps(CITIES.map((c) => Math.round(base + (46.5 - c.lat) * 1.1)));
          setSource('estimate');
        } finally {
          setLoading(false);
        }
      },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchTemps(controller.signal);
    return () => controller.abort();
  }, [fetchTemps]);

  const cityTemps: CityTemp[] = useMemo(
    () =>
      CITIES.map((c, i) => ({
        ...c,
        pt: project(c.lon, c.lat),
        temp: temps ? temps[i] : 18,
      })),
    [temps],
  );

  return (
    <div className="relative flex h-full flex-col rounded-[26px] border border-white/70 bg-white/70 p-5 shadow-[0_18px_40px_-20px_rgba(232,74,127,0.45)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-socotec text-white shadow-sm">
            <Flame size={18} />
          </span>
          <div>
            <h3 className="font-quicksand text-[0.95rem] font-bold tracking-wide text-slate-700">
              Carte thermique · France
            </h3>
            <p className="text-[0.72rem] text-slate-500">
              Stress thermique des bâtiments {source === 'live' ? '· en direct' : '· estimation'}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchTemps()}
          aria-label="Rafraîchir les températures"
          className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-slate-500 shadow transition hover:text-socotec active:scale-95"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative flex-1">
        <svg viewBox="0 0 600 600" className="h-full w-full" style={{ overflow: 'visible' }} role="img" aria-label="Carte thermique de la France">
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde8ef" />
              <stop offset="100%" stopColor="#ffeede" />
            </linearGradient>
            <clipPath id="franceClip">
              <path d={FRANCE_PATH} />
            </clipPath>
            <clipPath id="corsicaClip">
              <path d={CORSICA_PATH} />
            </clipPath>
            <filter id="heatBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>

          {/* land base */}
          <path d={FRANCE_PATH} fill="url(#land)" />
          <path d={CORSICA_PATH} fill="url(#land)" />

          {/* heat blobs, clipped to the country shape */}
          <g clipPath="url(#franceClip)" filter="url(#heatBlur)">
            {cityTemps.map((c) => (
              <circle key={c.name} cx={c.pt.x} cy={c.pt.y} r={74} fill={heatColor(c.temp)} opacity={0.82} />
            ))}
          </g>
          <g clipPath="url(#corsicaClip)" filter="url(#heatBlur)">
            {cityTemps
              .filter((c) => c.name === 'Ajaccio')
              .map((c) => (
                <circle key={c.name} cx={c.pt.x} cy={c.pt.y} r={60} fill={heatColor(c.temp)} opacity={0.85} />
              ))}
          </g>

          {/* borders on top */}
          <path d={FRANCE_PATH} fill="none" stroke="rgba(21,35,59,0.5)" strokeWidth={2} strokeLinejoin="round" />
          <path d={CORSICA_PATH} fill="none" stroke="rgba(21,35,59,0.5)" strokeWidth={2} strokeLinejoin="round" />

          {/* cities */}
          {cityTemps.map((c, i) => {
            const active = hovered === i;
            return (
              <g
                key={c.name}
                tabIndex={0}
                role="button"
                aria-label={`${c.name}, ${c.temp} degrés, ${stressLabel(c.temp)}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? null : h))}
                onClick={() => setHovered((h) => (h === i ? null : i))}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                {/* invisible larger hit target */}
                <circle cx={c.pt.x} cy={c.pt.y} r={16} fill="transparent" />
                <circle
                  cx={c.pt.x}
                  cy={c.pt.y}
                  r={active ? 7 : 4.5}
                  fill="#fff"
                  stroke={heatColor(c.temp)}
                  strokeWidth={active ? 4 : 3}
                  style={{ transition: 'r 0.15s, stroke-width 0.15s' }}
                />
                {c.label && !active && (
                  <text
                    x={c.pt.x + 9}
                    y={c.pt.y + 4}
                    fontSize={13}
                    fontWeight={600}
                    fill="rgba(21,35,59,0.7)"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {c.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* tooltip */}
          {hovered !== null && (
            <g transform={`translate(${cityTemps[hovered].pt.x}, ${cityTemps[hovered].pt.y - 16})`} style={{ pointerEvents: 'none' }}>
              <g transform="translate(-66, -52)">
                <rect width="132" height="46" rx="11" fill="#15233b" opacity="0.95" />
                <text x="66" y="20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                  {cityTemps[hovered].name} · {cityTemps[hovered].temp}°C
                </text>
                <text x="66" y="37" textAnchor="middle" fontSize="11.5" fill={heatColor(cityTemps[hovered].temp)} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                  {stressLabel(cityTemps[hovered].temp)}
                </text>
              </g>
              <path d="M -7 -6 L 7 -6 L 0 2 Z" fill="#15233b" opacity="0.95" />
            </g>
          )}
        </svg>
      </div>

      {/* legend */}
      <div className="mt-2">
        <div
          className="h-2.5 w-full rounded-full"
          style={{ background: 'linear-gradient(90deg, rgb(79,134,214), rgb(67,192,192), rgb(108,194,74), rgb(255,200,40), rgb(255,106,44), rgb(226,59,59))' }}
        />
        <div className="mt-1 flex justify-between text-[0.62rem] font-medium text-slate-500">
          <span>0°C · Frais</span>
          <span>Confort</span>
          <span>Vigilance</span>
          <span>34°C+ · Surchauffe</span>
        </div>
      </div>
    </div>
  );
};

export default FranceHeatMap;
