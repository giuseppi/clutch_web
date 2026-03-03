import { useState } from "react";
import { Link } from "react-router-dom";

const FooterCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section
      id="download"
      className="py-24 bg-background border-t border-border relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.06), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <span className="text-xs font-mono text-primary uppercase tracking-[0.3em]">
          Download
        </span>

        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mt-3">
          Track every shot.<br />
          <span className="text-primary text-glow-primary">Climb the ranks.</span>
        </h2>

        <p className="text-muted-foreground max-w-md mx-auto mt-4 text-lg">
          Download Clutch free on iOS and Android.
        </p>

        {/* App Store buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-10">
          <a
            href="https://apps.apple.com/app/clutch-basketball-analytics/id0000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground hover:bg-foreground/90 text-background px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download for iOS
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.clutch.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground hover:bg-foreground/90 text-background px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            Get it on Android
          </a>
          <Link
            to="/app/login"
            className="bg-foreground hover:bg-foreground/90 text-background px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Web Version
          </Link>
        </div>

        {/* Email capture */}
        <div className="mt-14 max-w-md mx-auto">
          <div className="glass-panel rounded-xl p-6 border border-border text-left">
            <h3 className="text-sm font-bold text-foreground">
              Get notified when Ranked Mode drops.
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Early access to competitive matchmaking. No spam.
            </p>

            {submitted ? (
              <div className="mt-4 flex items-center gap-2 text-accent font-mono text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                You're on the list.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-primary-glow hover:shadow-primary-glow-lg whitespace-nowrap"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
