import { describe, expect, it } from "vitest";
import { clamp01, easeInOutCubic, easeInOutQuad, easeOutQuart, lerp } from "./motion";

const easings = { easeInOutQuad, easeInOutCubic, easeOutQuart };

describe("easings", () => {
  it.each(Object.entries(easings))("%s maps 0 to 0 and 1 to 1", (_n, fn) => {
    expect(fn(0)).toBeCloseTo(0, 10);
    expect(fn(1)).toBeCloseTo(1, 10);
  });

  it.each(Object.entries(easings))("%s never decreases over 0..1", (_n, fn) => {
    let prev = fn(0);
    for (let i = 1; i <= 100; i++) {
      const v = fn(i / 100);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it("symmetric curves hit 0.5 at the midpoint", () => {
    expect(easeInOutQuad(0.5)).toBeCloseTo(0.5, 10);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10);
  });
});

describe("helpers", () => {
  it("clamp01 limits to 0..1", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.3)).toBe(0.3);
  });

  it("lerp interpolates", () => {
    expect(lerp(10, 20, 0.5)).toBe(15);
  });
});
