import { act, render } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FlipNumber } from "./FlipNumber";

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const layers = (container: HTMLElement) => container.querySelectorAll(".flip-half");
const text = (container: HTMLElement, selector: string) => container.querySelector(selector)?.textContent;
const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("FlipNumber", () => {
  it("renders the first value as plain text", () => {
    const { container } = render(<FlipNumber value="0" />);
    expect(root(container).textContent).toBe("0");
    expect(layers(container)).toHaveLength(0);
  });

  it("flips to a new value, then settles to plain text after 440 ms", () => {
    const { container, rerender } = render(<FlipNumber value="0" />);
    rerender(<FlipNumber value="2" />);
    expect(layers(container)).toHaveLength(4);
    expect(text(container, ".flip-out")).toBe("0");
    expect(text(container, ".flip-in")).toBe("2");

    wait(439);
    expect(layers(container)).toHaveLength(4);
    wait(1);
    expect(root(container).textContent).toBe("2");
    expect(layers(container)).toHaveLength(0);
  });

  it("settles after 170 ms when quick", () => {
    const { container, rerender } = render(<FlipNumber value="0" quick />);
    rerender(<FlipNumber value="2" quick />);
    expect(layers(container)).toHaveLength(4);
    expect(root(container)).toHaveClass("quick");
    wait(169);
    expect(layers(container)).toHaveLength(4);
    wait(1);
    expect(root(container).textContent).toBe("2");
    expect(layers(container)).toHaveLength(0);
  });

  it("keeps a quick flip quick when quick turns off mid-flip", () => {
    const { container, rerender } = render(<FlipNumber value="0" quick />);
    rerender(<FlipNumber value="2" quick />);
    wait(100);
    rerender(<FlipNumber value="2" quick={false} />);
    expect(root(container)).toHaveClass("quick");
    expect(layers(container)).toHaveLength(4);
    wait(69);
    expect(layers(container)).toHaveLength(4);
    wait(1);
    expect(root(container).textContent).toBe("2");
    expect(layers(container)).toHaveLength(0);
  });

  it("puts every half directly under the perspective element, hidden from assistive tech", () => {
    const { container, rerender } = render(<FlipNumber value="0" />);
    rerender(<FlipNumber value="2" />);
    for (const half of layers(container)) {
      expect(half.parentElement).toBe(root(container));
      expect(half).toHaveAttribute("aria-hidden", "true");
    }
    expect(container.querySelector(".flip-size")?.textContent).toBe("2");
  });

  it("restarts from the last value when a change lands mid-flip", () => {
    const { container, rerender } = render(<FlipNumber value="0" />);
    rerender(<FlipNumber value="2" />);
    wait(100);
    rerender(<FlipNumber value="5" />);
    expect(text(container, ".flip-out")).toBe("2");
    expect(text(container, ".flip-in")).toBe("5");

    // Past the first flip's 440 ms: the restarted flip is still running.
    wait(345);
    expect(layers(container)).toHaveLength(4);
    wait(95);
    expect(root(container).textContent).toBe("5");
    expect(layers(container)).toHaveLength(0);
  });

  it("swaps the number with no layers under reduced motion", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container, rerender } = render(<FlipNumber value="0" />);
    rerender(<FlipNumber value="2" />);
    expect(root(container).textContent).toBe("2");
    expect(layers(container)).toHaveLength(0);
  });

  it("passes className and style to the root", () => {
    const { container } = render(<FlipNumber value="7" className="score" style={{ color: "rgb(1, 2, 3)" }} />);
    expect(root(container)).toHaveClass("flip-num", "score");
    expect(root(container)).toHaveStyle({ color: "rgb(1, 2, 3)" });
  });
});
