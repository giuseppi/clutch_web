import type { Variants } from "framer-motion";

/** Entrance ease: fast start, long settle. */
export const EASE_RISE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Draw ease: slow start and end, used for lines and fills. */
export const EASE_DRAW: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const RISE = { y: 14, duration: 0.7, ease: EASE_RISE } as const;
export const STAGGER = 0.055;
export const DRAW = { duration: 0.9, ease: EASE_DRAW } as const;
export const FADE = { duration: 0.55 } as const;
export const VALUE_CHANGE = 0.4;

/** Entrance choreography: seconds after the page is ready. */
export const ENTRANCE = {
  navbar: 0,
  headline: 0.08,
  courtLines: 0.25,
  body: 0.45,
  card: 0.6,
  courtFill: 0.7,
  key: 1.0,
  firstShot: 1.2,
} as const;

export const riseVariants: Variants = {
  hidden: { opacity: 0, y: RISE.y },
  visible: { opacity: 1, y: 0, transition: { duration: RISE.duration, ease: RISE.ease } },
};

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export function lerp(a: number, b: number, f: number): number {
  return a + (b - a) * f;
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/** The curve of cubic-bezier(.65, 0, .35, 1). */
export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Close to cubic-bezier(.16, 1, .3, 1). */
export function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}
