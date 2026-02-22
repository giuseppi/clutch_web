import { Smartphone, Crosshair, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Smartphone,
    title: "Set Up Your Phone",
    description:
      "Point your phone at the court. Clutch's computer vision engine activates instantly.",
    spec: "CAM: 30fps | MODEL: YOLOv8",
    accent: "primary" as const,
  },
  {
    num: "02",
    icon: Crosshair,
    title: "Play Your Game",
    description:
      "Shoot, drill, compete. Clutch tracks every shot, make or miss, in real-time.",
    spec: "TRACKING: 120 data points/sec",
    accent: "accent" as const,
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Get Your Stats",
    description:
      "Instant analytics. Shooting %, session trends, and your MMR — all on your phone.",
    spec: "OUTPUT: FG% | 3PT% | MMR",
    accent: "primary" as const,
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-background relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-xs font-mono text-accent uppercase tracking-[0.3em]">
            How It Works
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mt-3">
            Three steps. Zero gear.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            No wearables, no sensors, no setup headaches. Just point and play.
          </p>
        </div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="max-w-5xl mx-auto relative">
          {/* Connecting dashed line (desktop: horizontal, mobile: vertical) */}
          <div
            className="hidden md:block absolute top-[72px] left-[16%] right-[16%] border-t-2 border-dashed border-primary/30"
            aria-hidden
          />
          <div
            className="md:hidden absolute top-0 bottom-0 left-8 border-l-2 border-dashed border-primary/30"
            aria-hidden
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const colorVar =
                step.accent === "accent" ? "var(--accent)" : "var(--primary)";

              return (
                <div key={step.num} className="relative pl-16 md:pl-0">
                  {/* Step number badge */}
                  <div
                    className="absolute left-0 top-0 md:relative md:mx-auto w-16 h-16 rounded-xl glass-panel border border-border flex items-center justify-center mb-6"
                    style={{
                      boxShadow: `0 0 20px hsl(${colorVar} / 0.15)`,
                    }}
                  >
                    <Icon
                      className="w-7 h-7"
                      style={{ color: `hsl(${colorVar})` }}
                    />
                  </div>

                  <div className="md:text-center mt-2 md:mt-0">
                    <span className="font-mono text-xs text-muted-foreground tracking-wider">
                      STEP {step.num}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-1">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-xs md:mx-auto">
                      {step.description}
                    </p>
                    <span className="inline-block mt-4 font-mono text-[10px] text-muted-foreground bg-secondary/60 px-3 py-1 rounded tracking-wider">
                      {step.spec}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
