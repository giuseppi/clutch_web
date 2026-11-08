import Navbar from "@/components/landing/Navbar";
import GameStage from "@/components/landing/GameStage";
import FeaturesPolaroidGrid from "@/components/landing/FeaturesPolaroidGrid";
import HowItWorksRail from "@/components/landing/HowItWorksRail";
import PullQuote from "@/components/landing/PullQuote";
import FooterCTA from "@/components/landing/FooterCTA";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <main className="min-h-screen bg-paper text-ink">
    <Navbar animateIn />
    <GameStage />
    <FeaturesPolaroidGrid />
    <HowItWorksRail />
    <PullQuote />
    <FooterCTA />
    <Footer />
  </main>
);

export default Index;
