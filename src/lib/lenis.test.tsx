import { render } from "@testing-library/react";
import Lenis from "lenis";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LenisProvider } from "./lenis";

vi.mock("lenis");

const mockMatchMedia = (reduce: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
};

describe("LenisProvider", () => {
  afterEach(() => {
    vi.mocked(Lenis).mockClear();
  });

  it("does not start Lenis under reduced motion", () => {
    mockMatchMedia(true);
    render(<LenisProvider>x</LenisProvider>);
    expect(Lenis).not.toHaveBeenCalled();
  });

  it("starts Lenis once otherwise", () => {
    mockMatchMedia(false);
    render(<LenisProvider>x</LenisProvider>);
    expect(Lenis).toHaveBeenCalledTimes(1);
  });
});
