import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetEntrance, settleEntrance } from "@/test/entrance";
import { setIntersection } from "@/test/intersection";
import FeaturesPolaroidGrid from "./FeaturesPolaroidGrid";

vi.mock("@/lib/entrance", () => import("@/test/entrance"));

const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));

describe("FeaturesPolaroidGrid", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    resetEntrance();
  });

  it("holds its reveals until the entrance settles, so the page has one entrance", async () => {
    const { container } = render(<FeaturesPolaroidGrid />);
    const intro = screen.getByText(/^Four systems running/);
    const cards = [...container.querySelectorAll("article")];
    expect(cards).toHaveLength(4);
    const showAll = () => act(() => [intro, ...cards].forEach((el) => setIntersection(el, 1)));
    const opacities = () => [intro, ...cards].map((el) => Number(el.style.opacity));

    showAll();
    await wait(900);
    expect(opacities()).toEqual([0, 0, 0, 0, 0]);

    act(() => settleEntrance());
    showAll();
    await wait(900);
    for (const opacity of opacities()) expect(opacity).toBeGreaterThan(0);
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
