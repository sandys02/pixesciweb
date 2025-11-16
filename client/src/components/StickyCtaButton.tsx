import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function StickyCtaButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsVisible(heroBottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 hidden md:block"
        >
          <Button
            size="lg"
            className="bg-success hover:bg-success/90 text-success-foreground shadow-lg hover:shadow-xl transition-all"
            onClick={handleClick}
            data-testid="button-sticky-cta"
          >
            Join Waitlist
            <ArrowUp className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
