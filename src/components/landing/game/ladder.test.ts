import { describe, expect, it } from "vitest";
import { LADDER, ladderAt, tokenAt, type LadderId, type LadderRow } from "./ladder";
import { L_ARRIVE, L_END, L_REORDER } from "./timeline";

const row = (T: number, id: LadderId): LadderRow => {
  const found = ladderAt(T).find((r) => r.id === id);
  if (!found) throw new Error(`no row ${id}`);
  return found;
};

/** T at which the reorder ease reaches its halfway point, where the ranks swap. */
const SWAP = L_REORDER + 0.7 * (1 - 0.5 ** 0.25);

describe("LADDER", () => {
  it("holds the spec's four players by first name, in the before order", () => {
    expect(LADDER.map((p) => p.name)).toEqual(["Johnny", "Giuseppi", "Andrew", "Dylan"]);
  });
});

describe("ladderAt", () => {
  it("starts with Johnny on top and no deltas", () => {
    const rows = ladderAt(0);
    expect(rows.map((r) => r.id)).toEqual(["J", "G", "A", "D"]);
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
    expect(rows.map((r) => r.mmr)).toEqual([1296, 1287, 1251, 1218]);
    expect(rows.map((r) => r.record)).toEqual(["21-8", "23-9", "18-10", "15-11"]);
    expect(rows.map((r) => r.slot)).toEqual([0, 1, 2, 3]);
    expect(rows.map((r) => r.delta)).toEqual([null, null, null, null]);
    expect(rows.some((r) => r.me)).toBe(false);
  });

  it("carries each row's own name and photo, whatever the order", () => {
    for (const T of [0, L_ARRIVE + 0.4, L_END]) {
      for (const r of ladderAt(T)) {
        const player = LADDER.find((p) => p.id === r.id);
        expect(r).toMatchObject({ name: player?.name, photo: player?.photo });
      }
    }
  });

  it("counts both MMRs toward their new values after the token arrives", () => {
    const T = L_ARRIVE + 0.2;
    const g = row(T, "G").mmr;
    const j = row(T, "J").mmr;
    expect(g).toBeGreaterThan(1287);
    expect(g).toBeLessThan(1301);
    expect(j).toBeGreaterThan(1284);
    expect(j).toBeLessThan(1296);
  });

  it("shows the new MMRs, records and deltas once counted", () => {
    const T = L_ARRIVE + 0.4;
    expect(row(T, "G")).toMatchObject({ mmr: 1301, record: "24-9", delta: "+14" });
    expect(row(T, "J")).toMatchObject({ mmr: 1284, record: "21-9", delta: "-12" });
    expect(row(T, "A")).toMatchObject({ mmr: 1251, record: "18-10", delta: null });
    expect(row(T, "D")).toMatchObject({ mmr: 1218, record: "15-11", delta: null });
  });

  it("keeps the old record and no delta until the token arrives", () => {
    const T = L_ARRIVE - 0.001;
    expect(row(T, "G")).toMatchObject({ mmr: 1287, record: "23-9", delta: null });
    expect(row(T, "J")).toMatchObject({ mmr: 1296, record: "21-8", delta: null });
  });

  it("swaps the ranks at the reorder's halfway point and marks Giuseppi", () => {
    expect(row(SWAP - 0.001, "G")).toMatchObject({ rank: 2, me: false });
    expect(row(SWAP - 0.001, "J").rank).toBe(1);
    expect(row(SWAP + 0.001, "G")).toMatchObject({ rank: 1, me: true });
    expect(row(SWAP + 0.001, "J").rank).toBe(2);
  });

  it("moves the rows by slot during the reorder, between their old and new places", () => {
    const g = row(SWAP, "G").slot;
    expect(g).toBeGreaterThan(0);
    expect(g).toBeLessThan(1);
    expect(row(SWAP, "J").slot).toBeCloseTo(1 - g, 10);
  });

  it("ends with Giuseppi in the top slot and Johnny second", () => {
    expect(row(L_END, "G")).toMatchObject({ slot: 0, rank: 1, me: true });
    expect(row(L_END, "J")).toMatchObject({ slot: 1, rank: 2 });
  });

  it("keeps Andrew and Dylan in slots 2 and 3 throughout", () => {
    for (let T = 0; T <= 2.3; T += 0.05) {
      expect(row(T, "A")).toMatchObject({ slot: 2, rank: 3 });
      expect(row(T, "D")).toMatchObject({ slot: 3, rank: 4 });
    }
  });
});

describe("tokenAt", () => {
  const from = { x: 0, y: 0 };
  const to = { x: 300, y: 400 };

  it("is absent before the beat and once it has faded out", () => {
    expect(tokenAt(0, from, to)).toBeNull();
    expect(tokenAt(L_ARRIVE + 0.25, from, to)).toBeNull();
    expect(tokenAt(1.3, from, to)).toBeNull();
    expect(tokenAt(L_END, from, to)).toBeNull();
  });

  it("leaves from the start point and lands on the end point", () => {
    expect(tokenAt(0.15, from, to)).toMatchObject(from);
    expect(tokenAt(1.05, from, to)).toMatchObject(to);
  });

  it("goes across, then down, when the points are apart (control at end x, start y)", () => {
    const frame = tokenAt(0.6, from, to);
    expect(frame?.x).toBeCloseTo(225, 6);
    expect(frame?.y).toBeCloseTo(100, 6);
  });

  it("swings 90 px to the side, halfway down, when the points are nearly stacked", () => {
    const frame = tokenAt(0.6, { x: 100, y: 0 }, { x: 120, y: 400 });
    expect(frame?.x).toBeCloseTo(150, 6);
    expect(frame?.y).toBeCloseTo(200, 6);
  });

  it("fades and scales in, swells mid-flight, then fades and shrinks out", () => {
    const start = tokenAt(0.001, from, to);
    expect(start?.opacity).toBeCloseTo(0.001 / 0.15, 6);
    expect(start?.scale).toBeCloseTo(0.8, 2);
    expect(tokenAt(0.15, from, to)).toMatchObject({ opacity: 1, scale: 1 });
    expect(tokenAt(0.6, from, to)?.scale).toBeCloseTo(1.12, 6);
    expect(tokenAt(L_ARRIVE, from, to)).toMatchObject({ opacity: 1 });
    const leaving = tokenAt(L_ARRIVE + 0.125, from, to);
    expect(leaving?.opacity).toBeCloseTo(0.5, 6);
    expect(leaving?.scale).toBeCloseTo(0.8, 6);
  });
});
