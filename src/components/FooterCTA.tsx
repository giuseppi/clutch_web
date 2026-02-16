const FooterCTA = () => {
  return (
    <section id="download" className="py-24 bg-background border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Ready to see the unseen?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
          Clutch brings NBA-level analytics to any video feed. No sensors, no wearables, just pure intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://apps.apple.com/app/clutch-basketball-analytics/id0000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground hover:bg-foreground/90 text-background px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download for iOS
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.clutch.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground hover:bg-foreground/90 text-background px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 w-full sm:w-auto border border-border"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            Get it on Android
          </a>
        </div>
        <div className="mt-16 text-xs text-muted-foreground font-mono">
          © 2025 Clutch Analytics Inc. All rights reserved.
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
