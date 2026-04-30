import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import clutchLogo from "@/assets/clutch_logo.png";

const handleComingSoon = (platform: string) => {
  toast(`${platform} version is coming soon.`);
};

/**
 * Sticky cream-mode navbar. Becomes a frosted backdrop after the user
 * has scrolled past the first viewport so it reads cleanly over content
 * without occluding text underneath.
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 100);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const backdrop = scrolled
    ? "bg-paper/70 backdrop-blur-md border-b border-ink/8"
    : "";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${backdrop}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 md:py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-paperAlt border border-ink/15 p-1 flex items-center justify-center overflow-hidden transition-colors group-hover:border-ink/40">
            <img
              src={clutchLogo}
              alt=""
              aria-hidden
              className="w-full h-full object-contain select-none"
            />
          </span>
          <span className="font-display text-xl md:text-2xl tracking-tight leading-none text-ink">
            CLUTCH
          </span>
          <span className="hidden md:inline label-mono text-inkMuted mt-0.5 ml-1">
            EST. 2026
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink href="#features">FEATURES</NavLink>
          <NavLink href="#how-it-works">HOW IT WORKS</NavLink>
          <NavLink href="#download">DOWNLOAD</NavLink>
        </div>

        <button
          onClick={() => handleComingSoon("App")}
          className="label-mono px-4 md:px-5 py-2 md:py-2.5 btn-sharp border border-ink/30 hover:border-ink text-ink transition-colors"
        >
          GET THE APP
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="label-mono px-4 py-2 text-ink/70 hover:text-ink transition-colors"
  >
    {children}
  </a>
);

export default Navbar;
