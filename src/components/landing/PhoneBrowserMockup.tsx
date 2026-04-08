import { useEffect, useState } from "react";

const SLIDES = [
  "/assets/demo_screen_1.png",
  "/assets/demo_screen_2.png",
  "/assets/demo_screen_3.png",
];

const fourFactors = [
  { metric: "PPP", home: "1.12", away: "0.98", homeWin: true },
  { metric: "eFG%", home: "54.2%", away: "47.8%", homeWin: true },
  { metric: "TO%", home: "11.3%", away: "15.7%", homeWin: true },
  { metric: "ORB%", home: "32.1%", away: "26.4%", homeWin: true },
];

const PhoneBrowserMockup = ({ inView }: { inView: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const id = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [inView, paused]);

  return (
    <div className="glass-panel rounded-xl border border-border overflow-hidden group">
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Platform</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
          AI-powered analytics — on your phone and the web
        </h3>
        <p className="text-muted-foreground mt-2 text-sm max-w-lg">
          Access your stats, box scores, and match breakdowns from any device. Upload game footage and let AI do the rest.
        </p>
      </div>

      {/* Mockup area */}
      <div className="relative mx-5 md:mx-6 mb-0 h-[340px] md:h-[400px] overflow-hidden rounded-b-xl">
        {/* Orange gradient background */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />

        {/* Browser frame — secondary, behind phone */}
        <div
          className="absolute right-0 top-6 w-[60%] md:w-[55%] rounded-lg border border-border bg-[hsl(0,0%,5%)] shadow-xl overflow-hidden transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "200ms",
          }}
        >
          {/* Chrome bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-[hsl(0,0%,7%)]">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-2">
              <div className="bg-[hsl(0,0%,12%)] rounded-full px-3 py-0.5 text-[9px] font-mono text-muted-foreground text-center">
                clutch.gg/analytics
              </div>
            </div>
          </div>

          {/* Analytics content */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">UCI vs UCLA</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground font-mono">72 – 68</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
                  WIN
                </span>
              </div>
            </div>

            <div className="border border-border rounded overflow-hidden">
              <div className="flex text-[8px] font-mono text-muted-foreground bg-[hsl(0,0%,7%)] border-b border-border">
                <span className="flex-1 px-2 py-1">Metric</span>
                <span className="w-12 text-center px-1 py-1 text-blue-400">UCI</span>
                <span className="w-12 text-center px-1 py-1 text-red-400">UCLA</span>
              </div>
              {fourFactors.map((row) => (
                <div key={row.metric} className="flex text-[8px] font-mono border-b border-border/50 last:border-0">
                  <span className="flex-1 px-2 py-1 text-muted-foreground">{row.metric}</span>
                  <span className={`w-12 text-center px-1 py-1 font-bold ${row.homeWin ? "text-accent-teal" : "text-foreground"}`}>
                    {row.home}
                  </span>
                  <span className={`w-12 text-center px-1 py-1 font-bold ${!row.homeWin ? "text-accent-teal" : "text-muted-foreground"}`}>
                    {row.away}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-end gap-1 h-8 pt-1">
              {[35, 48, 42, 55, 50, 62, 58, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: i >= 6 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.25)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phone frame — sized to stay within the mockup card */}
        <div
          className="absolute left-4 md:left-7 bottom-1 md:bottom-0 z-10 w-[132px] md:w-[166px] transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "400ms",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="rounded-[2rem] md:rounded-[2.5rem] border-[3px] border-[#333] bg-black shadow-2xl overflow-hidden">
            {/* Dynamic Island */}
            <div className="flex justify-center pt-2 pb-1.5 bg-black">
              <div className="w-20 md:w-24 h-[6px] md:h-[7px] rounded-full bg-[#1a1a1a]" />
            </div>

            {/* Screen area with slideshow */}
            <div className="relative w-full aspect-[9/19.5] overflow-hidden bg-black">
              {SLIDES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Clutch app screen ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
                  style={{ opacity: currentSlide === i ? 1 : 0 }}
                  draggable={false}
                />
              ))}
            </div>

            {/* Home indicator */}
            <div className="flex justify-center py-1.5 bg-black">
              <div className="w-20 md:w-28 h-[4px] rounded-full bg-[#333]" />
            </div>
          </div>

        </div>
      </div>

      {/* Slide indicators — outside overflow-hidden area */}
      <div className="flex justify-center gap-1.5 pb-4 pt-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === i ? "bg-primary w-4" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhoneBrowserMockup;
