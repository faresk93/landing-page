import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import { CV, type CVSkillGroup } from '../data/cv';

interface PlanetStyle {
  color: string;
  glow: string;
  ring: string;
  chip: string;
}

const PLANET_STYLES: PlanetStyle[] = [
  { color: '#00f3ff', glow: 'rgba(0,243,255,0.55)', ring: 'rgba(0,243,255,0.35)', chip: 'rgba(0,243,255,0.12)' },
  { color: '#bc13fe', glow: 'rgba(188,19,254,0.55)', ring: 'rgba(188,19,254,0.35)', chip: 'rgba(188,19,254,0.12)' },
  { color: '#ff9e00', glow: 'rgba(255,158,0,0.55)', ring: 'rgba(255,158,0,0.35)', chip: 'rgba(255,158,0,0.12)' },
  { color: '#4ade80', glow: 'rgba(74,222,128,0.55)', ring: 'rgba(74,222,128,0.35)', chip: 'rgba(74,222,128,0.12)' },
  { color: '#f472b6', glow: 'rgba(244,114,182,0.55)', ring: 'rgba(244,114,182,0.35)', chip: 'rgba(244,114,182,0.12)' },
  { color: '#fbbf24', glow: 'rgba(251,191,36,0.55)', ring: 'rgba(251,191,36,0.35)', chip: 'rgba(251,191,36,0.12)' },
  { color: '#818cf8', glow: 'rgba(129,140,248,0.55)', ring: 'rgba(129,140,248,0.35)', chip: 'rgba(129,140,248,0.12)' },
  { color: '#2dd4bf', glow: 'rgba(45,212,191,0.55)', ring: 'rgba(45,212,191,0.35)', chip: 'rgba(45,212,191,0.12)' },
];

interface StarfieldProps {
  count?: number;
}

function Starfield({ count = 120 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fit = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    fit();
    window.addEventListener('resize', fit);

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.015 + 0.005,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.tw += s.sp;
        const o = (Math.sin(s.tw) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.2 + o * 0.6})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(0,243,255,0.4)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', fit);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

interface PlanetProps {
  group: CVSkillGroup;
  index: number;
  total: number;
  orbitRadius: number;
  planetSize: number;
  duration: number;
  onSelect: (group: CVSkillGroup, style: PlanetStyle) => void;
  active: boolean;
  reduced: boolean;
}

function Planet({ group, index, total, orbitRadius, planetSize, duration, onSelect, active, reduced }: PlanetProps) {
  const style = PLANET_STYLES[index % PLANET_STYLES.length];
  const delay = -(duration / total) * index;

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: orbitRadius * 2,
        height: orbitRadius * 2,
        marginLeft: -orbitRadius,
        marginTop: -orbitRadius,
        animation: reduced ? 'none' : `skills-orbit ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
      }}
    >
      <button
        type="button"
        onClick={() => onSelect(group, style)}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center pointer-events-auto group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{
          top: 0,
          left: '50%',
          width: planetSize,
          height: planetSize,
          background: `radial-gradient(circle at 30% 30%, ${style.color}, rgba(10,10,20,0.9) 75%)`,
          border: `1px solid ${style.ring}`,
          boxShadow: `0 0 18px ${style.glow}, 0 0 42px ${style.glow}`,
          animation: reduced ? 'none' : `skills-counter-rotate ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          transform: active ? 'translate(-50%,-50%) scale(1.15)' : undefined,
          transition: 'transform 0.35s ease',
        }}
        aria-label={group.label}
      >
        <span
          className="font-orbitron font-black text-[8px] md:text-[10px] tracking-[0.15em] text-white uppercase px-1 text-center leading-tight pointer-events-none select-none"
          style={{ textShadow: `0 0 8px ${style.glow}` }}
        >
          {group.label}
        </span>
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `0 0 30px ${style.glow}, 0 0 70px ${style.glow}`,
          }}
        />
      </button>
    </div>
  );
}

const SkillsPage: React.FC = () => {
  const groups = CV.skills;
  const [selected, setSelected] = useState<{ group: CVSkillGroup; style: PlanetStyle } | null>(null);
  const [reduced, setReduced] = useState(false);
  const [viewport, setViewport] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1024, h: typeof window !== 'undefined' ? window.innerHeight : 768 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { base, step, planetSize } = useMemo(() => {
    const minDim = Math.min(viewport.w, viewport.h);
    const isMobile = minDim < 640;
    const b = isMobile ? Math.max(80, minDim * 0.18) : Math.max(120, minDim * 0.2);
    const s = isMobile ? Math.max(28, minDim * 0.055) : Math.max(44, minDim * 0.055);
    const p = isMobile ? 56 : 78;
    return { base: b, step: s, planetSize: p };
  }, [viewport]);

  return (
    <div className="fixed inset-0 bg-[#020205] text-white overflow-hidden [direction:ltr]">
      <style>{`
        @keyframes skills-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes skills-counter-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes skills-pulse-core {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.9; }
        }
        @keyframes skills-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(188,19,254,0.18) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(0,243,255,0.14) 0%, transparent 60%), linear-gradient(150deg, #020205 0%, #070716 60%, #020205 100%)',
        }}
      />
      <Starfield count={140} />

      <Link
        to="/"
        className="fixed top-6 left-6 md:top-8 md:left-8 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group z-50 pointer-events-auto"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-orbitron text-[10px] tracking-[0.3em] uppercase font-bold">Back</span>
      </Link>

      <div className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-2 text-white/40">
        <Sparkles className="w-3.5 h-3.5 text-neonPurple" />
        <span className="font-orbitron text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold">
          Skills · Planetary System
        </span>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="relative" style={{ width: '100vw', height: '100vh' }}>
          {/* Orbit rings */}
          {groups.map((_, i) => {
            const r = base + step * i;
            return (
              <div
                key={`ring-${i}`}
                className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
                style={{
                  width: r * 2,
                  height: r * 2,
                  marginLeft: -r,
                  marginTop: -r,
                  border: '1px dashed rgba(255,255,255,0.06)',
                }}
              />
            );
          })}

          {/* Central star */}
          <div
            className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
            style={{
              width: 110,
              height: 110,
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(circle, #ffffff 0%, #fde68a 25%, #f59e0b 55%, rgba(188,19,254,0.2) 80%, transparent 100%)',
              boxShadow:
                '0 0 60px rgba(253,230,138,0.55), 0 0 120px rgba(245,158,11,0.35), 0 0 180px rgba(188,19,254,0.25)',
              animation: reduced ? 'none' : 'skills-pulse-core 4s ease-in-out infinite',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center"
            style={{ animation: 'skills-fade-up 0.8s ease-out both' }}
          >
            <div className="font-orbitron font-black text-[9px] md:text-[11px] tracking-[0.35em] text-white uppercase drop-shadow-[0_0_6px_rgba(253,230,138,0.8)]">
              Fares
            </div>
            <div className="font-rajdhani text-[9px] md:text-[11px] text-yellow-100/70 tracking-widest mt-1">
              Core
            </div>
          </div>

          {/* Planets */}
          {groups.map((group, i) => (
            <Planet
              key={group.label}
              group={group}
              index={i}
              total={groups.length}
              orbitRadius={base + step * i}
              planetSize={planetSize}
              duration={28 + i * 6}
              onSelect={(g, s) => setSelected({ group: g, style: s })}
              active={selected?.group.label === group.label}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

      {/* Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="font-orbitron text-[8px] md:text-[10px] tracking-[0.35em] uppercase text-white/30">
          Tap a planet to explore
        </div>
      </div>

      {/* Skill detail modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-[#0d0d15]/95 border rounded-3xl p-8 shadow-2xl overflow-hidden"
              style={{
                borderColor: selected.style.ring,
                boxShadow: `0 0 40px ${selected.style.glow}, 0 0 100px ${selected.style.glow}`,
              }}
            >
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${selected.style.color} 0%, transparent 65%)`,
                  opacity: 0.25,
                  filter: 'blur(20px)',
                }}
              />
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${selected.style.color}, rgba(10,10,20,0.9) 80%)`,
                      boxShadow: `0 0 12px ${selected.style.glow}`,
                    }}
                  />
                  <h3
                    className="font-orbitron text-sm font-black uppercase tracking-[0.25em]"
                    style={{ color: selected.style.color }}
                  >
                    {selected.group.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto">
                {selected.group.items.map((item) => (
                  <span
                    key={item}
                    className="font-rajdhani font-bold text-xs tracking-wider px-3 py-1.5 rounded-full border text-white/90"
                    style={{
                      borderColor: selected.style.ring,
                      backgroundColor: selected.style.chip,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-orbitron text-[10px] tracking-[0.3em] uppercase hover:bg-white/10 transition-all"
              >
                Close Transmission
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsPage;
