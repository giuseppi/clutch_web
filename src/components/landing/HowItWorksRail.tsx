import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Crosshair, TrendingUp } from "lucide-react";
import { SplitText } from "./SplitText";
import { AnimatedNumber } from "./AnimatedNumber";

const steps = [
  {
    num: "01",
    icon: Smartphone,
    title: "Set up the phone.",
    description:
      "Prop it on the bleachers, a backpack, a tripod — anywhere with a view of the court. Open the app and confirm.",
    spec: "REAL-TIME CV ENGINE / ON-DEVICE",
  },
  {
    num: "02",
    icon: Crosshair,
    title: "Play the game.",
    description:
      "Shoot, drill, scrimmage. Every shot, board, and assist is recorded the moment it happens — no clipboard, no scorer.",
    spec: "AI TRACKING / EVERY SHOT",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Read the analytics.",
    description:
      "Box scores, shot charts, MMR tier, and trends across sessions — on your phone before you've finished cooling down.",
    spec: "INSTANT STATS / FG% · 3PT% · MMR",
  },
];

const HowItWorksRail = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Pin each step ~80vh of vertical scroll → 240vh total
  const translateX = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "-66.6667%"]);

  return (
    <div ref={ref} id="how-it-works" className="relative bg-paper text-ink paper-grain" style={{ height: "240vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* Section header */}
        <div className="px-6 md:px-12 pt-24 md:pt-28 pb-8">
          <div className="flex items-baseline justify-between border-b border-ink/15 pb-5 max-w-[1440px] mx-auto">
            <span className="label-mono text-inkMuted">HOW IT WORKS — 03</span>
            <span className="label-mono text-inkMuted hidden md:inline">3 STEPS / ZERO GEAR</span>
          </div>

          <div className="max-w-[1440px] mx-auto mt-8 md:mt-10">
            <SplitText
              as="h2"
              text="Three steps."
              className="font-display font-medium text-[clamp(2.5rem,7vw,5.5rem)] text-ink"
            />
            <SplitText
              as="h2"
              text="Zero gear."
              className="font-display font-medium italic text-[clamp(2.5rem,7vw,5.5rem)] text-brand pl-[6vw] md:pl-[18vw]"
              stagger={0.04}
            />
          </div>
        </div>

        {/* Horizontal pinned rail */}
        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div
            className="flex h-full items-center"
            style={{ x: translateX, width: `${steps.length * 100}vw` }}
          >
            {steps.map((step, i) => (
              <StepArticle key={step.num} step={step} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface StepProps {
  step: (typeof steps)[number];
  index: number;
}

const StepArticle = ({ step, index }: StepProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const Icon = step.icon;

  return (
    <article ref={ref} className="shrink-0 w-screen h-full flex items-center px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto w-full grid md:grid-cols-12 gap-y-8 md:gap-x-12 items-center">
        {/* Left: oversized number + per-step animation */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-ink/20 flex items-center justify-center bg-paperAlt">
              <Icon className="w-7 h-7 md:w-9 md:h-9 text-brand" aria-hidden />
            </div>
            <span className="label-mono text-inkMuted">STEP {step.num}</span>
          </div>
          <div className="font-display font-light italic text-[clamp(8rem,22vw,18rem)] leading-[0.85] text-ink/[0.10] mt-4">
            {step.num}
          </div>
        </div>

        {/* Right: copy + step animation panel */}
        <div className="md:col-span-7 md:pl-8 md:border-l border-ink/15">
          <h3 className="font-display font-medium text-3xl md:text-5xl leading-tight text-ink">
            {step.title}
          </h3>
          <p className="mt-5 max-w-md text-base md:text-lg text-ink/70 leading-relaxed">
            {step.description}
          </p>

          <div className="mt-8 max-w-md">
            <StepAnimation index={index} inView={inView} />
          </div>

          <span className="inline-block mt-6 label-mono text-inkMuted border border-ink/15 px-3 py-2">
            {step.spec}
          </span>
        </div>

        <div className="md:col-span-12 flex items-center justify-end gap-3 mt-4 md:mt-0">
          <span className="label-mono text-inkMuted">
            {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </article>
  );
};

/* ------------------- Per-step animations ------------------- */

const StepAnimation = ({ index, inView }: { index: number; inView: boolean }) => {
  if (index === 0) return <PhoneSetupAnim inView={inView} />;
  if (index === 1) return <ShotArcAnim inView={inView} />;
  return <StatGrowthAnim inView={inView} />;
};

/** Step 01 — phone outline + sight line + reticle, on a faded perspective court */
const PhoneSetupAnim = ({ inView }: { inView: boolean }) => (
  <div className="relative h-40 bg-paperAlt border border-ink/10 overflow-hidden">
    <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Faded perspective court behind everything */}
      <g opacity="0.35">
        <g transform="translate(200 90) skewX(-22) scale(1, 0.85) translate(-200 -90)">
          <rect x="60" y="34" width="280" height="112" fill="none" stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="0.8" />
          <line x1="200" y1="34" x2="200" y2="146" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="0.5" />
          <circle cx="200" cy="90" r="18" fill="none" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="0.5" />
          <rect x="60" y="68" width="44" height="44" fill="none" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="0.5" />
          <circle cx="104" cy="90" r="14" fill="none" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="0.5" />
          <rect x="296" y="68" width="44" height="44" fill="none" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="0.5" />
          <circle cx="296" cy="90" r="14" fill="none" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="0.5" />
          {/* Hoops */}
          <circle cx="64" cy="90" r="3" fill="none" stroke="#FF6A00" strokeOpacity="0.55" strokeWidth="1" />
          <circle cx="336" cy="90" r="3" fill="none" stroke="#FF6A00" strokeOpacity="0.55" strokeWidth="1" />
        </g>
      </g>

      {/* Phone */}
      <motion.rect
        x="40" y="42" width="42" height="76" rx="4"
        fill="#F0EEE5"
        stroke="#1A1A1A" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.line
        x1="55" y1="52" x2="67" y2="52"
        stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      />

      {/* Sight line phone → reticle */}
      <motion.line
        x1="84" y1="80" x2="290" y2="80"
        stroke="#FF6A00" strokeWidth="1.2" strokeDasharray="3 4"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Tracking reticle */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "300px 80px" }}
      >
        <circle cx="300" cy="80" r="22" fill="none" stroke="#FF6A00" strokeWidth="1.5" />
        <circle cx="300" cy="80" r="34" fill="none" stroke="#FF6A00" strokeWidth="0.5" strokeDasharray="2 3" />
        <line x1="300" y1="58" x2="300" y2="66" stroke="#FF6A00" strokeWidth="1.5" />
        <line x1="300" y1="94" x2="300" y2="102" stroke="#FF6A00" strokeWidth="1.5" />
        <line x1="278" y1="80" x2="286" y2="80" stroke="#FF6A00" strokeWidth="1.5" />
        <line x1="314" y1="80" x2="322" y2="80" stroke="#FF6A00" strokeWidth="1.5" />
      </motion.g>
      <motion.text
        x="345" y="78" className="font-mono" fontSize="9" fill="#1A1A1A"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.0 }}
      >
        LOCKED
      </motion.text>
      <motion.text
        x="345" y="90" className="font-mono" fontSize="8" fill="#FF6A00"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.2 }}
      >
        ON COURT
      </motion.text>
    </svg>
  </div>
);

/**
 * Step 02 — basketball arcs into a side-profile hoop. The hoop is drawn
 * from the shooter's side: pole on the far right, backboard shown as its
 * side-edge sliver, rim extending forward (left) as a flat ellipse, full
 * conical net with strand fans, horizontal weave rings, and faded back
 * strands suggesting depth.
 */
const ShotArcAnim = ({ inView }: { inView: boolean }) => {
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

  // Strand geometry — each strand starts at a point on the rim ellipse and
  // converges into a smaller ellipse at the bottom of the cone.
  const strands = Array.from({ length: STRAND_COUNT }, (_, i) => {
    const t = i / (STRAND_COUNT - 1); // 0..1 across rim diameter
    const x1 = RIM_CX + NET_HALF_TOP * (t * 2 - 1);
    const x2 = RIM_CX + NET_HALF_BOTTOM * (t * 2 - 1);
    return { x1, x2 };
  });
  // Faded back-strands — same x positions, but slightly higher y (suggests
  // they're behind the rim plane). 5 strands.
  const backStrands = Array.from({ length: 5 }, (_, i) => {
    const t = (i + 1) / 6;
    const x1 = RIM_CX + (NET_HALF_TOP - 1) * (t * 2 - 1);
    const x2 = RIM_CX + NET_HALF_BOTTOM * (t * 2 - 1);
    return { x1, x2 };
  });

  return (
    <div className="relative h-40 bg-paperAlt border border-ink/10 overflow-hidden">
      <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Floor */}
        <line x1="20" y1={FLOOR_Y} x2="380" y2={FLOOR_Y} stroke="#1A1A1A" strokeOpacity="0.25" strokeWidth="0.8" />

        {/* Shooter */}
        <motion.circle
          cx={SHOOTER_X} cy={SHOOTER_HEAD_Y} r="6" fill="#1A1A1A"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
        <motion.line
          x1={SHOOTER_X} y1={SHOOTER_HEAD_Y + 6} x2={SHOOTER_X} y2={FLOOR_Y}
          stroke="#1A1A1A" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Shot arc */}
        <motion.path
          d={ARC_PATH}
          fill="none" stroke="#FF6A00" strokeWidth="1.4" strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Hoop assembly — side profile */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Pole — vertical, far right */}
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

          {/* Backboard — drawn as the visible side edge (thin sliver) +
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

          {/* Rim — flat ellipse (side-angle perspective) */}
          <ellipse
            cx={RIM_CX} cy={RIM_Y}
            rx={RIM_RX} ry={3}
            fill="none" stroke="#FF6A00" strokeWidth="2.4"
          />

          {/* Net — full cone with front strands, back strands, weave rings */}
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

            {/* Horizontal weave rings — three at increasing depth */}
            <g strokeOpacity="0.5" strokeWidth="0.7">
              <ellipse cx={RIM_CX} cy={NET_TOP_Y + 8} rx={RIM_RX - 2.5} ry={2.4} />
              <ellipse cx={RIM_CX} cy={NET_TOP_Y + 15} rx={RIM_RX - 6} ry={1.8} />
              <ellipse cx={RIM_CX} cy={NET_TOP_Y + 21} rx={RIM_RX - 9.5} ry={1.2} />
            </g>
            {/* Bottom rim of net (closes the cone) */}
            <ellipse cx={RIM_CX} cy={NET_BOTTOM_Y} rx={NET_HALF_BOTTOM} ry={1} stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="0.7" />
          </g>
        </motion.g>

        {/* Ball traveling along the arc */}
        <motion.circle r="5" fill="#FF6A00">
          {inView && (
            <animateMotion dur="1.6s" begin="0.7s" fill="freeze" path={ARC_PATH} />
          )}
        </motion.circle>

        {/* SWISH stamp */}
        <motion.text
          x="208" y="44" className="font-mono" fontSize="11" fontWeight="600" fill="#FF6A00"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "208px 44px" }}
        >
          SWISH
        </motion.text>
        <motion.text
          x="208" y="58" className="font-mono" fontSize="8" fill="#1A1A1A"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.5 }}
        >
          +3 PTS
        </motion.text>
      </svg>
    </div>
  );
};

/** Step 03 — bar chart growing + animated counter ticking up to FG% */
const StatGrowthAnim = ({ inView }: { inView: boolean }) => {
  const bars = [38, 45, 52, 49, 58, 64, 71];
  return (
    <div className="relative h-40 bg-paperAlt border border-ink/10 p-4 overflow-hidden">
      <div className="flex items-baseline justify-between mb-2">
        <span className="label-mono text-ink/60">FG% · 7 SESSIONS</span>
        <span className="font-display font-medium text-2xl text-ink tabular-nums leading-none">
          <AnimatedNumber value={71} inView={inView} duration={1500} delay={300} decimals={0} suffix="%" />
        </span>
      </div>
      <div className="flex items-end gap-2 h-20">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-700 ease-out ${
              i === bars.length - 1 ? "bg-brand" : "bg-brand/40"
            }`}
            style={{
              height: inView ? `${h}%` : "0%",
              transitionDelay: `${600 + i * 90}ms`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1 label-mono text-ink/40">
        <span>S1</span>
        <span>S7</span>
      </div>
    </div>
  );
};

export default HowItWorksRail;
