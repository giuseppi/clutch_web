import { useLayoutEffect, useRef, type RefObject } from "react";
import { GREEN } from "./cardStyle";
import { inFlight, tokenAt, type Point } from "./ladder";
import { usePlayback } from "./playbackContext";

export interface MmrTokenProps {
  /** The positioned box the token is drawn in, around the hero and the leaderboard. */
  stageRef: RefObject<HTMLElement>;
  /** The live card's MMR chip value, where the token leaves from. */
  fromRef: RefObject<HTMLElement>;
  /** Giuseppi's MMR on the ladder, where it lands. */
  toRef: RefObject<HTMLElement>;
}

const TOKEN =
  "pointer-events-none absolute left-0 top-0 z-[6] whitespace-nowrap rounded-full border-[0.5px] border-[rgba(0,165,124,.35)] bg-white px-[.65em] py-[.2em] font-mono font-medium leading-[1.2] shadow-[0_8px_22px_rgba(0,0,0,.16)] [will-change:transform,opacity]";

/** An element's centre relative to the stage's top left. */
function centre(el: HTMLElement, stage: DOMRect): Point {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 - stage.left, y: r.top + r.height / 2 - stage.top };
}

/**
 * The winner's "+14", flying from the live card into the ladder during the leaderboard beat.
 * It renders only during the flight. After each commit of the flight, a layout effect
 * measures both ends against the stage, so the frame uses this frame's layout (a scroll or a
 * resize mid-flight keeps it on course), and writes the transform and opacity straight to
 * the element: no state per frame. It moves by transform only, sized like the chip it lifts
 * off. Under reduced motion lt starts at the end, so it never shows.
 */
export function MmrToken({ stageRef, fromRef, toRef }: MmrTokenProps) {
  const { lt } = usePlayback();
  const tokenRef = useRef<HTMLSpanElement>(null);
  const flying = lt !== null && inFlight(lt);

  useLayoutEffect(() => {
    const token = tokenRef.current;
    const stage = stageRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (lt === null || !token || !stage || !from || !to) return;
    const origin = stage.getBoundingClientRect();
    const frame = tokenAt(lt, centre(from, origin), centre(to, origin));
    if (!frame) return;
    token.style.fontSize = getComputedStyle(from).fontSize;
    token.style.opacity = String(frame.opacity);
    token.style.transform = `translate(${frame.x}px, ${frame.y}px) translate(-50%, -50%) scale(${frame.scale})`;
  }, [lt, stageRef, fromRef, toRef]);

  if (!flying) return null;
  // Hidden until the effect has placed it; React sets these once, so the effect's writes stay.
  return (
    <span ref={tokenRef} aria-hidden="true" data-testid="mmr-token" className={TOKEN} style={{ color: GREEN, opacity: 0 }}>
      +14
    </span>
  );
}
