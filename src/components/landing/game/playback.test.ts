import { describe, expect, it } from "vitest";
import { advance, isFastForward, isIdle, type Clock, type FrameInput } from "./playback";
import { FF, GAME, L_END, MAX_DT, RATE, START } from "./timeline";

const base: FrameInput = { dt: 1 / 60, started: true, reduced: false, ladderVisible: 0, cardVisible: 1 };

function run(clock: Clock, input: Partial<FrameInput>, seconds: number, fps = 60): Clock {
  let c = clock;
  const frames = Math.round(seconds * fps);
  for (let i = 0; i < frames; i++) c = advance(c, { ...base, ...input, dt: 1 / fps });
  return c;
}

function secondsUntil(clock: Clock, input: Partial<FrameInput>, done: (c: Clock) => boolean): number {
  let c = clock;
  let n = 0;
  while (!done(c) && n < 60 * 60) {
    c = advance(c, { ...base, ...input, dt: 1 / 60 });
    n++;
  }
  return n / 60;
}

describe("advance", () => {
  it("holds t at 0 until started", () => {
    for (const dt of [0.016, 0.05, 5]) {
      expect(advance({ t: 0, lt: null }, { ...base, dt, started: false }).t).toBe(0);
    }
  });

  it("runs at 1x before START and RATE after, and holds at GAME", () => {
    expect(advance({ t: 0, lt: null }, base).t).toBeCloseTo(1 / 60, 9);
    expect(advance({ t: START, lt: null }, base).t).toBeCloseTo(START + RATE / 60, 9);
    expect(advance({ t: GAME, lt: null }, base).t).toBe(GAME);
  });

  it("plays the full game in about 17.85 s", () => {
    const s = secondsUntil({ t: 0, lt: null }, {}, (c) => c.t >= GAME);
    expect(s).toBeGreaterThanOrEqual(17.8);
    expect(s).toBeLessThanOrEqual(17.9);
  });

  it("clamps a stalled frame", () => {
    const c = advance({ t: 5, lt: null }, { ...base, dt: 5 });
    expect(c.t).toBeCloseTo(5 + MAX_DT * RATE, 9);
  });

  it("ignores a negative dt (a first frame stamped before the loop started)", () => {
    expect(advance({ t: 5, lt: null }, { ...base, dt: -0.1 })).toEqual({ t: 5, lt: null });
    expect(advance({ t: GAME, lt: 1 }, { ...base, dt: -0.1, ladderVisible: 1 })).toEqual({ t: GAME, lt: 1 });
  });
});

describe("fast-forward", () => {
  it("is on with the ladder seen and the card not", () => {
    const input = { ...base, ladderVisible: 0.6, cardVisible: 0.59 };
    expect(isFastForward({ t: 5, lt: null }, input)).toBe(true);
    const c = advance({ t: 5, lt: null }, input);
    expect(c.t).toBeCloseTo(5 + (1 / 60) * RATE * FF, 9);
  });

  it("is off when the card is visible", () => {
    expect(isFastForward({ t: 5, lt: null }, { ...base, ladderVisible: 0.6, cardVisible: 0.6 })).toBe(false);
  });

  it("is off once the game is over", () => {
    expect(isFastForward({ t: GAME, lt: null }, { ...base, ladderVisible: 0.6, cardVisible: 0 })).toBe(false);
  });
});

describe("landing mid-page", () => {
  it("finishes the game and the beat quickly", () => {
    const input = { ladderVisible: 0.7, cardVisible: 0 };
    const gameDone = secondsUntil({ t: 0, lt: null }, input, (c) => c.t >= GAME);
    expect(gameDone).toBeLessThanOrEqual(2.3);
    const c = run({ t: 0, lt: null }, input, gameDone);
    const beatDone = secondsUntil(c, input, (k) => k.lt === L_END);
    expect(beatDone).toBeLessThanOrEqual(1.9);
  });

  it("plays at normal speed with nothing on screen", () => {
    const input = { ladderVisible: 0, cardVisible: 0 };
    const s = secondsUntil({ t: 0, lt: null }, input, (c) => c.t >= GAME);
    expect(s).toBeGreaterThanOrEqual(17.8);
    expect(s).toBeLessThanOrEqual(17.9);
  });
});

describe("leaderboard beat", () => {
  it("waits for the ladder and the end of the game", () => {
    expect(advance({ t: GAME, lt: null }, { ...base, ladderVisible: 0.59 }).lt).toBeNull();
    expect(advance({ t: GAME - 1, lt: null }, { ...base, ladderVisible: 1 }).lt).toBeNull();
    expect(advance({ t: GAME, lt: null }, { ...base, ladderVisible: 0.6 }).lt).toBeCloseTo(RATE / 60, 9);
  });

  it("advances at RATE, caps at L_END, and survives the ladder leaving", () => {
    let c: Clock = { t: GAME, lt: 0 };
    c = advance(c, { ...base, ladderVisible: 0 });
    expect(c.lt).toBeCloseTo(RATE / 60, 9);
    c = run(c, { ladderVisible: 0 }, 5);
    expect(c.lt).toBe(L_END);
  });
});

describe("monotonic clock", () => {
  it("never rewinds over 2000 seeded frames", () => {
    let seed = 12345;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    let c: Clock = { t: 0, lt: null };
    let reachedLt = false;
    for (let i = 0; i < 2000; i++) {
      const next = advance(c, {
        dt: rand() * 0.2,
        started: rand() > 0.1,
        reduced: false,
        ladderVisible: rand(),
        cardVisible: rand(),
      });
      expect(next.t).toBeGreaterThanOrEqual(c.t);
      if (c.lt !== null) expect(next.lt).not.toBeNull();
      expect(next.lt ?? 0).toBeGreaterThanOrEqual(c.lt ?? 0);
      if (next.lt !== null) reachedLt = true;
      c = next;
    }
    expect(reachedLt).toBe(true);
  });
});

describe("idle", () => {
  it("is idle only when no frame can change the clock", () => {
    expect(isIdle({ t: GAME - 0.01, lt: null }, 0)).toBe(false);
    expect(isIdle({ t: GAME, lt: null }, 0.59)).toBe(true);
    expect(isIdle({ t: GAME, lt: null }, 0.6)).toBe(false);
    expect(isIdle({ t: GAME, lt: 1 }, 0)).toBe(false);
    expect(isIdle({ t: GAME, lt: L_END }, 1)).toBe(true);
  });

  it("agrees with advance: an idle clock does not change on the next frame", () => {
    for (const [clock, ladderVisible] of [
      [{ t: GAME, lt: null }, 0.59],
      [{ t: GAME, lt: L_END }, 1],
    ] as const) {
      expect(advance(clock, { ...base, ladderVisible })).toEqual(clock);
    }
  });
});

describe("reduced motion", () => {
  it("jumps to the final state", () => {
    const input = { ...base, reduced: true };
    expect(advance({ t: 0, lt: null }, input)).toEqual({ t: GAME, lt: L_END });
    expect(advance({ t: 7, lt: 1 }, input)).toEqual({ t: GAME, lt: L_END });
  });
});
