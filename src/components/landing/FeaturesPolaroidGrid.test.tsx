import { act, render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetEntrance, settleEntrance } from "@/test/entrance";
import { setIntersection } from "@/test/intersection";
import FeaturesPolaroidGrid from "./FeaturesPolaroidGrid";

vi.mock("@/lib/entrance", () => import("@/test/entrance"));
vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));

describe("FeaturesPolaroidGrid", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.mocked(useReducedMotion).mockReturnValue(false);
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

  it("starts its bars, line and numbers drawn under reduced motion, off screen or not", () => {
    const firstRender = () => {
      const { container, unmount } = render(<FeaturesPolaroidGrid />);
      const styled = [...container.querySelectorAll<HTMLElement>("div[style]")];
      const shown = {
        bars: styled.filter((el) => el.style.width).map((el) => el.style.width),
        columns: styled.filter((el) => el.style.height).map((el) => el.style.height),
        line: (container.querySelector("polyline") as SVGPolylineElement).style.strokeDashoffset,
        rating: container.querySelector("article:nth-of-type(2) .tabular-nums")?.textContent,
      };
      unmount();
      return shown;
    };

    expect(firstRender()).toEqual({ bars: ["0%", "0%", "0%"], columns: ["0%", "0%", "0%", "0%", "0%"], line: "200", rating: "0" });

    vi.mocked(useReducedMotion).mockReturnValue(true);
    expect(firstRender()).toEqual({ bars: ["54%", "39%", "81%"], columns: ["40%", "52%", "48%", "65%", "78%"], line: "0", rating: "1247" });
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
