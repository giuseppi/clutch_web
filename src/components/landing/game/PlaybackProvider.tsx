import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { useEntranceStart } from "@/lib/entrance";
import { advance, isFastForward, type Clock } from "./playback";
import { PlaybackContext, type Playback } from "./playbackContext";
import { GAME, L_END } from "./timeline";

interface Frame extends Clock {
  ff: boolean;
}

const FIRST: Frame = { t: 0, lt: null, ff: false };
/** Reduced motion starts here, so the very first render is already final. */
const FINAL: Frame = { t: GAME, lt: L_END, ff: false };
const THRESHOLDS = [0, 0.1, 0.5, 0.6];

/** A ref callback that keeps `share` at the element's visible share, 0 when it is off screen. */
function useVisibleShare(): [(el: HTMLElement | null) => void, MutableRefObject<number>] {
  const share = useRef(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const watch = useCallback((el: HTMLElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    share.current = 0;
    if (!el) return;
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) share.current = e.isIntersecting ? e.intersectionRatio : 0;
      },
      { threshold: THRESHOLDS },
    );
    observer.current.observe(el);
  }, []);
  return [watch, share];
}

/**
 * Runs the hero clock. From the moment the entrance starts, one requestAnimationFrame loop
 * steps it with `advance`, and React state changes only when t, lt or ff does. Hidden tabs
 * get no frames, so the game pauses there, and MAX_DT stops a jump on return. The loop
 * ends once the game and the leaderboard beat are both over.
 */
export function PlaybackProvider({ children }: { children: ReactNode }) {
  const started = useEntranceStart();
  const reduced = useReducedMotion() ?? false;
  const [frame, setFrame] = useState<Frame>(() => (reduced ? FINAL : FIRST));
  const latest = useRef(frame);
  const [watchCard, card] = useVisibleShare();
  const [watchLadder, ladder] = useVisibleShare();

  useEffect(() => {
    if (!started) return;
    let id = 0;
    let last = performance.now();
    const step = (now: number) => {
      const input = { dt: (now - last) / 1000, started, reduced, ladderVisible: ladder.current, cardVisible: card.current };
      last = now;
      const prev = latest.current;
      const next = { ...advance(prev, input), ff: isFastForward(prev, input) };
      if (next.t !== prev.t || next.lt !== prev.lt || next.ff !== prev.ff) {
        latest.current = next;
        setFrame(next);
      }
      if (next.t < GAME || next.lt !== L_END) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [started, reduced, card, ladder]);

  const value = useMemo<Playback>(
    () => ({ ...frame, reduced, started, watchCard, watchLadder }),
    [frame, reduced, started, watchCard, watchLadder],
  );
  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}
