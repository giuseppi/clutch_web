import { describe, expect, it } from "vitest";
import {
  BRAND,
  HOOP,
  INK,
  SHOTS,
  TRAIL,
  beatAt,
  landTime,
  pointsOf,
  scoreColor,
  stateAt,
  tally,
  zoneOf,
  type Zone,
} from "./game";
import { BEAT, GAME, SHOT_COUNT, START } from "./timeline";

const TABLE: [number, string, Zone, 2 | 3][] = [
  [1, "G", "Mid-Range", 2],
  [2, "J", "Corner 3", 3],
  [3, "G", "Above Break 3", 3],
  [4, "J", "Mid-Range", 2],
  [5, "G", "Paint", 2],
  [6, "J", "Above Break 3", 3],
  [7, "G", "Mid-Range", 2],
  [8, "J", "Paint", 2],
  [9, "G", "Corner 3", 3],
  [10, "J", "Mid-Range", 2],
  [11, "G", "Paint", 2],
  [12, "J", "Above Break 3", 3],
  [13, "G", "Free Throw", 2],
];

describe("shot table", () => {
  it("has 13 shots", () => {
    expect(SHOTS).toHaveLength(SHOT_COUNT);
  });

  it.each(TABLE)("shot %i (%s) is %s for %i points", (n, player, zone, points) => {
    const shot = SHOTS[n - 1];
    expect(shot.player).toBe(player);
    expect(zoneOf(shot.x, shot.y)).toBe(zone);
    expect(pointsOf(zoneOf(shot.x, shot.y))).toBe(points);
  });
});

describe("tally", () => {
  it("matches the final box score", () => {
    const lines = tally(13);
    expect(lines.G).toEqual({ pts: 11, fgm: 5, fga: 7, tpm: 1, tpa: 2 });
    expect(lines.J).toEqual({ pts: 7, fgm: 3, fga: 6, tpm: 1, tpa: 3 });
  });
});

describe("stateAt", () => {
  it("is empty before the first shot", () => {
    for (const t of [0, START - 0.01]) {
      const s = stateAt(t);
      expect(s.landed).toBe(0);
      expect(s.beat).toBeNull();
    }
  });

  it("resolves a shot at 0.95 s into its beat", () => {
    expect(stateAt(START + 0.94).landed).toBe(0);
    expect(stateAt(START + 0.95).landed).toBe(1);
  });

  it("moves to the next beat at BEAT", () => {
    expect(stateAt(START + 1.59).beat?.index).toBe(0);
    const b = stateAt(START + BEAT).beat;
    expect(b?.index).toBe(1);
    expect(b?.u).toBeCloseTo(0, 6);
  });

  it("is final at GAME", () => {
    const s = stateAt(GAME);
    expect(s.final).toBe(true);
    expect(s.landed).toBe(13);
    expect(s.beat).toBeNull();
  });

  it("reports every shot landed at its landTime", () => {
    for (let i = 0; i < SHOT_COUNT; i++) {
      expect(stateAt(landTime(i)).landed).toBe(i + 1);
    }
  });

  it("tracks the last resolved shot", () => {
    expect(stateAt(0).last).toBeNull();
    expect(stateAt(landTime(2)).last).toBe(SHOTS[2]);
  });
});

describe("beatAt", () => {
  const make = SHOTS[0];
  const three = SHOTS[1];
  const miss = SHOTS[2];

  it("fades the shooter in", () => {
    expect(beatAt(make, 0.1).shooterOpacity).toBeCloseTo(0.5, 6);
  });

  it("flies a ball with a shadow", () => {
    const f = beatAt(make, 0.6);
    expect(f.ball).not.toBeNull();
    expect(f.shadow).not.toBeNull();
  });

  it("shows a make at 0.95", () => {
    const f = beatAt(make, 0.95);
    expect(f.ball).toBeNull();
    expect(f.pop?.text).toBe("+2");
    expect(beatAt(three, 0.95).pop?.text).toBe("+3");
    expect(f.rim?.r).toBeCloseTo(0.75, 6);
  });

  it("shows a miss at 0.95", () => {
    const f = beatAt(miss, 0.95);
    expect(f.ball?.x).toBeCloseTo(HOOP.x, 6);
    expect(f.ball?.y).toBeCloseTo(HOOP.y, 6);
    expect(f.ball?.opacity).toBeCloseTo(1, 6);
    expect(f.pop).toBeNull();
  });

  it("fades the shooter out and clears the beat", () => {
    expect(beatAt(make, 1.55).shooterOpacity).toBeCloseTo(0, 6);
    const end = beatAt(make, 1.6);
    expect(end.ball).toBeNull();
    expect(end.pop).toBeNull();
  });
});

describe("scoreColor", () => {
  it("is ink for both on a tie", () => {
    const s = stateAt(0);
    expect(scoreColor("G", s)).toBe(INK);
    expect(scoreColor("J", s)).toBe(INK);
  });

  it("colours the leader brand and the trailer grey", () => {
    const s1 = stateAt(landTime(0));
    expect(scoreColor("G", s1)).toBe(BRAND);
    expect(scoreColor("J", s1)).toBe(TRAIL);
    const s2 = stateAt(landTime(1));
    expect(scoreColor("J", s2)).toBe(BRAND);
  });

  it("ends with Giuseppi leading", () => {
    const s = stateAt(GAME);
    expect(scoreColor("G", s)).toBe(BRAND);
    expect(scoreColor("J", s)).toBe(TRAIL);
  });
});
