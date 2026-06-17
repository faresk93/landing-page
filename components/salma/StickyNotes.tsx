import React, { useEffect, useRef, useState } from 'react';
import { motion, useDragControls, useMotionValue, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, GripHorizontal } from 'lucide-react';
import { Cat, Paw } from './icons';

/* ------------------------------------------------------------------ */

interface Note {
  id: string;
  text: string;
  color: number;
  x: number;
  y: number;
  done: boolean;
  rotate: number;
}

const COLORS = [
  { bg: '#FFE99A', edge: '#F4D35E', tape: 'rgba(244,211,94,0.6)' },   // sunshine
  { bg: '#FFC4DD', edge: '#FF9BC4', tape: 'rgba(255,155,196,0.6)' },  // rose
  { bg: '#BFF2D8', edge: '#86E0B3', tape: 'rgba(134,224,179,0.6)' },  // mint
  { bg: '#DDD2FF', edge: '#BCA9F5', tape: 'rgba(188,169,245,0.6)' },  // lavender
  { bg: '#FFD4B8', edge: '#FFB088', tape: 'rgba(255,176,136,0.6)' },  // peach
  { bg: '#BFE6FF', edge: '#8FD0F5', tape: 'rgba(143,208,245,0.6)' },  // sky
];

const STORAGE_KEY = 'salma-sticky-notes-v2';

const DEFAULT_NOTES: Note[] = [
  { id: 'n1', text: 'Bienvenue Salma 💛\nÉcris ici tes tâches du jour.', color: 0, x: 18, y: 16, done: false, rotate: -3 },
  { id: 'n2', text: 'Glisse-moi où tu veux\n(attrape la barre du haut)', color: 1, x: 200, y: 40, done: false, rotate: 2 },
  { id: 'n3', text: 'Coche-moi quand c’est fait ✅', color: 2, x: 96, y: 168, done: false, rotate: 4 },
];

function load(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_NOTES;
}

/* ------------------------------------------------------------------ */

interface NoteCardProps {
  note: Note;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onChange: (id: string, patch: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, boardRef, onChange, onDelete }) => {
  const controls = useDragControls();
  const x = useMotionValue(note.x);
  const y = useMotionValue(note.y);
  const c = COLORS[note.color % COLORS.length];

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={controls}
      dragConstraints={boardRef}
      dragElastic={0.08}
      dragMomentum={false}
      onDragEnd={() => onChange(note.id, { x: x.get(), y: y.get() })}
      whileDrag={{ scale: 1.06, zIndex: 50, boxShadow: '0 22px 40px -12px rgba(0,0,0,0.35)' }}
      style={{ x, y, rotate: note.rotate, background: c.bg, borderColor: c.edge }}
      className="salma-draggable absolute w-[150px] rounded-xl border-2 p-2 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
    >
      {/* little tape */}
      <div
        className="absolute -top-2 left-1/2 h-3.5 w-12 -translate-x-1/2 rounded-[2px]"
        style={{ background: c.tape }}
      />
      {/* drag handle */}
      <div
        onPointerDown={(e) => controls.start(e)}
        className="-mx-1 mb-1 flex cursor-grab items-center justify-between rounded-md px-1 py-0.5 active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <GripHorizontal size={15} className="text-black/30" />
        <button
          onClick={() => onChange(note.id, { done: !note.done })}
          aria-label={note.done ? 'Marquer à faire' : 'Marquer comme fait'}
          className="grid h-5 w-5 place-items-center rounded-md border border-black/20 bg-white/50 transition hover:bg-white/80"
        >
          {note.done && <Check size={13} className="text-emerald-600" />}
        </button>
        <button
          onClick={() => onDelete(note.id)}
          aria-label="Supprimer la note"
          className="grid h-5 w-5 place-items-center rounded-md text-black/30 transition hover:bg-black/10 hover:text-rose-600"
        >
          <X size={14} />
        </button>
      </div>
      <textarea
        value={note.text}
        onChange={(e) => onChange(note.id, { text: e.target.value })}
        rows={4}
        spellCheck={false}
        className={`w-full resize-none border-none bg-transparent font-quicksand text-[0.82rem] font-medium leading-snug text-[#42323d] outline-none placeholder:text-black/30 ${
          note.done ? 'line-through opacity-50' : ''
        }`}
        placeholder="Écris ta tâche…"
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */

const StickyNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(load);
  const boardRef = useRef<HTMLDivElement>(null);
  const colorCursor = useRef(notes.length);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch { /* ignore quota */ }
  }, [notes]);

  const updateNote = (id: string, patch: Partial<Note>) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));

  const deleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const addNote = () => {
    const color = colorCursor.current++ % COLORS.length;
    const offset = (notes.length % 6) * 14;
    const note: Note = {
      id: `n${Date.now()}`,
      text: '',
      color,
      x: 24 + offset,
      y: 18 + offset,
      done: false,
      rotate: Math.random() * 8 - 4,
    };
    setNotes((prev) => [...prev, note]);
  };

  const remaining = notes.filter((n) => !n.done).length;

  return (
    <div className="relative flex h-full flex-col rounded-[26px] border border-white/70 bg-white/70 p-5 shadow-[0_18px_40px_-20px_rgba(232,74,127,0.45)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-amber-400 text-white shadow-sm">
            <Paw size={18} />
          </span>
          <div>
            <h3 className="font-quicksand text-[0.95rem] font-bold tracking-wide text-slate-700">
              Tableau de notes
            </h3>
            <p className="text-[0.72rem] text-slate-500">
              {remaining > 0 ? `${remaining} tâche${remaining > 1 ? 's' : ''} à faire` : 'Tout est fait, bravo ! 🎉'}
            </p>
          </div>
        </div>
        <button
          onClick={addNote}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3.5 py-2 text-[0.78rem] font-semibold text-white shadow-md transition hover:bg-rose-600 active:scale-95"
        >
          <Plus size={15} /> Note
        </button>
      </div>

      <div
        ref={boardRef}
        className="relative flex-1 overflow-hidden rounded-2xl border border-dashed border-rose-200"
        style={{
          minHeight: 340,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(232,74,127,0.10) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      >
        <AnimatePresence>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} boardRef={boardRef} onChange={updateNote} onDelete={deleteNote} />
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center text-slate-400">
            <div>
              <p className="font-quicksand text-sm">Aucune note pour l’instant</p>
              <p className="text-[0.72rem]">Clique sur « Note » pour commencer 🐾</p>
            </div>
          </div>
        )}

        {/* peeking cat in the corner */}
        <motion.div
          className="pointer-events-none absolute bottom-1 right-2 opacity-90"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cat variant="white" size={52} />
        </motion.div>
      </div>
    </div>
  );
};

export default StickyNotes;
