import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { DemoSection } from "@/components/DemoSection";
import { ToolsSection } from "@/components/ToolsSection";
import { UserStoriesSection } from "@/components/UserStoriesSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { EarlyAccessSection } from "@/components/EarlyAccessSection";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { StatsSection } from "@/components/StatsSection";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { LiveDemoSimulator } from "@/components/LiveDemoSimulator";
import { WorkflowVisualization } from "@/components/WorkflowVisualization";
import { UseCaseTabs } from "@/components/UseCaseTabs";
import { ROICalculator } from "@/components/ROICalculator";
import { StickyCtaButton } from "@/components/StickyCtaButton";
import { MobileStickyCtaButton } from "@/components/MobileStickyCtaButton";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <ProblemSection />
      <BeforeAfterSlider />
      <LiveDemoSimulator />
      <DemoSection />
      <WorkflowVisualization />
      <ToolsSection />
      <UseCaseTabs />
      <UserStoriesSection />
      <FeaturesSection />
      <ROICalculator />
      <EarlyAccessSection />
      <WaitlistForm />
      <FAQSection />
      <Footer />
      
      <StickyCtaButton />
      <MobileStickyCtaButton />
      <ExitIntentPopup />
    </div>
  );
}
