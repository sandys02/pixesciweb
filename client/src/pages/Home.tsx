import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { DemoSection } from "@/components/DemoSection";
import { ToolsSection } from "@/components/ToolsSection";
import { UserStoriesSection } from "@/components/UserStoriesSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { EarlyAccessSection } from "@/components/EarlyAccessSection";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <DemoSection />
      <ToolsSection />
      <UserStoriesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <EarlyAccessSection />
      <WaitlistForm />
      <FAQSection />
      <Footer />
    </div>
  );
}
