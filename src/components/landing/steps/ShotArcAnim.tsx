import { motion, useReducedMotion } from "framer-motion";
import { DashedDraw } from "../DashedDraw";
import { DRAW, FADE, arrive } from "@/lib/motion";

// Anchor coordinates (SVG units, viewBox 0..400 × 0..160)
const FLOOR_Y = 135;

// Side-profile hoop geometry
const POLE_X = 360;           // pole position (far right)
const BACKBOARD_TOP = 20;
const BACKBOARD_BOTTOM = 70;
const BACKBOARD_BACK_X = 354; // backboard back edge (touches pole)
const BACKBOARD_FRONT_X = 344;// backboard front edge (faces shooter)
// Rim extends forward (left) from the bottom-front of the backboard.
// Drawn as a flat ellipse to suggest the rim opening seen at a slight
// downward side angle.
const RIM_BACK_X = BACKBOARD_FRONT_X;
const RIM_FRONT_X = 308;
const RIM_CX = (RIM_BACK_X + RIM_FRONT_X) / 2;
const RIM_RX = (RIM_BACK_X - RIM_FRONT_X) / 2;
const RIM_Y = 70;

// Net dimensions
const NET_TOP_Y = RIM_Y;
const NET_BOTTOM_Y = NET_TOP_Y + 24;
const NET_HALF_TOP = RIM_RX - 1;
const NET_HALF_BOTTOM = 4;
const STRAND_COUNT = 11;

// Shooter
const SHOOTER_X = 50;
const SHOOTER_HEAD_Y = 92;
// Shot arc terminates at the front lip of the rim (clean swish entry)
const ARC_END_X = RIM_FRONT_X + 3;
const ARC_END_Y = RIM_Y;
const ARC_PATH = `M ${SHOOTER_X + 8} ${SHOOTER_HEAD_Y - 4} Q ${
  (SHOOTER_X + ARC_END_X) / 2
} 6 ${ARC_END_X} ${ARC_END_Y}`;

// Strand geometry - each strand starts at a point on the rim ellipse and
// converges into a smaller ellipse at the bottom of the cone.
const strands = Array.from({ length: STRAND_COUNT }, (_, i) => {
  const t = i / (STRAND_COUNT - 1); // 0..1 across rim diameter
  const x1 = RIM_CX + NET_HALF_TOP * (t * 2 - 1);
  const x2 = RIM_CX + NET_HALF_BOTTOM * (t * 2 - 1);
  return { x1, x2 };
});
// Faded back-strands - same x positions, but slightly higher y (suggests
// they're behind the rim plane). 5 strands.
const backStrands = Array.from({ length: 5 }, (_, i) => {
  const t = (i + 1) / 6;
  const x1 = RIM_CX + (NET_HALF_TOP - 1) * (t * 2 - 1);
  const x2 = RIM_CX + NET_HALF_BOTTOM * (t * 2 - 1);
  return { x1, x2 };
});

/**
 * Step 02 - basketball arcs into a side-profile hoop. The hoop is drawn
 * from the shooter's side: pole on the far right, backboard shown as its
 * side-edge sliver, rim extending forward (left) as a flat ellipse, full
 * conical net with strand fans, horizontal weave rings, and faded back
 * strands suggesting depth. Under reduced motion it starts at the make.
 */
export const ShotArcAnim = ({ inView }: { inView: boolean }) => {
  const still = useReducedMotion() ?? false;
  return (
    <div className="relative h-40 step-tight:h-28 step-flat:h-24 bg-paperAlt border border-ink/10 overflow-hidden">
      <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Floor */}
        <line x1="20" y1={FLOOR_Y} x2="380" y2={FLOOR_Y} stroke="#1A1A1A" strokeOpacity="0.25" strokeWidth="0.8" />

        {/* Shooter */}
        <motion.circle
          cx={SHOOTER_X} cy={SHOOTER_HEAD_Y} r="6" fill="#1A1A1A"
          initial={still ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={FADE}
        />
        <motion.line
          x1={SHOOTER_X} y1={SHOOTER_HEAD_Y + 6} x2={SHOOTER_X} y2={FLOOR_Y}
          stroke="#1A1A1A" strokeWidth="2"
          initial={still ? false : { pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ ...DRAW, delay: 0.2 }}
        />

        {/* Shot arc */}
        <DashedDraw d={ARC_PATH} dash="4 4" stroke="#FF6A00" strokeWidth={1.4} show={inView} delay={0.7} />

        <Hoop inView={inView} still={still} />

        {/* Ball traveling along the arc, or resting at its end under reduced motion */}
        {still ? (
          <circle cx={ARC_END_X} cy={ARC_END_Y} r="5" fill="#FF6A00" />
        ) : (
          <motion.circle r="5" fill="#FF6A00">
            {inView && (
              <animateMotion dur={`${DRAW.duration}s`} begin="0.7s" fill="freeze" path={ARC_PATH} />
            )}
          </motion.circle>
        )}

        <Stamp inView={inView} still={still} />
      </svg>
    </div>
  );
};

/** Hoop assembly - side profile */
const Hoop = ({ inView, still }: { inView: boolean; still: boolean }) => (
  <motion.g
    initial={still ? false : { opacity: 0 }}
    animate={inView ? { opacity: 1 } : { opacity: 0 }}
    transition={{ ...FADE, delay: 0.5 }}
  >
    <PoleAndBackboard />

    {/* Rim - flat ellipse (side-angle perspective) */}
    <ellipse
      cx={RIM_CX} cy={RIM_Y}
      rx={RIM_RX} ry={3}
      fill="none" stroke="#FF6A00" strokeWidth="2.4"
    />

    <Net />
  </motion.g>
);

const PoleAndBackboard = () => (
  <>
    {/* Pole - vertical, far right */}
    <line
      x1={POLE_X} y1={FLOOR_Y}
      x2={POLE_X} y2={BACKBOARD_TOP - 4}
      stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="1.6"
    />
    {/* Bottom pole base accent */}
    <line
      x1={POLE_X - 6} y1={FLOOR_Y}
      x2={POLE_X + 6} y2={FLOOR_Y}
      stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="2"
    />

    {/* Backboard - drawn as the visible side edge (thin sliver) +
        a hinted front face shaded slightly differently */}
    {/* Side edge (filled, faces the pole) */}
    <rect
      x={BACKBOARD_BACK_X} y={BACKBOARD_TOP}
      width={POLE_X - BACKBOARD_BACK_X} height={BACKBOARD_BOTTOM - BACKBOARD_TOP}
      fill="#1A1A1A" fillOpacity="0.18"
    />
    {/* Front face profile (taller line indicating the front edge of the board) */}
    <line
      x1={BACKBOARD_FRONT_X} y1={BACKBOARD_TOP}
      x2={BACKBOARD_FRONT_X} y2={BACKBOARD_BOTTOM}
      stroke="#1A1A1A" strokeWidth="1.6"
    />
    {/* Top edge */}
    <line
      x1={BACKBOARD_FRONT_X} y1={BACKBOARD_TOP}
      x2={BACKBOARD_BACK_X} y2={BACKBOARD_TOP}
      stroke="#1A1A1A" strokeWidth="1.6"
    />
    {/* Bottom edge */}
    <line
      x1={BACKBOARD_FRONT_X} y1={BACKBOARD_BOTTOM}
      x2={BACKBOARD_BACK_X} y2={BACKBOARD_BOTTOM}
      stroke="#1A1A1A" strokeWidth="1.6"
    />
  </>
);

/** Net - full cone with front strands, back strands, weave rings */
const Net = () => (
  <g stroke="#1A1A1A" strokeLinecap="round" fill="none">
    {/* Back strands (lower opacity, suggest depth behind the rim plane) */}
    <g strokeOpacity="0.22" strokeWidth="0.7">
      {backStrands.map((s, i) => (
        <line key={`b${i}`} x1={s.x1} y1={NET_TOP_Y - 1.5} x2={s.x2} y2={NET_BOTTOM_Y - 1.5} />
      ))}
    </g>

    {/* Front strands (full opacity) */}
    <g strokeOpacity="0.6" strokeWidth="0.75">
      {strands.map((s, i) => (
        <line key={`f${i}`} x1={s.x1} y1={NET_TOP_Y} x2={s.x2} y2={NET_BOTTOM_Y} />
      ))}
    </g>

    {/* Horizontal weave rings - three at increasing depth */}
    <g strokeOpacity="0.5" strokeWidth="0.7">
      <ellipse cx={RIM_CX} cy={NET_TOP_Y + 8} rx={RIM_RX - 2.5} ry={2.4} />
      <ellipse cx={RIM_CX} cy={NET_TOP_Y + 15} rx={RIM_RX - 6} ry={1.8} />
      <ellipse cx={RIM_CX} cy={NET_TOP_Y + 21} rx={RIM_RX - 9.5} ry={1.2} />
    </g>
    {/* Bottom rim of net (closes the cone) */}
    <ellipse cx={RIM_CX} cy={NET_BOTTOM_Y} rx={NET_HALF_BOTTOM} ry={1} stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="0.7" />
  </g>
);

// The SWISH stamp's right edge and baseline: under the arc, just left of the net, so it reads
// as the rim's label and clears the dashed line.
const STAMP_X = 302;
const STAMP_Y = 90;

/** SWISH stamp */
const Stamp = ({ inView, still }: { inView: boolean; still: boolean }) => (
  <>
    <motion.text
      x={STAMP_X} y={STAMP_Y} textAnchor="end" className="font-mono" fontSize="11" fontWeight="500" fill="#FF6A00"
      initial={still ? false : { opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={arrive(2.3)}
      style={{ transformOrigin: `${STAMP_X}px ${STAMP_Y}px` }}
    >
      SWISH
    </motion.text>
    <motion.text
      x={STAMP_X} y={STAMP_Y + 12} textAnchor="end" className="font-mono" fontSize="8" fill="#1A1A1A"
      initial={still ? false : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ ...FADE, delay: 2.5 }}
    >
      +3 PTS
    </motion.text>
  </>
);
