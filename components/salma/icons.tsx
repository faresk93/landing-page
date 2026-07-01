import React from 'react';

/**
 * Lovely SVG assets for the /salma dashboard.
 * Everything here is vector (no emoji-as-icon) so it scales crisply and themes nicely.
 */

type SVGProps = React.SVGProps<SVGSVGElement> & { size?: number };

/* ----------------------------- Cats ----------------------------- */

type CatVariant = 'black' | 'white' | 'tuxedo';

interface CatProps extends SVGProps {
  variant?: CatVariant;
  /** Eye color override */
  eye?: string;
}

const CAT_PRESET: Record<CatVariant, { fill: string; inner: string; eye: string; nose: string; stroke: string }> = {
  black:  { fill: '#23262f', inner: '#ff9bb3', eye: '#ffd34d', nose: '#ff7aa2', stroke: 'none' },
  white:  { fill: '#ffffff', inner: '#ffc2d6', eye: '#6fcf97', nose: '#ff7aa2', stroke: '#e3cdd6' },
  tuxedo: { fill: '#23262f', inner: '#ff9bb3', eye: '#ffd34d', nose: '#ff7aa2', stroke: 'none' },
};

/** An adorable sitting cat. Mostly black & white, just like Salma loves. */
export const Cat: React.FC<CatProps> = ({ variant = 'black', eye, size = 64, ...rest }) => {
  const p = CAT_PRESET[variant];
  const sw = p.stroke === 'none' ? 0 : 2;
  return (
    <svg viewBox="0 0 100 124" width={size} height={(size * 124) / 100} {...rest}>
      {/* tail */}
      <path
        d="M74 98 C 100 96, 98 60, 80 66 C 92 74, 86 92, 72 94 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={sw}
      />
      {/* body */}
      <path
        d="M50 52 C 28 52, 23 88, 30 108 C 35 120, 65 120, 70 108 C 77 88, 72 52, 50 52 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={sw}
      />
      {variant === 'tuxedo' && (
        <path d="M50 64 C 42 64, 40 100, 50 112 C 60 100, 58 64, 50 64 Z" fill="#ffffff" />
      )}
      {/* ears */}
      <path d="M30 30 L25 6 L48 24 Z" fill={p.fill} stroke={p.stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M70 30 L75 6 L52 24 Z" fill={p.fill} stroke={p.stroke} strokeWidth={sw} strokeLinejoin="round" />
      {/* head */}
      <circle cx="50" cy="44" r="25" fill={p.fill} stroke={p.stroke} strokeWidth={sw} />
      {/* inner ears */}
      <path d="M32 26 L30 13 L41 23 Z" fill={p.inner} />
      <path d="M68 26 L70 13 L59 23 Z" fill={p.inner} />
      {/* eyes */}
      <ellipse cx="40" cy="44" rx="3.6" ry="5.4" fill={eye ?? p.eye} />
      <ellipse cx="60" cy="44" rx="3.6" ry="5.4" fill={eye ?? p.eye} />
      <circle cx="41" cy="42" r="1" fill="#fff" opacity="0.9" />
      <circle cx="61" cy="42" r="1" fill="#fff" opacity="0.9" />
      {/* nose (tiny heart) */}
      <path d="M50 54 C 47.5 50.5, 44 52.5, 47 55 L50 57.4 L53 55 C 56 52.5, 52.5 50.5, 50 54 Z" fill={p.nose} />
      {/* whiskers */}
      <g stroke={p.stroke === 'none' ? '#5b5f6b' : '#c9b3bd'} strokeWidth="1.1" strokeLinecap="round">
        <path d="M36 50 L20 47" />
        <path d="M36 53 L21 54" />
        <path d="M64 50 L80 47" />
        <path d="M64 53 L79 54" />
      </g>
    </svg>
  );
};

/* ----------------------------- Hearts ----------------------------- */

interface HeartProps extends SVGProps {
  fill?: string;
  stroke?: string;
}

export const Heart: React.FC<HeartProps> = ({ fill = '#ff2d55', stroke = 'none', size = 24, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...rest}>
    <path
      d="M12 21 C12 21 3 14 3 8.5 C3 5.5 5.4 3.5 8 3.5 C9.7 3.5 11.2 4.5 12 6 C12.8 4.5 14.3 3.5 16 3.5 C18.6 3.5 21 5.5 21 8.5 C21 14 12 21 12 21 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke === 'none' ? 0 : 1.5}
      strokeLinejoin="round"
    />
  </svg>
);

/** Cupid heart pierced by an arrow — mirrors the page cursor. */
export const HeartArrow: React.FC<SVGProps> = ({ size = 40, ...rest }) => (
  <svg viewBox="0 0 42 42" width={size} height={size} {...rest}>
    <line x1="4" y1="5" x2="38" y2="37" stroke="#801225" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M3 4 L15 7 L7 15 Z" fill="#801225" />
    <path d="M33 31 L40 39 L31 39 Z" fill="#e63b5e" />
    <g transform="translate(10,8)">
      <path
        d="M12 21 C12 21 3 14 3 8.5 C3 5.5 5.4 3.5 8 3.5 C9.7 3.5 11.2 4.5 12 6 C12.8 4.5 14.3 3.5 16 3.5 C18.6 3.5 21 5.5 21 8.5 C21 14 12 21 12 21 Z"
        fill="#ff2d55"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

/* ----------------------------- Paw ----------------------------- */

export const Paw: React.FC<SVGProps> = ({ size = 24, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...rest}>
    <ellipse cx="12" cy="15.5" rx="5.2" ry="4.4" fill="currentColor" />
    <ellipse cx="6.4" cy="9.6" rx="2.1" ry="2.7" fill="currentColor" />
    <ellipse cx="17.6" cy="9.6" rx="2.1" ry="2.7" fill="currentColor" />
    <ellipse cx="9.4" cy="6.2" rx="1.9" ry="2.5" fill="currentColor" />
    <ellipse cx="14.6" cy="6.2" rx="1.9" ry="2.5" fill="currentColor" />
  </svg>
);

/* ----------------------- SOCOTEC homage mark ----------------------- */

/**
 * A respectful, clearly-stylised homage wordmark (not the official raster logo)
 * in SOCOTEC's coral, for the workplace tile.
 */
export const SocotecMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`} aria-label="SOCOTEC">
    <span
      className="grid place-items-center rounded-[7px] font-quicksand font-bold text-white"
      style={{ width: 26, height: 26, background: 'var(--color-socotec)', boxShadow: '0 4px 12px rgba(255,90,54,0.4)' }}
    >
      S
    </span>
    <span
      className="font-quicksand font-bold tracking-[0.18em] text-[1.05rem]"
      style={{ color: 'var(--color-socotec)' }}
    >
      SOCOTEC
    </span>
  </span>
);

/* ----------------------- Sparkle ----------------------- */

export const Sparkle: React.FC<SVGProps> = ({ size = 16, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...rest}>
    <path
      d="M12 2 C12 7 13 9 18 9 C13 9 12 11 12 16 C12 11 11 9 6 9 C11 9 12 7 12 2 Z"
      fill="currentColor"
    />
  </svg>
);
