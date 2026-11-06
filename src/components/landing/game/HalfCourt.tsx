import ballUrl from "@/assets/game/ball.webp";
import { clamp01 } from "@/lib/motion";
import { BRAND, HOOP, INK, PLAYERS, SHOTS, beatAt, landTime, stateAt, type BeatFrame, type Shot } from "./game";

const PAPER = "#F0EEE5";
const PAPER_ALT = "#E9E5D8";
const LINE = "rgba(26,26,26,.38)";
/** Seconds a make's heat takes to fade in. */
const HEAT_FADE = 0.6;

/**
 * The half court at game time `t`, in feet: baseline at the top, hoop centre at (0, 5.25).
 * Makes leave a filled mark and a heat glow, misses leave a ring, and the shot in progress
 * shows its shooter, ball, "+2" or "+3" pop and rim pulse.
 */
export function HalfCourt({ t }: { t: number }) {
  const state = stateAt(t);
  const landed = SHOTS.slice(0, state.landed);
  const shot = state.beat ? SHOTS[state.beat.index] : null;
  const frame = shot && state.beat ? beatAt(shot, state.beat.u) : null;

  return (
    <svg viewBox="-26.5 -1.5 53 50" aria-hidden="true" className="block h-auto max-h-[92%] w-full overflow-visible">
      <Floor />
      <g clipPath="url(#court-clip)">
        <g style={{ mixBlendMode: "multiply" }}>
          {landed.map((s, i) =>
            s.made ? (
              <circle
                key={i}
                data-heat={s.player}
                cx={s.x}
                cy={s.y}
                r={5.5}
                fill={`url(#court-heat-${s.player})`}
                opacity={clamp01((t - landTime(i)) / HEAT_FADE)}
              />
            ) : null,
          )}
        </g>
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
function Floor() {
  return (
    <>
      <defs>
        <radialGradient id="court-heat-G">
          <stop offset="0" stopColor={BRAND} stopOpacity={0.55} />
          <stop offset="0.45" stopColor={BRAND} stopOpacity={0.22} />
          <stop offset="1" stopColor={BRAND} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="court-heat-J">
          <stop offset="0" stopColor={INK} stopOpacity={0.3} />
          <stop offset="0.45" stopColor={INK} stopOpacity={0.12} />
          <stop offset="1" stopColor={INK} stopOpacity={0} />
        </radialGradient>
        <clipPath id="court-clip">
          <rect x={-25} y={0} width={50} height={47} />
        </clipPath>
      </defs>
      <rect x={-25} y={0} width={50} height={47} rx={0.4} fill={PAPER_ALT} />
      <rect x={-8} y={0} width={16} height={19} fill="rgba(26,26,26,.045)" />
    </>
  );
}

/** Boundary, lane, free-throw circle, three-point line and half-court circle. */
function Lines() {
  return (
    <g fill="none" stroke={LINE} strokeWidth={0.16}>
      <rect data-court-line="" pathLength={1} x={-25} y={0} width={50} height={47} strokeWidth={0.24} />
      <rect data-court-line="" pathLength={1} x={-8} y={0} width={16} height={19} />
      <circle data-court-line="" pathLength={1} cx={0} cy={19} r={6} />
      <path data-court-line="" pathLength={1} d="M -22 0 L -22 14.2 A 23.75 23.75 0 0 0 22 14.2 L 22 0" />
      <path data-court-line="" pathLength={1} d="M -6 47 A 6 6 0 0 1 6 47" />
    </g>
  );
}

function Hoop({ rim }: { rim: BeatFrame["rim"] }) {
  return (
    <>
      <line x1={-3} y1={4} x2={3} y2={4} stroke={INK} strokeWidth={0.3} />
      <circle cx={HOOP.x} cy={HOOP.y} r={0.75} fill="none" stroke={BRAND} strokeWidth={0.28} />
      {rim && <circle cx={HOOP.x} cy={HOOP.y} r={rim.r} fill="none" stroke={BRAND} strokeWidth={0.2} opacity={rim.opacity} />}
    </>
  );
}

/** A filled dot for a make, a ring for a miss. */
function Mark({ shot }: { shot: Shot }) {
  const color = PLAYERS[shot.player].color;
  return shot.made ? (
    <circle data-mark="make" cx={shot.x} cy={shot.y} r={0.85} fill={color} stroke={PAPER} strokeWidth={0.25} />
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
        <circle r={1.25} fill={PAPER} stroke={color} strokeWidth={0.3} />
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
