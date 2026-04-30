import { motion, type Variants } from "framer-motion";

interface SplitTextProps {
  text: string;
  /** Stagger delay between characters in seconds. Default 0.025. */
  stagger?: number;
  /** Per-character animation duration in seconds. Default 0.6. */
  duration?: number;
  /** Trigger reveal once when entering viewport. Default true. */
  whileInView?: boolean;
  /** Initial Y offset in pixels. Default 28. */
  y?: number;
  className?: string;
  as?: keyof Pick<HTMLElementTagNameMap, "h1" | "h2" | "h3" | "p" | "span">;
}

const charVariants: Variants = {
  hidden: (y: number) => ({ opacity: 0, y }),
  visible: { opacity: 1, y: 0 },
};

/**
 * Splits text by word and character. Each character animates independently,
 * with words preserved as inline-block units so they wrap naturally without
 * breaking apart mid-word. Whitespace between words is preserved as a
 * non-staggered span.
 */
export const SplitText = ({
  text,
  stagger = 0.025,
  duration = 0.6,
  whileInView = true,
  y = 28,
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
      animate={whileInView ? undefined : "visible"}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger }}
    >
      {words.map((word, wIdx) => (
        <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, cIdx) => (
            <motion.span
              key={`${char}-${cIdx}`}
              className="inline-block"
              custom={y}
              variants={charVariants}
              transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            >
              {char}
            </motion.span>
          ))}
          {wIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
};
