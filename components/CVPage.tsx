import React, { useState, useMemo, useCallback } from 'react';
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
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="mb-6 md:mb-10"
  >
    <div className="flex items-center gap-2 text-white/40">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60">
        {icon}
      </span>
      <span className="font-orbitron text-[9px] uppercase tracking-[0.35em]">{kicker}</span>
    </div>
    <h2 className="mt-3 font-orbitron text-xl font-black tracking-tight text-white/90 sm:text-2xl md:text-3xl">
      {title}
    </h2>
    <div className="mt-4 h-px w-16 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
  </motion.div>
);

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
  onToggle: (id: string) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = React.memo(({ exp, index, expanded, onToggle }) => {
  const accent = ACCENTS[exp.accent];

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.25), ease: 'easeOut' }}
      className="relative pl-10 sm:pl-14"
    >
      {/* Node dot */}
      <span
        className={`absolute left-[10px] top-5 z-10 h-3 w-3 rounded-full ring-4 sm:left-[18px] ${accent.dot} ${accent.dotRing}`}
        aria-hidden
      />
      <span className={`absolute left-[14px] top-9 bottom-0 w-px bg-gradient-to-b ${accent.line} to-transparent sm:left-[22px]`} aria-hidden />

      <button
        type="button"
        onClick={() => onToggle(exp.id)}
        aria-expanded={expanded}
        aria-controls={`exp-panel-${exp.id}`}
        className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:p-6 ${
          expanded ? accent.glow : ''
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
            transition={{ duration: 0.25 }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60"
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
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                      <li key={i} className="flex items-start gap-2 font-inter text-[13px] leading-relaxed text-white/75">
                        <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent.dot}`} aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.subRoles && exp.subRoles.length > 0 && (
                  <div className="mt-5 space-y-4">
                    {exp.subRoles.map((sr) => (
                      <div
                        key={sr.client}
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
                            <li key={i} className="flex items-start gap-2 font-inter text-[12.5px] leading-relaxed text-white/70">
                              <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent.dot}`} aria-hidden />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {exp.stack.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 font-orbitron text-[9px] uppercase tracking-[0.3em] text-white/35">
                      Tech stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.stack.map((t) => (
                        <span
                          key={t}
                          className={`rounded-full border px-2.5 py-1 font-inter text-[11px] ${accent.chip} ${accent.chipBorder}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
});
TimelineItem.displayName = 'TimelineItem';

const Timeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(CV.experiences[0]?.id ?? null);

  const handleToggle = useCallback((id: string) => {
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
          onToggle={handleToggle}
        />
      ))}
    </ol>
  );
};

/* ═══════════ SKILLS ═══════════ */

const Skills: React.FC = () => (
  <div className="grid gap-3 sm:grid-cols-2">
    {CV.skills.map((group, idx) => (
      <motion.div
        key={group.label}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.2), ease: 'easeOut' }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.05] sm:p-5"
      >
        <div className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-white/50">
          {group.label}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {group.items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-inter text-[11.5px] text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    ))}
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
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-400/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
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
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-inter text-[11px] text-white/75"
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
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 text-white/50">
        <Languages className="h-3.5 w-3.5" />
        <span className="font-orbitron text-[10px] uppercase tracking-[0.3em]">Languages</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {CV.languages.map((l) => (
          <li key={l.label} className="flex items-center justify-between font-inter text-[13px] text-white/75">
            <span>{l.label}</span>
            <span className="text-[11px] text-white/40">{l.level}</span>
          </li>
        ))}
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
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
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 text-white/50">
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-orbitron text-[10px] uppercase tracking-[0.3em]">Interests</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {CV.interests.map((i) => (
          <span
            key={i}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-inter text-[11.5px] text-white/75"
          >
            {i}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

/* ═══════════ PAGE ═══════════ */

const CVPage: React.FC = () => {
  return (
    <div className="relative min-h-[100dvh] w-full text-white">
      <AmbientBackground />

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
          <a
            href="/"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-orbitron text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
            onClick={(e) => {
              e.preventDefault();
              window.print();
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Print
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 md:px-8 md:pt-12">
        <Hero />

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
