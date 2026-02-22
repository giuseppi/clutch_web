import { useEffect, useState } from "react";
import { Smartphone, Crosshair, TrendingUp } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const STEP_DELAY = 1000; // ms between each step activation

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
  const { ref, inView } = useInView(0.25);
  const [activeStep, setActiveStep] = useState(0);

  // Sequentially activate steps: 0 → 1 → 2 → 3
  useEffect(() => {
    if (!inView || activeStep >= 3) return;
    const delay = activeStep === 0 ? 400 : STEP_DELAY;
    const timer = setTimeout(() => setActiveStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  }, [inView, activeStep]);

  // Line draws to 50% when step 2 activates, 100% when step 3 activates
  const lineProgress = activeStep <= 1 ? 0 : activeStep === 2 ? 50 : 100;

  return (
    <section
      id="how-it-works"
      className="py-24 bg-background relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
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

        <div className="max-w-5xl mx-auto relative">
          {/* ---- Desktop connecting line (horizontal) ---- */}
          <div
            className="hidden md:block absolute left-[16%] right-[16%]"
            style={{ top: 32 }}
            aria-hidden
          >
            {/* Background dashed track */}
            <div className="w-full border-t-2 border-dashed border-primary/15" />
            {/* Animated solid progress line */}
            <div
              className="absolute top-0 left-0 h-[2px] rounded-full"
              style={{
                width: `${lineProgress}%`,
                background: "hsl(var(--primary))",
                boxShadow:
                  lineProgress > 0
                    ? "0 0 10px hsl(var(--primary) / 0.5), 0 0 3px hsl(var(--primary) / 0.8)"
                    : "none",
                transition: `width ${STEP_DELAY}ms ease-out`,
              }}
            />
          </div>

          {/* ---- Mobile connecting line (vertical) ---- */}
          <div
            className="md:hidden absolute top-0 bottom-0 left-[31px]"
            aria-hidden
          >
            <div className="h-full border-l-2 border-dashed border-primary/15" />
            <div
              className="absolute top-0 left-0 w-[2px] rounded-full"
              style={{
                height: `${lineProgress}%`,
                background: "hsl(var(--primary))",
                boxShadow:
                  lineProgress > 0
                    ? "0 0 10px hsl(var(--primary) / 0.5)"
                    : "none",
                transition: `height ${STEP_DELAY}ms ease-out`,
              }}
            />
          </div>

          {/* ---- Step cards ---- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const colorVar =
                step.accent === "accent" ? "var(--accent)" : "var(--primary)";
              const isActive = activeStep >= i + 1;

              return (
                <div key={step.num} className="relative pl-16 md:pl-0">
                  {/* Icon badge */}
                  <div
                    className="absolute left-0 top-0 md:relative md:mx-auto w-16 h-16 rounded-xl glass-panel border flex items-center justify-center mb-6"
                    style={{
                      borderColor: isActive
                        ? `hsl(${colorVar} / 0.5)`
                        : "hsl(var(--border))",
                      boxShadow: isActive
                        ? `0 0 24px hsl(${colorVar} / 0.25)`
                        : "none",
                      transform: isActive ? "scale(1)" : "scale(0.85)",
                      opacity: isActive ? 1 : 0.4,
                      transition:
                        "border-color 0.6s, box-shadow 0.6s, transform 0.5s ease-out, opacity 0.5s ease-out",
                    }}
                  >
                    <Icon
                      className="w-7 h-7 transition-colors duration-500"
                      style={{
                        color: isActive
                          ? `hsl(${colorVar})`
                          : "hsl(var(--muted-foreground))",
                      }}
                    />
                  </div>

                  {/* Text content — fades + slides in */}
                  <div
                    className="md:text-center mt-2 md:mt-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : "translateY(14px)",
                      transition:
                        "opacity 0.6s ease-out, transform 0.6s ease-out",
                      transitionDelay: "150ms",
                    }}
                  >
                    <span className="font-mono text-xs text-muted-foreground tracking-wider">
                      STEP {step.num}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-1">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-xs md:mx-auto">
                      {step.description}
                    </p>

                    {/* Spec badge — fades in with extra delay */}
                    <span
                      className="inline-block mt-4 font-mono text-[10px] text-muted-foreground bg-secondary/60 px-3 py-1 rounded tracking-wider"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.5s ease-out",
                        transitionDelay: "400ms",
                      }}
                    >
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
