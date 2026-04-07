import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

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

const leaderboardPlayers = [
  { name: "A. Chen", mmr: 2380, rank: "Gold II", delta: "+45" },
  { name: "M. Davis", mmr: 2310, rank: "Gold I", delta: "+22" },
  { name: "R. Patel", mmr: 2240, rank: "Silver III", delta: "+38" },
  { name: "J. Williams", mmr: 2150, rank: "Silver II", delta: "+67" },
];

const statLines = [
  { label: "FG%", value: 54.2, delta: 3.1, up: true },
  { label: "3PT%", value: 38.7, delta: 5.4, up: true },
  { label: "FT%", value: 81.0, delta: -0.8, up: false },
];

const sparklineHeights = [30, 45, 35, 50, 42, 58, 52, 65, 55, 70, 60, 75, 68, 80, 72];

const FeaturesGrid = () => {
  const { ref, inView } = useInView(0.15);

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-xs font-mono text-primary uppercase tracking-[0.3em]">
            Features
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mt-3">
            Everything you need to level up.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Professional-grade basketball analytics powered by AI — no sensors, no wearables, just your phone.
          </p>
        </div>

        {/* Stripe-style grid: 2 large top, 2 medium bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">

          {/* --- Card 1: Professional Stat Tracking (large) --- */}
          <div className="glass-panel rounded-xl border border-border overflow-hidden group">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-mono text-primary uppercase tracking-widest">
                  Stat Tracking
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                Professional-level stat tracking
              </h3>
              <p className="text-muted-foreground mt-3 text-sm max-w-md">
                Track your shooting percentages, session trends, and improvement over time. See exactly where you're getting better.
              </p>
            </div>

            {/* Mockup area */}
            <div className="mx-6 md:mx-8 mb-6 md:mb-8 rounded-lg bg-[hsl(0,0%,5%)] border border-border p-5">
              <div className="space-y-3">
                {statLines.map((stat, i) => (
                  <div key={stat.label} className="flex items-center justify-between font-mono text-sm">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: inView ? `${stat.value}%` : "0%",
                            background: "hsl(var(--primary))",
                            transitionDelay: `${300 + i * 200}ms`,
                          }}
                        />
                      </div>
                      <span className="text-foreground font-bold w-14 text-right">
                        <AnimatedNumber value={stat.value} inView={inView} delay={i * 200} />%
                      </span>
                      <span
                        className={`text-xs w-10 text-right transition-opacity duration-500 ${stat.up ? "text-accent" : "text-destructive"}`}
                        style={{
                          opacity: inView ? 1 : 0,
                          transitionDelay: `${1400 + i * 200}ms`,
                        }}
                      >
                        {stat.up ? "+" : ""}{stat.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sparkline */}
              <div className="mt-5 flex items-end gap-[3px] h-12 border-t border-border pt-4">
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
                      transition: "height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transitionDelay: `${300 + i * 60}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
                <span>2 weeks ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* --- Card 2: Player Ratings / MMR (large) --- */}
          <div className="glass-panel rounded-xl border border-border overflow-hidden group">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-mono text-accent uppercase tracking-widest">
                  Player Ratings
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                Data-driven MMR rankings
              </h3>
              <p className="text-muted-foreground mt-3 text-sm max-w-md">
                Your on-court performance converts into a competitive rating. See where you stand and climb the leaderboard.
              </p>
            </div>

            {/* Leaderboard mockup */}
            <div className="mx-6 md:mx-8 mb-6 md:mb-8 rounded-lg bg-[hsl(0,0%,5%)] border border-border overflow-hidden">
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                <span>Player</span>
                <div className="flex items-center gap-6">
                  <span>Rank</span>
                  <span className="w-14 text-right">MMR</span>
                </div>
              </div>

              {leaderboardPlayers.map((player, i) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between px-4 py-3 font-mono text-sm border-b border-border/50 last:border-0 transition-all duration-500 ${
                    i === 0 ? "bg-accent/5" : ""
                  }`}
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-12px)",
                    transitionDelay: `${400 + i * 150}ms`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground w-4 text-right text-xs">{i + 1}</span>
                    <span className={i === 0 ? "text-accent font-bold" : "text-foreground"}>
                      {player.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary border border-border text-muted-foreground">
                      {player.rank}
                    </span>
                    <div className="flex items-center gap-2 w-14 justify-end">
                      <span className="text-foreground font-bold">{player.mmr}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Your position */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-primary/5 border-t border-primary/20 transition-all duration-700"
                style={{
                  opacity: inView ? 1 : 0,
                  transitionDelay: "1000ms",
                }}
              >
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="text-primary w-4 text-right text-xs font-bold">—</span>
                  <span className="text-primary font-bold">You</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                    Silver II
                  </span>
                  <span className="font-mono text-sm text-primary font-bold">2,150</span>
                  <span className="text-xs text-accent font-bold">+67</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Card 3: Live Score Tracking (medium) --- */}
          <div className="glass-panel rounded-xl border border-border overflow-hidden group">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-mono text-primary uppercase tracking-widest">
                  Live Scores
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">
                Real-time score tracking
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Clutch keeps the score live as you play. No manual input — AI handles it all.
              </p>
            </div>

            {/* Scoreboard mockup */}
            <div className="mx-6 md:mx-8 mb-6 md:mb-8 rounded-lg bg-[hsl(0,0%,5%)] border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-foreground uppercase tracking-wide">Live</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">Q4 · 4:23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center mb-2">
                    <span className="text-primary font-bold text-sm">A</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">Team A</span>
                  <div
                    className="text-4xl font-black text-foreground mt-1 transition-all duration-700"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "scale(1)" : "scale(0.8)",
                      transitionDelay: "500ms",
                    }}
                  >
                    <AnimatedNumber value={72} decimals={0} inView={inView} delay={300} duration={1200} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-muted-foreground mx-4">:</div>
                <div className="text-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 mx-auto flex items-center justify-center mb-2">
                    <span className="text-accent font-bold text-sm">B</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">Team B</span>
                  <div
                    className="text-4xl font-black text-foreground mt-1 transition-all duration-700"
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
              <div className="mt-4 pt-3 border-t border-border flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Last: 3PT by #15</span>
                <span className="text-primary">+3 pts</span>
              </div>
            </div>
          </div>

          {/* --- Card 4: Skill-Based Court Matching (medium) --- */}
          <div className="glass-panel rounded-xl border border-border overflow-hidden group">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-mono text-accent uppercase tracking-widest">
                  Court Matching
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">
                Play against your level
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Courts display active player rating ranges so you can find games with opponents close to your skill level.
              </p>
            </div>

            {/* Court rating mockup */}
            <div className="mx-6 md:mx-8 mb-6 md:mb-8 rounded-lg bg-[hsl(0,0%,5%)] border border-border p-5 space-y-3">
              {[
                { name: "Anteater Rec Center", players: "8/10", range: "1800–2200", match: "high" },
                { name: "Mesa Court Outdoor", players: "4/10", range: "2200–2600", match: "mid" },
                { name: "ARC Main Gym", players: "6/10", range: "1400–1800", match: "low" },
              ].map((court, i) => (
                <div
                  key={court.name}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                    court.match === "high"
                      ? "border-accent/30 bg-accent/5"
                      : "border-border bg-transparent"
                  }`}
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(8px)",
                    transitionDelay: `${500 + i * 150}ms`,
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{court.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{court.players} players</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{court.range}</span>
                    {court.match === "high" && (
                      <span className="text-[10px] font-mono text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
                        Best Match
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] font-mono text-muted-foreground">
                  Your MMR: <span className="text-accent font-bold">2,150</span> — showing courts within range
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
