import { useState, type Ref } from "react";
import { BRAND, INK, stateAt, type PlayerId } from "./game/game";
import { HalfCourt } from "./game/HalfCourt";
import { useLayout } from "./game/layout";
import { LiveCard } from "./game/LiveCard";
import { GAME } from "./game/timeline";

const FINAL = stateAt(GAME);

/*
  Three layouts (see layoutFor): split puts the copy and card left of the court, medium puts
  the copy on top with the court and card side by side, and stack runs copy, court, key and
  card in one column. Type and spacing are in container units of the 1280 px content box.
  The top padding clears the fixed navbar (68 px, 80 px from md).
*/
const Hero = ({ mmrRef }: { mmrRef?: Ref<HTMLSpanElement> }) => {
  const layout = useLayout();
  const [selected, setSelected] = useState<PlayerId>("G");

  return (
    <section data-layout={layout} className="group paper-grain pt-[68px] text-ink md:pt-[80px]">
      <div className="mx-auto max-w-[1280px] [container-type:inline-size]">
        <div className="grid grid-cols-[minmax(0,44fr)_minmax(0,56fr)] content-center items-center gap-[3.5cqw] px-[4cqw] py-[3.2cqw] group-data-[layout=split]:min-h-[calc(100svh-68px)] md:group-data-[layout=split]:min-h-[calc(100svh-80px)] group-data-[layout=medium]:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] group-data-[layout=medium]:gap-x-[4cqw] group-data-[layout=medium]:gap-y-[1.8cqw] group-data-[layout=medium]:px-[6cqw] group-data-[layout=medium]:pb-[4cqw] group-data-[layout=medium]:pt-[7cqw] group-data-[layout=stack]:grid-cols-[minmax(0,1fr)] group-data-[layout=stack]:gap-[3cqw] group-data-[layout=stack]:px-[5cqw] group-data-[layout=stack]:py-[6cqw]">
          <div className="flex flex-col gap-[1.5cqw] group-data-[layout=medium]:contents group-data-[layout=stack]:contents">
            <h1 className="text-balance text-[max(20px,4.3cqw)] font-semibold leading-[0.98] tracking-[-0.045em] group-data-[layout=medium]:col-span-2 group-data-[layout=medium]:text-[6.6cqw] group-data-[layout=stack]:text-[8.4cqw]">
              Talent doesn't wait for a camera crew.
            </h1>
            <p className="max-w-[38ch] text-[max(11px,1.3cqw)] leading-normal text-ink/[0.68] group-data-[layout=medium]:col-span-2 group-data-[layout=medium]:max-w-[46ch] group-data-[layout=medium]:text-[max(14px,2.3cqw)] group-data-[layout=stack]:text-[3.6cqw]">
              Clutch turns a phone in a courtside corner into a professional-grade analytics rig, built for the leagues
              that aren't on TV.
            </p>
            <div className="mt-[.4cqw] group-data-[layout=medium]:col-start-2 group-data-[layout=medium]:row-start-3 group-data-[layout=medium]:mt-[3cqw] group-data-[layout=medium]:self-center group-data-[layout=stack]:order-2">
              <LiveCard state={FINAL} selected={selected} onSelect={setSelected} mmrRef={mmrRef} />
            </div>
          </div>
          <div className="flex h-full flex-col items-center justify-center gap-[1cqw] group-data-[layout=medium]:col-start-1 group-data-[layout=medium]:row-start-3 group-data-[layout=medium]:mt-[3cqw] group-data-[layout=medium]:h-auto group-data-[layout=stack]:order-1 group-data-[layout=stack]:mt-[3cqw]">
            <HalfCourt t={GAME} />
            <p className="sr-only">Example 1v1 game at the UCI Anteater Recreation Center: Giuseppi wins 11 to 7.</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[max(9px,1.05cqw)] text-inkMuted group-data-[layout=medium]:text-[max(10px,1.6cqw)] group-data-[layout=stack]:text-[2.8cqw]">
              <KeyItem color={BRAND} name="Giuseppi" />
              <KeyItem color={INK} name="Johnny" />
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
