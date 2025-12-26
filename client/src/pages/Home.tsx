import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { ToolsSection } from "@/components/ToolsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PilotSignupSection } from "@/components/PilotSignupSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <ToolsSection />
      <PilotSignupSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
