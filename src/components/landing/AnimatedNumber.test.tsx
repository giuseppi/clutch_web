import { act, render } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnimatedNumber } from "./AnimatedNumber";

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

describe("AnimatedNumber", () => {
  it("counts up to its value once in view", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "requestAnimationFrame", "performance"] });
    const { container, rerender } = render(<AnimatedNumber value={71} inView={false} decimals={0} duration={100} />);
    expect(container.textContent).toBe("0");
    rerender(<AnimatedNumber value={71} inView decimals={0} duration={100} />);
    act(() => vi.advanceTimersByTime(50));
    expect(Number(container.textContent)).toBeGreaterThan(0);
    expect(Number(container.textContent)).toBeLessThan(71);
    act(() => vi.advanceTimersByTime(100));
    expect(container.textContent).toBe("71");
  });

  it("shows its value at once under reduced motion, in view or not", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const raf = vi.spyOn(window, "requestAnimationFrame");
    const { container } = render(<AnimatedNumber value={18.4} inView={false} suffix="%" />);
    expect(container.textContent).toBe("18.4%");
    expect(raf).not.toHaveBeenCalled();
    raf.mockRestore();
  });
});
