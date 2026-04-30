import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SplitText } from "./SplitText";
import { AnimatedNumber } from "./AnimatedNumber";
import { RotatingGlobe } from "./RotatingGlobe";

const statLines = [
  { label: "PTS", value: 18.4, target: 78, decimals: 1 },
  { label: "FG%", value: 54.2, target: 54, decimals: 1 },
  { label: "3P%", value: 38.7, target: 39, decimals: 1 },
  { label: "FT%", value: 81.0, target: 81, decimals: 1 },
];

const sessionBars = [40, 52, 48, 65, 78];

const polaroids = [
  { index: "01", kicker: "STAT TRACKING", rotate: -2.5, translateY: 0 },
  { index: "02", kicker: "PLAYER RATINGS", rotate: 1.8, translateY: 32 },
  { index: "03", kicker: "LIVE SCORES", rotate: -1.2, translateY: 16 },
  { index: "04", kicker: "COURT MATCHING", rotate: 2.4, translateY: 56 },
];

const FeaturesPolaroidGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.2 });

  return (
    <div id="features" className="paper-grain pt-20 md:pt-28 pb-24 md:pb-32 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header — TOC chrome */}
        <div className="flex items-baseline justify-between mb-10 md:mb-14 border-b border-ink/15 pb-5">
          <span className="label-mono text-inkMuted">FEATURES — 02</span>
          <span className="label-mono text-inkMuted hidden md:inline">04 / SYSTEMS</span>
        </div>

        {/* Headline */}
        <div className="grid md:grid-cols-12 gap-y-6 mb-16 md:mb-24">
          <SplitText
            as="h2"
            text="Everything a"
            className="md:col-span-12 font-display font-medium text-[clamp(2.5rem,7vw,5.5rem)] text-ink"
          />
          <SplitText
            as="h2"
            text="serious player needs."
            className="md:col-span-12 font-display font-medium italic text-[clamp(2.5rem,7vw,5.5rem)] text-ink pl-[6vw] md:pl-[16vw]"
            stagger={0.03}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-start-7 md:col-span-5 text-base md:text-lg text-ink/70 leading-relaxed mt-2"
          >
            Four systems running in concert behind a single phone camera.
            None of them require a coach, a scorer, or a wearable.
          </motion.p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-y-14 md:gap-y-20 md:gap-x-16 max-w-[1180px] mx-auto">
          {polaroids.map((p, i) => (
            <motion.article
              key={p.index}
              initial={{ opacity: 0, y: 60, rotate: p.rotate * 1.6 }}
              whileInView={{ opacity: 1, y: p.translateY, rotate: p.rotate }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotate: 0, y: p.translateY - 6, transition: { duration: 0.4 } }}
              className="bg-paperAlt border border-ink/10 shadow-[0_24px_60px_-24px_rgba(26,26,26,0.18)] p-6 md:p-7 origin-center"
            >
              {/* Polaroid "image area" — cream inner panel with animated content */}
              <div className="bg-paper text-ink aspect-[4/3] mb-5 relative overflow-hidden border border-ink/8">
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="label-mono text-ink/60">{p.kicker}</span>
                    <span className="font-display font-light italic text-3xl md:text-4xl text-ink/25">
                      {p.index}
                    </span>
                  </div>
                  {i === 0 && <StatTrackingContent inView={inView} />}
                  {i === 1 && <PlayerRatingsContent inView={inView} />}
                  {i === 2 && <LiveScoresContent inView={inView} />}
                  {i === 3 && <CourtMatchingContent inView={inView} />}
                </div>
              </div>

              {/* Polaroid caption — title + body */}
              <Caption index={i} />
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Per-card animated content ---------------- */

const StatTrackingContent = ({ inView }: { inView: boolean }) => (
  <div className="flex-1 flex flex-col">
    {/* Big focal stat */}
    <div className="mb-3">
      <div className="font-display font-medium text-5xl md:text-6xl text-ink tabular-nums leading-none">
        <AnimatedNumber value={18.4} inView={inView} duration={1600} delay={200} />
      </div>
      <div className="label-mono text-ink/55 mt-1">PPG · LAST 5 GAMES</div>
    </div>

    {/* Stat bars */}
    <div className="space-y-1.5 flex-1">
      {statLines.slice(1).map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-ink/60 w-7">{stat.label}</span>
          <div className="flex-1 h-1 bg-ink/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-1000 ease-out"
              style={{
                width: inView ? `${stat.target}%` : "0%",
                transitionDelay: `${600 + i * 180}ms`,
              }}
            />
          </div>
          <span className="text-ink w-9 text-right tabular-nums">
            <AnimatedNumber value={stat.value} inView={inView} delay={400 + i * 180} duration={1100} />
          </span>
        </div>
      ))}
    </div>

    {/* Session sparkline at bottom */}
    <div className="mt-auto pt-3 border-t border-ink/10">
      <div className="flex items-end gap-1.5 h-6">
        {sessionBars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-700 ease-out ${
              i === sessionBars.length - 1 ? "bg-brand" : "bg-brand/40"
            }`}
            style={{
              height: inView ? `${h}%` : "0%",
              transitionDelay: `${1300 + i * 80}ms`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const PlayerRatingsContent = ({ inView }: { inView: boolean }) => (
  <div className="flex-1 flex flex-col">
    <div className="flex items-end gap-3 mb-2">
      <div className="font-display font-medium text-5xl md:text-6xl text-ink tabular-nums leading-none">
        <AnimatedNumber value={1247} inView={inView} duration={1800} delay={200} decimals={0} />
      </div>
      <span className="label-mono text-brand bg-brand/10 border border-brand/30 px-2 py-1">GOLD</span>
    </div>
    <div className="label-mono text-ink/55 mb-4">MMR · GLICKO-2</div>

    {/* Sparkline */}
    <div className="flex-1 relative">
      <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          points="0,22 12,18 22,20 34,15 46,16 56,11 68,12 80,8 92,9 100,6"
          fill="none"
          stroke="#FF6A00"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 200,
            strokeDashoffset: inView ? 0 : 200,
            transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1) 700ms",
          }}
        />
        <circle cx="100" cy="6" r="1.5" fill="#FF6A00" opacity={inView ? 1 : 0} className="transition-opacity duration-300 delay-[2200ms]" />
      </svg>
    </div>

    <div className="mt-auto pt-3 border-t border-ink/10 flex items-center justify-between font-mono text-[11px]">
      <span className="text-ink/60">RANK</span>
      <span className="text-ink tabular-nums">
        #<AnimatedNumber value={412} inView={inView} duration={1400} delay={400} decimals={0} />
      </span>
      <span className="text-brand">
        ↑ <AnimatedNumber value={18} inView={inView} duration={1400} delay={500} decimals={0} suffix=" wks" />
      </span>
    </div>
  </div>
);

const LiveScoresContent = ({ inView }: { inView: boolean }) => (
  <div className="flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
        <span className="label-mono text-ink/80">LIVE</span>
      </div>
      <span className="font-mono text-[11px] text-ink/60">Q4 · 4:23</span>
    </div>

    <div className="flex-1 grid grid-cols-2 gap-3 items-center">
      <div className="text-center">
        <div className="label-mono text-ink/55 mb-1">TEAM A</div>
        <div className="font-display font-medium text-5xl md:text-6xl text-ink tabular-nums leading-none">
          <AnimatedNumber value={72} inView={inView} duration={1300} delay={300} decimals={0} />
        </div>
      </div>
      <div className="text-center border-l border-ink/10">
        <div className="label-mono text-ink/55 mb-1">TEAM B</div>
        <div className="font-display font-medium text-5xl md:text-6xl text-ink/70 tabular-nums leading-none">
          <AnimatedNumber value={68} inView={inView} duration={1300} delay={400} decimals={0} />
        </div>
      </div>
    </div>

    <div className="mt-auto pt-3 border-t border-ink/10 flex justify-between font-mono text-[11px]">
      <span className="text-ink/60">LAST: 3PT BY #15</span>
      <span className="text-brand">+3 PTS</span>
    </div>
  </div>
);

const CourtMatchingContent = ({ inView }: { inView: boolean }) => (
  <div className="flex-1 flex flex-col">
    <div className="flex-1 flex items-center justify-center -mx-2">
      <RotatingGlobe inView={inView} />
    </div>
    <div className="mt-auto pt-3 border-t border-ink/10 flex justify-between font-mono text-[11px]">
      <span className="text-ink/60">12 ACTIVE COURTS</span>
      <span className="text-brand">→ NEAR YOU</span>
    </div>
  </div>
);

/* ---------------- Captions ---------------- */

const captions = [
  {
    title: "Pro-grade box scores, automatic.",
    body: "Every shot, assist, board, and turnover — extracted from the video. No clipboard, no scorer's table.",
  },
  {
    title: "MMR for the rest of us.",
    body: "Performance converts into a competitive rating. Glicko-2 with custom modifiers — borrowed from chess, tuned for hoops.",
  },
  {
    title: "The score keeps itself.",
    body: "Real-time score and game clock, derived from the play. No manual input — the AI handles it as the game happens.",
  },
  {
    title: "Find a game at your level.",
    body: "Active courts and skill bands surfaced live. Turn up where the play matches your tier.",
  },
];

const Caption = ({ index }: { index: number }) => {
  const c = captions[index];
  return (
    <div>
      <h3 className="font-display text-xl md:text-2xl text-ink leading-tight">{c.title}</h3>
      <p className="mt-2 text-sm text-ink/70 leading-relaxed">{c.body}</p>
    </div>
  );
};

export default FeaturesPolaroidGrid;
