import { Trophy, Target, Users, Calendar } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "J. Williams", mmr: 2450, bar: 100 },
  { rank: 2, name: "A. Chen", mmr: 2380, bar: 92 },
  { rank: 3, name: "M. Davis", mmr: 2310, bar: 85 },
  { rank: 4, name: "R. Patel", mmr: 2240, bar: 78 },
];

const statLines = [
  { label: "FG%", value: "54.2", delta: "+3.1", up: true },
  { label: "3PT%", value: "38.7", delta: "+5.4", up: true },
  { label: "FT%", value: "81.0", delta: "-0.8", up: false },
];

const sessionDots = [
  [0, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 1, 1, 0, 1],
  [0, 1, 1, 1, 0, 0, 1],
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
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
          {/* Hero Card — Ranked Mode (spans 2 rows on desktop) */}
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
              <div className="flex items-center gap-1 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7" />
                </svg>
              </div>
              <div className="glass-panel px-3 py-2 rounded border border-accent/40 shadow-[0_0_12px_hsl(168_76%_50%/0.15)]">
                <span className="font-mono text-sm text-accent animate-pulse-slow">Gold I</span>
              </div>
            </div>

            {/* Leaderboard preview */}
            <div className="mt-8 space-y-2">
              {leaderboardData.map((row) => (
                <div
                  key={row.rank}
                  className="flex items-center gap-3 text-xs font-mono"
                >
                  <span className="text-muted-foreground w-4 text-right">{row.rank}</span>
                  <span className="text-foreground flex-1 truncate">{row.name}</span>
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.bar}%`,
                        background:
                          row.rank === 1
                            ? "hsl(var(--accent))"
                            : "hsl(var(--primary))",
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground w-12 text-right">{row.mmr}</span>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          </div>

          {/* Card 2 — AI Stat Tracking */}
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

            <div className="mt-5 space-y-3">
              {statLines.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between font-mono text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold">{stat.value}%</span>
                    <span className={stat.up ? "text-accent text-xs" : "text-destructive text-xs"}>
                      {stat.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini sparkline */}
            <div className="mt-4 flex items-end gap-[3px] h-8">
              {[30, 45, 35, 50, 42, 58, 52, 65, 55, 70, 60, 75, 68, 80, 72].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i >= 12
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 3 — Game Modes */}
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
              ].map((mode) => (
                <div
                  key={mode.label}
                  className="flex-1 glass-panel rounded-lg p-3 text-center border border-border hover:border-primary/40 transition-colors"
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

          {/* Card 4 — Match History (full-width on mobile, bottom-right on desktop) */}
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

            {/* Activity grid (GitHub-contribution-style) */}
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
                  week.map((active, di) => (
                    <div
                      key={`${wi}-${di}`}
                      className="w-4 h-4 rounded-[3px]"
                      style={{
                        background: active
                          ? `hsl(var(--primary) / ${0.3 + Math.random() * 0.7})`
                          : "hsl(var(--secondary))",
                      }}
                    />
                  ))
                )}
              </div>
              <div className="hidden sm:flex flex-col gap-1 ml-auto font-mono text-xs">
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <span>This week</span>
                  <span className="text-foreground font-bold">4 sessions</span>
                </div>
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <span>Streak</span>
                  <span className="text-primary font-bold">12 days</span>
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
