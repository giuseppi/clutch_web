import { motion } from "framer-motion";
import { useId } from "react";
import ballUrl from "@/assets/game/ball.webp";
import { clamp01, drawVariants, ENTRANCE, fadeVariants } from "@/lib/motion";
import { BRAND, HOOP, INK, PLAYERS, SHOTS, beatAt, landTime, stateAt, type BeatFrame, type Shot } from "./game";

/** Court lines are one layer of ink at this opacity, so where lines meet or cross they do not darken. */
const LINE_OPACITY = 0.38;
const LINE_WIDTH = 0.16;
const OUTLINE_WIDTH = 0.24;
/** Seconds a make's heat takes to fade in. */
const HEAT_FADE = 0.6;

/** The viewBox is 53 ft wide; the court's outer edge is the boundary (x = ±25) plus half its stroke. */
const VIEW_WIDTH = 53;
const EDGE = 25 + OUTLINE_WIDTH / 2;
/** Widen the SVG and pull it out by its side padding so the court's outer lines sit on the box edges. */
const FIT = {
  width: `${(100 * VIEW_WIDTH) / (2 * EDGE)}%`,
  marginInline: `${(-100 * (VIEW_WIDTH / 2 - EDGE)) / (2 * EDGE)}%`,
};

/** Court lines as paths (Safari only honours pathLength on <path>), so each can draw in. */
const COURT_LINES = {
  boundary: "M -25 0 H 25 V 47 H -25 Z",
  // Open at the top: the baseline is the lane's top edge.
  lane: "M -8 0 V 19 H 8 V 0",
  freeThrow: "M 0 13 A 6 6 0 0 1 0 25 A 6 6 0 0 1 0 13 Z",
  three: "M -22 0 L -22 14.2 A 23.75 23.75 0 0 0 22 14.2 L 22 0",
  halfCourt: "M -6 47 A 6 6 0 0 1 6 47",
} as const;

/**
 * The half court at game time `t`, in feet: baseline at the top, hoop centre at (0, 5.25).
 * Makes leave a filled mark and a heat glow, misses leave a ring, and the shot in progress
 * shows its shooter, ball, "+2" or "+3" pop and rim pulse.
 *
 * Entrance: under a motion parent that goes from "hidden" to "visible" (the hero), the lines
 * draw in and the floor and hoop fade in at their ENTRANCE times. On its own it renders settled.
 */
export function HalfCourt({ t }: { t: number }) {
  // useId gives ":r1:"; colons are dropped so the ids are safe inside url(#...).
  const id = useId().replace(/:/g, "");
  const state = stateAt(t);
  const landed = SHOTS.slice(0, state.landed);
  const shot = state.beat ? SHOTS[state.beat.index] : null;
  const frame = shot && state.beat ? beatAt(shot, state.beat.u) : null;

  return (
    <svg viewBox="-26.5 -1.5 53 50" aria-hidden="true" className="block h-auto max-w-none overflow-visible" style={FIT}>
      <Floor id={id} />
      {/* The glow is plain alpha over the court (no blend mode), as in the approved sketch. */}
      <g clipPath={`url(#${id}-clip)`}>
        {landed.map((s, i) =>
          s.made ? (
            <circle
              key={i}
              data-heat={s.player}
              cx={s.x}
              cy={s.y}
              r={5.5}
              fill={`url(#${id}-heat-${s.player})`}
              opacity={clamp01((t - landTime(i)) / HEAT_FADE)}
            />
          ) : null,
        )}
      </g>
      <Lines />
      <Hoop rim={frame?.rim ?? null} />
      <g>
        {landed.map((s, i) => (
          <Mark key={i} shot={s} />
        ))}
      </g>
      {shot && frame && <Beat shot={shot} frame={frame} />}
    </svg>
  );
}

/** Heat gradients, the court clip, the court fill and the lane tint. */
function Floor({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-heat-G`}>
          <stop offset="0" stopColor={BRAND} stopOpacity={0.55} />
          <stop offset="0.45" stopColor={BRAND} stopOpacity={0.22} />
          <stop offset="1" stopColor={BRAND} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-heat-J`}>
          <stop offset="0" stopColor={INK} stopOpacity={0.3} />
          <stop offset="0.45" stopColor={INK} stopOpacity={0.12} />
          <stop offset="1" stopColor={INK} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={-25} y={0} width={50} height={47} />
        </clipPath>
      </defs>
      <motion.g variants={fadeVariants} transition={{ delay: ENTRANCE.courtFill }}>
        <rect x={-25} y={0} width={50} height={47} rx={0.4} className="fill-paperAlt" />
        <rect x={-8} y={0} width={16} height={19} fill="rgba(26,26,26,.045)" />
      </motion.g>
    </>
  );
}

function Lines() {
  return (
    <g fill="none" stroke={INK} strokeWidth={LINE_WIDTH} opacity={LINE_OPACITY}>
      {Object.entries(COURT_LINES).map(([name, d]) => (
        <motion.path
          key={name}
          data-court-line={name}
          pathLength={1}
          d={d}
          strokeWidth={name === "boundary" ? OUTLINE_WIDTH : undefined}
          variants={drawVariants}
          transition={{ delay: ENTRANCE.courtLines }}
        />
      ))}
    </g>
  );
}

/** Backboard, a short ink connector to the rim, and the rim at court line weight so it never reads as a miss ring. */
function Hoop({ rim }: { rim: BeatFrame["rim"] }) {
  const rimTop = HOOP.y - 0.75;
  return (
    <motion.g variants={fadeVariants} transition={{ delay: ENTRANCE.courtFill }}>
      <line data-backboard="" x1={-3} y1={4} x2={3} y2={4} stroke={INK} strokeWidth={0.3} />
      <line data-connector="" x1={HOOP.x} y1={4} x2={HOOP.x} y2={rimTop} stroke={INK} strokeWidth={LINE_WIDTH} />
      <circle data-rim="" cx={HOOP.x} cy={HOOP.y} r={0.75} fill="none" stroke={BRAND} strokeWidth={LINE_WIDTH} />
      {rim && <circle cx={HOOP.x} cy={HOOP.y} r={rim.r} fill="none" stroke={BRAND} strokeWidth={0.2} opacity={rim.opacity} />}
    </motion.g>
  );
}

/** A filled dot for a make, a ring for a miss. */
function Mark({ shot }: { shot: Shot }) {
  const color = PLAYERS[shot.player].color;
  return shot.made ? (
    <circle data-mark="make" cx={shot.x} cy={shot.y} r={0.85} fill={color} strokeWidth={0.25} className="stroke-paper" />
  ) : (
    <circle data-mark="miss" cx={shot.x} cy={shot.y} r={0.75} fill="none" stroke={color} strokeWidth={0.28} />
  );
}

/** The shot in progress: shooter marker, ball and its ground shadow, and the points pop. */
function Beat({ shot, frame }: { shot: Shot; frame: BeatFrame }) {
  const color = PLAYERS[shot.player].color;
  const { ball, shadow, pop } = frame;
  return (
    <>
      <g transform={`translate(${shot.x} ${shot.y})`} opacity={frame.shooterOpacity}>
        <circle r={1.25} stroke={color} strokeWidth={0.3} className="fill-paper" />
        <text y={0.42} textAnchor="middle" fontSize={1.15} fontWeight={600} fill={color}>
          {shot.player}
        </text>
      </g>
      {shadow && <ellipse cx={shadow.x} cy={shadow.y} rx={0.7} ry={0.38} fill="rgba(26,26,26,.25)" opacity={shadow.opacity} />}
      {ball && (
        <image
          href={ballUrl}
          x={ball.x - ball.size / 2}
          y={ball.y - ball.size / 2}
          width={ball.size}
          height={ball.size}
          opacity={ball.opacity}
        />
      )}
      {pop && (
        <text x={pop.x} y={pop.y} textAnchor="middle" fontSize={2.2} fontWeight={500} fill={BRAND} opacity={pop.opacity} className="font-mono">
          {pop.text}
        </text>
      )}
    </>
  );
}
