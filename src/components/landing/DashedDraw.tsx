import { motion } from "framer-motion";
import { useId } from "react";
import { DRAW, drawHidden, drawShown } from "@/lib/motion";

interface DashedDrawProps {
  d: string;
  /** The stroke's dash pattern, for example "4 4". */
  dash: string;
  stroke: string;
  strokeWidth: number;
  /** Draws in when true, and back out when false. */
  show: boolean;
  /** Seconds before the draw starts. Default 0. */
  delay?: number;
}

/**
 * A dashed stroke that draws in along its path and ends in its dash pattern. A line draws in
 * by animating its dash, so a dashed line cannot draw that way: a solid copy of the path draws
 * in as a mask and reveals the dashed stroke under it. The mask is in user space, as a straight
 * line's bounding box has no height.
 */
export function DashedDraw({ d, dash, stroke, strokeWidth, show, delay = 0 }: DashedDrawProps) {
  // useId gives ":r1:"; colons are dropped so the id is safe inside url(#...).
  const id = `draw-${useId().replace(/:/g, "")}`;
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse">
        <motion.path
          d={d}
          pathLength={1}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth * 3}
          initial={drawHidden}
          animate={show ? drawShown : drawHidden}
          transition={{ ...DRAW, delay }}
        />
      </mask>
      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} mask={`url(#${id})`} />
    </>
  );
}
