import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { getTierLabel, getTierTextClass } from "@/lib/mmrTier";
import PhoneBrowserMockup from "./PhoneBrowserMockup";
import GlobeCard from "./GlobeCard";

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

/** Demo rows for enhanced stats card */
const statLines = [
  { label: "PTS", value: 18.4, delta: 2.3, up: true },
  { label: "FG%", value: 54.2, delta: 3.1, up: true },
  { label: "3P%", value: 38.7, delta: 5.4, up: true },
  { label: "FT%", value: 81.0, delta: -0.8, up: false },
  { label: "AST", value: 4.2, delta: 0.6, up: true },
  { label: "REB", value: 6.8, delta: 1.1, up: true },
];

/** Session bar chart data (5 sessions) */
const sessionBars = [
  { label: "S1", height: 40 },
  { label: "S2", height: 52 },
  { label: "S3", height: 48 },
  { label: "S4", height: 65 },
  { label: "S5", height: 78 },
];

/** Demo leaderboard players */
const leaderboardPlayers = [
  { name: "A. Chen", mmr: 94, delta: "+2.1" },
  { name: "M. Davis", mmr: 76, delta: "+1.4" },
  { name: "R. Patel", mmr: 52, delta: "+0.8" },
  { name: "J. Williams", mmr: 31, delta: "+1.2" },
];

const FeaturesGrid = () => {
  const { ref, inView } = useInView(0.15);

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Features</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mt-3">
            Everything you need to level up.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Professional-grade basketball analytics powered by AI — no sensors, no wearables, just your phone.
          </p>
        </div>

        {/* Row 1: Large mockup + Enhanced stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {/* Phone + Web Mockup (60%) */}
          <div className="md:col-span-3">
            <PhoneBrowserMockup inView={inView} />
          </div>

          {/* Enhanced Stat Tracking (40%) */}
          <div className="md:col-span-2">
            <div className="glass-panel rounded-xl border border-border overflow-hidden group h-full flex flex-col">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-primary uppercase tracking-widest">Stat Tracking</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground leading-tight">
                  Professional-level box scores
                </h3>
                <p className="text-muted-foreground mt-2 text-xs">
                  Track every metric that matters. See exactly where you're improving.
                </p>
              </div>

              {/* Stats mockup */}
              <div className="mx-4 md:mx-5 mb-4 md:mb-5 rounded-lg bg-[hsl(0,0%,5%)] border border-border p-4 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {statLines.map((stat, i) => (
                    <div key={stat.label} className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground w-8">{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: inView ? `${Math.min(stat.value, 100)}%` : "0%",
                              background: "hsl(var(--primary))",
                              transitionDelay: `${300 + i * 150}ms`,
                            }}
                          />
                        </div>
                        <span className="text-foreground font-bold w-10 text-right">
                          <AnimatedNumber value={stat.value} inView={inView} delay={i * 150} />
                        </span>
                        <span
                          className={`text-[10px] w-8 text-right transition-opacity duration-500 ${stat.up ? "text-accent" : "text-destructive"}`}
                          style={{ opacity: inView ? 1 : 0, transitionDelay: `${1200 + i * 150}ms` }}
                        >
                          {stat.up ? "+" : ""}{stat.delta}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* More stats link */}
                  <div
                    className="pt-1 transition-opacity duration-500"
                    style={{ opacity: inView ? 1 : 0, transitionDelay: "1800ms" }}
                  >
                    <span className="text-[10px] font-mono text-primary cursor-pointer hover:underline">
                      + 12 more stats...
                    </span>
                  </div>
                </div>

                {/* Session bar chart */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-[9px] font-mono text-muted-foreground mb-2">Session Performance</div>
                  <div className="flex items-end gap-2 h-14">
                    {sessionBars.map((bar, i) => (
                      <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-sm transition-all duration-700"
                          style={{
                            height: inView ? `${bar.height}%` : "0%",
                            background:
                              i === sessionBars.length - 1
                                ? "hsl(var(--primary))"
                                : "hsl(var(--primary) / 0.3)",
                            transitionDelay: `${1400 + i * 100}ms`,
                          }}
                        />
                        <span className="text-[8px] font-mono text-muted-foreground">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Leaderboard + Live Scores + Globe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mt-5">

          {/* Card: Player Ratings / MMR */}
          <div className="glass-panel rounded-xl border border-border overflow-hidden group">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-mono text-accent uppercase tracking-widest">Player Ratings</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground leading-tight">
                Data-driven MMR rankings
              </h3>
              <p className="text-muted-foreground mt-2 text-xs">
                Your performance converts into a competitive rating. See where you stand.
              </p>
            </div>

            <div className="mx-5 md:mx-6 mb-5 md:mb-6 rounded-lg bg-[hsl(0,0%,5%)] border border-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
                <span>Player</span>
                <div className="flex items-center gap-4">
                  <span>Tier</span>
                  <span className="w-10 text-right">MMR</span>
                </div>
              </div>

              {leaderboardPlayers.map((player, i) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between px-3 py-2.5 font-mono text-xs border-b border-border/50 last:border-0 transition-all duration-500 ${
                    i === 0 ? "bg-accent/5" : ""
                  }`}
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-12px)",
                    transitionDelay: `${400 + i * 150}ms`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-3 text-right text-[10px]">{i + 1}</span>
                    <span className={i === 0 ? "text-accent font-bold" : "text-foreground"}>{player.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">
                      {getTierLabel(player.mmr)}
                    </span>
                    <span className={`font-bold w-10 text-right ${getTierTextClass(player.mmr)}`}>{player.mmr}</span>
                  </div>
                </div>
              ))}

              <div
                className="flex items-center justify-between px-3 py-2.5 bg-primary/5 border-t border-primary/20 transition-all duration-700"
                style={{ opacity: inView ? 1 : 0, transitionDelay: "1000ms" }}
              >
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-primary w-3 text-right text-[10px] font-bold">—</span>
                  <span className="text-primary font-bold">You</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                    {getTierLabel(52)}
                  </span>
                  <span className={`font-mono text-xs font-bold ${getTierTextClass(52)}`}>52</span>
                  <span className="text-[10px] text-accent font-bold">+0.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Live Score Tracking */}
          <div className="glass-panel rounded-xl border border-border overflow-hidden group">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-mono text-primary uppercase tracking-widest">Live Scores</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground leading-tight">
                Real-time score tracking
              </h3>
              <p className="text-muted-foreground mt-2 text-xs">
                Clutch keeps the score live as you play. No manual input — AI handles it all.
              </p>
            </div>

            <div className="mx-5 md:mx-6 mb-5 md:mb-6 rounded-lg bg-[hsl(0,0%,5%)] border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-foreground uppercase tracking-wide">Live</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">Q4 · 4:23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center mb-1.5">
                    <span className="text-primary font-bold text-xs">A</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Team A</span>
                  <div
                    className="text-3xl font-black text-foreground mt-1 transition-all duration-700"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "scale(1)" : "scale(0.8)",
                      transitionDelay: "500ms",
                    }}
                  >
                    <AnimatedNumber value={72} decimals={0} inView={inView} delay={300} duration={1200} />
                  </div>
                </div>
                <div className="text-xl font-bold text-muted-foreground mx-3">:</div>
                <div className="text-center flex-1">
                  <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 mx-auto flex items-center justify-center mb-1.5">
                    <span className="text-accent font-bold text-xs">B</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Team B</span>
                  <div
                    className="text-3xl font-black text-foreground mt-1 transition-all duration-700"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "scale(1)" : "scale(0.8)",
                      transitionDelay: "600ms",
                    }}
                  >
                    <AnimatedNumber value={68} decimals={0} inView={inView} delay={400} duration={1200} />
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-border flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Last: 3PT by #15</span>
                <span className="text-primary">+3 pts</span>
              </div>
            </div>
          </div>

          {/* Card: Globe / Court Matching */}
          <GlobeCard inView={inView} />
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
