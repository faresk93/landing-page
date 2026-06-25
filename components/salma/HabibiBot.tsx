import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Send, X, Loader2 } from 'lucide-react';
import { askHabibi } from '../../services/salmaChatService';
import { sanitizeInput, checkRateLimit } from '../../utils/security';
import { Heart, Sparkle } from './icons';

/* ------------------------------------------------------------------ */

interface Msg { id: string; role: 'user' | 'bot'; text: string; }

const GREETING =
  'Coucou ma Salma 🌹 C’est moi, ton Habibi — enfin, ma petite version IA, soufflée à l’oreille par Fares. ' +
  'Demande-moi ce que tu veux : une idée, un coup de main pour le boulot, une recette, ou juste un câlin en mots. Je suis tout à toi. 💖';

const SUGGESTIONS = [
  'Donne-moi du courage pour aujourd’hui 💪',
  'Aide-moi à organiser ma journée',
  'Dis-moi quelque chose de mignon 🥰',
  'Une idée de pause déjeuner ?',
];

/* A gentle typewriter for the bot replies. */
const Typing: React.FC<{ text: string; onTick?: () => void }> = ({ text, onTick }) => {
  const [shown, setShown] = useState('');
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setShown(text); return; }
    setShown('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      onTick?.();
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span>{shown}</span>;
};

/* ------------------------------------------------------------------ */

const HabibiBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 'init', role: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const scrollToEnd = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };
  useEffect(scrollToEnd, [messages, loading, open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;

    if (!checkRateLimit('salma_habibi', 30, 10 * 60 * 1000)) {
      setRateLimited(true);
      setTimeout(() => setRateLimited(false), 4000);
      return;
    }

    setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: 'user', text }]);
    setInput('');
    setLoading(true);

    const res = await askHabibi(sanitizeInput(text));
    setMessages((prev) => [...prev, { id: `b${Date.now()}`, role: 'bot', text: res.output }]);
    setLoading(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir Habibi, ton assistant amoureux"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: open ? 0 : 1, rotate: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="fixed bottom-5 right-5 z-[90] grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 text-white shadow-[0_12px_32px_-8px_rgba(232,74,127,0.8)]"
      >
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full bg-rose-400"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <Heart size={28} fill="#fff" />
        <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-white text-rose-500 shadow">
          <Sparkle size={13} className="text-amber-400" />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* dim backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[95] bg-rose-900/20 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              className="fixed bottom-0 right-0 z-[96] flex h-[78dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/70 bg-white/85 shadow-[0_-10px_50px_-12px_rgba(232,74,127,0.5)] backdrop-blur-2xl sm:bottom-5 sm:right-5 sm:h-[34rem] sm:w-[24rem] sm:rounded-[28px]"
            >
              {/* header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-rose-400 to-fuchsia-500 px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/20">
                    <Heart size={22} fill="#fff" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-rose-500 bg-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-quicksand text-[1.05rem] font-bold leading-tight">Habibi</h3>
                    <p className="font-quicksand text-[0.72rem] text-white/80">Ton Fares de poche · toujours là 💖</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
                >
                  <X size={18} />
                </button>
              </div>

              {/* messages */}
              <div
                ref={scrollRef}
                className="salma-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(232,74,127,0.07) 1px, transparent 0)',
                  backgroundSize: '20px 20px',
                }}
              >
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 font-quicksand text-[0.88rem] leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'rounded-br-md bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white'
                          : 'rounded-bl-md border border-rose-100 bg-white text-slate-700'
                      }`}
                    >
                      {m.role === 'bot' && m.id !== 'init' ? (
                        <Typing text={m.text} onTick={scrollToEnd} />
                      ) : (
                        m.text
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* suggestions, only at the very start */}
                {messages.length === 1 && !loading && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-rose-200 bg-white/70 px-3 py-1.5 font-quicksand text-[0.74rem] font-medium text-rose-600 transition hover:bg-rose-50 active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-rose-100 bg-white px-4 py-3 shadow-sm">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-rose-300"
                          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* input */}
              <form onSubmit={onSubmit} className="relative border-t border-rose-100 bg-white/70 p-3">
                {rateLimited && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500/90 px-3 py-1 font-quicksand text-[0.7rem] text-white shadow">
                    Doucement mon amour 🥰 reprends ton souffle un instant.
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écris à ton Habibi…"
                    disabled={loading}
                    className="min-w-0 flex-1 rounded-full border border-rose-200 bg-white px-4 py-2.5 font-quicksand text-[0.88rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-400"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Envoyer"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white shadow-md transition active:scale-95 disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HabibiBot;
