import type { Ref } from "react";
import arcUrl from "@/assets/game/uci-arc.webp";
import { VALUE_CHANGE } from "@/lib/motion";
import { FlipNumber } from "./FlipNumber";
import { formatCardDate } from "./format";
import { PLAYERS, scoreColor, zoneOf, type GameState, type PlayerId } from "./game";

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

const GREEN = "#00A57C";
const MUTED = "#8B8F98";

/*
  Sizes follow the hero's layout (data-layout on the hero root, a 1280 px container),
  in container units: the split size first, then medium and stack.
*/
const MICRO = "whitespace-nowrap font-medium uppercase leading-[1.3] tracking-[0.08em]";
const MICRO_SIZE =
  "text-[max(8px,1cqw)] group-data-[layout=medium]:text-[max(8.5px,1.4cqw)] group-data-[layout=stack]:text-[2.6cqw]";
const LABEL = `${MICRO} ${MICRO_SIZE}`;

/**
 * The live game card, laid out like the Clutch app's Recap card and Match Details score
 * block. Every row has a fixed height and the Win tags only toggle visibility, so the
 * card never changes size whatever the score or the selected player.
 */
export function LiveCard({ state, selected, onSelect, quick, date = new Date(), rootRef, mmrRef }: LiveCardProps) {
  return (
    <div
      ref={rootRef}
      data-testid="live-card"
      className="overflow-hidden rounded-[20px] border-[0.5px] border-black/[0.06] bg-white text-[#11181C] shadow-[0_4px_16px_rgba(0,0,0,.14)]"
    >
      <Banner final={state.final} date={date} />
      <div className="px-[1.5cqw] pb-[1.2cqw] pt-[.9cqw] group-data-[layout=medium]:px-[2.2cqw] group-data-[layout=medium]:pb-[2cqw] group-data-[layout=medium]:pt-[1.5cqw] group-data-[layout=stack]:px-[4cqw] group-data-[layout=stack]:pb-[3.6cqw] group-data-[layout=stack]:pt-[2.4cqw]">
        <div className="grid grid-cols-[minmax(0,1fr)_5.4em_minmax(0,1fr)] items-center">
          <Side player="G" state={state} selected={selected} onSelect={onSelect} quick={quick} />
          <span className={`${LABEL} justify-self-center text-[#8B8F98]`}>VS</span>
          <Side player="J" state={state} selected={selected} onSelect={onSelect} quick={quick} />
        </div>
        <Chips state={state} selected={selected} mmrRef={mmrRef} />
        <p
          data-testid="card-caption"
          className="mt-[.8cqw] h-[1.4em] truncate text-[max(9px,1.15cqw)] leading-[1.4] text-[#4B5563] group-data-[layout=medium]:mt-[1.3cqw] group-data-[layout=medium]:text-[max(10px,1.7cqw)] group-data-[layout=stack]:mt-[2.4cqw] group-data-[layout=stack]:text-[3.2cqw]"
        >
          <Caption state={state} />
        </p>
      </div>
    </div>
  );
}

function Banner({ final, date }: { final: boolean; date: Date }) {
  return (
    <div className="relative h-[10cqw] overflow-hidden bg-paperAlt group-data-[layout=medium]:h-[13cqw] group-data-[layout=stack]:h-[27cqw]">
      <img
        src={arcUrl}
        alt=""
        className="absolute inset-0 block h-full w-full object-cover [filter:saturate(.5)_sepia(.15)_contrast(.9)_brightness(1.06)] [object-position:50%_38%]"
      />
      <div className="absolute inset-0 bg-paper opacity-40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_18%,rgba(255,255,255,.55)_62%,rgba(255,255,255,.97)_100%)]" />
      <span
        className={`${LABEL} absolute left-[1.1cqw] top-[.9cqw] inline-flex items-center gap-[5px] rounded-full border-[0.5px] border-black/[0.06] bg-white/[0.82] px-2 py-[3px] text-[#4B5563] backdrop-blur-[8px] group-data-[layout=medium]:left-[1.7cqw] group-data-[layout=medium]:top-[1.5cqw] group-data-[layout=stack]:left-[3cqw] group-data-[layout=stack]:top-[2.6cqw]`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${final ? "bg-[#8B8F98]" : "bg-brand motion-safe:animate-[live-pulse_1.6s_ease-in-out_infinite]"}`}
        />
        <span>{`${final ? "FINAL" : "LIVE"} · ${formatCardDate(date)}`}</span>
      </span>
      <p className="absolute bottom-[.7cqw] left-[1.5cqw] right-[1.5cqw] text-balance text-[max(13px,1.75cqw)] font-semibold leading-[1.15] tracking-[-0.02em] group-data-[layout=medium]:bottom-[1.2cqw] group-data-[layout=medium]:left-[2.2cqw] group-data-[layout=medium]:right-[2.2cqw] group-data-[layout=medium]:text-[2.5cqw] group-data-[layout=stack]:bottom-[2cqw] group-data-[layout=stack]:left-[4cqw] group-data-[layout=stack]:text-[4.8cqw]">
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
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onSelect(player)}
      className="relative grid grid-rows-[auto_auto_auto] justify-items-center gap-y-[3px] rounded-[10px] px-1 pb-[6px] pt-[3px] after:absolute after:inset-x-[32%] after:bottom-0 after:h-[2px] after:rounded-[2px] after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-pressed:after:bg-brand"
    >
      <span className={`${LABEL} ${pressed ? "text-[#11181C]" : "text-[#8B8F98]"}`}>
        {PLAYERS[player].name.toUpperCase()}
      </span>
      <FlipNumber
        value={String(state.lines[player].pts)}
        quick={quick}
        className="font-mono text-[max(24px,3.6cqw)] font-medium tracking-[-0.03em] group-data-[layout=medium]:text-[5.2cqw] group-data-[layout=stack]:text-[9.5cqw]"
        style={{ color: scoreColor(player, state), transition: `color ${VALUE_CHANGE}s ease` }}
      />
      <span
        className={`${MICRO} rounded-[8px] border-[0.5px] border-[rgba(0,165,124,.3)] bg-[rgba(0,200,150,.13)] px-[7px] py-px text-[max(7px,.85cqw)] text-[#00A57C] group-data-[layout=medium]:text-[max(8px,1.2cqw)] group-data-[layout=stack]:text-[2.3cqw]`}
        style={{ visibility: won ? "visible" : "hidden" }}
      >
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
    <div className="mt-[.7cqw] grid grid-cols-4 gap-[.7cqw] group-data-[layout=medium]:mt-[1.2cqw] group-data-[layout=medium]:gap-[1cqw] group-data-[layout=stack]:mt-[2cqw] group-data-[layout=stack]:gap-[2cqw]">
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
    <div className="grid justify-items-center gap-y-[2px] rounded-[12px] border-[0.5px] border-black/[0.05] bg-[linear-gradient(135deg,#FFFEF7_0%,#FCF7E9_40%,#F8F1DD_75%,#F2EBD0_100%)] px-[.3cqw] py-[.7cqw] group-data-[layout=medium]:px-[.5cqw] group-data-[layout=medium]:py-[1.1cqw] group-data-[layout=stack]:px-[1cqw] group-data-[layout=stack]:py-[2cqw]">
      <span
        className={`${MICRO} text-[max(7px,.9cqw)] text-[#8B8F98] group-data-[layout=medium]:text-[max(8px,1.25cqw)] group-data-[layout=stack]:text-[2.4cqw]`}
      >
        {label}
      </span>
      <span
        ref={valueRef}
        className="h-[1.2em] font-mono text-[max(12px,1.75cqw)] font-medium leading-[1.2] group-data-[layout=medium]:text-[2.5cqw] group-data-[layout=stack]:text-[4.6cqw]"
        style={{ color }}
      >
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
