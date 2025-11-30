import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CALENDAR_URL = "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true";

export function HeroSection() {
  return (
    <section id="hero-section" className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              For Biotech & Pharma R&D Teams and Research Labs
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Stop    Fighting    Software.
            <br className="hidden md:block" />
            <span className="block mt-3">Start    Doing    Science.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
            Pixesci is an AI agent that has been trained to automate technical biotech softwares such as Schrödinger, Imaris, FlowJo, Prism, Benchling, ImageJ and PK Sim.
          </p>
          <div>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-10 py-6 min-h-12 font-semibold"
              asChild
              data-testid="button-hero-talk-to-us"
            >
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">Get a Quick Demo</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
