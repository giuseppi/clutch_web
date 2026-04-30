import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import basketballImg from "@/assets/basketball.png";
import AROverlay from "./AROverlay";
import { SplitText } from "./SplitText";

/**
 * Dark-mode pinned ball-zoom section. The page is 300vh tall; the inner
 * viewport sticks while scroll progress (0 → 1) drives:
 *   0.00–0.12: ball floats (scale 1), title visible
 *   0.12–0.40: ball zooms in (1 → 12), "NO SENSORS" / "JUST AI" beats
 *   0.40–0.55: ball zooms back out (12 → 4), settles in-hand size
 *   0.55–0.75: cream court diagram + AR overlay HUD fade in
 *
 * NOTE: src/assets/basketball.png is currently 557x561. For retina-sharp
 * peak zoom drop a 2000x2000+ transparent PNG at the same path — no code
 * change needed. Peak scale is 12 to compensate for the current asset.
 */
const BallZoom = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const ballScale = useTransform(scrollYProgress, [0, 0.12, 0.4, 0.55, 0.75], [1, 1, 12, 4, 4]);
  const ballOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0.25]);
  const courtOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const arOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.12], [1, 0]);
  const text1Opacity = useTransform(scrollYProgress, [0.16, 0.2, 0.28, 0.32], [0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.34, 0.42, 0.46], [0, 1, 1, 0]);

  const scrollBarFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative bg-obsidian text-paper" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-obsidian">
        {/* Subtle radial glow behind the ball */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.5], [0.45, 0]),
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,106,0,0.10), transparent 60%)",
          }}
        />

        {/* Court diagram in cream-on-dark — fades in late */}
        <motion.div className="absolute inset-0" style={{ opacity: courtOpacity }}>
          <CourtDiagram />
        </motion.div>

        {/* AR overlay HUD */}
        <motion.div className="absolute inset-0" style={{ opacity: arOpacity }}>
          <AROverlay opacity={1} />
        </motion.div>

        {/* The ball */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ opacity: ballOpacity }}
        >
          <motion.img
            src={basketballImg}
            alt="Basketball"
            className="w-48 h-48 md:w-80 md:h-80 object-contain select-none"
            style={{
              scale: ballScale,
              filter: "drop-shadow(0 18px 60px rgba(0,0,0,0.55))",
            }}
          />
        </motion.div>

        {/* Floating spec chips */}
        <motion.div
          className="absolute top-[22%] right-[6%] md:right-[20%] glass-panel-dark px-3 py-1 rounded font-mono text-[10px] text-brand z-10 pointer-events-none"
          style={{ opacity: titleOpacity }}
        >
          OBJ_ID: BB_v4.2
        </motion.div>
        <motion.div
          className="absolute bottom-[28%] left-[6%] md:left-[20%] glass-panel-dark px-3 py-1 rounded font-mono text-[10px] text-paper/70 z-10 pointer-events-none"
          style={{ opacity: titleOpacity }}
        >
          STATUS: TRACKING
        </motion.div>

        {/* Title — wordmark + scroll prompt */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none z-10"
          style={{ opacity: titleOpacity }}
        >
          <h2 className="font-display font-medium text-6xl md:text-8xl text-paper">CLUTCH</h2>
          <span className="label-mono text-paper/60 mt-4">Scroll to Analyze</span>
        </motion.div>

        {/* Beat 1: NO SENSORS */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          style={{ opacity: text1Opacity }}
        >
          <div className="text-center">
            <SplitText
              as="h2"
              text="NO"
              className="font-display font-medium text-6xl md:text-9xl text-paper"
              stagger={0.04}
            />
            <SplitText
              as="h2"
              text="SENSORS."
              className="font-display font-medium text-6xl md:text-9xl text-brand -mt-2 md:-mt-4"
              stagger={0.04}
            />
          </div>
        </motion.div>

        {/* Beat 2: JUST AI */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          style={{ opacity: text2Opacity }}
        >
          <div className="text-center relative">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,106,0,0.18), transparent 70%)",
              }}
            />
            <h2 className="relative font-display font-medium text-6xl md:text-9xl text-paper">
              JUST <span className="text-brand">AI.</span>
            </h2>
            <p className="relative mt-6 max-w-sm mx-auto font-mono text-sm leading-relaxed text-paper/70 border-r-2 border-brand pr-4 text-right">
              Computer vision extracting 120 data points per second from standard video.
            </p>
          </div>
        </motion.div>

        {/* Vertical scroll progress rail */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 items-center">
          <div className="w-1 h-16 bg-paper/15 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-brand rounded-full"
              style={{ height: scrollBarFill }}
            />
          </div>
          <span className="label-mono text-paper/60" style={{ writingMode: "vertical-rl" }}>
            Scroll
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Editorial isometric basketball court — cream strokes on dark obsidian
 * with brand-orange accents. Visible during the AR overlay reveal.
 */
const CourtDiagram = () => (
  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-16">
    <svg
      viewBox="0 0 800 480"
      className="w-full max-w-[1100px] h-auto opacity-95"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="courtFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A1A1F" />
          <stop offset="1" stopColor="#0A0A0F" />
        </linearGradient>
      </defs>
      <g transform="translate(400 240) skewX(-18) translate(-400 -240)">
        <rect x="60" y="60" width="680" height="360" fill="url(#courtFill)" stroke="#F0EEE5" strokeOpacity="0.65" strokeWidth="1.5" />
        <line x1="400" y1="60" x2="400" y2="420" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="400" cy="240" r="48" fill="none" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="400" cy="240" r="6" fill="#FF6A00" />
        <rect x="60" y="160" width="120" height="160" fill="none" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="180" cy="240" r="40" fill="none" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <rect x="620" y="160" width="120" height="160" fill="none" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="620" cy="240" r="40" fill="none" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M 60 110 Q 280 240 60 370" fill="none" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M 740 110 Q 520 240 740 370" fill="none" stroke="#F0EEE5" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="80" cy="240" r="5" fill="none" stroke="#FF6A00" strokeWidth="2" />
        <circle cx="720" cy="240" r="5" fill="none" stroke="#FF6A00" strokeWidth="2" />
        <PlayerMarker x="240" y="200" label="07" />
        <PlayerMarker x="320" y="280" label="22" />
        <PlayerMarker x="480" y="220" label="14" />
        <PlayerMarker x="540" y="290" label="09" />
        <PlayerMarker x="600" y="195" label="33" />
      </g>
    </svg>
  </div>
);

const PlayerMarker = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <g>
    <circle cx={x} cy={y} r="14" fill="#FF6A00" fillOpacity="0.18" stroke="#FF6A00" strokeWidth="1" />
    <circle cx={x} cy={y} r="3" fill="#FF6A00" />
    <text x={x + 18} y={y + 4} className="font-mono" fontSize="10" fill="#F0EEE5">
      #{label}
    </text>
  </g>
);

export default BallZoom;
