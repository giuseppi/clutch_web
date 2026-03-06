import { useEffect, useState } from "react";
import { Trophy, Target, Users, Calendar } from "lucide-react";
import { useInView } from "@/hooks/useInView";

// ---------------------------------------------------------------------------
// Animated number counter — counts from 0 to `value` with easeOutCubic
// ---------------------------------------------------------------------------
const AnimatedNumber = ({
  value,
  decimals = 1,
  inView,
  delay = 0,
  duration = 1400,
}: {
  value: number;
  decimals?: number;
  inView: boolean;
  delay?: number;
  duration?: number;
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(eased * value);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [inView, value, delay, duration]);

  return <>{display.toFixed(decimals)}</>;
};

// ---------------------------------------------------------------------------
// Leaderboard data & climb stages
// ---------------------------------------------------------------------------
const players = [
  { id: "chen", name: "A. Chen" },
  { id: "davis", name: "M. Davis" },
  { id: "patel", name: "R. Patel" },
  { id: "williams", name: "J. Williams" },
];

// Visual position of each player at each climb stage
// Index = player array index, value = row position (0 = #1)
const stagePositions = [
  [0, 1, 2, 3], // Williams at #4
  [0, 1, 3, 2], // Williams passes Patel → #3
  [0, 2, 3, 1], // Williams passes Davis → #2
  [1, 2, 3, 0], // Williams passes Chen  → #1
];

const williamsMmr = [2100, 2260, 2330, 2450];
const otherMmrs: Record<string, number> = {
  chen: 2380,
  davis: 2310,
  patel: 2240,
};

const ROW_H = 32; // px per leaderboard row slot

// ---------------------------------------------------------------------------
// Stat tracking data
// ---------------------------------------------------------------------------
const statLines = [
  { label: "FG%", value: 54.2, delta: 3.1, up: true },
  { label: "3PT%", value: 38.7, delta: 5.4, up: true },
  { label: "FT%", value: 81.0, delta: -0.8, up: false },
];

const sparklineHeights = [30, 45, 35, 50, 42, 58, 52, 65, 55, 70, 60, 75, 68, 80, 72];

// ---------------------------------------------------------------------------
// Match history grid (deterministic intensity per cell)
// ---------------------------------------------------------------------------
const sessionDots = [
  [0, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 1, 1, 0, 1],
  [0, 1, 1, 1, 0, 0, 1],
];

function dotOpacity(wi: number, di: number) {
  return 0.35 + ((wi * 7 + di * 3) % 7) / 10;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const FeaturesGrid = () => {
  const { ref, inView } = useInView(0.2);
  const [climbStage, setClimbStage] = useState(0);

  // Advance leaderboard climb stage every 900ms once in view
  useEffect(() => {
    if (!inView) return;
    if (climbStage >= 3) return;

    const timer = setTimeout(() => {
      setClimbStage((s) => Math.min(s + 1, 3));
    }, 900);

    return () => clearTimeout(timer);
  }, [inView, climbStage]);

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-xs font-mono text-primary uppercase tracking-[0.3em]">
            Features
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mt-3">
            Built for ballers.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            NBA-level analytics from nothing but your phone camera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* ----------------------------------------------------------- */}
          {/* Hero Card — Ranked Mode (spans 2 rows on desktop)           */}
          {/* ----------------------------------------------------------- */}
          <div className="md:row-span-2 glass-panel rounded-xl p-6 md:p-8 border border-border relative overflow-hidden group">
            <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold font-mono uppercase tracking-wider px-3 py-1 rounded-full">
              Coming Soon
            </span>

            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="text-xs font-mono text-accent uppercase tracking-widest">
                Ranked Mode
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
              Compete<br />Globally
            </h3>
            <p className="text-muted-foreground mt-3 text-sm max-w-xs">
              Your performance earns a rank. Climb the leaderboard against players worldwide.
            </p>

            {/* MMR rank-up badge */}
            <div className="mt-6 flex items-center gap-3">
              <div className="glass-panel px-3 py-2 rounded border border-border">
                <span className="font-mono text-sm text-muted-foreground">Silver II</span>
              </div>
              <div
                className="flex items-center gap-1 text-primary transition-opacity duration-500"
                style={{ opacity: inView && climbStage >= 2 ? 1 : 0 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7" />
                </svg>
              </div>
              <div
                className="glass-panel px-3 py-2 rounded border border-accent/40 shadow-[0_0_12px_hsl(168_76%_50%/0.15)] transition-opacity duration-500"
                style={{ opacity: inView && climbStage >= 3 ? 1 : 0 }}
              >
                <span className="font-mono text-sm text-accent animate-pulse-slow">Gold I</span>
              </div>
            </div>

            {/* Animated leaderboard */}
            <div className="mt-8 relative" style={{ height: ROW_H * 4 }}>
              {players.map((player, i) => {
                const pos = stagePositions[climbStage][i];
                const isW = player.id === "williams";
                const mmr = isW ? williamsMmr[climbStage] : otherMmrs[player.id];
                const maxMmr = williamsMmr[climbStage];
                const barPct = (mmr / maxMmr) * 100;

                return (
                  <div
                    key={player.id}
                    className="absolute left-0 right-0 flex items-center gap-3 text-xs font-mono"
                    style={{
                      top: pos * ROW_H,
                      transition: "top 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                      opacity: inView ? 1 : 0,
                      transitionProperty: "top, opacity",
                      transitionDuration: "0.7s, 0.5s",
                      transitionDelay: `0s, ${i * 100}ms`,
                    }}
                  >
                    <span className="text-muted-foreground w-4 text-right">{pos + 1}</span>
                    <span
                      className={`flex-1 truncate ${isW ? "text-accent font-bold" : "text-foreground"}`}
                    >
                      {player.name}
                    </span>
                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: inView ? `${barPct}%` : "0%",
                          background: isW && pos === 0
                            ? "hsl(var(--accent))"
                            : "hsl(var(--primary))",
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground w-12 text-right">
                      {inView ? mmr : "—"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          </div>

          {/* ----------------------------------------------------------- */}
          {/* Card 2 — AI Stat Tracking                                    */}
          {/* ----------------------------------------------------------- */}
          <div className="glass-panel rounded-xl p-6 border border-border relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest">
                Shot Tracking
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-foreground">
              Track Every Shot
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              See your shooting progression after every session — no sensors, just your phone camera.
            </p>

            {/* Animated stat readouts */}
            <div className="mt-5 space-y-3">
              {statLines.map((stat, i) => (
                <div key={stat.label} className="flex items-center justify-between font-mono text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold">
                      <AnimatedNumber
                        value={stat.value}
                        inView={inView}
                        delay={i * 200}
                      />
                      %
                    </span>
                    <span
                      className={`text-xs transition-opacity duration-500 ${stat.up ? "text-accent" : "text-destructive"}`}
                      style={{
                        opacity: inView ? 1 : 0,
                        transitionDelay: `${1400 + i * 200}ms`,
                      }}
                    >
                      {stat.up ? "+" : ""}
                      {stat.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sparkline — bars grow from bottom */}
            <div className="mt-4 flex items-end gap-[3px] h-8">
              {sparklineHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: inView ? `${h}%` : "0%",
                    background:
                      i >= 12
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.25)",
                    transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    transitionDelay: `${300 + i * 60}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* Card 3 — Game Modes                                          */}
          {/* ----------------------------------------------------------- */}
          <div className="glass-panel rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest">
                Game Modes
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-foreground">
              Solo. 1v1. 5v5.
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              From solo drills to full-court runs, Clutch tracks it all.
            </p>

            <div className="mt-5 flex gap-3">
              {[
                { label: "Solo Drills", icon: "1" },
                { label: "1v1 Battle", icon: "2" },
                { label: "5v5 Court", icon: "5" },
              ].map((mode, i) => (
                <div
                  key={mode.label}
                  className="flex-1 glass-panel rounded-lg p-3 text-center border border-border hover:border-primary/40 transition-all"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                    transitionDelay: `${600 + i * 150}ms`,
                  }}
                >
                  <span className="font-mono text-xl font-bold text-foreground block">
                    {mode.icon}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1 block">
                    {mode.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* Card 4 — Match History                                       */}
          {/* ----------------------------------------------------------- */}
          <div className="md:col-span-2 glass-panel rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="text-xs font-mono text-accent uppercase tracking-widest">
                Match History
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-foreground">
              Every Session, Logged
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Calendar view of your sessions with drill-down stats.
            </p>

            {/* Activity grid — dots pop in with stagger */}
            <div className="mt-5 flex gap-6 items-start">
              <div className="flex flex-col gap-1">
                {["Mon", "Wed", "Fri", "Sun"].map((d) => (
                  <span key={d} className="text-[9px] font-mono text-muted-foreground h-4 flex items-center">
                    {d}
                  </span>
                ))}
              </div>
              <div className="flex gap-1 overflow-hidden">
                {sessionDots.map((week, wi) =>
                  week.map((active, di) => {
                    const flatIdx = wi * 7 + di;
                    return (
                      <div
                        key={`${wi}-${di}`}
                        className="w-4 h-4 rounded-[3px]"
                        style={{
                          background: active
                            ? `hsl(var(--primary) / ${dotOpacity(wi, di)})`
                            : "hsl(var(--secondary))",
                          opacity: inView ? 1 : 0,
                          transform: inView ? "scale(1)" : "scale(0)",
                          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                          transitionDelay: `${400 + flatIdx * 30}ms`,
                        }}
                      />
                    );
                  })
                )}
              </div>
              <div className="hidden sm:flex flex-col gap-1 ml-auto font-mono text-xs">
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <span>This week</span>
                  <span className="text-foreground font-bold">
                    <AnimatedNumber value={4} decimals={0} inView={inView} delay={800} duration={600} /> sessions
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <span>Streak</span>
                  <span className="text-primary font-bold">
                    <AnimatedNumber value={12} decimals={0} inView={inView} delay={1000} duration={800} /> days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
