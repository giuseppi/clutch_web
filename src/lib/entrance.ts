import { useEffect, useState } from "react";

/**
 * Resolves when the fonts are ready, so the headline words do not reflow mid-animation,
 * or after `timeoutMs` at the latest. Browsers without document.fonts (and jsdom) wait
 * for the timeout.
 */
export function entranceStart(timeoutMs = 500): Promise<void> {
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  if (!("fonts" in document)) return timeout;
  return Promise.race([document.fonts.ready.then(() => undefined), timeout]);
}

/** Once per page load: remounts (and the navbar and hero together) share one start. */
let started = false;
let waiting: Promise<void> | null = null;

/** True once the entrance has started; it stays true for the rest of the page load. */
export function useEntranceStart(): boolean {
  const [ready, setReady] = useState(started);

  useEffect(() => {
    if (ready) return;
    let live = true;
    waiting ??= entranceStart().then(() => {
      started = true;
    });
    void waiting.then(() => {
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, [ready]);

  return ready;
}
