/** All times are design seconds. Playback multiplies them by RATE. */
export const START = 1.2;
export const BEAT = 1.6;
export const LAND = 0.95;
export const SHOT_COUNT = 13;
export const GAME = START + SHOT_COUNT * BEAT;

export const RATE = 1.25;
export const FF = 8;
export const MAX_DT = 0.05;

/** Leaderboard beat, in design seconds from its start. */
export const L_ARRIVE = 1.05;
export const L_REORDER = 1.6;
export const L_END = 2.3;
