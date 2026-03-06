import { Link } from "react-router-dom";
import clutchLogo from "@/assets/clutch_logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center mix-blend-difference">
      <Link to="/" className="flex items-center gap-2.5">
        <img src={clutchLogo} alt="Clutch logo" className="w-10 h-10 rounded object-contain" />
        <span className="font-extrabold tracking-tighter text-xl text-foreground">CLUTCH</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
        <a href="#download" className="hover:text-primary transition-colors">Download</a>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://apps.apple.com/app/clutch-basketball-analytics/id0000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-foreground text-background px-3 py-2 rounded font-semibold text-xs hover:bg-foreground/90 transition-colors"
          aria-label="Download on the App Store"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span className="hidden sm:inline">App Store</span>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.clutch.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-foreground text-background px-3 py-2 rounded font-semibold text-xs hover:bg-foreground/90 transition-colors"
          aria-label="Get it on Google Play"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
          </svg>
          <span className="hidden sm:inline">Google Play</span>
        </a>
        <Link
          to="/app/login"
          className="flex items-center gap-1.5 bg-foreground text-background px-3 py-2 rounded font-semibold text-xs hover:bg-foreground/90 transition-colors"
          aria-label="Open Web Version"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span className="hidden sm:inline">Web Version</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
