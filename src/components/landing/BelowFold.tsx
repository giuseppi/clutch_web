import { useEffect, useLayoutEffect } from "react";
import FeaturesPolaroidGrid from "./FeaturesPolaroidGrid";
import HowItWorksRail from "./HowItWorksRail";
import PullQuote from "./PullQuote";
import FooterCTA from "./FooterCTA";
import Footer from "./Footer";

/**
 * The landing sections under the leaderboard. Index loads them as their own chunk and holds
 * the hero's entrance until `onPainted`, one frame after they mount.
 */
const BelowFold = ({ onPainted }: { onPainted?: () => void }) => {
  useLandOnHash();
  useEffect(() => {
    if (!onPainted) return;
    const frame = requestAnimationFrame(() => onPainted());
    return () => cancelAnimationFrame(frame);
  }, [onPainted]);
  return (
    <>
      <FeaturesPolaroidGrid />
      <HowItWorksRail />
      <PullQuote />
      <FooterCTA />
      <Footer />
    </>
  );
};

/*
  A page load of /#features, /#how-it-works or /#download (the contact page's nav and footer
  links) lands on that section. The browser looks for the anchor before React has drawn it,
  so it stays at the top. A reload or a back and forward restores its own scroll instead.
  The section ids are plain ASCII, so the hash is used as is: decoding a malformed one (/#%)
  would throw and blank the page.
*/
function useLandOnHash() {
  useLayoutEffect(() => {
    const nav = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav && nav.type !== "navigate") return;
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
}

export default BelowFold;
