interface AROverlayProps {
  opacity: number;
}

const AROverlay = ({ opacity }: AROverlayProps) => {
  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none px-4 pb-4 pt-24 md:px-10 md:pb-10 md:pt-24 flex flex-col justify-between transition-opacity duration-300 text-paper"
      style={{ opacity }}
    >
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        <div className="glass-panel-dark p-3 md:p-4 rounded-lg flex gap-4 md:gap-6 items-center border-l-4 border-brand">
          <div className="flex flex-col">
            <span className="label-mono text-paper/60">Game Clock</span>
            <span className="text-xl md:text-2xl font-mono font-bold tracking-widest">04:23</span>
          </div>
          <div className="h-8 w-px bg-paper/20" />
          <div className="flex flex-col">
            <span className="label-mono text-paper/60">Period</span>
            <span className="text-lg md:text-xl font-bold text-brand">Q4</span>
          </div>
        </div>
        <div className="glass-panel-dark px-3 py-2 rounded flex items-center gap-3">
          <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
          <span className="label-mono">LIVE ANALYSIS</span>
        </div>
      </div>

      {/* Center HUD */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[35%] right-[5%] md:right-[8%] glass-panel-dark p-3 rounded-lg border border-brand/40">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-3 h-3 text-brand" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span className="label-mono text-paper/60">Shot Quality</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold leading-none">
            88<span className="text-sm text-paper/60">%</span>
          </div>
          <div className="text-[10px] text-brand mt-1">+12% vs AVG</div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="glass-panel-dark w-full md:w-96 rounded-lg p-4 border-t-2 border-brand/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="label-mono text-brand">Live Telemetry</h3>
            <span className="w-2 h-2 bg-brand rounded-full" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-paper/60">
              <span>Release Velocity</span>
              <span className="text-paper">14.2 m/s</span>
            </div>
            <div className="flex justify-between text-paper/60">
              <span>Apex Height</span>
              <span className="text-paper">4.8 m</span>
            </div>
            <div className="flex justify-between text-paper/60">
              <span>Entry Angle</span>
              <span className="text-brand">46.5°</span>
            </div>
          </div>
        </div>

        <div className="glass-panel-dark w-full md:w-1/2 p-2 rounded-lg flex items-center gap-4">
          <button className="text-paper hover:text-brand transition-colors pointer-events-auto" aria-label="Play">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <div className="flex-1 h-8 bg-black/40 rounded relative overflow-hidden flex items-center px-2">
            <div className="flex items-end gap-[2px] h-full w-full opacity-70">
              {[50, 75, 25, 33, 66, 100, 50, 25, 40, 60, 80, 45].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-sm ${i === 5 ? "bg-brand" : i < 5 ? "bg-brand/60" : "bg-paper/25"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <span className="font-mono text-xs text-paper/60">1x</span>
        </div>
      </div>
    </div>
  );
};

export default AROverlay;
