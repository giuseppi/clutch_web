import { motion } from "framer-motion";
import { riseVariants, STAGGER } from "@/lib/motion";

interface SplitTextProps {
  text: string;
  /** Seconds to wait before the first word rises. Default 0. */
  delay?: number;
  /** Rise when entering the viewport, once. Default true. */
  whileInView?: boolean;
  /** Rise on mount when whileInView is false. Default true. */
  play?: boolean;
  /** Seconds between words. Default STAGGER. */
  stagger?: number;
  className?: string;
  as?: keyof Pick<HTMLElementTagNameMap, "h1" | "h2" | "h3" | "p" | "span">;
}

/**
 * Splits text by word. Each word rises with the shared RISE motion, STAGGER
 * apart. Words stay whole inline-block units so they wrap naturally.
 */
export const SplitText = ({
  text,
  delay = 0,
  whileInView = true,
  play = true,
  stagger = STAGGER,
  className = "",
  as: Tag = "h2",
}: SplitTextProps) => {
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView={whileInView ? "visible" : undefined}
      animate={whileInView ? undefined : play ? "visible" : "hidden"}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
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
};
