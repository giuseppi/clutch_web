import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BallZoom from "@/components/landing/BallZoom";
import FeaturesPolaroidGrid from "@/components/landing/FeaturesPolaroidGrid";
import HowItWorksRail from "@/components/landing/HowItWorksRail";
import PullQuote from "@/components/landing/PullQuote";
import FooterCTA from "@/components/landing/FooterCTA";
import Footer from "@/components/landing/Footer";
import { Loader } from "@/components/landing/Loader";

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <Navbar />
      <Hero />
      <BallZoom />
      <FeaturesPolaroidGrid />
      <HowItWorksRail />
      <PullQuote />
      <FooterCTA />
      <Footer />
    </main>
  );
};

export default Index;
