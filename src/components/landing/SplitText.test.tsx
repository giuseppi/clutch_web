import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetEntrance, settleEntrance } from "@/test/entrance";
import { setIntersection } from "@/test/intersection";
import { SplitText } from "./SplitText";

vi.mock("@/lib/entrance", () => import("@/test/entrance"));

afterEach(resetEntrance);

const TEXT = "Everything a serious player needs.";
const firstWordOpacity = () => Number(screen.getByText("Everything").style.opacity);
const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));

describe("SplitText", () => {
  it("names the heading with its whole text and hides the word pieces from screen readers", () => {
    render(<SplitText text={TEXT} />);
    const heading = screen.getByRole("heading", { level: 2, name: TEXT });
    expect(heading).toHaveAttribute("aria-label", TEXT);
    const words = [...heading.children];
    expect(words).toHaveLength(5);
    for (const word of words) expect(word).toHaveAttribute("aria-hidden", "true");
  });

  it("holds an in-view reveal until the entrance settles (the first shot), so the page has one entrance", async () => {
    render(<SplitText text={TEXT} />);
    act(() => setIntersection(screen.getByRole("heading"), 1));
    await wait(300);
    expect(firstWordOpacity()).toBe(0);

    act(() => settleEntrance());
    act(() => setIntersection(screen.getByRole("heading"), 1));
    await wait(300);
    expect(firstWordOpacity()).toBeGreaterThan(0);
  });
});
