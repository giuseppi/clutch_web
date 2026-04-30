import { useEffect, useMemo, useRef, useState } from "react";
import { CONTINENT_DOTS } from "./globeData";

const COURTS = [
  { name: "Madison Sq Garden", time: "8–10 PM", tier: "GOLD", lat: 40.75, lng: -73.99 },
  { name: "Rucker Park", time: "4–6 PM", tier: "PLAT", lat: 40.83, lng: -73.94 },
  { name: "Crypto.com Arena", time: "7–9 PM", tier: "GOLD", lat: 34.04, lng: -118.27 },
  { name: "Anteater Rec Center", time: "7–9 PM", tier: "SILV", lat: 33.64, lng: -117.84 },
  { name: "United Center", time: "6–8 PM", tier: "GOLD", lat: 41.88, lng: -87.67 },
  { name: "Venice Beach Courts", time: "3–5 PM", tier: "GOLD", lat: 33.99, lng: -118.47 },
  { name: "Accor Arena", time: "8–10 PM", tier: "GOLD", lat: 48.84, lng: 2.38 },
  { name: "WiZink Center", time: "9–11 PM", tier: "GOLD", lat: 40.4, lng: -3.68 },
  { name: "Rizal Memorial", time: "5–7 PM", tier: "SILV", lat: 14.56, lng: 120.98 },
  { name: "Yoyogi Gymnasium", time: "7–9 PM", tier: "GOLD", lat: 35.67, lng: 139.7 },
  { name: "Qudos Bank Arena", time: "6–8 PM", tier: "SILV", lat: -33.85, lng: 151.07 },
  { name: "Ginásio Ibirapuera", time: "8–10 PM", tier: "GOLD", lat: -23.59, lng: -46.66 },
];

function project(lat: number, lng: number, rotation: number, R: number, cx: number, cy: number) {
  const phi = (lat * Math.PI) / 180;
  const lambda = ((lng + rotation) * Math.PI) / 180;
  const x = R * Math.cos(phi) * Math.sin(lambda);
  const y = -R * Math.sin(phi);
  const z = R * Math.cos(phi) * Math.cos(lambda);
  return { x: cx + x, y: cy + y, z };
}

interface RotatingGlobeProps {
  inView: boolean;
}

export const RotatingGlobe = ({ inView }: RotatingGlobeProps) => {
  const [rotation, setRotation] = useState(0);
  const [autoIdx, setAutoIdx] = useState(0);
  const [autoVisible, setAutoVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  hoverRef.current = hoveredIdx;

  // Use requestAnimationFrame for smoother rotation than setInterval
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (hoverRef.current === null) {
        setRotation((r) => (r + dt * 0.01) % 360);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    const show = () => {
      setAutoVisible(true);
      setTimeout(() => setAutoVisible(false), 3200);
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
        return { ...p, visible: p.z > 0, opacity: p.z > 0 ? 0.18 + 0.7 * (p.z / R) : 0 };
      }),
    [rotation],
  );

  const courtDots = useMemo(
    () =>
      COURTS.map((c) => {
        const p = project(c.lat, c.lng, rotation, R, cx, cy);
        return { ...c, ...p, visible: p.z > 5 };
      }),
    [rotation],
  );

  const displayIdx = hoveredIdx !== null ? hoveredIdx : autoIdx;
  const displayCourt = courtDots[displayIdx];
  const showPopup = hoveredIdx !== null ? true : autoVisible;

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg viewBox="0 0 200 200" className="w-full max-w-[260px]">
        {/* Globe sphere outline */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="0.8" />
        {/* Equator + meridian rings for depth */}
        <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.35} fill="none" stroke="#1A1A1A" strokeOpacity="0.45" strokeWidth="0.7" />
        <ellipse cx={cx} cy={cy} rx={R * 0.35} ry={R} fill="none" stroke="#1A1A1A" strokeOpacity="0.35" strokeWidth="0.7" />

        {dots.map(
          (d, i) =>
            d.visible && (
              <circle key={i} cx={d.x} cy={d.y} r={1.4} fill="#1A1A1A" opacity={Math.max(d.opacity, 0.55)} />
            ),
        )}

        {courtDots.map(
          (c, i) =>
            c.visible && (
              <g key={`c-${i}`}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={8}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={i === displayIdx ? 3 : 2}
                  fill="#FF6A00"
                  opacity={i === displayIdx ? 1 : 0.7}
                  className="pointer-events-none"
                />
              </g>
            ),
        )}
      </svg>

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
          <div className="bg-paper text-ink px-3 py-2 shadow-[0_8px_24px_-8px_rgba(26,26,26,0.25)] min-w-[150px] border border-ink/15">
            <div className="label-mono text-brand">{displayCourt.name}</div>
            <div className="flex items-center justify-between gap-3 mt-1">
              <span className="font-mono text-[10px] text-ink/60">{displayCourt.time}</span>
              <span className="font-mono text-[10px] text-ink/80">{displayCourt.tier}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
