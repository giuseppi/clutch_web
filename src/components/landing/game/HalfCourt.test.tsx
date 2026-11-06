import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { landTime } from "./game";
import { HalfCourt } from "./HalfCourt";
import { GAME, START } from "./timeline";

const marks = (container: HTMLElement) => container.querySelectorAll("[data-mark]");

describe("HalfCourt", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows every shot and the heat of every make at the end", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    expect(container.querySelectorAll('[data-mark="make"]')).toHaveLength(8);
    expect(container.querySelectorAll('[data-mark="miss"]')).toHaveLength(5);
    expect(container.querySelectorAll("[data-heat]")).toHaveLength(8);
  });

  it("lands the first mark at 0.95 s into the first beat", () => {
    const before = render(<HalfCourt t={START + 0.94} />);
    expect(marks(before.container)).toHaveLength(0);
    before.unmount();

    const after = render(<HalfCourt t={START + 0.95} />);
    expect(marks(after.container)).toHaveLength(1);
  });

  it("fades a make's heat in over 0.6 s", () => {
    const { container } = render(<HalfCourt t={landTime(0) + 0.3} />);
    const heat = container.querySelectorAll("[data-heat]");
    expect(heat).toHaveLength(1);
    expect(Number(heat[0].getAttribute("opacity"))).toBeCloseTo(0.5);
  });

  it("draws the ball mid-flight", () => {
    const { container } = render(<HalfCourt t={START + 0.6} />);
    expect(container.querySelector("image")).not.toBeNull();
  });

  it("pops the points over a make", () => {
    const { container } = render(<HalfCourt t={landTime(1) + 0.1} />);
    expect(container.querySelector("text.font-mono")?.textContent).toBe("+3");
  });

  it("has no ball once the game is over", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    expect(container.querySelector("image")).toBeNull();
  });

  it("gives every court line pathLength 1 so it can draw in", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    const lines = container.querySelectorAll("[data-court-line]");
    expect(lines).toHaveLength(5);
    for (const line of lines) expect(line).toHaveAttribute("pathLength", "1");
  });
});
