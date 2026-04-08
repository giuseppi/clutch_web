import { useEffect, useState, useMemo, useRef } from "react";
import { getTierLabel, getTierTextClass } from "@/lib/mmrTier";
import { CONTINENT_DOTS } from "./globeData";

const COURTS = [
  // USA
  { name: "Madison Sq Garden", time: "8–10 PM", mmrLow: 70, mmrHigh: 90, lat: 40.75, lng: -73.99 },
  { name: "Rucker Park", time: "4–6 PM", mmrLow: 60, mmrHigh: 80, lat: 40.83, lng: -73.94 },
  { name: "Crypto.com Arena", time: "7–9 PM", mmrLow: 65, mmrHigh: 85, lat: 34.04, lng: -118.27 },
  { name: "Anteater Rec Center", time: "7–9 PM", mmrLow: 40, mmrHigh: 60, lat: 33.64, lng: -117.84 },
  { name: "United Center", time: "6–8 PM", mmrLow: 55, mmrHigh: 75, lat: 41.88, lng: -87.67 },
  { name: "Venice Beach Courts", time: "3–5 PM", mmrLow: 50, mmrHigh: 70, lat: 33.99, lng: -118.47 },
  // Europe
  { name: "Accor Arena", time: "8–10 PM", mmrLow: 60, mmrHigh: 80, lat: 48.84, lng: 2.38 },
  { name: "WiZink Center", time: "9–11 PM", mmrLow: 55, mmrHigh: 75, lat: 40.40, lng: -3.68 },
  // Asia / Oceania
  { name: "Rizal Memorial", time: "5–7 PM", mmrLow: 45, mmrHigh: 65, lat: 14.56, lng: 120.98 },
  { name: "Yoyogi Gymnasium", time: "7–9 PM", mmrLow: 50, mmrHigh: 70, lat: 35.67, lng: 139.70 },
  { name: "Qudos Bank Arena", time: "6–8 PM", mmrLow: 40, mmrHigh: 60, lat: -33.85, lng: 151.07 },
  // South America
  { name: "Ginásio Ibirapuera", time: "8–10 PM", mmrLow: 50, mmrHigh: 70, lat: -23.59, lng: -46.66 },
  // Africa
  { name: "Hassan Mostafa Hall", time: "7–9 PM", mmrLow: 35, mmrHigh: 55, lat: 30.01, lng: 31.45 },
];

function project(lat: number, lng: number, rotation: number, R: number, cx: number, cy: number) {
  const phi = (lat * Math.PI) / 180;
  const lambda = ((lng + rotation) * Math.PI) / 180;
  const x = R * Math.cos(phi) * Math.sin(lambda);
  const y = -R * Math.sin(phi);
  const z = R * Math.cos(phi) * Math.cos(lambda);
  return { x: cx + x, y: cy + y, z };
}

const GlobeCard = ({ inView }: { inView: boolean }) => {
  const [rotation, setRotation] = useState(0);
  const [autoIdx, setAutoIdx] = useState(0);
  const [autoVisible, setAutoVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);

  // Keep ref in sync so intervals can read latest hover state
  hoverRef.current = hoveredIdx;

  // Rotate globe — pause rotation while hovering
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      if (hoverRef.current === null) {
        setRotation((r) => (r + 0.3) % 360);
      }
    }, 50);
    return () => clearInterval(id);
  }, [inView]);

  // Auto-cycle popups — only when not hovering
  useEffect(() => {
    if (!inView) return;
    const show = () => {
      setAutoVisible(true);
      setTimeout(() => setAutoVisible(false), 3000);
    };
    show();
    const id = setInterval(() => {
      if (hoverRef.current !== null) return;
      setAutoIdx((i) => (i + 1) % COURTS.length);
      setTimeout(show, 400);
    }, 5000);
    return () => clearInterval(id);
  }, [inView]);

  const R = 80;
  const cx = 100;
  const cy = 100;

  const dots = useMemo(
    () =>
      CONTINENT_DOTS.map((d) => {
        const p = project(d.lat, d.lng, rotation, R, cx, cy);
        return { ...p, visible: p.z > 0, opacity: p.z > 0 ? 0.12 + 0.88 * (p.z / R) : 0 };
      }),
    [rotation]
  );

  const courtDots = useMemo(
    () =>
      COURTS.map((c) => {
        const p = project(c.lat, c.lng, rotation, R, cx, cy);
        return { ...c, ...p, visible: p.z > 5 };
      }),
    [rotation]
  );

  // Determine which court to show: hover takes priority over auto-cycle
  const displayIdx = hoveredIdx !== null ? hoveredIdx : autoIdx;
  const displayCourt = courtDots[displayIdx];
  const showPopup = hoveredIdx !== null ? true : autoVisible;

  return (
    <div className="glass-panel rounded-xl border border-border overflow-hidden group flex flex-col">
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-mono text-accent uppercase tracking-widest">Court Matching</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground leading-tight">
          Skill-based matchmaking across courts
        </h3>
        <p className="text-muted-foreground mt-2 text-xs">
          Find games at your level. Courts show active player ratings so you always play competitive matches.
        </p>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 pb-5 min-h-[240px]">
        <svg viewBox="0 0 200 200" className="w-full max-w-[220px]">
          {/* Equator and meridian rings for depth */}
          <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.35} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx={cx} cy={cy} rx={R * 0.35} ry={R} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />

          {/* Globe dots */}
          {dots.map(
            (d, i) =>
              d.visible && (
                <circle key={i} cx={d.x} cy={d.y} r={1.1} fill="hsl(var(--accent))" opacity={d.opacity * 0.6} />
              )
          )}

          {/* Court marker dots — interactive */}
          {courtDots.map(
            (c, i) =>
              c.visible && (
                <g key={`court-${i}`}>
                  {/* Invisible larger hit area for easier hovering */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={8}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                  {/* Visible dot */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={i === displayIdx ? 3 : 2}
                    fill="hsl(var(--primary))"
                    opacity={i === displayIdx ? 1 : 0.7}
                    className={`pointer-events-none ${i === displayIdx ? "animate-pulse-slow" : ""}`}
                  />
                </g>
              )
          )}
        </svg>

        {/* Popup card */}
        {displayCourt.visible && (
          <div
            className="absolute z-10 transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: showPopup ? 1 : 0,
              left: `${(displayCourt.x / 200) * 100}%`,
              top: `${(displayCourt.y / 200) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="bg-[hsl(0,0%,8%)] border border-border rounded-lg px-3 py-2 shadow-lg min-w-[160px]">
              <div className="text-[10px] font-mono text-primary font-bold">{displayCourt.name}</div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span className="text-[10px] font-mono text-muted-foreground">{displayCourt.time}</span>
                <span className="text-[10px] font-mono">
                  <span className={getTierTextClass(displayCourt.mmrLow)}>{getTierLabel(displayCourt.mmrLow)}</span>
                  <span className="text-muted-foreground"> – </span>
                  <span className={getTierTextClass(displayCourt.mmrHigh)}>{getTierLabel(displayCourt.mmrHigh)}</span>
                </span>
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                MMR {displayCourt.mmrLow}–{displayCourt.mmrHigh}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobeCard;
