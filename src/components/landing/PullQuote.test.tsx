import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetEntrance, settleEntrance } from "@/test/entrance";
import { setIntersection } from "@/test/intersection";
import { firstShown, sampleOpacities } from "@/test/reveal";
import PullQuote from "./PullQuote";

vi.mock("@/lib/entrance", () => import("@/test/entrance"));

afterEach(resetEntrance);

describe("PullQuote", () => {
  it("waits for the entrance to settle, then shows the label and the quote, and only after them the signature", async () => {
    render(<PullQuote />);
    const label = screen.getByText("A NOTE ON PURPOSE");
    const quote = screen.getByText(/Talent is everywhere/);
    const signature = screen.getByText("THE CLUTCH TEAM").parentElement as HTMLElement;
    const opacities = () => [label, quote, signature].map((el) => Number(el.style.opacity));
    // Everything on screen at once, as on a reload that restores the scroll here.
    act(() => {
      for (const el of [label.parentElement as HTMLElement, label, quote, signature]) setIntersection(el, 1);
    });
    const before = await sampleOpacities(opacities, 600);
    expect(before.every((o) => o.every((x) => x === 0))).toBe(true);

    act(() => settleEntrance());
    const after = await sampleOpacities(opacities, 1400);
    expect(firstShown(after, 1)).toBeGreaterThanOrEqual(0);
    expect(firstShown(after, 2)).toBeGreaterThan(firstShown(after, 1));
    expect(after.every(([l, q, s]) => s === 0 || (l > 0 && q > 0))).toBe(true);
  });
});
