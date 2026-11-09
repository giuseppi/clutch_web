import { act, render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetEntrance, settleEntrance } from "@/test/entrance";
import { setIntersection } from "@/test/intersection";
import { firstShown, sampleOpacities } from "@/test/reveal";
import HowItWorksRail from "./HowItWorksRail";

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));
vi.mock("@/lib/entrance", () => import("@/test/entrance"));

beforeEach(() => {
  // jsdom has no media playback; the demo step pauses its video while off screen.
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(useReducedMotion).mockReturnValue(false);
  resetEntrance();
});

/** The first render, with no step on screen: what a reader sees before anything animates. */
function firstRender() {
  const { container } = render(<HowItWorksRail />);
  const [setup, shot, , stats] = [...container.querySelectorAll("article")];
  const opacity = (el: Element | undefined | null) => el?.getAttribute("opacity");
  return {
    phone: opacity(setup.querySelector('path[d^="M 44 42"]')),
    locked: opacity([...setup.querySelectorAll("text")].find((t) => t.textContent === "LOCKED")),
    swish: opacity([...shot.querySelectorAll("text")].find((t) => t.textContent === "SWISH")),
    ball: shot.querySelector('circle[r="5"]'),
    bars: [...stats.querySelectorAll<HTMLElement>("div[style]")].map((bar) => bar.style.height),
    count: stats.querySelector(".tabular-nums")?.textContent,
  };
}

describe("HowItWorksRail", () => {
  it("waits for each step to come on screen before it draws", () => {
    const step = firstRender();
    expect(step.phone).toBe("0");
    expect(step.locked).toBe("0");
    expect(step.swish).toBe("0");
    expect(step.ball).not.toHaveAttribute("cx");
    expect(step.bars).toEqual(["0%", "0%", "0%", "0%", "0%", "0%", "0%"]);
    expect(step.count).toBe("0%");
  });

  it("waits for the entrance to settle, then reveals the header and only after it the steps", async () => {
    const { container } = render(<HowItWorksRail />);
    const firstWord = screen.getByText("Four");
    const lines = firstWord.closest("h2")?.parentElement as HTMLElement;
    const panel = container.querySelector(".sticky") as HTMLElement;
    const steps = panel.firstElementChild as HTMLElement;
    const opacities = () => [Number(firstWord.style.opacity), Number(steps.style.opacity)];
    // The header and the first step on screen at once, as on a load of /#how-it-works.
    act(() => {
      setIntersection(lines, 1);
      setIntersection(panel, 1);
      for (const article of container.querySelectorAll("article")) setIntersection(article, 1);
    });
    const before = await sampleOpacities(opacities, 600);
    expect(before.every(([head, step]) => head === 0 && step === 0)).toBe(true);
    expect(container.querySelector('path[d^="M 44 42"]')).toHaveAttribute("opacity", "0");

    act(() => settleEntrance());
    const after = await sampleOpacities(opacities, 1400);
    expect(firstShown(after, 0)).toBeGreaterThanOrEqual(0);
    expect(firstShown(after, 1)).toBeGreaterThan(firstShown(after, 0));
    expect(after.every(([head, step]) => step === 0 || head > 0)).toBe(true);
  });

  it("starts every step at its end state under reduced motion, on screen or not", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const step = firstRender();
    expect(step.phone).toBe("1");
    expect(step.locked).toBe("1");
    expect(step.swish).toBe("1");
    // The ball rests at the rim instead of travelling the arc.
    expect(step.ball).toHaveAttribute("cx", "311");
    expect(step.ball).toHaveAttribute("cy", "70");
    expect(step.ball?.querySelector("animateMotion")).toBeNull();
    expect(step.bars).toEqual(["38%", "45%", "52%", "49%", "58%", "64%", "71%"]);
    expect(step.count).toBe("71%");
  });
});
