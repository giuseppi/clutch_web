import { act, render } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DRAW } from "@/lib/motion";
import { DashedDraw } from "./DashedDraw";

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

afterEach(() => vi.mocked(useReducedMotion).mockReturnValue(false));

const ARC = "M 10 80 Q 200 6 390 80";

function renderArc(show: boolean) {
  const view = render(
    <svg viewBox="0 0 400 160">
      <DashedDraw d={ARC} dash="4 4" stroke="#FF6A00" strokeWidth={1.4} show={show} />
    </svg>,
  );
  const mask = view.container.querySelector("mask path") as SVGPathElement;
  const dashed = view.container.querySelector(`path[mask]`) as SVGPathElement;
  return { ...view, mask, dashed };
}

describe("DashedDraw", () => {
  it("reveals a dashed stroke through a solid mask that has not drawn yet", () => {
    const { container, mask, dashed } = renderArc(false);
    const id = container.querySelector("mask")?.id;
    expect(dashed).toHaveAttribute("mask", `url(#${id})`);
    expect(dashed).toHaveAttribute("stroke-dasharray", "4 4");
    expect(dashed).toHaveAttribute("d", ARC);
    expect(mask).toHaveAttribute("d", ARC);
    expect(mask).toHaveAttribute("stroke", "#fff");
    expect(mask).toHaveAttribute("stroke-dashoffset", "1");
  });

  it("ends in the dashed pattern: the mask clears its dash once drawn, the stroke keeps its own", async () => {
    const { mask, dashed } = renderArc(true);
    await act(() => new Promise((r) => setTimeout(r, DRAW.duration * 1000 + 300)));
    expect(mask).toHaveAttribute("stroke-dasharray", "none");
    expect(dashed).toHaveAttribute("stroke-dasharray", "4 4");
  });

  it("starts drawn under reduced motion", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { mask, dashed } = renderArc(true);
    expect(mask).toHaveAttribute("stroke-dashoffset", "0");
    expect(mask).toHaveAttribute("stroke-dasharray", "none");
    expect(dashed).toHaveAttribute("stroke-dasharray", "4 4");
  });
});
