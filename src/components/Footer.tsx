const Footer = () => {
  return (
    <footer className="py-10 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + copyright */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M4.93 4.93c4.08 2.12 10.06 2.12 14.14 0" />
                  <path d="M4.93 19.07c4.08-2.12 10.06-2.12 14.14 0" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                </svg>
              </div>
              <span className="font-bold tracking-tighter text-foreground text-sm">
                CLUTCH
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              &copy; {new Date().getFullYear()} Clutch Analytics
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#download" className="hover:text-foreground transition-colors">
              Download
            </a>
            <span className="w-px h-3 bg-border" />
            <a
              href="mailto:investors@clutchanalytics.com"
              className="hover:text-primary transition-colors"
            >
              For Investors
            </a>
          </div>

          {/* Founders */}
          <p className="text-[11px] text-muted-foreground font-mono">
            Built by Giuseppi Pelayo &amp; Johnny Fok
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
