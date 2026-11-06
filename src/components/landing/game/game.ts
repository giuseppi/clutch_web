import { clamp01, easeInOutQuad, lerp } from "@/lib/motion";
import { BEAT, LAND, SHOT_COUNT, START } from "./timeline";

export type PlayerId = "G" | "J";
export type Zone = "Corner 3" | "Above Break 3" | "Paint" | "Free Throw" | "Mid-Range";

export interface Shot {
  player: PlayerId;
  x: number;
  y: number;
  made: boolean;
}

export interface PlayerLine {
  pts: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
}

export interface GameState {
  /** Shots resolved, 0..13. */
  landed: number;
  lines: Record<PlayerId, PlayerLine>;
  /** Null on a tie. */
  leader: PlayerId | null;
  final: boolean;
  /** Shot in progress and seconds into its beat. */
  beat: { index: number; u: number } | null;
  last: Shot | null;
}

export interface BeatFrame {
  shooterOpacity: number;
  /** Centre, in feet. */
  ball: { x: number; y: number; size: number; opacity: number } | null;
  shadow: { x: number; y: number; opacity: number } | null;
  pop: { x: number; y: number; text: string; opacity: number } | null;
  rim: { r: number; opacity: number } | null;
}

export const BRAND = "#FF6A00";
export const INK = "#1A1A1A";
export const TRAIL = "#4B5563";

export const PLAYERS: Record<PlayerId, { name: "Giuseppi" | "Johnny"; color: string }> = {
  G: { name: "Giuseppi", color: BRAND },
  J: { name: "Johnny", color: INK },
};

export const HOOP = { x: 0, y: 5.25 };

/** Floating point slack for beat boundaries (e.g. 2.15 - 1.2 is a hair under 0.95). */
const EPS = 1e-9;

const G = "G";
const J = "J";

export const SHOTS: readonly Shot[] = [
  { player: G, x: -8, y: 14, made: true },
  { player: J, x: 22.5, y: 6, made: true },
  { player: G, x: 0, y: 30, made: false },
  { player: J, x: 12, y: 20, made: true },
  { player: G, x: -4, y: 9, made: true },
  { player: J, x: -17, y: 22, made: false },
  { player: G, x: 16, y: 22, made: true },
  { player: J, x: 3, y: 11, made: true },
  { player: G, x: -22.5, y: 8, made: true },
  { player: J, x: -10, y: 16, made: false },
  { player: G, x: 5, y: 7, made: false },
  { player: J, x: 18, y: 25, made: false },
  { player: G, x: -2, y: 21, made: true },
];

export function zoneOf(x: number, y: number): Zone {
  if (y < 14.2 && Math.abs(x) >= 22) return "Corner 3";
  if (Math.hypot(x - HOOP.x, y - HOOP.y) > 23.75) return "Above Break 3";
  if (Math.abs(x) < 8 && y < 19) return "Paint";
  if (y >= 19 && Math.hypot(x, y - 19) < 6) return "Free Throw";
  return "Mid-Range";
}

export function pointsOf(zone: Zone): 2 | 3 {
  return zone === "Corner 3" || zone === "Above Break 3" ? 3 : 2;
}

export function landTime(index: number): number {
  return START + index * BEAT + LAND;
}

export function tally(landed: number): Record<PlayerId, PlayerLine> {
  const lines: Record<PlayerId, PlayerLine> = {
    G: { pts: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0 },
    J: { pts: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0 },
  };
  for (const shot of SHOTS.slice(0, landed)) {
    const points = pointsOf(zoneOf(shot.x, shot.y));
    const line = lines[shot.player];
    line.fga += 1;
    if (points === 3) line.tpa += 1;
    if (shot.made) {
      line.fgm += 1;
      line.pts += points;
      if (points === 3) line.tpm += 1;
    }
  }
  return lines;
}

export function stateAt(t: number): GameState {
  const local = Math.max(0, t - START);
  const k = Math.min(SHOT_COUNT, Math.floor((local + EPS) / BEAT));
  const u = Math.max(0, local - k * BEAT);
  const landed = t < START ? 0 : k + (k < SHOT_COUNT && u + EPS >= LAND ? 1 : 0);
  const lines = tally(landed);
  const diff = lines.G.pts - lines.J.pts;
  return {
    landed,
    lines,
    leader: diff > 0 ? "G" : diff < 0 ? "J" : null,
    final: landed === SHOT_COUNT,
    beat: t >= START && k < SHOT_COUNT ? { index: k, u } : null,
    last: landed > 0 ? SHOTS[landed - 1] : null,
  };
}

export function beatAt(shot: Shot, u: number): BeatFrame {
  const frame: BeatFrame = {
    shooterOpacity: clamp01(u / 0.2) * (1 - clamp01((u - 1.25) / 0.3)),
    ball: null,
    shadow: null,
    pop: null,
    rim: null,
  };

  if (u >= 0.25 && u < LAND) {
    const f = easeInOutQuad((u - 0.25) / 0.7);
    const gx = lerp(shot.x, HOOP.x, f);
    const gy = lerp(shot.y, HOOP.y, f);
    const h = 4 * f * (1 - f);
    frame.ball = { x: gx, y: gy - 3 * h, size: 1.5 * (1 + 0.9 * h), opacity: 1 };
    frame.shadow = { x: gx, y: gy + 0.4, opacity: 0.9 - 0.6 * h };
  } else if (u >= LAND && !shot.made && u < 1.3) {
    const f = (u - LAND) / 0.35;
    const dir = shot.x >= 0 ? -1 : 1;
    frame.ball = { x: HOOP.x + 3 * dir * f, y: HOOP.y + 2.4 * f, size: 1.5, opacity: 1 - f };
  } else if (u >= LAND && shot.made) {
    const f = clamp01((u - LAND) / 0.5);
    const popOpacity = 1 - clamp01((u - 1.3) / 0.25);
    const text = pointsOf(zoneOf(shot.x, shot.y)) === 3 ? "+3" : "+2";
    if (popOpacity > 0) frame.pop = { x: shot.x, y: shot.y - 1.8 - 2 * f, text, opacity: popOpacity };
    if (f < 1) frame.rim = { r: 0.75 + 2.6 * f, opacity: 1 - f };
  }
  return frame;
}

/** Brand for the leader, grey for the trailer, ink on a tie. */
export function scoreColor(player: PlayerId, state: GameState): string {
  if (state.leader === null) return INK;
  return state.leader === player ? BRAND : TRAIL;
}
