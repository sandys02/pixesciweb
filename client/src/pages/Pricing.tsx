import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const CALENDAR_URL = "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true";

const enterpriseFeatures = [
  "Unlimited tool orchestration",
  "Custom workflow automation",
  "On-premise deployment available",
  "SSO & SAML authentication",
  "Advanced security controls",
  "Compliance (SOC2, HIPAA ready)",
  "Dedicated success manager",
  "Priority support & custom SLA",
  "Team training & onboarding",
];

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Enterprise-grade AI orchestration for scientific software, tailored to your team's needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-8 border border-border">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Enterprise
              </div>
              <h2 className="text-3xl font-bold mb-4">Custom</h2>
              <p className="text-muted-foreground mb-8">
                Tailored to your research infrastructure. Deploy PixeSci across teams, labs, and facilities—fully customized to your stack and security requirements.
              </p>

              <ul className="space-y-3 mb-8">
                {enterpriseFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full"
                asChild
                data-testid="button-pricing-talk-to-us"
              >
                <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                  Talk to Us
                </a>
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-4">Got Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Reach out to get a custom quote tailored to your needs or learn how PixeSci can transform your research workflows.
            </p>
            <Button
              variant="outline"
              asChild
              data-testid="button-pricing-contact"
            >
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                Talk to Us
              </a>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
