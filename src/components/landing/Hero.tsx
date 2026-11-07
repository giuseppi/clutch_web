import { useState, type Ref } from "react";
import { BRAND, INK, stateAt, type PlayerId } from "./game/game";
import { HalfCourt } from "./game/HalfCourt";
import { useLayout, type Layout } from "./game/layout";
import { LiveCard } from "./game/LiveCard";
import { GAME } from "./game/timeline";

const FINAL = stateAt(GAME);

/*
  The fixed Navbar's height, the one place the hero knows it: py-4 around a 36 px row,
  py-5 around a 40 px row from md. It pads the hero's top and sizes the split's min-height.
*/
const NAV_CLEARANCE = "[--nav-h:68px] md:[--nav-h:80px] pt-[var(--nav-h)]";

/** Same content box as the Navbar and the other sections, so the edges line up. */
const CONTENT = "mx-auto max-w-[1440px] px-6 md:px-12 [container-type:inline-size]";

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

const Hero = ({ mmrRef }: { mmrRef?: Ref<HTMLSpanElement> }) => {
  const layout = useLayout();
  const [selected, setSelected] = useState<PlayerId>("G");
  const l = LAYOUT[layout];

  return (
    <section data-layout={layout} className={`hero group paper-grain text-ink ${NAV_CLEARANCE}`}>
      <div className={CONTENT}>
        <div className={`grid items-center ${l.grid}`}>
          <div className={l.copy}>
            <h1 className={`text-balance font-semibold leading-[0.98] tracking-[-0.045em] ${l.h1}`}>
              Talent doesn't wait for a camera crew.
            </h1>
            <p className={`text-balance leading-normal text-ink/[0.68] ${l.body}`}>
              Clutch turns a phone in a courtside corner into a{" "}
              <span className="whitespace-nowrap">professional-grade</span> analytics rig, built for the leagues that
              aren't on TV.
            </p>
            <div className={l.card}>
              <LiveCard state={FINAL} selected={selected} onSelect={setSelected} mmrRef={mmrRef} />
            </div>
          </div>
          <div className={`flex flex-col justify-center ${l.court}`}>
            <div className={`flex flex-col items-center ${l.courtBox}`}>
              <HalfCourt t={GAME} />
              <p className="sr-only">Example 1v1 game at the UCI Anteater Recreation Center: Giuseppi wins 11 to 7.</p>
              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-inkMuted ${l.key}`}>
                <KeyItem color={BRAND} name="Giuseppi" />
                <KeyItem color={INK} name="Johnny" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const KeyItem = ({ color, name }: { color: string; name: string }) => (
  <span>
    <span aria-hidden="true" className="mr-[5px] inline-block h-2 w-2 rounded-full" style={{ background: color }} />
    {name}
  </span>
);

export default Hero;
