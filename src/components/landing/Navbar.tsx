import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import clutchLogo from "@/assets/clutch_logo.png";
import { useEntranceStart } from "@/lib/entrance";
import { DROP } from "@/lib/motion";
import { GRID } from "./game/layout";

/**
 * Sticky cream-mode navbar. Becomes a frosted backdrop after the user
 * has scrolled past the first viewport so it reads cleanly over content
 * without occluding text underneath. With `animateIn` (the landing page only),
 * it waits for the entrance, then fades and drops into place.
 */
const Navbar = ({ animateIn = false }: { animateIn?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const backdrop = scrolled
    ? "bg-paper/70 backdrop-blur-md border-b border-ink/8"
    : "";

  const Nav = animateIn ? EnteringNav : "nav";

  return (
    <Nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${backdrop}`}>
      <div className={`${GRID} py-4 md:py-5 flex items-center justify-between`}>
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
          <span className="hidden md:inline label text-inkMuted mt-0.5 ml-1">
            EST. 2026
          </span>
        </Link>

        <NavLinks />

        <a
          href="/#download"
          className="label px-4 md:px-5 py-2 md:py-2.5 btn-sharp border border-ink/30 hover:border-ink text-ink transition-colors"
        >
          COMING SOON
        </a>
      </div>
    </Nav>
  );
};

const dropIn: Variants = {
  hidden: { opacity: 0, y: DROP.y },
  visible: { opacity: 1, y: 0, transition: { duration: DROP.duration, ease: DROP.ease } },
};

/**
 * Hidden until the entrance starts. It shows at once under reduced motion, and when it mounts
 * after the entrance has started (a return to the page), so the entrance plays once per page load.
 */
const EnteringNav = ({ className, children }: { className: string; children: ReactNode }) => {
  const started = useEntranceStart();
  const [resumed] = useState(started);
  const reduced = useReducedMotion();
  return (
    <motion.nav
      className={className}
      variants={dropIn}
      initial={reduced || resumed ? false : "hidden"}
      animate={started || reduced ? "visible" : "hidden"}
    >
      {children}
    </motion.nav>
  );
};

/** The section and contact links, from md up. */
const NavLinks = () => (
  <div className="hidden md:flex items-center gap-1">
    <NavLink href="/#features">FEATURES</NavLink>
    <NavLink href="/#how-it-works">HOW IT WORKS</NavLink>
    <Link
      to="/contact"
      className="label px-4 py-2 text-ink/70 hover:text-ink transition-colors"
    >
      CONTACT US
    </Link>
  </div>
);

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="label px-4 py-2 text-ink/70 hover:text-ink transition-colors"
  >
    {children}
  </a>
);

export default Navbar;
