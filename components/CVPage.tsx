import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Languages,
  Award,
  ChevronDown,
  Download,
  Rocket,
} from 'lucide-react';
import { CV, type CVExperience } from '../data/cv';

type AccentKey = CVExperience['accent'];

interface AccentStyle {
  dot: string;
  dotRing: string;
  line: string;
  chip: string;
  chipBorder: string;
  glow: string;
  label: string;
}

const ACCENTS: Record<AccentKey, AccentStyle> = {
  cyan: {
    dot: 'bg-sky-300/80',
    dotRing: 'ring-sky-300/20',
    line: 'from-sky-300/40',
    chip: 'bg-sky-300/10 text-sky-100',
    chipBorder: 'border-sky-300/20',
    glow: 'shadow-[0_0_40px_-12px_rgba(125,211,252,0.35)]',
    label: 'text-sky-200',
  },
  indigo: {
    dot: 'bg-indigo-300/80',
    dotRing: 'ring-indigo-300/20',
    line: 'from-indigo-300/40',
    chip: 'bg-indigo-300/10 text-indigo-100',
    chipBorder: 'border-indigo-300/20',
    glow: 'shadow-[0_0_40px_-12px_rgba(165,180,252,0.35)]',
    label: 'text-indigo-200',
  },
  emerald: {
    dot: 'bg-emerald-300/80',
    dotRing: 'ring-emerald-300/20',
    line: 'from-emerald-300/40',
    chip: 'bg-emerald-300/10 text-emerald-100',
    chipBorder: 'border-emerald-300/20',
    glow: 'shadow-[0_0_40px_-12px_rgba(110,231,183,0.35)]',
    label: 'text-emerald-200',
  },
  amber: {
    dot: 'bg-amber-300/80',
    dotRing: 'ring-amber-300/20',
    line: 'from-amber-300/40',
    chip: 'bg-amber-300/10 text-amber-100',
    chipBorder: 'border-amber-300/20',
    glow: 'shadow-[0_0_40px_-12px_rgba(252,211,77,0.35)]',
    label: 'text-amber-200',
  },
};

interface SkillColorStyle {
  cardBg: string;
  cardBorder: string;
  hoverBorder: string;
  hoverBg: string;
  labelColor: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  chipHover: string;
  glow: string;
  gradient: string;
}

const SKILL_COLORS: Record<string, SkillColorStyle> = {
  Backend: {
    cardBg: 'bg-violet-500/[0.04]',
    cardBorder: 'border-violet-400/15',
    hoverBorder: 'hover:border-violet-400/35',
    hoverBg: 'hover:bg-violet-500/[0.08]',
    labelColor: 'text-violet-300/80',
    chipBg: 'bg-violet-400/[0.08]',
    chipBorder: 'border-violet-400/20',
    chipText: 'text-violet-100',
    chipHover: 'hover:bg-violet-400/15 hover:border-violet-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(167,139,250,0.35)]',
    gradient: 'from-violet-400/10 via-transparent',
  },
  Frontend: {
    cardBg: 'bg-sky-500/[0.04]',
    cardBorder: 'border-sky-400/15',
    hoverBorder: 'hover:border-sky-400/35',
    hoverBg: 'hover:bg-sky-500/[0.08]',
    labelColor: 'text-sky-300/80',
    chipBg: 'bg-sky-400/[0.08]',
    chipBorder: 'border-sky-400/20',
    chipText: 'text-sky-100',
    chipHover: 'hover:bg-sky-400/15 hover:border-sky-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(56,189,248,0.35)]',
    gradient: 'from-sky-400/10 via-transparent',
  },
  Databases: {
    cardBg: 'bg-emerald-500/[0.04]',
    cardBorder: 'border-emerald-400/15',
    hoverBorder: 'hover:border-emerald-400/35',
    hoverBg: 'hover:bg-emerald-500/[0.08]',
    labelColor: 'text-emerald-300/80',
    chipBg: 'bg-emerald-400/[0.08]',
    chipBorder: 'border-emerald-400/20',
    chipText: 'text-emerald-100',
    chipHover: 'hover:bg-emerald-400/15 hover:border-emerald-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(110,231,183,0.35)]',
    gradient: 'from-emerald-400/10 via-transparent',
  },
  'DevOps / Tools': {
    cardBg: 'bg-amber-500/[0.04]',
    cardBorder: 'border-amber-400/15',
    hoverBorder: 'hover:border-amber-400/35',
    hoverBg: 'hover:bg-amber-500/[0.08]',
    labelColor: 'text-amber-300/80',
    chipBg: 'bg-amber-400/[0.08]',
    chipBorder: 'border-amber-400/20',
    chipText: 'text-amber-100',
    chipHover: 'hover:bg-amber-400/15 hover:border-amber-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(252,211,77,0.35)]',
    gradient: 'from-amber-400/10 via-transparent',
  },
  'Testing / Quality': {
    cardBg: 'bg-rose-500/[0.04]',
    cardBorder: 'border-rose-400/15',
    hoverBorder: 'hover:border-rose-400/35',
    hoverBg: 'hover:bg-rose-500/[0.08]',
    labelColor: 'text-rose-300/80',
    chipBg: 'bg-rose-400/[0.08]',
    chipBorder: 'border-rose-400/20',
    chipText: 'text-rose-100',
    chipHover: 'hover:bg-rose-400/15 hover:border-rose-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(251,113,133,0.35)]',
    gradient: 'from-rose-400/10 via-transparent',
  },
  Integrations: {
    cardBg: 'bg-cyan-500/[0.04]',
    cardBorder: 'border-cyan-400/15',
    hoverBorder: 'hover:border-cyan-400/35',
    hoverBg: 'hover:bg-cyan-500/[0.08]',
    labelColor: 'text-cyan-300/80',
    chipBg: 'bg-cyan-400/[0.08]',
    chipBorder: 'border-cyan-400/20',
    chipText: 'text-cyan-100',
    chipHover: 'hover:bg-cyan-400/15 hover:border-cyan-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(34,211,238,0.35)]',
    gradient: 'from-cyan-400/10 via-transparent',
  },
  Methodology: {
    cardBg: 'bg-indigo-500/[0.04]',
    cardBorder: 'border-indigo-400/15',
    hoverBorder: 'hover:border-indigo-400/35',
    hoverBg: 'hover:bg-indigo-500/[0.08]',
    labelColor: 'text-indigo-300/80',
    chipBg: 'bg-indigo-400/[0.08]',
    chipBorder: 'border-indigo-400/20',
    chipText: 'text-indigo-100',
    chipHover: 'hover:bg-indigo-400/15 hover:border-indigo-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(129,140,248,0.35)]',
    gradient: 'from-indigo-400/10 via-transparent',
  },
  'AI & Tools': {
    cardBg: 'bg-fuchsia-500/[0.04]',
    cardBorder: 'border-fuchsia-400/15',
    hoverBorder: 'hover:border-fuchsia-400/35',
    hoverBg: 'hover:bg-fuchsia-500/[0.08]',
    labelColor: 'text-fuchsia-300/80',
    chipBg: 'bg-fuchsia-400/[0.08]',
    chipBorder: 'border-fuchsia-400/20',
    chipText: 'text-fuchsia-100',
    chipHover: 'hover:bg-fuchsia-400/15 hover:border-fuchsia-400/35',
    glow: 'hover:shadow-[0_0_35px_-10px_rgba(232,121,249,0.35)]',
    gradient: 'from-fuchsia-400/10 via-transparent',
  },
};

const DEFAULT_SKILL_COLOR: SkillColorStyle = {
  cardBg: 'bg-white/[0.03]',
  cardBorder: 'border-white/10',
  hoverBorder: 'hover:border-white/20',
  hoverBg: 'hover:bg-white/[0.05]',
  labelColor: 'text-white/50',
  chipBg: 'bg-white/[0.04]',
  chipBorder: 'border-white/10',
  chipText: 'text-white/80',
  chipHover: 'hover:bg-white/[0.08] hover:border-white/25',
  glow: '',
  gradient: 'from-white/5 via-transparent',
};

const NAV_SECTIONS = [
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: Rocket },
  { id: 'additional', label: 'More', icon: Award },
];

/* ═══════════ FLOATING NAV ═══════════ */

interface FloatingNavProps {
  active: string;
  visible: boolean;
  onNavigate: (id: string) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ active, visible, onNavigate }) => {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Section navigation"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 top-1/2 z-30 -translate-y-1/2 hidden lg:flex flex-col items-center gap-1 rounded-2xl border border-white/[0.08] bg-[#060812]/75 p-2 shadow-2xl backdrop-blur-2xl"
        >
          {/* top accent line */}
          <div className="mb-1 h-px w-4 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {NAV_SECTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <div key={id} className="group relative flex items-center">
                <motion.button
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-label={`Navigate to ${label}`}
                  whileHover={reduce ? undefined : { scale: 1.12 }}
                  whileTap={reduce ? undefined : { scale: 0.92 }}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white/[0.12] text-white shadow-[0_0_14px_-4px_rgba(255,255,255,0.3)]'
                      : 'text-white/35 hover:bg-white/[0.06] hover:text-white/70'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {isActive && (
                    <motion.span
                      layoutId="navActiveGlow"
                      className="absolute inset-0 rounded-xl border border-white/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>

                {/* tooltip */}
                <span
                  className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl border border-white/[0.08] bg-[#060812]/90 px-3 py-1.5 font-orbitron text-[9px] uppercase tracking-[0.3em] text-white/70 opacity-0 shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
                >
                  {label}
                  <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 h-2 w-2 rotate-45 rounded-sm border-r border-t border-white/[0.08] bg-[#060812]/90" />
                </span>
              </div>
            );
          })}

          <div className="mt-1 h-px w-4 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* section progress dots */}
          <div className="flex flex-col items-center gap-1 pt-1">
            {NAV_SECTIONS.map(({ id }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-label={`Go to ${id}`}
                className={`rounded-full transition-all duration-300 ${
                  active === id ? 'h-3 w-1 bg-white/60' : 'h-1 w-1 bg-white/20 hover:bg-white/35'
                }`}
              />
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

/* ═══════════ AMBIENT BACKGROUND ═══════════ */

const AmbientBackground: React.FC = React.memo(() => {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#070a14] via-[#0a0d1c] to-[#060812]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 15%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(56,189,248,0.14), transparent 55%), radial-gradient(ellipse at 55% 50%, rgba(139,92,246,0.08), transparent 60%)',
        }}
      />
      <motion.div
        className="absolute top-[-12%] left-[-10%] h-[40vmax] w-[40vmax] rounded-full bg-indigo-500/[0.08] blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-18%] right-[-12%] h-[45vmax] w-[45vmax] rounded-full bg-sky-500/[0.07] blur-3xl"
        animate={reduce ? undefined : { x: [0, -30, 20, 0], y: [0, -25, 15, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
});
AmbientBackground.displayName = 'AmbientBackground';

/* ═══════════ SHARED ═══════════ */

interface SectionHeaderProps {
  kicker: string;
  title: string;
  icon: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ kicker, title, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="mb-6 md:mb-10"
  >
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex items-center gap-2 text-white/40"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60">
        {icon}
      </span>
      <span className="font-orbitron text-[9px] uppercase tracking-[0.35em]">{kicker}</span>
    </motion.div>
    <h2 className="mt-3 font-orbitron text-xl font-black tracking-tight text-white/90 sm:text-2xl md:text-3xl">
      {title}
    </h2>
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width: 64, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      className="mt-4 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent"
    />
  </motion.div>
);

/* ═══════════ SECTION QUICK NAV ═══════════ */

interface SectionQuickNavProps {
  active: string;
  onNavigate: (id: string) => void;
}

const QUICK_NAV_ITEMS = [
  { id: 'experience', label: 'Experience', icon: Briefcase, kicker: 'Career' },
  { id: 'skills', label: 'Skills', icon: Sparkles, kicker: 'Toolbox' },
  { id: 'education', label: 'Education', icon: GraduationCap, kicker: 'Foundations' },
  { id: 'projects', label: 'Projects', icon: Rocket, kicker: 'Highlights' },
  { id: 'additional', label: 'More', icon: Award, kicker: 'Languages & More' },
];

const SectionQuickNav: React.FC<SectionQuickNavProps> = ({ active, onNavigate }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 md:mt-10"
    >
      {/* Label row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="mb-4 flex items-center justify-center gap-3"
      >
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
        <span className="font-orbitron text-[9px] uppercase tracking-[0.4em] text-white/30">
          Navigate sections
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
      </motion.div>

      {/* Buttons row — scrollable on mobile */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-stretch justify-start gap-2 sm:justify-center sm:gap-3">
          {QUICK_NAV_ITEMS.map(({ id, label, icon: Icon, kicker }, i) => {
            const isActive = active === id;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-label={`Go to ${label}`}
                initial={{ opacity: 0, y: 16, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 0.6 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={reduce ? undefined : { y: -3, scale: 1.04 }}
                whileTap={reduce ? undefined : { scale: 0.96 }}
                className={`group relative flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 transition-all duration-300 sm:gap-1.5 sm:px-5 sm:py-3.5 ${
                  isActive
                    ? 'border-white/20 bg-white/[0.07] text-white shadow-[0_4px_24px_-8px_rgba(255,255,255,0.18)]'
                    : 'border-white/[0.07] bg-white/[0.02] text-white/45 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/75'
                }`}
              >
                {/* active top bar */}
                {isActive && (
                  <motion.span
                    layoutId="quickNavTopBar"
                    className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-gradient-to-r from-white/20 via-white/50 to-white/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-xl border transition-all duration-300 sm:h-8 sm:w-8 ${
                    isActive
                      ? 'border-white/20 bg-white/[0.1] text-white'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/50 group-hover:border-white/15 group-hover:text-white/70'
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>

                <span className="font-orbitron text-[9px] font-bold uppercase tracking-[0.15em] sm:text-[10px] sm:tracking-[0.18em]">
                  {label}
                </span>

                <span className={`hidden font-inter text-[10px] transition-colors duration-200 sm:block ${isActive ? 'text-white/40' : 'text-white/25 group-hover:text-white/35'}`}>
                  {kicker}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom separator */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7, ease: 'easeOut' }}
        className="mt-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />
    </motion.div>
  );
};

/* ═══════════ HERO ═══════════ */

const Hero: React.FC = () => {
  const { profile } = CV;

  const contactItems = useMemo(
    () => [
      { icon: MapPin, label: profile.contact.location, href: undefined },
      { icon: Mail, label: profile.contact.email, href: `mailto:${profile.contact.email}` },
      { icon: Phone, label: profile.contact.phone, href: `tel:${profile.contact.phone.replace(/\s/g, '')}` },
      { icon: Globe, label: profile.contact.website, href: `https://${profile.contact.website}` },
      { icon: Github, label: profile.contact.github, href: `https://${profile.contact.github}` },
      { icon: Linkedin, label: profile.contact.linkedin, href: `https://${profile.contact.linkedin}` },
    ],
    [profile.contact],
  );

  return (
    <motion.header
      id="hero"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-60 w-60 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 h-60 w-60 rounded-full bg-sky-400/10 blur-3xl" />
        </div>

        <div className="relative">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </span>
            <span className="font-orbitron text-[9px] uppercase tracking-[0.3em] text-white/60">
              Interactive CV · 2026
            </span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-5 font-orbitron text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-2 font-rajdhani text-base font-medium tracking-wide text-white/70 sm:text-lg md:text-xl"
          >
            {profile.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 max-w-2xl font-inter text-sm leading-relaxed text-white/60 sm:text-[15px]"
          >
            {profile.summary}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {contactItems.map(({ icon: Icon, label, href }) => {
              const content = (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white">
                  <Icon className="h-3 w-3 text-white/50" />
                  <span className="font-inter">{label}</span>
                </span>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </motion.header>
  );
};

/* ═══════════ TIMELINE ═══════════ */

interface TimelineItemProps {
  exp: CVExperience;
  index: number;
  expanded: boolean;
  shouldScroll: boolean;
  onToggle: (id: string) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = React.memo(({ exp, index, expanded, shouldScroll, onToggle }) => {
  const accent = ACCENTS[exp.accent];
  const itemRef = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (shouldScroll && itemRef.current && !reduce) {
      const timer = setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [shouldScroll, reduce]);

  return (
    <motion.li
      ref={itemRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.25), ease: 'easeOut' }}
      className="relative pl-10 sm:pl-14"
    >
      {/* Node dot */}
      <motion.span
        className={`absolute left-[10px] top-5 z-10 h-3 w-3 rounded-full ring-4 sm:left-[18px] ${accent.dot} ${accent.dotRing}`}
        animate={expanded ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        aria-hidden
      />
      <span className={`absolute left-[14px] top-9 bottom-0 w-px bg-gradient-to-b ${accent.line} to-transparent sm:left-[22px]`} aria-hidden />

      <motion.button
        type="button"
        onClick={() => onToggle(exp.id)}
        aria-expanded={expanded}
        aria-controls={`exp-panel-${exp.id}`}
        whileTap={reduce ? undefined : { scale: 0.995 }}
        className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:p-6 ${
          expanded ? `${accent.glow} border-white/15` : ''
        }`}
      >
        {/* shimmer line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* expanded top accent */}
        {expanded && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accent.line} to-transparent origin-left`}
          />
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={`font-orbitron text-[10px] uppercase tracking-[0.25em] ${accent.label}`}>{exp.period}</div>
            <h3 className="mt-1.5 font-orbitron text-base font-bold text-white sm:text-lg">
              {exp.role}
            </h3>
            <div className="mt-0.5 font-rajdhani text-sm font-medium text-white/70 sm:text-base">
              {exp.company}
              {exp.client && (
                <span className="text-white/40"> · Client: <span className="text-white/70">{exp.client}</span></span>
              )}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-white/40">
              <MapPin className="h-3 w-3" />
              <span className="font-inter">{exp.location}</span>
            </div>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              expanded ? `border-white/20 bg-white/[0.08] ${accent.label}` : 'border-white/10 bg-white/[0.04] text-white/60'
            }`}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </div>

        <p className="mt-3 font-inter text-sm leading-relaxed text-white/65">{exp.summary}</p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={`exp-panel-${exp.id}`}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {exp.contextNote && (
                  <p className="mb-3 font-inter text-[12px] italic text-white/45">
                    {exp.contextNote}
                  </p>
                )}

                {exp.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {exp.bullets.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="flex items-start gap-2 font-inter text-[13px] leading-relaxed text-white/75"
                      >
                        <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent.dot}`} aria-hidden />
                        <span>{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {exp.subRoles && exp.subRoles.length > 0 && (
                  <div className="mt-5 space-y-4">
                    {exp.subRoles.map((sr, srIdx) => (
                      <motion.div
                        key={sr.client}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: srIdx * 0.07 + 0.1 }}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/85">
                            Client · {sr.client}
                          </div>
                          <div className={`font-orbitron text-[10px] uppercase tracking-[0.2em] ${accent.label}`}>
                            {sr.period}
                          </div>
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {sr.bullets.map((b, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.28, delay: i * 0.04 + 0.15 }}
                              className="flex items-start gap-2 font-inter text-[12.5px] leading-relaxed text-white/70"
                            >
                              <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent.dot}`} aria-hidden />
                              <span>{b}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                )}

                {exp.stack.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-5"
                  >
                    <div className="mb-2 font-orbitron text-[9px] uppercase tracking-[0.3em] text-white/35">
                      Tech stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.stack.map((t, i) => (
                        <motion.span
                          key={t}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.22, delay: i * 0.025 + 0.25 }}
                          className={`rounded-full border px-2.5 py-1 font-inter text-[11px] ${accent.chip} ${accent.chipBorder}`}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.li>
  );
});
TimelineItem.displayName = 'TimelineItem';

const Timeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(CV.experiences[0]?.id ?? null);
  const [lastToggledId, setLastToggledId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setLastToggledId(id);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <ol className="relative space-y-5 sm:space-y-6">
      {CV.experiences.map((exp, i) => (
        <TimelineItem
          key={exp.id}
          exp={exp}
          index={i}
          expanded={expandedId === exp.id}
          shouldScroll={lastToggledId === exp.id && expandedId === exp.id}
          onToggle={handleToggle}
        />
      ))}
    </ol>
  );
};

/* ═══════════ SKILLS ═══════════ */

const Skills: React.FC = () => (
  <div className="grid gap-3 sm:grid-cols-2">
    {CV.skills.map((group, idx) => {
      const colors = SKILL_COLORS[group.label] ?? DEFAULT_SKILL_COLOR;
      return (
        <motion.div
          key={group.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.2), ease: 'easeOut' }}
          className={`group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 sm:p-5 ${colors.cardBg} ${colors.cardBorder} ${colors.hoverBorder} ${colors.hoverBg} ${colors.glow}`}
        >
          {/* soft gradient overlay */}
          <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${colors.gradient} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

          <div className={`relative font-orbitron text-[10px] uppercase tracking-[0.3em] ${colors.labelColor}`}>
            {group.label}
          </div>
          <div className="relative mt-3 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className={`rounded-full border px-2.5 py-1 font-inter text-[11.5px] transition-all duration-200 ${colors.chipBg} ${colors.chipBorder} ${colors.chipText} ${colors.chipHover}`}
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      );
    })}
  </div>
);

/* ═══════════ EDUCATION ═══════════ */

const Education: React.FC = () => (
  <div className="space-y-3">
    {CV.education.map((ed, i) => (
      <motion.div
        key={ed.id}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.2) }}
        className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05] sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="min-w-0">
          <div className="font-orbitron text-sm font-bold text-white sm:text-base">{ed.degree}</div>
          <div className="mt-0.5 font-rajdhani text-sm text-white/60">{ed.institution}</div>
          {ed.honors && (
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-200/80">
              <Award className="h-3 w-3" />
              <span className="font-inter">{ed.honors}</span>
            </div>
          )}
        </div>
        <div className="mt-2 font-orbitron text-[10px] uppercase tracking-[0.25em] text-white/45 sm:mt-0 sm:ml-4">
          {ed.period}
        </div>
      </motion.div>
    ))}
  </div>
);

/* ═══════════ PROJECTS ═══════════ */

const Projects: React.FC = () => (
  <div className="space-y-3">
    {CV.projects.map((p, i) => (
      <motion.article
        key={p.name}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.2) }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="font-orbitron text-base font-bold text-white sm:text-lg">{p.name}</div>
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 font-inter text-xs text-sky-200/80 transition-colors hover:text-sky-200"
              >
                <Globe className="h-3 w-3" />
                {p.url.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <Rocket className="h-4 w-4 text-white/30" />
        </div>
        <p className="mt-3 font-inter text-sm leading-relaxed text-white/70">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-inter text-[11px] text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07]"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.article>
    ))}
  </div>
);

/* ═══════════ FOOTER INFO ═══════════ */

const AdditionalInfo: React.FC = () => (
  <div className="grid gap-3 md:grid-cols-3">
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-2 text-white/50">
        <Languages className="h-3.5 w-3.5" />
        <span className="font-orbitron text-[10px] uppercase tracking-[0.3em]">Languages</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {CV.languages.map((l) => (
          <li key={l.label} className="flex items-center justify-between font-inter text-[13px] text-white/75">
            <span>{l.label}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-orbitron text-[9px] uppercase tracking-widest text-white/40">{l.level}</span>
          </li>
        ))}
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-2 text-white/50">
        <Award className="h-3.5 w-3.5" />
        <span className="font-orbitron text-[10px] uppercase tracking-[0.3em]">Certifications</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {CV.certifications.map((c) => (
          <li key={c} className="flex items-start gap-2 font-inter text-[13px] text-white/75">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" aria-hidden />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-2 text-white/50">
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-orbitron text-[10px] uppercase tracking-[0.3em]">Interests</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {CV.interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-inter text-[11.5px] text-white/75 transition-all hover:border-white/20 hover:bg-white/[0.07]"
          >
            {interest}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

/* ═══════════ PAGE ═══════════ */

const CVPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('experience');
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topBarHeight = 56;
      const y = el.getBoundingClientRect().top + window.scrollY - topBarHeight - 24;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    heroObserver.observe(heroEl);

    const sectionIds = NAV_SECTIONS.map((s) => s.id);
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: 0.25, rootMargin: '-10% 0px -50% 0px' },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      heroObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full text-white">
      <AmbientBackground />
      <FloatingNav active={activeSection} visible={navVisible} onNavigate={scrollToSection} />

      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-[#060812]/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-orbitron text-[10px] font-bold uppercase tracking-[0.25em]">Home</span>
          </Link>

          {/* Mobile section pills */}
          <div className="flex items-center gap-1 lg:hidden">
            {NAV_SECTIONS.slice(0, 4).map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                aria-label={id}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${
                  activeSection === id
                    ? 'bg-white/[0.1] text-white'
                    : 'text-white/35 hover:bg-white/[0.06] hover:text-white/60'
                }`}
              >
                <Icon className="h-3 w-3" />
              </button>
            ))}
          </div>

          <a
            href="/Fares_KHIARY_EN.pdf"
            download="Fares_KHIARY_EN.pdf"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-orbitron text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            Download CV
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 md:px-8 md:pt-12">
        <Hero />
        <SectionQuickNav active={activeSection} onNavigate={scrollToSection} />

        <section id="experience" className="mt-14 md:mt-20">
          <SectionHeader
            kicker="Career"
            title="Professional Experience"
            icon={<Briefcase className="h-3.5 w-3.5" />}
          />
          <Timeline />
        </section>

        <section id="skills" className="mt-14 md:mt-20">
          <SectionHeader
            kicker="Toolbox"
            title="Technical Skills"
            icon={<Sparkles className="h-3.5 w-3.5" />}
          />
          <Skills />
        </section>

        <section id="education" className="mt-14 md:mt-20">
          <SectionHeader
            kicker="Foundations"
            title="Education"
            icon={<GraduationCap className="h-3.5 w-3.5" />}
          />
          <Education />
        </section>

        <section id="projects" className="mt-14 md:mt-20">
          <SectionHeader
            kicker="Highlights"
            title="Selected Projects"
            icon={<Rocket className="h-3.5 w-3.5" />}
          />
          <Projects />
        </section>

        <section id="additional" className="mt-14 md:mt-20">
          <SectionHeader
            kicker="More"
            title="Languages, Certifications & Interests"
            icon={<Award className="h-3.5 w-3.5" />}
          />
          <AdditionalInfo />
        </section>

        <footer className="mt-16 border-t border-white/5 pt-6 text-center">
          <p className="font-inter text-xs text-white/35">
            Crafted with care · © {new Date().getFullYear()} {CV.profile.name.split(' ')[0]}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default CVPage;
