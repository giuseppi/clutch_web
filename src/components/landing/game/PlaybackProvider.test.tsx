import { act, render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePlayback } from "./playbackContext";
import { PlaybackProvider } from "./PlaybackProvider";
import { GAME, L_END } from "./timeline";

vi.mock("@/lib/entrance", () => ({ useEntranceStart: vi.fn(() => true) }));

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
});

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

const renders: { t: number; lt: number | null }[] = [];

function Clock() {
  const { t, lt } = usePlayback();
  renders.push({ t, lt });
  return <p data-testid="clock">{`${t} ${lt}`}</p>;
}

function renderClock() {
  renders.length = 0;
  return render(
    <PlaybackProvider>
      <Clock />
    </PlaybackProvider>,
  );
}

const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("PlaybackProvider", () => {
  it("plays the game to the end and holds it, with no leaderboard beat", () => {
    renderClock();
    expect(renders[0]).toEqual({ t: 0, lt: null });
    wait(18_000);
    expect(screen.getByTestId("clock").textContent).toBe(`${GAME} null`);
  });

  it("starts final under reduced motion", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    renderClock();
    expect(renders[0]).toEqual({ t: GAME, lt: L_END });
  });

  it("runs no frames after it unmounts", () => {
    const { unmount } = renderClock();
    wait(1000);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    const count = renders.length;
    wait(1000);
    expect(renders.length).toBe(count);
  });

  it("throws when used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Clock />)).toThrow(/PlaybackProvider/);
    vi.mocked(console.error).mockRestore();
  });
});
