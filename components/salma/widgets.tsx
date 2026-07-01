import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Clock, MapPin, Wind, Droplets, Timer as TimerIcon, Play, Pause, RotateCcw, Sparkles,
  Sun, CloudSun, Cloudy, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning,
  Coffee, Brain,
} from 'lucide-react';
import Tile from './Tile';
import { Heart } from './icons';

/* ===================================================================
   Live clock — Paris time + full French date
   =================================================================== */

export const LiveClock: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris',
      }).format(now),
    [now],
  );
  const dateStr = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris',
      }).format(now),
    [now],
  );

  return (
    <Tile title="Heure de Paris" icon={<Clock size={18} />} accent="var(--color-rose)" delay={delay} tilt>
      <div className="flex flex-col items-center py-1">
        <div className="font-quicksand text-[2.7rem] font-bold leading-none tracking-tight text-slate-800 tabular-nums">
          {time}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[0.8rem] capitalize text-slate-500">
          <MapPin size={13} className="text-rose-400" />
          {dateStr}
        </div>
      </div>
    </Tile>
  );
};

/* ===================================================================
   Weather — La Défense, Paris (live, via Open-Meteo, with fallback)
   =================================================================== */

interface WeatherState {
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  code: number;
  source: 'live' | 'estimate';
}

const WMO: { match: (c: number) => boolean; label: string; Icon: React.ComponentType<{ size?: number; className?: string }>; }[] = [
  { match: (c) => c === 0 || c === 1, label: 'Ciel dégagé', Icon: Sun },
  { match: (c) => c === 2, label: 'Éclaircies', Icon: CloudSun },
  { match: (c) => c === 3, label: 'Couvert', Icon: Cloudy },
  { match: (c) => c === 45 || c === 48, label: 'Brouillard', Icon: CloudFog },
  { match: (c) => c >= 51 && c <= 57, label: 'Bruine', Icon: CloudDrizzle },
  { match: (c) => (c >= 61 && c <= 67) || (c >= 80 && c <= 82), label: 'Pluie', Icon: CloudRain },
  { match: (c) => (c >= 71 && c <= 77) || c === 85 || c === 86, label: 'Neige', Icon: CloudSnow },
  { match: (c) => c >= 95, label: 'Orage', Icon: CloudLightning },
];

function describe(code: number) {
  return WMO.find((w) => w.match(code)) ?? { label: 'Temps doux', Icon: CloudSun };
}

// Approx. monthly average high for Paris — used only if the live call fails.
const PARIS_MONTHLY = [7, 8, 12, 16, 20, 23, 25, 25, 21, 16, 11, 8];

export const WeatherWidget: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [data, setData] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fallback = (): WeatherState => ({
      temp: PARIS_MONTHLY[new Date().getMonth()],
      feels: PARIS_MONTHLY[new Date().getMonth()] - 1,
      humidity: 62,
      wind: 12,
      code: 2,
      source: 'estimate',
    });

    const load = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=48.8918&longitude=2.2389&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Europe%2FParis',
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error('weather http');
        const json = await res.json();
        const c = json.current;
        if (!alive) return;
        setData({
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          humidity: Math.round(c.relative_humidity_2m),
          wind: Math.round(c.wind_speed_10m),
          code: c.weather_code,
          source: 'live',
        });
      } catch {
        if (alive) setData(fallback());
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    const id = window.setInterval(load, 10 * 60 * 1000);
    return () => {
      alive = false;
      controller.abort();
      window.clearInterval(id);
    };
  }, []);

  const info = data ? describe(data.code) : null;

  return (
    <Tile title="La Défense" subtitle="Paris · La Défense" icon={<MapPin size={18} />} accent="var(--color-socotec)" delay={delay} tilt>
      {loading || !data || !info ? (
        <div className="flex animate-pulse flex-col gap-2 py-2">
          <div className="h-10 w-24 rounded-xl bg-rose-100/70" />
          <div className="h-3 w-32 rounded-full bg-rose-100/70" />
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3">
            <info.Icon size={44} className="text-socotec" />
            <div>
              <div className="font-quicksand text-[2.4rem] font-bold leading-none text-slate-800 tabular-nums">
                {data.temp}°<span className="text-[1.3rem] align-top">C</span>
              </div>
              <div className="text-[0.8rem] text-slate-500">{info.label}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[0.72rem] text-slate-600">
            <div className="rounded-xl bg-white/60 py-1.5">
              <div className="font-semibold text-slate-700 tabular-nums">{data.feels}°</div>
              <div className="text-slate-400">ressenti</div>
            </div>
            <div className="rounded-xl bg-white/60 py-1.5">
              <div className="flex items-center justify-center gap-1 font-semibold text-slate-700 tabular-nums">
                <Droplets size={12} className="text-sky-400" />{data.humidity}%
              </div>
              <div className="text-slate-400">humidité</div>
            </div>
            <div className="rounded-xl bg-white/60 py-1.5">
              <div className="flex items-center justify-center gap-1 font-semibold text-slate-700 tabular-nums">
                <Wind size={12} className="text-teal-400" />{data.wind}
              </div>
              <div className="text-slate-400">km/h</div>
            </div>
          </div>
          <div className="mt-2 text-right text-[0.62rem] text-slate-400">
            {data.source === 'live' ? '● en direct' : '○ estimation hors-ligne'}
          </div>
        </div>
      )}
    </Tile>
  );
};

/* ===================================================================
   Encouragement — sweet rotating words just for Salma
   =================================================================== */

const SWEET_WORDS = [
  'Salma, tu es brillante. Le monde a de la chance de t’avoir. 🌸',
  'Respire. Tu fais déjà un travail incroyable aujourd’hui. ☕',
  'Ton intelligence et ta douceur changent les choses, vraiment. ✨',
  'Chaque bâtiment plus durable, c’est un peu grâce à toi. 🌍',
  'Tu es plus forte que la pile de mails qui t’attend. 💪',
  'Petit rappel : tu es exactement là où tu dois être. 💗',
  'Un café, un sourire, et tu vas tout déchirer. 🐱',
  'Sois fière de toi : hier encore tu rêvais d’être ici. 🌟',
  'Tu mérites une pause autant que tu mérites une médaille. 🏅',
  'Salma, ta gentillesse est un super-pouvoir. Continue. 💖',
  'Avance à ton rythme — tu es déjà extraordinaire. 🦋',
  'Le climat change, mais ta détermination, jamais. 🌱',
];

export const EncouragementCard: React.FC<{ delay?: number; className?: string }> = ({ delay = 0, className = '' }) => {
  const [i, setI] = useState(() => Math.floor(Math.random() * SWEET_WORDS.length));
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % SWEET_WORDS.length), 11000);
    return () => window.clearInterval(id);
  }, [reduce]);

  const next = () => setI((p) => (p + 1 + Math.floor(Math.random() * (SWEET_WORDS.length - 1))) % SWEET_WORDS.length);

  return (
    <Tile
      title="Petit mot doux"
      icon={<Heart size={16} fill="#fff" />}
      accent="var(--color-roseDeep)"
      delay={delay}
      className={`overflow-hidden ${className}`}
    >
      <div className="relative min-h-[88px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className="font-quicksand text-[1.05rem] font-medium leading-relaxed text-slate-700"
          >
            {SWEET_WORDS[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        onClick={next}
        aria-label="Afficher un autre mot doux"
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-1.5 text-[0.78rem] font-semibold text-rose-600 transition hover:bg-rose-500/20"
      >
        <Sparkles size={14} /> Encore un mot doux
      </button>
    </Tile>
  );
};

/* ===================================================================
   Pomodoro — a gentle focus timer for productive, kind days
   =================================================================== */

const FOCUS_MIN = 25;
const BREAK_MIN = 5;

export const PomodoroTimer: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState(0);
  const tickRef = useRef<number | null>(null);

  const total = (mode === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60;

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // session complete → switch mode
          setMode((m) => (m === 'focus' ? 'break' : 'focus'));
          setRunning(false);
          setRounds((r) => (mode === 'focus' ? r + 1 : r));
          return (mode === 'focus' ? BREAK_MIN : FOCUS_MIN) * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(total);
  };

  const switchMode = (m: 'focus' | 'break') => {
    setMode(m);
    setRunning(false);
    setSecondsLeft((m === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const progress = 1 - secondsLeft / total;

  const R = 64;
  const C = 2 * Math.PI * R;
  const accent = mode === 'focus' ? '#e84a7f' : '#2dd4bf';

  return (
    <Tile title="Focus" subtitle={`${rounds} session${rounds > 1 ? 's' : ''} accomplie${rounds > 1 ? 's' : ''}`} icon={<TimerIcon size={18} />} accent="var(--color-roseDeep)" delay={delay} tilt>
      <div className="flex flex-col items-center">
        <div className="mb-3 flex rounded-full bg-white/60 p-1 text-[0.72rem] font-semibold">
          <button
            onClick={() => switchMode('focus')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${mode === 'focus' ? 'bg-rose-500 text-white shadow' : 'text-slate-500'}`}
          >
            <Brain size={13} /> Concentration
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${mode === 'break' ? 'bg-teal-500 text-white shadow' : 'text-slate-500'}`}
          >
            <Coffee size={13} /> Pause
          </button>
        </div>

        <div className="relative grid place-items-center">
          <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(232,74,127,0.12)" strokeWidth="11" />
            <motion.circle
              cx="80" cy="80" r={R} fill="none" stroke={accent} strokeWidth="11" strokeLinecap="round"
              strokeDasharray={C}
              animate={{ strokeDashoffset: C * (1 - progress) }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-quicksand text-[2.3rem] font-bold leading-none text-slate-800 tabular-nums">
              {mm}:{ss}
            </span>
            <span className="text-[0.7rem] text-slate-400">{mode === 'focus' ? 'au travail 🌸' : 'repose-toi 🍵'}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? 'Mettre en pause' : 'Démarrer le minuteur'}
            className="grid h-12 w-12 place-items-center rounded-full text-white shadow-lg transition active:scale-95"
            style={{ background: accent }}
          >
            {running ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
          </button>
          <button
            onClick={reset}
            aria-label="Réinitialiser le minuteur"
            className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-slate-500 shadow transition hover:text-rose-500 active:scale-95"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </Tile>
  );
};
