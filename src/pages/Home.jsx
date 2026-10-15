
import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
import FeatureGrid from "../components/landing/FeatureGrid";
import HowItWorks from "../components/landing/HowItWorks";
import PricingPreview from "../components/landing/PricingPreview";
import Testimonials from "../components/landing/Testimonials";
import FAQSection from "../components/landing/FAQSection";
import CtaSection from "../components/landing/CtaSection";
import LandingFooter from "../components/landing/LandingFooter";

const Home = () => {
  return (
  
      <div className="landing-page min-h-screen bg-white transition-colors duration-200">
        <LandingNav />
        <main>
          <HeroSection />
          <FeatureGrid />
          <HowItWorks />
          <PricingPreview />
          <Testimonials />
          <FAQSection />
          <CtaSection />
        </main>
        <LandingFooter />
      </div>
    
  );
};

export default Home;
