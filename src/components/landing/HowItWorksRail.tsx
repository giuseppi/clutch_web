import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Crosshair, Play, TrendingUp } from "lucide-react";
import { SplitText } from "./SplitText";
import { DemoVideo } from "./DemoVideo";
import { GRID } from "./game/layout";
import { PhoneSetupAnim } from "./steps/PhoneSetupAnim";
import { ShotArcAnim } from "./steps/ShotArcAnim";
import { StatGrowthAnim } from "./steps/StatGrowthAnim";

const steps = [
  {
    num: "01",
    icon: Smartphone,
    title: "Set up the phone.",
    description:
      "Prop it on the bleachers, a backpack, a tripod, or anywhere with a view of the court. Open the app and confirm.",
    spec: "REAL-TIME CV ENGINE / ON-DEVICE",
  },
  {
    num: "02",
    icon: Crosshair,
    title: "Play the game.",
    description:
      "Shoot, drill, scrimmage. Every shot, board, and assist is recorded the moment it happens. No clipboard, no scorer.",
    spec: "AI TRACKING / EVERY SHOT",
  },
  {
    num: "03",
    icon: Play,
    title: "See it in action.",
    description:
      "Watch Clutch track shots in real time, with no wearables and no manual input. Just your phone and the court.",
    spec: "LIVE DEMO / ON-DEVICE AI",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Read the analytics.",
    description:
      "Box scores, shot charts, MMR tier, and trends across sessions, on your phone before you've finished cooling down.",
    spec: "INSTANT STATS / FG% · 3PT% · MMR",
  },
];

const HowItWorksRail = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const translateX = useTransform(scrollYProgress, [0.05, 0.95], ["0%", `-${((steps.length - 1) / steps.length) * 100}%`]);

  return (
    <div id="how-it-works" className="relative bg-paper text-ink paper-grain">
      {/* Section header, which scrolls away before the steps pin */}
      <div className={`${GRID} pt-24 md:pt-28 pb-8`}>
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-5">
          <span className="label text-inkMuted">HOW IT WORKS · 03</span>
          <span className="label text-inkMuted hidden md:inline">4 STEPS / ZERO GEAR</span>
        </div>

        <div className="mt-8 md:mt-10">
          <SplitText
            as="h2"
            text="Four steps."
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] text-ink"
          />
          <SplitText
            as="h2"
            text="Zero gear."
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] text-brand pl-[6vw] md:pl-[min(18vw,259px)]"
          />
        </div>
      </div>

      {/* Horizontal pinned rail: one screen, its top padding clearing the fixed navbar (69 px, 81 px from md) */}
      <div ref={ref} className="relative" style={{ height: "320vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden pt-[4.5rem] md:pt-[5.25rem]">
          {/* Sized in % of the panel, not vw, so each step is the page's width without its scrollbar, like the navbar */}
          <motion.div
            className="flex h-full items-center"
            style={{ x: translateX, width: `${steps.length * 100}%` }}
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
  // Under reduced motion each step's animation shows its end state, on screen or not.
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { amount: 0.3 }) || reduced;
  const Icon = step.icon;

  return (
    <article ref={ref} className="shrink-0 h-full flex items-center" style={{ width: `${100 / steps.length}%` }}>
      <div className={`${GRID} w-full grid md:grid-cols-12 gap-y-8 step-tight:gap-y-4 md:step-tight:gap-y-2 md:gap-x-12 items-center`}>
        {/* Left: oversized number + per-step animation */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 step-tight:w-12 step-tight:h-12 rounded-full border border-ink/20 flex items-center justify-center bg-paperAlt">
              <Icon className="w-7 h-7 md:w-9 md:h-9 step-tight:w-5 step-tight:h-5 text-brand" aria-hidden />
            </div>
            <span className="label-mono text-inkMuted">STEP {step.num}</span>
          </div>
          <div className="font-display font-normal text-[clamp(8rem,22vw,18rem)] leading-[0.85] text-ink/[0.10] mt-4 step-short:hidden">
            {step.num}
          </div>
        </div>

        {/* Right: copy + step animation panel */}
        <div className="md:col-span-7 md:pl-8 md:border-l border-ink/15">
          <h3 className="font-display text-3xl md:text-5xl step-tight:text-2xl leading-tight text-ink">
            {step.title}
          </h3>
          <p className="mt-5 step-tight:mt-2 max-w-md text-base md:text-lg step-tight:text-sm text-ink/70 leading-relaxed">
            {step.description}
          </p>

          <div className="mt-8 step-tight:mt-2 max-w-md">
            <StepAnimation index={index} inView={inView} />
          </div>

          <span className="inline-block mt-6 step-tight:mt-2 label text-inkMuted border border-ink/15 px-3 py-2 step-tight:py-1.5">
            {step.spec}
          </span>
        </div>

        <div className="md:col-span-12 flex items-center justify-end gap-3 mt-4 md:mt-0 step-tight:mt-0">
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
  if (index === 2) return <DemoVideo />;
  return <StatGrowthAnim inView={inView} />;
};

export default HowItWorksRail;
