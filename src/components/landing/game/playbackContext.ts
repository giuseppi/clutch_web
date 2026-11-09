import { createContext, useContext } from "react";
import type { Clock } from "./playback";

export interface Frame extends Clock {
  ff: boolean;
}

/**
 * The hero clock for this page load. PlaybackProvider resumes from it when it mounts again
 * (a return to the page through the router), so the game plays once per page load.
 */
export const pageClock: { current: Frame } = { current: { t: 0, lt: null, ff: false } };

/** The hero clock and what feeds it. Everything the hero and leaderboard draw comes from t and lt. */
export interface Playback {
  /** Game time in design seconds, 0 to GAME. */
  t: number;
  /** Leaderboard beat time, null until the beat starts. */
  lt: number | null;
  /** The game is fast-forwarding (leaderboard in view, card not). */
  ff: boolean;
  reduced: boolean;
  /** The entrance has started (fonts ready, or 500 ms). */
  started: boolean;
  /** Ref callback for the live card; its visible share feeds fast-forward. */
  watchCard: (el: HTMLElement | null) => void;
  /** Ref callback for the leaderboard; its visible share starts the beat and fast-forward. */
  watchLadder: (el: HTMLElement | null) => void;
}

export const PlaybackContext = createContext<Playback | null>(null);

export function usePlayback(): Playback {
  const playback = useContext(PlaybackContext);
  if (!playback) throw new Error("usePlayback must be used inside a PlaybackProvider");
  return playback;
}
