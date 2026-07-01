import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionStyle } from 'framer-motion';

interface TileProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
  /** Enable interactive 3D tilt on pointer move (desktop only). */
  tilt?: boolean;
  delay?: number;
  style?: MotionStyle;
}

/**
 * The signature bento card for the /salma dashboard:
 * soft glass, rose glow, optional 3D tilt, staggered entrance.
 */
const Tile: React.FC<TileProps> = ({
  title,
  subtitle,
  icon,
  accent = 'var(--color-roseDeep)',
  className = '',
  bodyClassName = '',
  children,
  tilt = false,
  delay = 0,
  style,
}) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 18 });

  const enableTilt = tilt && !reduceMotion;

  const handleMove = (e: React.PointerEvent) => {
    if (!enableTilt || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformPerspective: 900,
        ...style,
      }}
      className={`group relative rounded-[26px] border border-white/70 bg-white/70 p-5 shadow-[0_18px_40px_-20px_rgba(232,74,127,0.45)] backdrop-blur-xl ${className}`}
    >
      {/* soft top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[26px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
      {(title || icon) && (
        <div className="mb-3 flex items-center gap-2.5">
          {icon && (
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-white shadow-sm"
              style={{ background: accent }}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            {title && (
              <h3 className="truncate font-quicksand text-[0.95rem] font-bold tracking-wide text-slate-700">
                {title}
              </h3>
            )}
            {subtitle && <p className="truncate text-[0.72rem] text-slate-500">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </motion.div>
  );
};

export default Tile;
