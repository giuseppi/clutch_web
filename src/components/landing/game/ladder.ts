// Files, not data URIs in the main bundle: the photos sit below the fold.
import andrewUrl from "@/assets/ladder/andrew.webp?no-inline";
import dylanUrl from "@/assets/ladder/dylan.webp?no-inline";
import giuseppiUrl from "@/assets/ladder/giuseppi.webp?no-inline";
import johnnyUrl from "@/assets/ladder/johnny.webp?no-inline";
import { clamp01, easeInOutCubic, easeOutQuart, lerp } from "@/lib/motion";
import { L_ARRIVE, L_END, L_REORDER } from "./timeline";

export type LadderId = "G" | "J" | "A" | "D";

interface Standing {
  mmr: number;
  record: string;
}

export interface LadderPlayer {
  id: LadderId;
  name: string;
  photo: string;
  before: Standing;
  after?: Standing & { delta: "+14" | "-12" };
}

/** The court ladder before and after the 1v1 (illustrative). Its order is the DOM order. */
export const LADDER: readonly LadderPlayer[] = [
  { id: "J", name: "Johnny", photo: johnnyUrl, before: { mmr: 1296, record: "21-8" }, after: { mmr: 1284, record: "21-9", delta: "-12" } },
  { id: "G", name: "Giuseppi", photo: giuseppiUrl, before: { mmr: 1287, record: "23-9" }, after: { mmr: 1301, record: "24-9", delta: "+14" } },
  { id: "A", name: "Andrew", photo: andrewUrl, before: { mmr: 1251, record: "18-10" } },
  { id: "D", name: "Dylan", photo: dylanUrl, before: { mmr: 1218, record: "15-11" } },
];

export const BEFORE: readonly LadderId[] = ["J", "G", "A", "D"];
export const AFTER: readonly LadderId[] = ["G", "J", "A", "D"];

export interface LadderRow {
  id: LadderId;
  name: string;
  photo: string;
  rank: number;
  /** Place in the list, 0 at the top; fractional while the rows swap. */
  slot: number;
  mmr: number;
  record: string;
  delta: string | null;
  /** The winner's row, tinted once he takes the top rank. */
  me: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface TokenFrame {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

/** Seconds the MMRs take to count to their new values, and the token to fade out. */
const COUNT = 0.4;
const LEAVE = 0.25;
/** The token's appearance before it sets off. */
const APPEAR = 0.15;
const REORDER = L_END - L_REORDER;

/**
 * The ladder at beat time T (design seconds, 0 to L_END), one row per player in LADDER
 * order, each with its own name and photo. The MMRs count and the records and deltas switch
 * when the token arrives; the rows then swap places, and the ranks swap at the swap's
 * halfway point.
 */
export function ladderAt(T: number): LadderRow[] {
  const arrived = T >= L_ARRIVE;
  const f = clamp01((T - L_ARRIVE) / COUNT);
  const m = easeOutQuart(clamp01((T - L_REORDER) / REORDER));
  return LADDER.map(({ id, name, photo, before, after }) => {
    const moved = arrived && after !== undefined;
    return {
      id,
      name,
      photo,
      rank: (m >= 0.5 ? AFTER : BEFORE).indexOf(id) + 1,
      slot: lerp(BEFORE.indexOf(id), AFTER.indexOf(id), m),
      mmr: moved ? Math.round(lerp(before.mmr, after.mmr, f)) : before.mmr,
      record: moved ? after.record : before.record,
      delta: moved ? after.delta : null,
      me: id === "G" && m >= 0.5,
    };
  });
}

/** The token is on screen: from the beat's start until it has faded out after arriving. */
export function inFlight(T: number): boolean {
  return T > 0 && T < L_ARRIVE + LEAVE;
}

/**
 * The "+14" token at beat time T, flying from the card's MMR chip (`from`) to Giuseppi's
 * MMR on the ladder (`to`) on a quadratic curve: across then down when the points are
 * apart, or a swing 90 px to the side when they are nearly stacked (phones). Null when
 * it is not on screen.
 */
export function tokenAt(T: number, from: Point, to: Point): TokenFrame | null {
  if (!inFlight(T)) return null;
  const u = easeInOutCubic(clamp01((T - APPEAR) / (L_ARRIVE - APPEAR)));
  const c = Math.abs(to.x - from.x) > 80 ? { x: to.x, y: from.y } : { x: from.x + 90, y: (from.y + to.y) / 2 };
  const bezier = (a: number, b: number, d: number) => (1 - u) ** 2 * a + 2 * (1 - u) * u * b + u * u * d;
  const appear = clamp01(T / APPEAR);
  const leave = clamp01((T - L_ARRIVE) / LEAVE);
  return {
    x: bezier(from.x, c.x, to.x),
    y: bezier(from.y, c.y, to.y),
    opacity: appear * (1 - leave),
    scale: (0.8 + 0.2 * appear) * (1 + 0.12 * Math.sin(Math.PI * u)) * (1 - 0.4 * leave),
  };
}
