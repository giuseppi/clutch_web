import { useScrollProgress } from "@/hooks/useScrollProgress";
import AROverlay from "./AROverlay";

const basketballImg = "/images/basketball.jpg";
const gameImg = "/images/basketball-game.jpg";

const ScrollytellingHero = () => {
  const { containerRef, progress } = useScrollProgress();

  // Stage breakpoints:
  // 0–0.12: Ball floating (scale 1), title visible
  // 0.12–0.35: Ball zooms IN (scale 1 → 25) + "NO SENSORS" / "JUST AI" text
  // 0.35–0.50: Ball zooms OUT (scale 25 → 4) — "from player's hand"
  // 0.50–0.58: Crossfade: ball out, game video in
  // 0.58–0.78: Game video zooms out to full court
  // 0.78–1.0: AR overlay fades in

  // Ball scale: 1 → 25 (zoom in) → 4 (zoom out from hand) → then hidden
  const ballScale =
    progress < 0.12
      ? 1
      : progress < 0.35
        ? 1 + ((progress - 0.12) / 0.23) * 24
        : progress < 0.5
          ? 25 - ((progress - 0.35) / 0.15) * 21
          : 4;

  // Ball opacity: visible until crossfade, then fade out with game fade in
  const ballOpacity =
    progress < 0.5 ? 1 : progress < 0.58 ? 1 - (progress - 0.5) / 0.08 : 0;

  // Game opacity: hidden until crossfade
  const gameOpacity =
    progress < 0.5 ? 0 : progress < 0.58 ? (progress - 0.5) / 0.08 : 1;

  // Game scale: starts zoomed in (2.2), zooms out to 1
  const gameScale =
    progress < 0.58 ? 2.2 : progress < 0.78 ? 2.2 - ((progress - 0.58) / 0.2) * 1.2 : 1;

  // Text 1 "NO SENSORS" opacity
  const text1Opacity =
    progress > 0.14 && progress < 0.28
      ? progress < 0.18
        ? (progress - 0.14) / 0.04
        : progress > 0.24
          ? 1 - (progress - 0.24) / 0.04
          : 1
      : 0;

  // Text 2 "JUST AI" opacity
  const text2Opacity =
    progress > 0.26 && progress < 0.40
      ? progress < 0.30
        ? (progress - 0.26) / 0.04
        : progress > 0.36
          ? 1 - (progress - 0.36) / 0.04
          : 1
      : 0;

  // AR overlay opacity
  const arOpacity = progress > 0.78 ? Math.min(1, (progress - 0.78) / 0.15) : 0;

  // Title opacity (fade out as scroll starts)
  const titleOpacity =
    progress < 0.05 ? 1 : progress < 0.12 ? 1 - (progress - 0.05) / 0.07 : 0;

  // Radial glow: subtle neutral (no orange box), fades as we scroll
  const glowOpacity = Math.max(0, 0.35 - progress * 1.5);

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "#050505" }}
      >
        {/* Subtle radial glow behind ball (neutral, no orange box) */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: glowOpacity,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04), transparent 55%)",
          }}
        />

        {/* Game image (behind ball) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: gameOpacity }}
        >
          <img
            src={gameImg}
            alt="Basketball game footage"
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${gameScale})`,
              filter: "grayscale(30%)",
            }}
          />
          {/* Scanlines over video */}
          <div className="absolute inset-0 scanlines opacity-30" />
          {/* Top/bottom gradient vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, hsl(0 0% 2% / 0.7), transparent 30%, transparent 70%, hsl(0 0% 2% / 0.8))",
            }}
          />
        </div>

        {/* AR Overlay */}
        <AROverlay opacity={arOpacity} />

        {/* Basketball */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: ballOpacity, zIndex: 10 }}
        >
          <img
            src={basketballImg}
            alt="Basketball"
            className="w-48 h-48 md:w-80 md:h-80 object-contain select-none"
            style={{
              transform: `scale(${ballScale})`,
              filter:
                "drop-shadow(0 8px 32px rgba(0,0,0,0.5)) drop-shadow(0 0 0 1px rgba(255,255,255,0.03))",
            }}
          />
        </div>

        {/* Floating specs around ball */}
        <div
          className="absolute top-[22%] right-[30%] glass-panel px-3 py-1 rounded text-[10px] font-mono text-primary z-10 pointer-events-none"
          style={{ opacity: titleOpacity }}
        >
          OBJ_ID: BB_v4.2
        </div>
        <div
          className="absolute bottom-[30%] left-[25%] glass-panel px-3 py-1 rounded text-[10px] font-mono text-muted-foreground z-10 pointer-events-none"
          style={{ opacity: titleOpacity }}
        >
          SCALE: {ballScale.toFixed(1)}x
        </div>

        {/* Title text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none z-10"
          style={{ opacity: titleOpacity }}
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground">
            CLUTCH
          </h1>
          <p className="text-muted-foreground mt-4 font-mono text-sm uppercase tracking-widest">
            Scroll to Analyze
          </p>
        </div>

        {/* Value prop text 1: NO SENSORS */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          style={{ opacity: text1Opacity }}
        >
          <div className="text-center">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground">
              NO
            </h2>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-primary text-glow-primary -mt-2 md:-mt-4">
              SENSORS
            </h2>
          </div>
        </div>

        {/* Value prop text 2: JUST AI */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          style={{ opacity: text2Opacity }}
        >
          <div className="text-center relative">
            <div
              className="absolute -inset-8 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(24 96% 50% / 0.15), transparent 70%)" }}
            />
            <h2 className="relative text-6xl md:text-9xl font-black tracking-tighter text-foreground">
              JUST <span className="text-accent text-glow-accent">AI</span>
            </h2>
            <p className="relative mt-6 text-muted-foreground max-w-sm mx-auto font-mono text-sm leading-relaxed border-r-2 border-primary pr-4 text-right">
              Computer vision extracting 120 data points per second from standard video.
            </p>
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 items-center">
          <div className="w-1 h-16 bg-secondary rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
          <span
            className="text-[10px] font-mono text-muted-foreground uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScrollytellingHero;
