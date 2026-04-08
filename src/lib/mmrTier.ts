/**
 * MMR tier bands (1–99 scale). Used by UI and for display alongside numeric MMR.
 *
 * Distribution:
 *   Rookie  1-19   — new/low-skill players
 *   Bronze  20-39  — developing players
 *   Silver  40-59  — average skill
 *   Gold    60-89  — above average, broadest tier
 *   Diamond 90-99  — elite, hardest to reach
 */

export enum Tier {
  ROOKIE = "ROOKIE",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  DIAMOND = "DIAMOND",
}

export type TierConfig = {
  min: number;
  max: number;
  label: string;
};

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  [Tier.ROOKIE]: { min: 1, max: 19, label: "Rookie" },
  [Tier.BRONZE]: { min: 20, max: 39, label: "Bronze" },
  [Tier.SILVER]: { min: 40, max: 59, label: "Silver" },
  [Tier.GOLD]: { min: 60, max: 89, label: "Gold" },
  [Tier.DIAMOND]: { min: 90, max: 99, label: "Diamond" },
};

/** Numeric MMR (0–99) → tier. Values below 1 are treated as Rookie. */
export function getTier(mmr: number): Tier {
  const r = Math.round(Number.isFinite(mmr) ? mmr : 50);
  if (r < 1) return Tier.ROOKIE;
  if (r <= TIER_CONFIG[Tier.ROOKIE].max) return Tier.ROOKIE;
  if (r <= TIER_CONFIG[Tier.BRONZE].max) return Tier.BRONZE;
  if (r <= TIER_CONFIG[Tier.SILVER].max) return Tier.SILVER;
  if (r <= TIER_CONFIG[Tier.GOLD].max) return Tier.GOLD;
  return Tier.DIAMOND;
}

export function getTierLabel(mmr: number): string {
  return TIER_CONFIG[getTier(mmr)].label;
}

/** Tailwind text classes for tier-colored numeric MMR (dark UI). */
export const TIER_TEXT_CLASS: Record<Tier, string> = {
  [Tier.ROOKIE]: "text-slate-400",
  [Tier.BRONZE]: "text-amber-600",
  [Tier.SILVER]: "text-slate-200",
  [Tier.GOLD]: "text-yellow-400",
  [Tier.DIAMOND]: "text-cyan-300",
};

/** Gradient classes for progress bars / rings (from → to). */
export const TIER_BAR_GRADIENT: Record<Tier, string> = {
  [Tier.ROOKIE]: "from-slate-600 to-slate-500",
  [Tier.BRONZE]: "from-amber-800 to-amber-600",
  [Tier.SILVER]: "from-slate-500 to-slate-300",
  [Tier.GOLD]: "from-yellow-600 to-amber-400",
  [Tier.DIAMOND]: "from-cyan-600 to-sky-300",
};

/** Solid stroke / accent for SVG rings. */
export const TIER_RING_COLOR: Record<Tier, string> = {
  [Tier.ROOKIE]: "#94a3b8",
  [Tier.BRONZE]: "#d97706",
  [Tier.SILVER]: "#e2e8f0",
  [Tier.GOLD]: "#facc15",
  [Tier.DIAMOND]: "#67e8f9",
};

export function getTierTextClass(mmr: number): string {
  return TIER_TEXT_CLASS[getTier(mmr)];
}

export function getTierBarGradient(mmr: number): string {
  return TIER_BAR_GRADIENT[getTier(mmr)];
}

export function getTierRingColor(mmr: number): string {
  return TIER_RING_COLOR[getTier(mmr)];
}

/** Compact pill (dashboard table). */
export const TIER_BADGE_CLASS: Record<Tier, string> = {
  [Tier.ROOKIE]: "text-slate-300 bg-slate-500/10 border-slate-500/20",
  [Tier.BRONZE]: "text-amber-600 bg-amber-600/10 border-amber-600/20",
  [Tier.SILVER]: "text-slate-200 bg-slate-400/10 border-slate-400/20",
  [Tier.GOLD]: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  [Tier.DIAMOND]: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
};

export function getTierBadgeClass(mmr: number): string {
  return TIER_BADGE_CLASS[getTier(mmr)];
}

/** Fill ratio for 1–99 scale (e.g. progress bars). */
export function mmrFillPercent(mmr: number): number {
  const r = Math.max(1, Math.min(99, Math.round(Number.isFinite(mmr) ? mmr : 50)));
  return (r / 99) * 100;
}
