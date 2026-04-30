import { motion } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

/**
 * First-paint loading curtain — adapted from P1's pattern but cast in our
 * editorial cream/Inter Tight system. Full-bleed obsidian panel with the
 * CLUTCH wordmark, mono microcopy, and a hairline progress bar that fills
 * over 1.5s. Holds briefly, then fades away to reveal the cream hero —
 * "lights on" moment.
 */
export const Loader = ({ onComplete }: LoaderProps) => (
  <motion.div
    className="fixed inset-0 z-[80] bg-obsidian text-paper flex flex-col justify-between p-6 md:p-12"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ delay: 1.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    onAnimationComplete={onComplete}
  >
    {/* Top chrome — editorial dateline */}
    <div className="flex justify-between items-start">
      <span className="label-mono text-paper/60">EST. 2026 — IRVINE, CA</span>
      <span className="label-mono text-paper/60 hidden md:inline">CLUTCH ANALYTICS / VOL. I</span>
    </div>

    {/* Wordmark + progress bar */}
    <div>
      <div className="flex justify-between items-end mb-5">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-5xl md:text-7xl tracking-[-0.025em] text-paper leading-none"
        >
          CLUTCH
        </motion.span>
        <span className="label-mono text-paper/60">LOADING</span>
      </div>

      {/* Hairline progress bar */}
      <div className="h-px bg-paper/20 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-brand origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  </motion.div>
);
