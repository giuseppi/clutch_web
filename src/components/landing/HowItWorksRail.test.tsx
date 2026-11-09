import { render } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
