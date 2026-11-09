import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useEntranceSettled } from "@/lib/entrance";
import { FADE, riseVariants } from "@/lib/motion";
import { GRID } from "./game/layout";

const PullQuote = () => {
  // One trigger, behind the entrance's settle: the label and the quote arrive together and
  // the signature 0.3 s later, so nothing shows before the quote.
  const groupRef = useRef<HTMLDivElement>(null);
  const settled = useEntranceSettled();
  const shown = useInView(groupRef, { once: true, amount: 0.4 }) && settled;

  return (
    <div className="bg-paper text-ink paper-grain py-24 md:py-32">
      <div ref={groupRef} className={GRID}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={FADE}
          className="label text-inkMuted block mb-8 md:mb-10"
        >
          A NOTE ON PURPOSE
        </motion.span>

        <motion.blockquote
          variants={riseVariants}
          initial="hidden"
          animate={shown ? "visible" : "hidden"}
          className="font-display text-[clamp(1.75rem,4.5vw,3.5rem)] text-ink leading-[1.15] tracking-[-0.01em] max-w-[20ch]"
        >
          Talent is everywhere. The cameras aren't. Clutch closes that gap, built
          for the leagues that <span className="text-brand">aren't</span> on TV.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: shown ? 1 : 0 }}
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
