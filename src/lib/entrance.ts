import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ENTRANCE } from "./motion";

/** Work the entrance also waits for, within the same cap (the landing page's lazy sections). */
const holds: Promise<unknown>[] = [];

/**
 * Holds the entrance until `until` settles, at most until its cap. Call it before the first
 * render. A failed `until` only ends the wait: the code that awaits it reports the failure.
 */
export function holdEntrance(until: Promise<unknown>): void {
  holds.push(until.catch(() => undefined));
}

/**
 * Resolves when the fonts are ready, so the headline words do not reflow mid-animation, and
 * any holds have settled, or after `timeoutMs` at the latest. Browsers without document.fonts
 * (and jsdom) wait for the timeout.
 */
export function entranceStart(timeoutMs = 500): Promise<void> {
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  if (!("fonts" in document)) return timeout;
  return Promise.race([Promise.all([document.fonts.ready, ...holds]).then(() => undefined), timeout]);
}

/** Once per page load: remounts (and the navbar and hero together) share one start. */
let startedAt: number | null = null;
let waiting: Promise<void> | null = null;

function whenStarted(): Promise<void> {
  waiting ??= entranceStart().then(() => {
    startedAt = performance.now();
  });
  return waiting;
}

const passed = (seconds: number) => startedAt !== null && performance.now() - startedAt >= seconds * 1000;

/** True once `seconds` have passed since the entrance started; it stays true for the page load. */
function useEntranceAfter(seconds: number): boolean {
  const [ready, setReady] = useState(() => passed(seconds));

  useEffect(() => {
    if (ready) return;
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    void whenStarted().then(() => {
      if (!live) return;
      const left = (startedAt ?? 0) + seconds * 1000 - performance.now();
      if (left <= 0) setReady(true);
      else timer = setTimeout(() => setReady(true), left);
    });
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [ready, seconds]);

  return ready;
}

/** True once the entrance has started. */
export function useEntranceStart(): boolean {
  return useEntranceAfter(0);
}

/**
 * True once the entrance has settled, at its first shot. Reveals outside the hero that are
 * on screen at load wait for it, so the page has one entrance. Under reduced motion there is
 * no entrance to wait for, so it is true from the first render.
 */
export function useEntranceSettled(): boolean {
  const settled = useEntranceAfter(ENTRANCE.firstShot);
  const reduced = useReducedMotion() ?? false;
  return settled || reduced;
}
