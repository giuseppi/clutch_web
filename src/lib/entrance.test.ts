import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { entranceStart, useEntranceStart } from "./entrance";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  Reflect.deleteProperty(document, "fonts");
  vi.useRealTimers();
});

function setFontsReady(ready: Promise<unknown>) {
  Object.defineProperty(document, "fonts", { value: { ready }, configurable: true });
}

/** Starts entranceStart and reports whether it has resolved after each wait. */
function track() {
  let done = false;
  void entranceStart().then(() => {
    done = true;
  });
  return async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
    return done;
  };
}

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
});

describe("useEntranceStart", () => {
  it("turns true once the entrance starts, and a remount does not wait again", async () => {
    const first = renderHook(() => useEntranceStart());
    expect(first.result.current).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(first.result.current).toBe(true);
    first.unmount();

    const again = renderHook(() => useEntranceStart());
    expect(again.result.current).toBe(true);
  });
});
