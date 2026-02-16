interface AROverlayProps {
  opacity: number;
}

const AROverlay = ({ opacity }: AROverlayProps) => {
  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none p-4 md:p-10 flex flex-col justify-between transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        <div className="glass-panel p-3 md:p-4 rounded-lg flex gap-4 md:gap-6 items-center border-l-4 border-primary">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Game Clock</span>
            <span className="text-xl md:text-2xl font-mono font-bold text-foreground tracking-widest">04:23</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Period</span>
            <span className="text-lg md:text-xl font-bold text-primary">Q4</span>
          </div>
        </div>
        <div className="glass-panel px-3 py-2 rounded flex items-center gap-3">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="font-mono text-[10px] md:text-xs text-foreground">LIVE ANALYSIS</span>
        </div>
      </div>

      {/* Center AR Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Defense bounding box */}
        <div className="absolute top-[38%] left-[25%] w-24 md:w-32 h-48 md:h-64 border-2 border-accent/60 rounded-lg hidden md:block">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 glass-panel px-2 py-1 rounded text-[10px] font-mono text-accent whitespace-nowrap">
            P_DEFENSE #23
          </div>
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-accent" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-accent" />
          <div className="absolute bottom-1 left-1 right-1 bg-accent/10 p-1">
            <div className="h-1 w-full bg-accent/20 rounded overflow-hidden">
              <div className="h-full bg-accent" style={{ width: "85%" }} />
            </div>
          </div>
        </div>

        {/* Shooter bounding box */}
        <div className="absolute top-[33%] left-[50%] w-24 md:w-32 h-48 md:h-64 border-2 border-primary/80 rounded-lg shadow-primary-glow hidden md:block">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass-panel px-3 py-2 rounded text-xs font-mono text-foreground whitespace-nowrap border border-primary/50 flex flex-col items-center">
            <span className="text-primary font-bold">SHOOTER #15</span>
            <span className="text-[10px] text-muted-foreground">PPG: 24.5</span>
          </div>
        </div>

        {/* Shot trajectory arc */}
        <svg className="absolute inset-0 w-full h-full hidden md:block" style={{ zIndex: -1 }}>
          <path
            d="M 55% 35% Q 70% 10% 85% 45%"
            fill="none"
            stroke="hsl(24 96% 50%)"
            strokeWidth="2"
            strokeDasharray="10 5"
            className="opacity-70"
          />
          <circle cx="85%" cy="45%" r="6" fill="hsl(24 96% 50%)" className="animate-pulse" />
        </svg>

        {/* Shot probability */}
        <div className="absolute top-[35%] right-[5%] md:right-[8%] glass-panel p-3 rounded-lg border border-primary/30">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Shot Quality</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-foreground leading-none">
            88<span className="text-sm text-muted-foreground">%</span>
          </div>
          <div className="text-[10px] text-accent mt-1">+12% vs AVG</div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="glass-panel w-full md:w-96 rounded-lg p-4 border-t-2 border-accent/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-wider">Live Telemetry</h3>
            <span className="w-2 h-2 bg-accent rounded-full" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Release Velocity</span>
              <span className="text-foreground">14.2 m/s</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Apex Height</span>
              <span className="text-foreground">4.8 m</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Entry Angle</span>
              <span className="text-primary">46.5°</span>
            </div>
          </div>
        </div>

        <div className="glass-panel w-full md:w-1/2 p-2 rounded-lg flex items-center gap-4">
          <button className="text-foreground hover:text-primary transition-colors pointer-events-auto">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <div className="flex-1 h-8 bg-background/40 rounded relative overflow-hidden flex items-center px-2">
            <div className="flex items-end gap-[2px] h-full w-full opacity-50">
              {[50, 75, 25, 33, 66, 100, 50, 25, 40, 60, 80, 45].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-sm ${i === 5 ? "bg-primary shadow-primary-glow" : i < 5 ? "bg-primary/60" : "bg-muted-foreground/30"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground">1x</span>
        </div>
      </div>
    </div>
  );
};

export default AROverlay;
