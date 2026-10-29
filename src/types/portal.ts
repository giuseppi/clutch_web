/**
 * Shapes the coach portal pages under src/pages/app read from API responses.
 *
 * The portal is not routed today (App.tsx redirects /app/* to /), and these
 * interfaces describe what the pages expect, not what server/ returns. Known
 * differences: elo history is newRating/delta on the server but newMmr here,
 * highlight clips are startTimestamp/endTimestamp/eventType on the server but
 * startTime/endTime/clipType here, and player stats are a bare array on the
 * server but { careerAverages, recentStats } here. Reconcile these with
 * server/src/services before routing the portal again.
 */

export interface PortalTeam {
  id: string;
  name: string;
  abbreviation: string;
  state?: string | null;
  classification?: string | null;
}

export interface PortalMatch {
  id: string;
  scheduledDate: string;
  venue?: string | null;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  isProcessed: boolean;
  homeTeam?: PortalTeam;
  awayTeam?: PortalTeam;
}

export interface PortalPlayer {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber?: string | null;
  heightInches?: number | null;
  weightLbs?: number | null;
  graduationYear: number;
  mmr: number;
  stars: number;
  rank?: number;
  trend?: number;
  team?: PortalTeam;
}

export interface PortalEloEntry {
  newMmr: number;
  delta: number;
}

export interface PortalMatchStat {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fgMade: number;
  fgAttempted: number;
  match?: { scheduledDate: string };
}

export interface PortalPlayTag {
  id: string;
  label: string;
  timestamp: number;
  statType?: string | null;
}

export interface PortalHighlight {
  id: string;
  title?: string;
  label?: string;
  notes?: string;
  clipType?: string;
  startTime: number;
  endTime: number;
}

export type PortalSessionType = "PRACTICE" | "SCRIMMAGE" | "TRAINING";

export interface PortalSession {
  id: string;
  title: string;
  sessionType: PortalSessionType;
  date: string;
}
