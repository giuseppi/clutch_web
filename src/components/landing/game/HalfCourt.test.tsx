import { act, render } from "@testing-library/react";
import { motion } from "framer-motion";
import { describe, expect, it } from "vitest";
import { DRAW, ENTRANCE } from "@/lib/motion";
import { HOOP, INK, landTime } from "./game";
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

  it("draws every court line as a path with pathLength 1 so it can draw in", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    const lines = container.querySelectorAll("[data-court-line]");
    expect(lines).toHaveLength(5);
    for (const line of lines) {
      expect(line.tagName).toBe("path");
      expect(line).toHaveAttribute("pathLength", "1");
    }
  });

  it("clears each line's dash once it has drawn in, so closed shapes and arcs end closed", async () => {
    const { container } = render(
      <motion.div initial="hidden" animate="visible">
        <HalfCourt t={0} />
      </motion.div>,
    );
    const lines = [...container.querySelectorAll("[data-court-line]")];
    for (const line of lines) expect(line).toHaveAttribute("stroke-dashoffset", "1");
    await act(() => new Promise((r) => setTimeout(r, (ENTRANCE.courtLines + DRAW.duration) * 1000 + 300)));
    for (const line of lines) {
      expect(line).toHaveAttribute("stroke-dashoffset", "0");
      expect(line).toHaveAttribute("stroke-dasharray", "none");
    }
  });

  it("joins the corner threes to the 23.75 ft arc at (-22, 14.2) and (22, 14.2)", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    const d = container.querySelector('[data-court-line="three"]')?.getAttribute("d") ?? "";
    const n = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    // M x0 y0 L x1 y1 A rx ry rot large sweep x2 y2 L x3 y3
    expect(n).toEqual([-22, 0, -22, 14.2, 23.75, 23.75, 0, 0, 0, 22, 14.2, 22, 0]);
    expect(Math.hypot(22 - HOOP.x, 14.2 - HOOP.y)).toBeCloseTo(23.75, 2);
  });

  it("puts the backboard at y = 4 and the rim at the hoop, joined by a connector", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    const board = container.querySelector("[data-backboard]");
    expect([board?.getAttribute("x1"), board?.getAttribute("x2"), board?.getAttribute("y1"), board?.getAttribute("y2")]).toEqual([
      "-3",
      "3",
      "4",
      "4",
    ]);
    const rim = container.querySelector("[data-rim]");
    expect([rim?.getAttribute("cx"), rim?.getAttribute("cy"), rim?.getAttribute("r")]).toEqual(["0", "5.25", "0.75"]);
    expect(rim).toHaveAttribute("stroke-width", "0.16");
    const connector = container.querySelector("[data-connector]");
    expect([connector?.getAttribute("y1"), connector?.getAttribute("y2")]).toEqual(["4", "4.5"]);
  });

  it("leaves the lane's top edge to the baseline, so the baseline is drawn once", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    expect(container.querySelector('[data-court-line="lane"]')).toHaveAttribute("d", "M -8 0 V 19 H 8 V 0");
  });

  it("draws the lines as one layer of ink at 38%, so crossings and joins do not darken", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    const layer = container.querySelector("[data-court-line]")?.parentElement;
    expect(layer).toHaveAttribute("stroke", INK);
    expect(layer).toHaveAttribute("opacity", "0.38");
  });

  it("keeps misses heavier than the rim", () => {
    const { container } = render(<HalfCourt t={GAME} />);
    expect(container.querySelector('[data-mark="miss"]')).toHaveAttribute("stroke-width", "0.28");
  });
});
