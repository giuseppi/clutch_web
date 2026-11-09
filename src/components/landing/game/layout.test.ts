import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { layoutFor, useLayout, type Layout } from "./layout";

const SIZES: [number, number, Layout][] = [
  [390, 844, "stack"],
  [466, 678, "stack"],
  [619, 300, "stack"],
  [844, 390, "split"],
  [890, 626, "split"],
  [1180, 820, "split"],
  [1440, 900, "split"],
  [1000, 800, "split"],
  [1200, 1600, "split"],
  [626, 890, "medium"],
  [820, 1180, "medium"],
  [1024, 1366, "medium"],
  [999, 800, "medium"],
  [1199, 1000, "medium"],
];

describe("layoutFor", () => {
  it.each(SIZES)("%i x %i is %s", (w, h, expected) => {
    expect(layoutFor(w, h)).toBe(expected);
  });
});

describe("useLayout", () => {
  it("follows window size on resize", () => {
    window.innerWidth = 390;
    window.innerHeight = 844;
    const { result } = renderHook(() => useLayout());
    expect(result.current).toBe("stack");
    act(() => {
      window.innerWidth = 844;
      window.innerHeight = 390;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe("split");
  });
});
