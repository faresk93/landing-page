import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface TrailHeart {
  id: number;
  x: number;
  y: number;
  hue: number;
  size: number;
  drift: number;
}

const HEART_COLORS = ['#ff2d55', '#ff6fa5', '#ff5a36', '#e84a7f', '#ff9bb3'];

/**
 * A gentle trail of little hearts that follows the pointer.
 * Pure decoration: disabled on touch devices and when reduced-motion is requested.
 */
const HeartCursor: React.FC = () => {
  const [hearts, setHearts] = useState<TrailHeart[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef({ x: 0, y: 0, t: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const { x, y, t } = lastRef.current;
      const dist = Math.hypot(e.clientX - x, e.clientY - y);
      // Throttle by distance + time so the trail stays tasteful, never spammy.
      if (dist < 26 || now - t < 45) return;
      lastRef.current = { x: e.clientX, y: e.clientY, t: now };

      const id = idRef.current++;
      const heart: TrailHeart = {
        id,
        x: e.clientX,
        y: e.clientY,
        hue: Math.floor(Math.random() * HEART_COLORS.length),
        size: 10 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 40,
      };
      setHearts((prev) => [...prev.slice(-16), heart]);
      window.setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 950);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden>
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.svg
            key={h.id}
            viewBox="0 0 24 24"
            width={h.size}
            height={h.size}
            style={{ position: 'absolute', left: h.x - h.size / 2, top: h.y - h.size / 2 }}
            initial={{ opacity: 0.95, scale: 0.4, y: 0, x: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.15, y: -46, x: h.drift, rotate: h.drift }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
          >
            <path
              d="M12 21 C12 21 3 14 3 8.5 C3 5.5 5.4 3.5 8 3.5 C9.7 3.5 11.2 4.5 12 6 C12.8 4.5 14.3 3.5 16 3.5 C18.6 3.5 21 5.5 21 8.5 C21 14 12 21 12 21 Z"
              fill={HEART_COLORS[h.hue]}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HeartCursor;
