import { useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { ENTRANCE } from "./motion";

/** Work the entrance also waits for, within the same cap (the landing page's lazy sections). */
const holds: Promise<unknown>[] = [];

/**
 * Holds the entrance until the returned release is called, at most until its cap. Call it
 * before the first render. If `loading` fails first, the wait ends at once: the code that
 * awaits `loading` reports the failure.
 */
export function holdEntrance(loading: Promise<unknown>): () => void {
  let release: () => void = () => {};
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  holds.push(loading.then(() => released).catch(() => undefined));
  return release;
}

/*
  The faces the entrance sets: the hero headline (Geist 600) and the live card's numbers and
  labels (Geist Mono 500). Each is one variable file, so these load every weight in use. They
  are asked for by name: document.fonts.ready can resolve before a face is even requested
  (WebKit, on the first synchronous render).
*/
const ENTRANCE_FONTS = ["600 1em Geist", '500 1em "Geist Mono"'];

function entranceFonts(): Promise<unknown> {
  return Promise.all(ENTRANCE_FONTS.map((font) => document.fonts.load(font))).catch((error: unknown) => {
    console.error("[entrance] A font did not load, so the entrance starts without it:", error);
  });
}

/**
 * Resolves when the entrance's fonts have loaded, so the headline words do not reflow
 * mid-animation, and any holds have settled, or after `timeoutMs` at the latest. Browsers
 * without document.fonts (and jsdom) wait for the timeout.
 */
export function entranceStart(timeoutMs = 500): Promise<void> {
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  if (!("fonts" in document)) return timeout;
  return Promise.race([Promise.all([entranceFonts(), ...holds]).then(() => undefined), timeout]);
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

/*
  The settle wait is only for content that shares the screen with the hero's entrance. Once
  the hero has been off screen (a load of /#download, a reload that restores a scroll below
  it, or a reader who scrolls on before the first shot), nothing waits for it any more, for
  the rest of the page load.
*/
let offStage = false;
const offStageListeners = new Set<() => void>();

function subscribeOffStage(listener: () => void) {
  offStageListeners.add(listener);
  return () => {
    offStageListeners.delete(listener);
  };
}

/** Marks the element the entrance plays in (the hero), so useEntranceSettled knows when it is off screen. */
export function useEntranceStage(ref: RefObject<Element | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || offStage) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting || offStage) return;
      offStage = true;
      observer.disconnect();
      for (const listener of offStageListeners) listener();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

/**
 * True once the entrance has settled, at its first shot. Reveals outside the hero that are
 * on screen at load wait for it, so the page has one entrance. It is true at once when the
 * hero is off screen (see useEntranceStage), and from the first render under reduced motion,
 * with no entrance to wait for.
 */
export function useEntranceSettled(): boolean {
  const settled = useEntranceAfter(ENTRANCE.firstShot);
  const away = useSyncExternalStore(subscribeOffStage, () => offStage);
  const reduced = useReducedMotion() ?? false;
  return settled || away || reduced;
}
