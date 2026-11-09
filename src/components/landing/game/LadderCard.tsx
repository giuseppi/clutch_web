import { Trophy } from "lucide-react";
import { memo, type CSSProperties, type Ref } from "react";
import { VALUE_CHANGE } from "@/lib/motion";
import { CARD, GREEN, MUTED, TEXT, cx } from "./cardStyle";
import { BRAND, TRAIL } from "./game";
import { AFTER, LADDER, ladderAt, type LadderRow } from "./ladder";

export interface LadderCardProps {
  /** Beat time, 0 (before) to L_END (after). */
  T: number;
  /** Giuseppi's MMR, where the token lands. */
  mmrRef?: Ref<HTMLSpanElement>;
  rootRef?: Ref<HTMLDivElement>;
}

/*
  Everything inside is in em of the card's font size, which follows the leaderboard's layout
  (data-layout on the section root): split, then medium, then stack, in container units of
  the section's content box. The 12.5 px floor keeps the smallest text (0.8em) at 10 px.
  --rh is the row height; the list is four rows tall whatever the order.
*/
const SIZE =
  "text-[max(12.5px,1.35cqw)] group-data-[layout=medium]:text-[max(12.5px,2.26cqw)] group-data-[layout=stack]:text-[max(12.5px,4.1cqw)] [--rh:3.2em] group-data-[layout=stack]:[--rh:3.45em]";
const SCOPE = "rounded-full border-[0.5px] border-black/10 px-[.95em] py-[.35em] text-[.8em] font-medium leading-[1.5] data-[active]:border-brand data-[active]:bg-brand/10";
/*
  Columns: rank, photo, name over record, MMR, and the delta's reserved space, set on the
  list as --pad, --rank, --photo and --gap so the divider can start at the name column.
  The row in the last slot has none (data-last), so no line sits on the card's bottom padding.
*/
const COLUMNS = "[--gap:.7em] [--pad:.5em] [--photo:2.1em] [--rank:1.4em]";
const ROW =
  "absolute inset-x-0 top-0 grid h-[var(--rh)] grid-cols-[var(--rank)_var(--photo)_minmax(0,1fr)_auto_3.1em] items-center gap-x-[var(--gap)] rounded-[10px] px-[var(--pad)] [transform:translateY(calc(var(--slot)*100%))]";
const DIVIDER =
  "after:absolute after:bottom-0 after:left-[calc(var(--pad)+var(--rank)+var(--photo)+2*var(--gap))] after:right-[var(--pad)] after:h-[0.5px] after:bg-black/[0.06] after:content-[''] data-[last]:after:hidden";
const TINT = "rgba(255,106,0,.08)";
const SCOPES = ["Friends", "Court", "City"] as const;
const LAST = LADDER.length - 1;

/*
  The moving rows keep their DOM order (Johnny before Giuseppi) while they swap on screen, so
  screen readers get this list instead: the ladder after the game, in rank order.
*/
const FINAL_RANKING = (
  <ol className="sr-only" aria-label="Court ladder after the game">
    {AFTER.map((id) => {
      const { name, before, after } = LADDER.find((p) => p.id === id)!;
      const { mmr, record } = after ?? before;
      return <li key={id}>{`${name}: ${mmr} MMR${after ? ` (${after.delta})` : ""}, record ${record}`}</li>;
    })}
  </ol>
);

/**
 * The court leaderboard, laid out like the Clutch app's Leaderboards screen, at beat time T.
 * Rows keep their DOM order and move by transform, one row height per slot, so the card
 * never changes size while they swap; they are hidden from screen readers, which read
 * FINAL_RANKING. Memoized: its parent renders on every game frame.
 */
export const LadderCard = memo(function LadderCard({ T, mmrRef, rootRef }: LadderCardProps) {
  return (
    <div ref={rootRef} data-testid="ladder-card" className={cx(CARD, SIZE, "px-[1.1em] pb-[.8em] pt-[1.1em]")} style={{ color: TEXT }}>
      <div aria-hidden="true" className="mb-[.9em] flex gap-[.5em]">
        {SCOPES.map((scope) => (
          <span key={scope} data-active={scope === "Court" || undefined} className={SCOPE} style={{ color: scope === "Court" ? BRAND : TRAIL }}>
            {scope}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-[.8em] pb-[.8em]">
        <Trophy aria-hidden="true" className="h-[1.45em] w-[1.45em] flex-none" style={{ color: BRAND }} />
        <div className="min-w-0">
          <p className="text-[1.15em] font-semibold leading-[1.2] tracking-[-0.02em]">Court · 1V1</p>
          <p className="truncate text-[.82em] leading-[1.3]" style={{ color: MUTED }}>
            UCI Anteater Recreation Center
          </p>
        </div>
      </div>
      <ul aria-hidden="true" className={cx("relative h-[calc(4*var(--rh))] border-t-[0.5px] border-black/[0.06]", COLUMNS)}>
        {ladderAt(T).map((row) => (
          <Row key={row.id} row={row} mmrRef={row.id === "G" ? mmrRef : undefined} />
        ))}
      </ul>
      {FINAL_RANKING}
    </div>
  );
});

function Row({ row, mmrRef }: { row: LadderRow; mmrRef?: Ref<HTMLSpanElement> }) {
  const { name, photo, rank, slot, mmr, record, delta, me } = row;
  const style = { "--slot": slot, backgroundColor: me ? TINT : "transparent", transition: `background-color ${VALUE_CHANGE}s ease` };
  return (
    <li className={cx(ROW, DIVIDER)} data-last={slot === LAST || undefined} style={style as CSSProperties}>
      <span data-testid="rank" className="font-mono tabular-nums" style={{ color: MUTED }}>
        {rank}
      </span>
      <img src={photo} alt="" width={96} height={96} className="block h-[var(--photo)] w-[var(--photo)] rounded-full bg-[#F2F0EA] object-cover" />
      <span className="grid min-w-0 leading-[1.25]">
        <span className="truncate font-medium" style={{ color: me ? BRAND : undefined, transition: `color ${VALUE_CHANGE}s ease` }}>
          {name}
        </span>
        <span className="font-mono text-[.8em]" style={{ color: MUTED }}>
          {record}
        </span>
      </span>
      <span ref={mmrRef} data-testid="mmr" className="font-mono text-[1.2em] font-medium tracking-[-0.02em] tabular-nums">
        {mmr}
      </span>
      <span
        data-testid="delta"
        className="text-right font-mono text-[.8em] tabular-nums"
        style={{ color: delta?.startsWith("+") ? GREEN : MUTED, visibility: delta ? "visible" : "hidden" }}
      >
        {delta}
      </span>
    </li>
  );
}
