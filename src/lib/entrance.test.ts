import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ENTRANCE } from "./motion";

/* framer's reduced-motion answer, per test (the module is re-imported fresh each time). */
const motion = vi.hoisted(() => ({ reduced: false }));
vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: () => motion.reduced,
}));

/* entrance.ts keeps its state for the page load, so every test imports a fresh copy. */
let entrance: typeof import("./entrance");

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
  vi.resetModules();
  entrance = await import("./entrance");
});

afterEach(() => {
  Reflect.deleteProperty(document, "fonts");
  vi.useRealTimers();
  motion.reduced = false;
});

function setFontsReady(ready: Promise<unknown>) {
  Object.defineProperty(document, "fonts", { value: { ready }, configurable: true });
}

/** Starts entranceStart and reports whether it has resolved after each wait. */
function track() {
  let done = false;
  void entrance.entranceStart().then(() => {
    done = true;
  });
  return async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
    return done;
  };
}

const wait = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

describe("entranceStart", () => {
  it("resolves at 500 ms when the browser has no document.fonts", async () => {
    expect("fonts" in document).toBe(false);
    const after = track();
    expect(await after(499)).toBe(false);
    expect(await after(1)).toBe(true);
  });

  it("resolves when the fonts are ready, if that comes first", async () => {
    setFontsReady(new Promise((resolve) => setTimeout(resolve, 100)));
    const after = track();
    expect(await after(99)).toBe(false);
    expect(await after(1)).toBe(true);
  });

  it("resolves at 500 ms when the fonts never get ready", async () => {
    setFontsReady(new Promise(() => {}));
    const after = track();
    expect(await after(499)).toBe(false);
    expect(await after(1)).toBe(true);
  });

  it("waits for a hold's release as well as the fonts, within the same cap", async () => {
    setFontsReady(Promise.resolve());
    const release = entrance.holdEntrance(Promise.resolve());
    setTimeout(release, 200);
    const after = track();
    expect(await after(199)).toBe(false);
    expect(await after(1)).toBe(true);
  });

  it("keeps waiting after the load until the release, at most until 500 ms", async () => {
    setFontsReady(Promise.resolve());
    entrance.holdEntrance(Promise.resolve());
    const after = track();
    expect(await after(499)).toBe(false);
    expect(await after(1)).toBe(true);
  });

  it("stops waiting when the load fails, and at 500 ms for one that never settles", async () => {
    setFontsReady(Promise.resolve());
    entrance.holdEntrance(new Promise((_, reject) => setTimeout(() => reject(new Error("chunk")), 50)));
    const failed = track();
    expect(await failed(50)).toBe(true);

    vi.resetModules();
    entrance = await import("./entrance");
    entrance.holdEntrance(new Promise(() => {}));
    const stuck = track();
    expect(await stuck(499)).toBe(false);
    expect(await stuck(1)).toBe(true);
  });
});

describe("useEntranceStart", () => {
  it("turns true once the entrance starts, and a remount does not wait again", async () => {
    const first = renderHook(() => entrance.useEntranceStart());
    expect(first.result.current).toBe(false);
    await wait(500);
    expect(first.result.current).toBe(true);
    first.unmount();

    const again = renderHook(() => entrance.useEntranceStart());
    expect(again.result.current).toBe(true);
  });
});

describe("useEntranceSettled", () => {
  it("turns true at the first shot after the start, not at the start", async () => {
    const settle = ENTRANCE.firstShot * 1000;
    const start = renderHook(() => entrance.useEntranceStart());
    const settled = renderHook(() => entrance.useEntranceSettled());
    await wait(500);
    expect(start.result.current).toBe(true);
    expect(settled.result.current).toBe(false);
    await wait(settle - 1);
    expect(settled.result.current).toBe(false);
    await wait(1);
    expect(settled.result.current).toBe(true);
  });

  it("is true on the first render under reduced motion, with no entrance to wait for", () => {
    motion.reduced = true;
    expect(renderHook(() => entrance.useEntranceSettled()).result.current).toBe(true);
  });

  it("is true at once on a mount after the settle", async () => {
    const first = renderHook(() => entrance.useEntranceSettled());
    await wait(500 + ENTRANCE.firstShot * 1000);
    expect(first.result.current).toBe(true);
    expect(renderHook(() => entrance.useEntranceSettled()).result.current).toBe(true);
  });
});
