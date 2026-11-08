import { AnimatedNumber } from "../AnimatedNumber";

/** Step 04 - bar chart growing + animated counter ticking up to FG% */
export const StatGrowthAnim = ({ inView }: { inView: boolean }) => {
  const bars = [38, 45, 52, 49, 58, 64, 71];
  return (
    <div className="relative h-40 bg-paperAlt border border-ink/10 p-4 overflow-hidden">
      <div className="flex items-baseline justify-between mb-2">
        <span className="label text-ink/60">FG% · 7 SESSIONS</span>
        <span className="font-display text-2xl text-ink tabular-nums leading-none">
          <AnimatedNumber value={71} inView={inView} duration={1500} delay={300} decimals={0} suffix="%" />
        </span>
      </div>
      <div className="flex items-end gap-2 h-20">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-700 ease-out ${
              i === bars.length - 1 ? "bg-brand" : "bg-brand/40"
            }`}
            style={{
              height: inView ? `${h}%` : "0%",
              transitionDelay: `${600 + i * 90}ms`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1 label-mono text-ink/40">
        <span>S1</span>
        <span>S7</span>
      </div>
    </div>
  );
};
