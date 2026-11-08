import FeaturesPolaroidGrid from "./FeaturesPolaroidGrid";
import HowItWorksRail from "./HowItWorksRail";
import PullQuote from "./PullQuote";
import FooterCTA from "./FooterCTA";
import Footer from "./Footer";

/** The landing sections under the leaderboard. Index loads them as their own chunk. */
const BelowFold = () => (
  <>
    <FeaturesPolaroidGrid />
    <HowItWorksRail />
    <PullQuote />
    <FooterCTA />
    <Footer />
  </>
);

export default BelowFold;
