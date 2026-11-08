import { motion, useReducedMotion } from "framer-motion";
import { DashedDraw } from "../DashedDraw";
import { DRAW, FADE, arrive, drawHidden, drawShown } from "@/lib/motion";

/**
 * Step 01 - phone outline + sight line + reticle, on a faded perspective court.
 * Under reduced motion it starts drawn.
 */
export const PhoneSetupAnim = ({ inView }: { inView: boolean }) => {
  const still = useReducedMotion() ?? false;
  return (
    <div className="relative h-40 bg-paperAlt border border-ink/10 overflow-hidden">
      <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <FadedCourt />

        {/* Phone: a 42 x 76 rect with 4 px corners at (40, 42), as a path (Safari only honours pathLength on <path>) */}
        <motion.path
          d="M 44 42 H 78 A 4 4 0 0 1 82 46 V 114 A 4 4 0 0 1 78 118 H 44 A 4 4 0 0 1 40 114 V 46 A 4 4 0 0 1 44 42 Z"
          pathLength={1}
          fill="#F0EEE5"
          stroke="#1A1A1A" strokeWidth="1.5"
          initial={still ? false : { ...drawHidden, opacity: 0 }}
          animate={inView ? { ...drawShown, opacity: 1 } : { ...drawHidden, opacity: 0 }}
          transition={DRAW}
        />
        <motion.line
          x1="55" y1="52" x2="67" y2="52"
          stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round"
          initial={still ? false : { pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ ...DRAW, delay: 0.9 }}
        />

        {/* Sight line phone → reticle */}
        <DashedDraw d="M 84 80 H 290" dash="3 4" stroke="#FF6A00" strokeWidth={1.2} show={inView} delay={1.0} />

        <Reticle inView={inView} still={still} />
      </svg>
    </div>
  );
};

/** Faded perspective court behind everything */
const FadedCourt = () => (
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
);

/** Tracking reticle, then its LOCKED / ON COURT readout */
const Reticle = ({ inView, still }: { inView: boolean; still: boolean }) => (
  <>
    <motion.g
      initial={still ? false : { scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={arrive(1.6)}
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
      initial={still ? false : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ ...FADE, delay: 2.0 }}
    >
      LOCKED
    </motion.text>
    <motion.text
      x="345" y="90" className="font-mono" fontSize="8" fill="#FF6A00"
      initial={still ? false : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ ...FADE, delay: 2.2 }}
    >
      ON COURT
    </motion.text>
  </>
);
