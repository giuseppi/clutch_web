import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setIntersection } from "@/test/intersection";
import FeaturesPolaroidGrid from "./FeaturesPolaroidGrid";

describe("FeaturesPolaroidGrid", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("stops the globe off screen", () => {
    vi.useFakeTimers();
    const raf = vi.spyOn(window, "requestAnimationFrame");
    render(<FeaturesPolaroidGrid />);
    const globe = screen.getByTestId("court-globe");

    act(() => setIntersection(globe, 0.5));
    expect(raf).toHaveBeenCalled();

    act(() => setIntersection(globe, 0));
    raf.mockClear();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(raf).not.toHaveBeenCalled();
  });
});
