import { motion } from "framer-motion";
import { useState, type Ref } from "react";
import { ENTRANCE, fadeVariants, riseVariants } from "@/lib/motion";
import { BRAND, INK, stateAt, type PlayerId } from "./game/game";
import { HalfCourt } from "./game/HalfCourt";
import { inFlight } from "./game/ladder";
import { CONTENT, useLayout, type Layout } from "./game/layout";
import { LiveCard } from "./game/LiveCard";
import { usePlayback } from "./game/playbackContext";
import { SplitText } from "./SplitText";

const HEADLINE = "Talent doesn't wait for a camera crew.";

/*
  The fixed Navbar's height, the one place the hero knows it: py-4 around a 36 px row,
  py-5 around a 40 px row from md. It pads the hero's top and sizes the split's min-height.
*/
const NAV_CLEARANCE = "[--nav-h:68px] md:[--nav-h:80px] pt-[var(--nav-h)]";

/*
  Three layouts (see layoutFor). Split: copy and card left of the court (44/56), at least
  one screen tall, and fitted to short screens through --u and --court-w (.hero in index.css).
  Medium: copy on top, court (52) and card (48) side by side. Stack: copy, court, key, then
  card. Medium and stack sizes are in container units of the content box.
*/
interface LayoutClasses {
  grid: string;
  copy: string;
  h1: string;
  body: string;
  card: string;
  court: string;
  courtBox: string;
  key: string;
}

const LAYOUT: Record<Layout, LayoutClasses> = {
  split: {
    grid: "grid-cols-[minmax(0,44fr)_minmax(0,56fr)] content-center gap-x-[3.8cqw] py-[var(--pad)] min-h-[calc(100svh-var(--nav-h))]",
    copy: "flex flex-col gap-[calc(1.63*var(--u))]",
    h1: "text-[max(20px,calc(4.67*var(--u)))]",
    body: "max-w-[38ch] text-[max(13px,calc(1.41*var(--u)))]",
    card: "mt-[calc(.43*var(--u))]",
    court: "h-full items-end",
    courtBox: "w-[var(--court-w)] gap-[1.09cqw]",
    key: "text-[max(10px,1.14cqw)]",
  },
  medium: {
    grid: "grid-cols-[minmax(0,52fr)_minmax(0,48fr)] gap-x-[4.55cqw] gap-y-[2.05cqw] pb-[4.55cqw] pt-[7.95cqw]",
    copy: "contents",
    h1: "col-span-2 text-[7.5cqw]",
    body: "col-span-2 max-w-[46ch] text-[max(14px,2.61cqw)]",
    card: "col-start-2 row-start-3 mt-[3.41cqw] self-center",
    court: "col-start-1 row-start-3 mt-[3.41cqw]",
    courtBox: "w-full gap-[1.09cqw]",
    key: "text-[max(10px,1.82cqw)]",
  },
  stack: {
    grid: "grid-cols-1 gap-[3.33cqw] py-[6.67cqw]",
    copy: "contents",
    h1: "text-[9.33cqw]",
    body: "max-w-[38ch] text-[max(13px,4cqw)]",
    card: "order-2",
    court: "order-1 mt-[3.33cqw]",
    courtBox: "w-full gap-[1.09cqw]",
    key: "text-[max(10px,3.11cqw)]",
  },
};

/*
  The game plays from the shared clock (PlaybackProvider). The entrance runs from `started`
  at the ENTRANCE times: the section goes from "hidden" to "visible" and every child with
  variants (body, card, key, and the court's lines, floor and hoop) follows with its own
  delay. The headline runs its own word stagger. Under reduced motion, and when the hero mounts
  again with the game already under way (a return to the page), all of it starts final.
  While the leaderboard's "+14" token flies from the MMR chip, Giuseppi is selected, and he
  stays selected after it until the visitor picks a side.
*/
const Hero = ({ mmrRef }: { mmrRef?: Ref<HTMLSpanElement> }) => {
  const layout = useLayout();
  const { t, lt, ff, reduced, started, watchCard } = usePlayback();
  const [selected, setSelected] = useState<PlayerId>("G");
  if (lt !== null && inFlight(lt) && selected !== "G") setSelected("G");
  const [resumed] = useState(() => t > 0);
  const still = reduced || resumed;
  const l = LAYOUT[layout];

  return (
    <motion.section
      data-layout={layout}
      className={`hero group text-ink ${NAV_CLEARANCE}`}
      initial={still ? false : "hidden"}
      animate={started || still ? "visible" : "hidden"}
    >
      <div className={CONTENT}>
        <div className={`grid items-center ${l.grid}`}>
          <div className={l.copy}>
            <SplitText
              as="h1"
              text={HEADLINE}
              whileInView={false}
              play={started}
              instant={still}
              delay={ENTRANCE.headline}
              className={`text-balance font-semibold leading-[0.98] tracking-[-0.045em] ${l.h1}`}
            />
            <Body className={l.body} />
            <motion.div variants={riseVariants} transition={{ delay: ENTRANCE.card }} className={l.card}>
              <LiveCard
                state={stateAt(t)}
                selected={selected}
                onSelect={setSelected}
                quick={ff}
                rootRef={watchCard}
                mmrRef={mmrRef}
              />
            </motion.div>
          </div>
          <CourtColumn t={t} l={l} />
        </div>
      </div>
    </motion.section>
  );
};

const Body = ({ className }: { className: string }) => (
  <motion.p
    variants={riseVariants}
    transition={{ delay: ENTRANCE.body }}
    className={`text-balance leading-normal text-ink/[0.68] ${className}`}
  >
    Clutch turns a phone in a courtside corner into a <span className="whitespace-nowrap">professional-grade</span>{" "}
    analytics rig, built for the leagues that aren't on TV.
  </motion.p>
);

/** The court, its summary for screen readers, and the player key. */
const CourtColumn = ({ t, l }: { t: number; l: LayoutClasses }) => (
  <div className={`flex flex-col justify-center ${l.court}`}>
    <div className={`flex flex-col items-center ${l.courtBox}`}>
      <HalfCourt t={t} />
      <p className="sr-only">Example 1v1 game at the UCI Anteater Recreation Center: Giuseppi wins 11 to 7.</p>
      <motion.div
        variants={fadeVariants}
        transition={{ delay: ENTRANCE.key }}
        className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-inkMuted ${l.key}`}
      >
        <KeyItem color={BRAND} name="Giuseppi" />
        <KeyItem color={INK} name="Johnny" />
      </motion.div>
    </div>
  </div>
);

const KeyItem = ({ color, name }: { color: string; name: string }) => (
  <span>
    <span aria-hidden="true" className="mr-[5px] inline-block h-2 w-2 rounded-full" style={{ background: color }} />
    {name}
  </span>
);

export default Hero;
