import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Gamepad2 } from 'lucide-react';
import Tile from './Tile';
import { Cat, Heart } from './icons';

type Cell = null | 'C' | 'B'; // C = white cat (Salma), B = black cat (AI)

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWin(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

const isFull = (b: Cell[]) => b.every((c) => c !== null);
const empties = (b: Cell[]) => b.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);

/** Friendly Newell-Simon strategy with a dash of randomness so Salma can win. */
function aiMove(board: Cell[]): number {
  const free = empties(board);
  if (free.length === 0) return -1;

  // 25% of the time, play kindly (random) — love > winning 💗
  if (Math.random() < 0.25) return free[Math.floor(Math.random() * free.length)];

  const tryWin = (who: Cell): number => {
    for (const [a, b, c] of LINES) {
      const line = [board[a], board[b], board[c]];
      const idx = [a, b, c];
      const mineCount = line.filter((v) => v === who).length;
      const emptyCount = line.filter((v) => v === null).length;
      if (mineCount === 2 && emptyCount === 1) return idx[line.indexOf(null)];
    }
    return -1;
  };

  let m = tryWin('B'); if (m >= 0) return m;   // win
  m = tryWin('C'); if (m >= 0) return m;        // block
  if (board[4] === null) return 4;              // center
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const sides = [1, 3, 5, 7].filter((i) => board[i] === null);
  return sides[Math.floor(Math.random() * sides.length)];
}

const Morpion: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'C' | 'B'>('C');
  const [score, setScore] = useState({ you: 0, cat: 0, draw: 0 });

  const result = getWin(board);
  const over = !!result || isFull(board);

  const status = result
    ? result.winner === 'C'
      ? 'Tu as gagné, Salma ! 🎉'
      : 'Le chat noir gagne 😼'
    : isFull(board)
      ? 'Match nul 🤝'
      : turn === 'C'
        ? 'À toi de jouer 🐱'
        : 'Le chat noir réfléchit…';

  // Tally the score once per finished game.
  useEffect(() => {
    if (result) {
      setScore((s) => (result.winner === 'C' ? { ...s, you: s.you + 1 } : { ...s, cat: s.cat + 1 }));
    } else if (isFull(board)) {
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  // AI turn.
  useEffect(() => {
    if (turn !== 'B' || over) return;
    const id = window.setTimeout(() => {
      setBoard((b) => {
        if (getWin(b) || isFull(b)) return b;
        const move = aiMove(b);
        if (move < 0) return b;
        const nb = [...b];
        nb[move] = 'B';
        return nb;
      });
      setTurn('C');
    }, 560);
    return () => window.clearTimeout(id);
  }, [turn, over]);

  const play = useCallback(
    (i: number) => {
      if (board[i] || over || turn !== 'C') return;
      setBoard((b) => {
        const nb = [...b];
        nb[i] = 'C';
        return nb;
      });
      setTurn('B');
    },
    [board, over, turn],
  );

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn('C');
  };

  return (
    <Tile
      title="Morpion des chats"
      subtitle="Toi (chat blanc) vs chat noir"
      icon={<Gamepad2 size={18} />}
      accent="#7c5cff"
      delay={delay}
    >
      <div className="flex flex-col items-center">
        <div className="mb-3 flex w-full items-center justify-between text-[0.72rem] font-semibold">
          <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-slate-600">
            <Cat variant="white" size={18} /> {score.you}
          </span>
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-slate-500 tabular-nums">{score.draw} nul</span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-slate-600">
            {score.cat} <Cat variant="black" size={18} />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-gradient-to-br from-violet-100 to-rose-100 p-2">
          {board.map((cell, i) => {
            const winning = result?.line.includes(i);
            return (
              <motion.button
                key={i}
                onClick={() => play(i)}
                disabled={!!cell || over || turn !== 'C'}
                whileHover={!cell && !over && turn === 'C' ? { scale: 1.05 } : undefined}
                whileTap={!cell && !over && turn === 'C' ? { scale: 0.9 } : undefined}
                aria-label={`Case ${i + 1}${cell === 'C' ? ', chat blanc' : cell === 'B' ? ', chat noir' : ', vide'}`}
                className={`grid h-[58px] w-[58px] place-items-center rounded-xl border transition-colors sm:h-16 sm:w-16 ${
                  winning ? 'border-rose-400 bg-rose-200/70 shadow-[0_0_18px_rgba(232,74,127,0.5)]' : 'border-white/80 bg-white/75'
                }`}
              >
                <AnimatePresence>
                  {cell && (
                    <motion.span
                      key={cell}
                      initial={{ scale: 0, rotate: -40, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                    >
                      <Cat variant={cell === 'C' ? 'white' : 'black'} size={38} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-1.5 font-quicksand text-[0.85rem] font-semibold text-slate-600"
            >
              {result?.winner === 'C' && <Heart size={14} fill="#e84a7f" />}
              {status}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          onClick={reset}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-4 py-1.5 text-[0.78rem] font-semibold text-violet-600 transition hover:bg-violet-500/20"
        >
          <RotateCcw size={14} /> Nouvelle partie
        </button>
      </div>
    </Tile>
  );
};

export default Morpion;
