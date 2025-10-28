import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Microscope, Dna, BarChart3 } from "lucide-react";
import frustratedImage from "@assets/generated_images/Complex_software_interface_showing_frustration_0a50718a.png";
import happyImage from "@assets/generated_images/Scientific_AI_analysis_interface_f1e4b778.png";

export function HeroSection() {
  const handleJoinWaitlist = () => {
    console.log("Join Waitlist clicked - scrolling to form");
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWatchDemo = () => {
    console.log("Watch Demo clicked");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <motion.div
        className="absolute top-20 left-10 text-primary/20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Microscope className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-20 text-accent/20"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        <Dna className="w-20 h-20" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 left-1/4 text-primary/20"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      >
        <BarChart3 className="w-14 h-14" />
      </motion.div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto mb-12"
        >
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold text-sm">
              Built for Biotech & Pharma R&D
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Stop Fighting Software.<br />
            <span className="text-primary">Start Doing Science.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            AI that turns any scientific tool into a simple conversation.
            <br />
            Built for life science researchers who need answers, not manuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-success hover:bg-success/90 text-success-foreground text-lg px-8 py-6 min-h-12"
              onClick={handleJoinWaitlist}
              data-testid="button-hero-join-waitlist"
            >
              Join the Waitlist
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 min-h-12"
              onClick={handleWatchDemo}
              data-testid="button-watch-demo"
            >
              Watch 60-Second Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted rounded-md" />
            <img
              src={frustratedImage}
              alt="Complex software interface with multiple menus"
              className="relative rounded-md w-full h-64 md:h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-md">
              <p className="text-sm font-semibold text-foreground">Before: Complex menus & frustration</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-md blur-xl" />
            <img
              src={happyImage}
              alt="PixeSci AI interface showing scientific data analysis"
              className="relative rounded-md w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-primary/90 backdrop-blur-sm p-3 rounded-md">
              <p className="text-sm font-semibold text-primary-foreground">After: "Analyze tumor response" → Answered!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
