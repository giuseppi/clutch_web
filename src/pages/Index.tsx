import Navbar from "@/components/landing/Navbar";
import ScrollytellingHero from "@/components/landing/ScrollytellingHero";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import FooterCTA from "@/components/landing/FooterCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <ScrollytellingHero />
      <FeaturesGrid />
      <HowItWorks />
      <FooterCTA />
      <Footer />
    </main>
  );
};

export default Index;
