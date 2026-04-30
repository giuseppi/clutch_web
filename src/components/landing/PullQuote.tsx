import { motion } from "framer-motion";

const PullQuote = () => {
  return (
    <div className="bg-paper text-ink paper-grain py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="label-mono text-inkMuted block mb-8 md:mb-10"
        >
          A NOTE ON PURPOSE
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-light italic text-[clamp(1.75rem,4.5vw,3.5rem)] text-ink leading-[1.15] tracking-[-0.01em] max-w-[20ch]"
        >
          Talent is everywhere. The cameras aren't. Clutch closes that gap — built
          for the leagues that <span className="not-italic">aren't</span> on TV.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 md:mt-10 flex items-center gap-4 text-inkMuted"
        >
          <span className="w-12 h-px bg-inkMuted/40" />
          <span className="label-mono">— THE CLUTCH TEAM</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PullQuote;
