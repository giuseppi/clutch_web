import { motion } from "framer-motion";
import type { Ref } from "react";
import { useEntranceSettled } from "@/lib/entrance";
import { STAGGER, riseVariants } from "@/lib/motion";
import { LadderCard } from "./game/LadderCard";
import { CONTENT, useLayout, type Layout } from "./game/layout";
import { usePlayback } from "./game/playbackContext";

/*
  Split: copy left and the card right, on the hero's 44/56 columns and gap. Medium: 40/60.
  Stack: copy over the card. Sizes are in container units of the content box, matched to
  the hero's type at each layout.
*/
const LAYOUT: Record<Layout, { grid: string; copy: string; h2: string; body: string; card: string }> = {
  split: {
    grid: "grid-cols-[minmax(0,44fr)_minmax(0,56fr)] gap-x-[3.8cqw] pb-[2.2cqw] pt-[4.3cqw]",
    copy: "gap-[1.3cqw]",
    h2: "text-[max(20px,3.35cqw)]",
    body: "max-w-[36ch] text-[max(13px,1.41cqw)]",
    card: "w-[39cqw] justify-self-end",
  },
  medium: {
    grid: "grid-cols-[minmax(0,40fr)_minmax(0,60fr)] gap-x-[4.55cqw] pb-[3cqw] pt-[5.65cqw]",
    copy: "gap-[2cqw]",
    h2: "text-[5.2cqw]",
    body: "max-w-[36ch] text-[max(14px,2.61cqw)]",
    card: "",
  },
  stack: {
    grid: "grid-cols-1 gap-[5.7cqw] pb-[6cqw] pt-[12cqw]",
    copy: "gap-[2.7cqw]",
    h2: "text-[8cqw]",
    body: "max-w-[38ch] text-[max(13px,4cqw)]",
    card: "",
  },
};

/**
 * The section under the hero where Giuseppi's +14 lands and the court ladder re-ranks.
 * It rises in once 10% of it is on screen, and not before the hero's entrance settles,
 * so a tall screen that shows it at load still gets one entrance.
 */
const Leaderboard = ({ mmrRef }: { mmrRef?: Ref<HTMLSpanElement> }) => {
  const layout = useLayout();
  const settled = useEntranceSettled();
  const l = LAYOUT[layout];

  return (
    <section data-layout={layout} className="group text-ink">
      <div className={CONTENT}>
        <motion.div
          className={`grid items-center ${l.grid}`}
          initial="hidden"
          whileInView={settled ? "visible" : undefined}
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={riseVariants} className={`flex flex-col ${l.copy}`}>
            <h2 className={`text-balance font-semibold leading-[0.98] tracking-[-0.045em] ${l.h2}`}>
              Every win climbs your court's ladder.
            </h2>
            <p className={`text-balance leading-normal text-ink/[0.68] ${l.body}`}>
              MMR updates the moment a game ends, and your court's leaderboard re-ranks.
            </p>
          </motion.div>
          <motion.div variants={riseVariants} transition={{ delay: STAGGER }} className={l.card}>
            <Ladder mmrRef={mmrRef} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/** The one part that follows the clock, so the section around it skips the game's frames. */
function Ladder({ mmrRef }: { mmrRef?: Ref<HTMLSpanElement> }) {
  const { lt, watchLadder } = usePlayback();
  return <LadderCard T={lt ?? 0} rootRef={watchLadder} mmrRef={mmrRef} />;
}

export default Leaderboard;
