import { FF, GAME, L_END, MAX_DT, RATE, START } from "./timeline";

/** lt is null until the leaderboard beat starts. */
export interface Clock {
  t: number;
  lt: number | null;
}

export interface FrameInput {
  dt: number;
  started: boolean;
  reduced: boolean;
  ladderVisible: number;
  cardVisible: number;
}

/** Skip ahead when the leaderboard is in view but the live card is not. */
export function isFastForward(clock: Clock, input: FrameInput): boolean {
  return input.started && clock.t < GAME && input.ladderVisible >= 0.6 && input.cardVisible < 0.6;
}

export function advance(clock: Clock, input: FrameInput): Clock {
  if (input.reduced) return { t: GAME, lt: L_END };
  // A first frame can be stamped before the loop's start time (dt < 0); a stalled one is capped.
  const dt = Math.min(Math.max(input.dt, 0), MAX_DT);
  let { t, lt } = clock;
  if (input.started && t < GAME) {
    const rate = (t < START ? 1 : RATE) * (isFastForward(clock, input) ? FF : 1);
    t = Math.min(GAME, t + dt * rate);
  }
  if (lt === null && input.ladderVisible >= 0.6 && t >= GAME) lt = 0;
  if (lt !== null) lt = Math.min(L_END, lt + dt * RATE);
  return { t, lt };
}
