import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { useEntranceStart } from "@/lib/entrance";
import { advance, isFastForward, isIdle } from "./playback";
import { PlaybackContext, pageClock, type Frame, type Playback } from "./playbackContext";
import { GAME, L_END } from "./timeline";

/** Reduced motion starts here, so the very first render is already final. */
const FINAL: Frame = { t: GAME, lt: L_END, ff: false };
const THRESHOLDS = [0, 0.1, 0.5, 0.6];

/**
 * A ref callback that keeps `share` at the element's visible share, 0 when it is off screen,
 * and calls `onChange` when it moves.
 */
function useVisibleShare(onChange: MutableRefObject<() => void>): [(el: HTMLElement | null) => void, MutableRefObject<number>] {
  const share = useRef(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const watch = useCallback(
    (el: HTMLElement | null) => {
      observer.current?.disconnect();
      observer.current = null;
      share.current = 0;
      if (!el) return;
      observer.current = new IntersectionObserver(
        (entries) => {
          for (const e of entries) share.current = e.isIntersecting ? e.intersectionRatio : 0;
          onChange.current();
        },
        { threshold: THRESHOLDS },
      );
      observer.current.observe(el);
    },
    [onChange],
  );
  return [watch, share];
}

/**
 * Runs the hero clock. From the moment the entrance starts, a requestAnimationFrame loop steps
 * it with `advance`, and React state changes only when t, lt or ff does. The loop stops when
 * no frame can change the clock (isIdle) and the visibility observers start it again. Hidden
 * tabs get no frames, so the game pauses there, and MAX_DT stops a jump on return. The clock
 * lives in `pageClock`, so a remount resumes it instead of replaying the game.
 */
export function PlaybackProvider({ children }: { children: ReactNode }) {
  const started = useEntranceStart();
  const reduced = useReducedMotion() ?? false;
  const [frame, setFrame] = useState<Frame>(() => (reduced ? FINAL : pageClock.current));
  const kick = useRef(() => {});
  const [watchCard, card] = useVisibleShare(kick);
  const [watchLadder, ladder] = useVisibleShare(kick);

  useEffect(() => {
    if (!started) return;
    let id = 0;
    let last = 0;
    const step = (now: number) => {
      const input = { dt: (now - last) / 1000, started, reduced, ladderVisible: ladder.current, cardVisible: card.current };
      last = now;
      const prev = pageClock.current;
      const next = { ...advance(prev, input), ff: isFastForward(prev, input) };
      if (next.t !== prev.t || next.lt !== prev.lt || next.ff !== prev.ff) {
        pageClock.current = next;
        setFrame(next);
      }
      id = isIdle(next, ladder.current) ? 0 : requestAnimationFrame(step);
    };
    // (Re)start the loop, timing its first frame from now rather than from before it stopped.
    kick.current = () => {
      if (id || isIdle(pageClock.current, ladder.current)) return;
      last = performance.now();
      id = requestAnimationFrame(step);
    };
    kick.current();
    return () => {
      cancelAnimationFrame(id);
      kick.current = () => {};
    };
  }, [started, reduced, card, ladder]);

  const value = useMemo<Playback>(
    () => ({ ...frame, reduced, started, watchCard, watchLadder }),
    [frame, reduced, started, watchCard, watchLadder],
  );
  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}
