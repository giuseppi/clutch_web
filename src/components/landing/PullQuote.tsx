import { motion } from "framer-motion";
import { FADE, riseVariants } from "@/lib/motion";
import { GRID } from "./game/layout";

const PullQuote = () => {
  return (
    <div className="bg-paper text-ink paper-grain py-24 md:py-32">
      <div className={GRID}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={FADE}
          className="label text-inkMuted block mb-8 md:mb-10"
        >
          A NOTE ON PURPOSE
        </motion.span>

        <motion.blockquote
          variants={riseVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="font-display text-[clamp(1.75rem,4.5vw,3.5rem)] text-ink leading-[1.15] tracking-[-0.01em] max-w-[20ch]"
        >
          Talent is everywhere. The cameras aren't. Clutch closes that gap, built
          for the leagues that <span className="text-brand">aren't</span> on TV.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...FADE, delay: 0.3 }}
          className="mt-8 md:mt-10 flex items-center gap-4 text-inkMuted"
        >
          <span className="w-12 h-px bg-inkMuted/40" />
          <span className="label">THE CLUTCH TEAM</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PullQuote;
