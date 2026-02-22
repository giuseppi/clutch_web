import Navbar from "@/components/Navbar";
import ScrollytellingHero from "@/components/ScrollytellingHero";
import FeaturesGrid from "@/components/FeaturesGrid";
import HowItWorks from "@/components/HowItWorks";
import FooterCTA from "@/components/FooterCTA";
import Footer from "@/components/Footer";

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
