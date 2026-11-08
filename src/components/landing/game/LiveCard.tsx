import { useState, type Ref } from "react";
import arcUrl from "@/assets/game/uci-arc.webp";
import { VALUE_CHANGE } from "@/lib/motion";
import { CARD, GREEN, MUTED, TEXT, cx } from "./cardStyle";
import { FlipNumber } from "./FlipNumber";
import { formatCardDate } from "./format";
import { PLAYERS, TRAIL, scoreColor, zoneOf, type GameState, type PlayerId } from "./game";

export interface LiveCardProps {
  state: GameState;
  selected: PlayerId;
  onSelect: (player: PlayerId) => void;
  /** Shorter score flips, for fast-forward. */
  quick?: boolean;
  /** Defaults to today. */
  date?: Date;
  rootRef?: Ref<HTMLDivElement>;
  /** The MMR chip's value. */
  mmrRef?: Ref<HTMLSpanElement>;
}

/*
  Sizes follow the hero's layout (data-layout on the hero root). Each entry gives the split
  size, then medium, then stack. Split sizes are in --u (see .hero in index.css: 1cqw, or less
  so the split hero fits a short screen); medium and stack are in container units of the
  hero's content box. Labels and tags never go below 10 px, so landscape phones stay legible.
*/
const LABEL = "whitespace-nowrap font-medium uppercase leading-[1.3] tracking-[0.08em]";
const SIZE = {
  label: "text-[max(10px,calc(1.09*var(--u)))] group-data-[layout=medium]:text-[max(10px,1.59cqw)] group-data-[layout=stack]:text-[max(10px,2.89cqw)]",
  tag: "text-[max(10px,calc(.92*var(--u)))] group-data-[layout=medium]:text-[max(10px,1.36cqw)] group-data-[layout=stack]:text-[max(10px,2.56cqw)]",
  chipLabel: "text-[max(10px,calc(.98*var(--u)))] group-data-[layout=medium]:text-[max(10px,1.42cqw)] group-data-[layout=stack]:text-[max(10px,2.67cqw)]",
  chipValue: "text-[max(12px,calc(1.9*var(--u)))] group-data-[layout=medium]:text-[2.84cqw] group-data-[layout=stack]:text-[5.11cqw]",
  score: "text-[max(24px,calc(3.91*var(--u)))] group-data-[layout=medium]:text-[5.91cqw] group-data-[layout=stack]:text-[10.56cqw]",
  banner: "h-[calc(10.87*var(--u))] group-data-[layout=medium]:h-[17cqw] group-data-[layout=stack]:h-[30cqw]",
  pillAt: "left-[calc(1.2*var(--u))] top-[calc(.98*var(--u))] group-data-[layout=medium]:left-[1.93cqw] group-data-[layout=medium]:top-[1.7cqw]",
  pillAtStack: "group-data-[layout=stack]:left-[3.33cqw] group-data-[layout=stack]:top-[2.89cqw]",
  titleAt: "inset-x-[calc(1.63*var(--u))] bottom-[calc(.76*var(--u))] group-data-[layout=medium]:inset-x-[2.5cqw] group-data-[layout=medium]:bottom-[1.36cqw]",
  titleAtStack: "group-data-[layout=stack]:left-[4.44cqw] group-data-[layout=stack]:right-[1.67cqw] group-data-[layout=stack]:bottom-[2.22cqw]",
  title: "text-[max(13px,calc(1.9*var(--u)))] group-data-[layout=medium]:text-[2.84cqw] group-data-[layout=stack]:text-[5.33cqw]",
  body: "px-[calc(1.63*var(--u))] pb-[calc(1.3*var(--u))] pt-[calc(.98*var(--u))] group-data-[layout=medium]:px-[2.5cqw] group-data-[layout=medium]:pb-[2.27cqw]",
  bodyMore: "group-data-[layout=medium]:pt-[1.7cqw] group-data-[layout=stack]:px-[4.44cqw] group-data-[layout=stack]:pb-[4cqw] group-data-[layout=stack]:pt-[2.67cqw]",
  chips: "mt-[calc(.76*var(--u))] gap-[calc(.76*var(--u))] group-data-[layout=medium]:mt-[1.36cqw] group-data-[layout=medium]:gap-[1.14cqw]",
  chipsStack: "group-data-[layout=stack]:mt-[2.22cqw] group-data-[layout=stack]:gap-[2.22cqw]",
  chip: "px-[calc(.33*var(--u))] py-[calc(.76*var(--u))] group-data-[layout=medium]:px-[.57cqw] group-data-[layout=medium]:py-[1.25cqw]",
  chipStack: "group-data-[layout=stack]:px-[1.11cqw] group-data-[layout=stack]:py-[2.22cqw]",
  caption: "mt-[calc(.87*var(--u))] text-[max(11px,calc(1.25*var(--u)))] group-data-[layout=medium]:mt-[1.48cqw] group-data-[layout=medium]:text-[max(11px,1.93cqw)]",
  captionStack: "group-data-[layout=stack]:mt-[2.67cqw] group-data-[layout=stack]:text-[max(11px,3.56cqw)]",
};

const PILL =
  "absolute inline-flex items-center gap-[5px] rounded-full border-[0.5px] border-black/[0.06] bg-white/[0.82] px-2 py-[3px] backdrop-blur-[8px]";
const FADE = "bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_18%,rgba(255,255,255,.55)_62%,rgba(255,255,255,.97)_100%)]";
const PHOTO = "absolute inset-0 block h-full w-full object-cover [object-position:50%_38%]";
const PHOTO_TONE = "[filter:saturate(.5)_sepia(.15)_contrast(.9)_brightness(1.06)]";
const SIDE = "relative grid grid-rows-[auto_auto_auto] justify-items-center gap-y-[3px] rounded-[10px] px-1 pb-[6px] pt-[3px]";
const UNDERLINE = "after:absolute after:inset-x-[32%] after:bottom-0 after:h-[2px] after:rounded-[2px] after:content-[''] aria-pressed:after:bg-brand";
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";
const WIN_TAG = "rounded-[8px] border-[0.5px] border-[rgba(0,165,124,.3)] bg-[rgba(0,200,150,.13)] px-[7px] py-px";
const CHIP = "grid justify-items-center gap-y-[2px] rounded-[12px] border-[0.5px] border-black/[0.05]";
const CHIP_FILL = "bg-[linear-gradient(135deg,#FFFEF7_0%,#FCF7E9_40%,#F8F1DD_75%,#F2EBD0_100%)]";

/**
 * The live game card, laid out like the Clutch app's Recap card and Match Details score
 * block. Every row has a fixed height and the Win tags only toggle visibility, so the
 * card never changes size whatever the score or the selected player.
 */
export function LiveCard({ state, selected, onSelect, quick, date, rootRef, mmrRef }: LiveCardProps) {
  // Read once per mount: the card renders on every game frame.
  const [today] = useState(() => new Date());
  return (
    <div ref={rootRef} data-testid="live-card" className={CARD} style={{ color: TEXT }}>
      <Banner final={state.final} date={date ?? today} />
      <div className={cx(SIZE.body, SIZE.bodyMore)}>
        <div className="grid grid-cols-[minmax(0,1fr)_5.4em_minmax(0,1fr)] items-center">
          <Side player="G" state={state} selected={selected} onSelect={onSelect} quick={quick} />
          <span className={cx(LABEL, SIZE.label, "justify-self-center")} style={{ color: MUTED }}>
            VS
          </span>
          <Side player="J" state={state} selected={selected} onSelect={onSelect} quick={quick} />
        </div>
        <Chips state={state} selected={selected} mmrRef={mmrRef} />
        <p
          data-testid="card-caption"
          className={cx("h-[1.4em] truncate leading-[1.4]", SIZE.caption, SIZE.captionStack)}
          style={{ color: TRAIL }}
        >
          <Caption state={state} />
        </p>
      </div>
    </div>
  );
}

function Banner({ final, date }: { final: boolean; date: Date }) {
  return (
    <div className={cx("relative overflow-hidden bg-paperAlt", SIZE.banner)}>
      <img src={arcUrl} alt="" className={cx(PHOTO, PHOTO_TONE)} />
      <div className="absolute inset-0 bg-paper opacity-40 mix-blend-multiply" />
      <div className={cx("absolute inset-0", FADE)} />
      <span className={cx(LABEL, SIZE.label, PILL, SIZE.pillAt, SIZE.pillAtStack)} style={{ color: TRAIL }}>
        <span
          className={cx("h-1.5 w-1.5 rounded-full", !final && "bg-brand motion-safe:animate-[live-pulse_1.6s_ease-in-out_infinite]")}
          style={final ? { background: MUTED } : undefined}
        />
        <span>{`${final ? "FINAL" : "LIVE"} · ${formatCardDate(date)}`}</span>
      </span>
      <p className={cx("absolute text-balance font-semibold leading-[1.15] tracking-[-0.02em]", SIZE.title, SIZE.titleAt, SIZE.titleAtStack)}>
        1v1 @ UCI Anteater Recreation Center
      </p>
    </div>
  );
}

interface SideProps {
  player: PlayerId;
  state: GameState;
  selected: PlayerId;
  onSelect: (player: PlayerId) => void;
  quick?: boolean;
}

function Side({ player, state, selected, onSelect, quick }: SideProps) {
  const pressed = selected === player;
  const won = state.final && state.leader === player;
  return (
    <button type="button" aria-pressed={pressed} onClick={() => onSelect(player)} className={cx(SIDE, UNDERLINE, FOCUS)}>
      <span className={cx(LABEL, SIZE.label)} style={{ color: pressed ? TEXT : MUTED }}>
        {PLAYERS[player].name.toUpperCase()}
      </span>
      <FlipNumber
        value={String(state.lines[player].pts)}
        quick={quick}
        className={cx("font-mono font-medium tracking-[-0.03em]", SIZE.score)}
        style={{ color: scoreColor(player, state), transition: `color ${VALUE_CHANGE}s ease` }}
      />
      <span className={cx(LABEL, SIZE.tag, WIN_TAG)} style={{ color: GREEN, visibility: won ? "visible" : "hidden" }}>
        WIN
      </span>
    </button>
  );
}

function Chips({ state, selected, mmrRef }: { state: GameState; selected: PlayerId; mmrRef?: Ref<HTMLSpanElement> }) {
  const line = state.lines[selected];
  const won = state.leader === selected;
  const mmr = state.final ? (won ? "+14" : "-12") : "··";
  const mmrColor = state.final ? (won ? GREEN : undefined) : MUTED;
  return (
    <div className={cx("grid grid-cols-4", SIZE.chips, SIZE.chipsStack)}>
      <Chip label="FG" value={`${line.fgm}/${line.fga}`} />
      <Chip label="3PT" value={`${line.tpm}/${line.tpa}`} />
      <Chip label="FG%" value={String(line.fga ? Math.round((100 * line.fgm) / line.fga) : 0)} />
      <Chip label="MMR" value={mmr} color={mmrColor} valueRef={mmrRef} />
    </div>
  );
}

interface ChipProps {
  label: string;
  value: string;
  color?: string;
  valueRef?: Ref<HTMLSpanElement>;
}

function Chip({ label, value, color, valueRef }: ChipProps) {
  return (
    <div className={cx(CHIP, CHIP_FILL, SIZE.chip, SIZE.chipStack)}>
      <span className={cx(LABEL, SIZE.chipLabel)} style={{ color: MUTED }}>
        {label}
      </span>
      <span ref={valueRef} className={cx("h-[1.2em] font-mono font-medium leading-[1.2]", SIZE.chipValue)} style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function Caption({ state }: { state: GameState }) {
  if (state.final && state.leader) {
    return <>{`Final ${state.lines.G.pts}-${state.lines.J.pts} · ${PLAYERS[state.leader].name} wins`}</>;
  }
  if (!state.last) return <>Tip-off</>;
  const { player, x, y, made } = state.last;
  return (
    <>
      {`${PLAYERS[player].name} · ${zoneOf(x, y)} · `}
      {made ? <strong className="font-semibold text-brand">Made</strong> : "Missed"}
    </>
  );
}
