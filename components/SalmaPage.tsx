import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Home } from 'lucide-react';

import HeartCursor from './salma/HeartCursor';
import { LiveClock, WeatherWidget, EncouragementCard, PomodoroTimer } from './salma/widgets';
import StickyNotes from './salma/StickyNotes';
import FranceHeatMap from './salma/FranceHeatMap';
import Morpion from './salma/Morpion';
import { Cat, Heart, HeartArrow, Paw, SocotecMark, Sparkle } from './salma/icons';

/* ------------------------------------------------------------------ */
/* Floating, parallaxing background decor                              */
/* ------------------------------------------------------------------ */

interface FloatItem { left: string; top: string; delay: number; dur: number; node: React.ReactNode; depth: number; }

const DECOR: FloatItem[] = [
  { left: '6%', top: '22%', delay: 0, dur: 6, depth: 30, node: <Cat variant="black" size={66} /> },
  { left: '88%', top: '16%', delay: 1.2, dur: 7, depth: 50, node: <Cat variant="white" size={58} /> },
  { left: '12%', top: '74%', delay: 0.6, dur: 6.5, depth: 40, node: <Cat variant="tuxedo" size={52} /> },
  { left: '92%', top: '78%', delay: 1.8, dur: 5.5, depth: 24, node: <Paw size={30} /> },
  { left: '78%', top: '46%', delay: 0.4, dur: 7.5, depth: 18, node: <Heart size={26} fill="#ff9bb3" /> },
  { left: '20%', top: '12%', delay: 1.5, dur: 6.8, depth: 22, node: <Heart size={20} fill="#ff6fa5" /> },
  { left: '46%', top: '8%', delay: 0.9, dur: 8, depth: 14, node: <Sparkle size={18} /> },
];

const BackgroundDecor: React.FC = () => {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduce, mx, my]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* soft gradient blobs */}
      <div className="absolute -left-20 -top-24 h-[360px] w-[360px] rounded-full bg-rose-300/40 blur-3xl" />
      <div className="absolute right-[-80px] top-1/3 h-[420px] w-[420px] rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute bottom-[-120px] left-1/4 h-[380px] w-[380px] rounded-full bg-fuchsia-200/40 blur-3xl" />

      {/* floating cats / hearts with subtle mouse parallax */}
      {DECOR.map((d, i) => (
        <Parallax key={i} sx={sx} sy={sy} depth={reduce ? 0 : d.depth} left={d.left} top={d.top}>
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
            className="opacity-70 drop-shadow-[0_8px_14px_rgba(232,74,127,0.25)]"
          >
            {d.node}
          </motion.div>
        </Parallax>
      ))}
    </div>
  );
};

const Parallax: React.FC<{
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  depth: number;
  left: string;
  top: string;
  children: React.ReactNode;
}> = ({ sx, sy, depth, left, top, children }) => {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div className="absolute" style={{ left, top, x, y }}>
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero with a gentle 3D tilt on the name                             */
/* ------------------------------------------------------------------ */

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 16 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.header
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-10 text-center sm:pt-14"
    >
      <motion.div
        variants={item}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-rose-500 backdrop-blur"
      >
        <Sparkle size={14} className="text-amber-400" />
        Rien que pour toi
      </motion.div>

      <motion.div
        variants={item}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformPerspective: 1000 }}
        className="flex flex-col items-center gap-1"
      >
        <h1 className="salma-gradient-text font-dancing text-[5rem] font-bold leading-none sm:text-[7rem]">
          Salma
        </h1>
        <span className="salma-arabic text-[3.4rem] leading-tight text-roseDeep sm:text-[4.5rem]" style={{ color: 'var(--color-roseDeep)' }}>
          سلمى
        </span>
      </motion.div>

      <motion.p variants={item} className="mt-5 max-w-xl font-quicksand text-lg font-medium text-slate-600">
        Ton petit tableau de bord, pensé et conçu avec tout mon amour 💖
        <br />
        pour t’accompagner, te faciliter la vie et te faire sourire chaque jour.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-white/70 bg-white/60 px-5 py-3 backdrop-blur"
      >
        <SocotecMark />
        <span className="h-4 w-px bg-slate-300" />
        <span className="font-quicksand text-sm text-slate-600">là où tu fais la différence pour le climat 🌍</span>
      </motion.div>
    </motion.header>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const SalmaPage: React.FC = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Pour Salma 💖';
    return () => { document.title = prev; };
  }, []);

  const monthYear = useMemo(
    () => new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date()),
    [],
  );

  return (
    <div
      className="salma-root salma-scroll relative min-h-[100dvh] w-full overflow-x-hidden font-quicksand text-slate-800"
      style={{ background: 'linear-gradient(160deg, #fff5f7 0%, #fff0ea 45%, #fdeef6 100%)' }}
    >
      <HeartCursor />
      <BackgroundDecor />

      {/* back home */}
      <Link
        to="/"
        className="fixed left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3.5 py-2 text-[0.75rem] font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:text-rose-500"
      >
        <Home size={15} /> Accueil
      </Link>

      <Hero />

      {/* Dashboard */}
      <main className="relative z-10 mx-auto mt-10 grid max-w-7xl grid-cols-1 items-stretch gap-5 px-4 pb-4 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <EncouragementCard />
        </div>

        <div className="lg:col-span-7">
          <StickyNotes />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-5">
          <LiveClock />
          <WeatherWidget delay={0.05} />
        </div>

        <div className="lg:col-span-7">
          <FranceHeatMap />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-5">
          <Morpion />
          <PomodoroTimer delay={0.05} />
        </div>
      </main>

      {/* Signature */}
      <footer className="relative z-10 mx-auto max-w-3xl px-4 pb-16 pt-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3 text-rose-300">
          <Paw size={16} className="text-rose-300" />
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300" />
          <HeartArrow size={28} />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300" />
          <Paw size={16} className="text-rose-300" />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-dancing text-3xl font-semibold text-roseDeep"
          style={{ color: 'var(--color-roseDeep)' }}
        >
          Fait avec 💖 par Fares, pour Salma
        </motion.p>
        <p className="mt-2 font-quicksand text-sm capitalize text-slate-500">
          {monthYear} · Tu es, et tu resteras, mon plus beau projet.
        </p>
      </footer>
    </div>
  );
};

export default SalmaPage;
