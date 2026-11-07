import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEntranceStart } from "@/lib/entrance";
import { setIntersection } from "@/test/intersection";
import { SplitText } from "./SplitText";

vi.mock("@/lib/entrance", () => ({ useEntranceStart: vi.fn(() => false) }));

const TEXT = "Everything a serious player needs.";
const firstWordOpacity = () => Number(screen.getByText("Everything").style.opacity);
const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));

describe("SplitText", () => {
  it("holds an in-view reveal until the entrance starts, so it never rises ahead of the hero", async () => {
    const { rerender } = render(<SplitText text={TEXT} />);
    act(() => setIntersection(screen.getByRole("heading"), 1));
    await wait(300);
    expect(firstWordOpacity()).toBe(0);

    vi.mocked(useEntranceStart).mockReturnValue(true);
    rerender(<SplitText text={TEXT} />);
    act(() => setIntersection(screen.getByRole("heading"), 1));
    await wait(300);
    expect(firstWordOpacity()).toBeGreaterThan(0);
  });
});
