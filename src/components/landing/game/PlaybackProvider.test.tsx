import { act, render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setIntersection } from "@/test/intersection";
import { pageClock, usePlayback } from "./playbackContext";
import { PlaybackProvider } from "./PlaybackProvider";
import { GAME, L_END } from "./timeline";

vi.mock("@/lib/entrance", () => ({ useEntranceStart: vi.fn(() => true) }));

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  // A fresh page load.
  pageClock.current = { t: 0, lt: null, ff: false };
});

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

const renders: { t: number; lt: number | null }[] = [];

function Clock() {
  const { t, lt, watchLadder } = usePlayback();
  renders.push({ t, lt });
  return (
    <>
      <p data-testid="clock">{`${t} ${lt}`}</p>
      <div data-testid="ladder" ref={watchLadder} />
    </>
  );
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

const last = () => renders[renders.length - 1];

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

  it("resumes from the page-load clock on a remount instead of replaying", () => {
    const first = renderClock();
    wait(6000);
    const paused = last().t;
    expect(paused).toBeGreaterThan(1);
    first.unmount();
    wait(2000);

    renderClock();
    expect(renders[0].t).toBe(paused);
    wait(1000);
    expect(last().t).toBeGreaterThan(paused);
  });

  it("shows the final clock at once on a remount after the game", () => {
    const first = renderClock();
    wait(18_000);
    first.unmount();
    renderClock();
    expect(renders[0].t).toBe(GAME);
  });

  it("stops its frame loop once nothing can change, and restarts when the ladder comes into view", () => {
    renderClock();
    wait(18_000);
    expect(last().t).toBe(GAME);
    expect(vi.getTimerCount()).toBe(0);

    act(() => setIntersection(screen.getByTestId("ladder"), 0.6));
    expect(vi.getTimerCount()).toBe(1);
    wait(3000);
    expect(last().lt).toBe(L_END);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("throws when used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Clock />)).toThrow(/PlaybackProvider/);
    vi.mocked(console.error).mockRestore();
  });
});
