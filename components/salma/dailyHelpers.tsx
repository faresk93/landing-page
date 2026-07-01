import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2, Circle, Plus, X, Droplets, Wind, ListChecks,
} from 'lucide-react';
import Tile from './Tile';
import { Heart, Sparkle } from './icons';

/* ===================================================================
   Shared: a tiny "reset every day" localStorage helper
   =================================================================== */

const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

function useDailyState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = `salma-${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.day === todayKey()) return parsed.value as T;
      }
    } catch { /* ignore */ }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ day: todayKey(), value }));
    } catch { /* ignore quota */ }
  }, [storageKey, value]);

  return [value, setValue];
}

/* ===================================================================
   Daily checklist — "Ma to-do du jour"
   A gentle, satisfying task list that resets each morning.
   =================================================================== */

interface Task { id: string; text: string; done: boolean; }

const DEFAULT_TASKS: Task[] = [
  { id: 't1', text: 'Boire un grand verre d’eau 💧', done: false },
  { id: 't2', text: 'Répondre aux mails importants 📩', done: false },
  { id: 't3', text: 'Faire une vraie pause déjeuner 🍽️', done: false },
  { id: 't4', text: 'Sourire à Fares (au moins une fois) 😘', done: false },
];

export const DailyChecklist: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [tasks, setTasks] = useDailyState<Task[]>('daily-tasks', DEFAULT_TASKS);
  const [draft, setDraft] = useState('');

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: `t${Date.now()}`, text, done: false }]);
    setDraft('');
  };

  return (
    <Tile
      title="Ma to-do du jour"
      subtitle={allDone ? 'Tout est fait, bravo mon amour ! 🎉' : `${done}/${total} accomplies`}
      icon={<ListChecks size={18} />}
      accent="var(--color-roseDeep)"
      delay={delay}
    >
      {/* progress bar */}
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-rose-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-400"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <ul className="flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {tasks.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-rose-50/70"
            >
              <button
                onClick={() => toggle(t.id)}
                aria-label={t.done ? 'Marquer à faire' : 'Marquer comme fait'}
                className="shrink-0 text-rose-400 transition active:scale-90"
              >
                {t.done ? (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                ) : (
                  <Circle size={20} className="text-rose-300" />
                )}
              </button>
              <span
                className={`flex-1 font-quicksand text-[0.9rem] ${
                  t.done ? 'text-slate-400 line-through' : 'text-slate-700'
                }`}
              >
                {t.text}
              </span>
              <button
                onClick={() => remove(t.id)}
                aria-label="Supprimer la tâche"
                className="shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-500"
              >
                <X size={15} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <form onSubmit={add} className="mt-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ajouter une tâche…"
          className="min-w-0 flex-1 rounded-full border border-rose-200 bg-white/70 px-4 py-2 font-quicksand text-[0.85rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-400"
        />
        <button
          type="submit"
          aria-label="Ajouter"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-500 text-white shadow-md transition hover:bg-rose-600 active:scale-95"
        >
          <Plus size={17} />
        </button>
      </form>

      <AnimatePresence>
        {allDone && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 font-quicksand text-[0.82rem] font-semibold text-emerald-600"
          >
            <Sparkle size={14} className="text-amber-400" /> Journée maîtrisée, je suis fier de toi 💖
          </motion.p>
        )}
      </AnimatePresence>
    </Tile>
  );
};

/* ===================================================================
   Hydration tracker — "Pense à boire"
   Tap a glass when you drink. Resets every day.
   =================================================================== */

const GOAL = 8;

export const HydrationTracker: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [count, setCount] = useDailyState<number>('hydration', 0);
  const reduce = useReducedMotion();

  const set = (n: number) => setCount(Math.max(0, Math.min(GOAL, n)));
  const reached = count >= GOAL;

  return (
    <Tile
      title="Pense à boire"
      subtitle={reached ? 'Objectif atteint, championne ! 🏆' : `${count}/${GOAL} verres aujourd’hui`}
      icon={<Droplets size={18} />}
      accent="#38bdf8"
      delay={delay}
    >
      <div className="grid grid-cols-4 gap-2.5">
        {Array.from({ length: GOAL }).map((_, i) => {
          const filled = i < count;
          return (
            <button
              key={i}
              onClick={() => set(i + 1 === count ? count - 1 : i + 1)}
              aria-label={`Verre ${i + 1}`}
              className="group relative grid aspect-[3/4] place-items-end overflow-hidden rounded-xl border-2 border-sky-200 bg-white/60 transition active:scale-95"
            >
              <motion.div
                className="w-full bg-gradient-to-t from-sky-400 to-sky-300"
                initial={false}
                animate={{ height: filled ? '78%' : '0%' }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 22 }}
              />
              <Droplets
                size={16}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition ${
                  filled ? 'text-white' : 'text-sky-300 group-hover:text-sky-400'
                }`}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => set(count + 1)}
          className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-4 py-1.5 text-[0.8rem] font-semibold text-sky-600 transition hover:bg-sky-500/20"
        >
          <Plus size={14} /> Un verre
        </button>
        <span className="font-quicksand text-[0.72rem] text-slate-400">
          Reste hydratée, ya hayati 💙
        </span>
      </div>
    </Tile>
  );
};

/* ===================================================================
   Mood check-in — "Comment tu te sens ?"
   Salma taps a mood and gets a little loving word back from Fares.
   =================================================================== */

interface Mood { emoji: string; label: string; reply: string; color: string; }

const MOODS: Mood[] = [
  { emoji: '🥰', label: 'Heureuse', reply: 'Ton bonheur est ma plus belle réussite. Garde ce sourire, il illumine tout. 💖', color: '#f472b6' },
  { emoji: '😌', label: 'Sereine', reply: 'Cette paix te va si bien. Savoure ce moment calme, tu le mérites. 🌿', color: '#34d399' },
  { emoji: '😐', label: 'Comme ci', reply: 'Les journées « bof » existent aussi, et c’est ok. Je suis là, toujours. 🫶', color: '#fbbf24' },
  { emoji: '😣', label: 'Stressée', reply: 'Respire avec moi, doucement. Une chose à la fois — tu es plus forte que tu crois. 💪', color: '#fb923c' },
  { emoji: '🥺', label: 'Triste', reply: 'Viens là. Même de loin, je te serre fort dans mes bras. Ça va aller, je te le promets. 🤍', color: '#a78bfa' },
];

export const MoodCheckIn: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [picked, setPicked] = useDailyState<string | null>('mood', null);
  const current = MOODS.find((m) => m.label === picked) ?? null;

  return (
    <Tile
      title="Comment tu te sens ?"
      subtitle="Un petit mot de Fares t’attend 💌"
      icon={<Heart size={15} fill="#fff" />}
      accent="var(--color-rose)"
      delay={delay}
    >
      <div className="flex justify-between gap-1.5">
        {MOODS.map((m) => {
          const active = m.label === picked;
          return (
            <button
              key={m.label}
              onClick={() => setPicked(active ? null : m.label)}
              aria-label={m.label}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-2 transition active:scale-95 ${
                active ? 'border-transparent shadow-md' : 'border-transparent hover:bg-rose-50'
              }`}
              style={active ? { background: `${m.color}22`, borderColor: m.color } : undefined}
            >
              <motion.span
                className="text-2xl"
                animate={active ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {m.emoji}
              </motion.span>
              <span className="font-quicksand text-[0.62rem] font-semibold text-slate-500">{m.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mt-3 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3"
          >
            <p className="font-quicksand text-[0.88rem] font-medium leading-relaxed text-slate-700">
              {current.reply}
            </p>
            <p className="mt-1 text-right font-dancing text-lg text-roseDeep" style={{ color: 'var(--color-roseDeep)' }}>
              — Fares
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Tile>
  );
};

/* ===================================================================
   Breathing bubble — "Respire avec moi"
   A calming 4-7-8 style guided breath for stressful work moments.
   =================================================================== */

const PHASES = [
  { label: 'Inspire…', secs: 4, scale: 1.35 },
  { label: 'Retiens…', secs: 4, scale: 1.35 },
  { label: 'Expire…', secs: 6, scale: 0.85 },
] as const;

export const BreathingBubble: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [cycles, setCycles] = useState(0);
  const reduce = useReducedMotion();
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timeout.current = window.setTimeout(() => {
      setPhase((p) => {
        const next = (p + 1) % PHASES.length;
        if (next === 0) setCycles((c) => c + 1);
        return next;
      });
    }, PHASES[phase].secs * 1000);
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, [running, phase]);

  const toggle = () => {
    if (running) {
      setRunning(false);
      setPhase(0);
    } else {
      setCycles(0);
      setPhase(0);
      setRunning(true);
    }
  };

  const p = PHASES[phase];

  return (
    <Tile
      title="Respire avec moi"
      subtitle={running ? `${cycles} respiration${cycles > 1 ? 's' : ''} · ensemble` : 'Une pause douceur quand ça monte 🌸'}
      icon={<Wind size={18} />}
      accent="#2dd4bf"
      delay={delay}
    >
      <div className="flex flex-col items-center py-2">
        <div className="relative grid h-40 w-40 place-items-center">
          <motion.div
            className="absolute h-32 w-32 rounded-full bg-teal-300/30 blur-xl"
            animate={running && !reduce ? { scale: p.scale, opacity: 0.7 } : { scale: 1, opacity: 0.4 }}
            transition={{ duration: running ? p.secs : 0.5, ease: 'easeInOut' }}
          />
          <motion.div
            className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-teal-300 to-emerald-300 shadow-[0_10px_30px_-8px_rgba(45,212,191,0.7)]"
            animate={running && !reduce ? { scale: p.scale } : { scale: 1 }}
            transition={{ duration: running ? p.secs : 0.5, ease: 'easeInOut' }}
          >
            <span className="font-quicksand text-sm font-bold text-white">
              {running ? p.label : 'Prête ?'}
            </span>
          </motion.div>
        </div>

        <button
          onClick={toggle}
          className={`mt-4 rounded-full px-6 py-2 font-quicksand text-[0.85rem] font-semibold text-white shadow-md transition active:scale-95 ${
            running ? 'bg-slate-400 hover:bg-slate-500' : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {running ? 'Arrêter' : 'Commencer à respirer'}
        </button>
      </div>
    </Tile>
  );
};
