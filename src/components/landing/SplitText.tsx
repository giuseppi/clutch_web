import { motion } from "framer-motion";
import { memo } from "react";
import { useEntranceSettled } from "@/lib/entrance";
import { riseVariants, STAGGER } from "@/lib/motion";

interface SplitTextProps {
  text: string;
  /** Seconds to wait before the first word rises. Default 0. */
  delay?: number;
  /** Rise when entering the viewport, once, and not before the entrance settles. Default true. */
  whileInView?: boolean;
  /** Rise on mount when whileInView is false. Default true. */
  play?: boolean;
  /** Show the risen words at once, with no animation (reduced motion). Default false. */
  instant?: boolean;
  className?: string;
  as?: keyof Pick<HTMLElementTagNameMap, "h1" | "h2" | "h3" | "p" | "span">;
}

/**
 * Splits text by word. Each word rises with the shared RISE motion, STAGGER
 * apart. Words stay whole inline-block units so they wrap naturally. Memoized:
 * the hero headline sits in a parent that renders on every game frame.
 */
export const SplitText = memo(function SplitText({
  text,
  delay = 0,
  whileInView = true,
  play = true,
  instant = false,
  className = "",
  as: Tag = "h2",
}: SplitTextProps) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  // A heading already on screen below a short hero would otherwise rise during the hero's entrance.
  const settled = useEntranceSettled();

  return (
    <MotionTag
      className={className}
      initial={instant ? false : "hidden"}
      whileInView={whileInView && settled ? "visible" : undefined}
      animate={whileInView ? undefined : play || instant ? "visible" : "hidden"}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delayChildren: delay, staggerChildren: STAGGER }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <motion.span className="inline-block" variants={riseVariants}>
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </MotionTag>
  );
});
