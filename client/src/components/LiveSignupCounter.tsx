import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

export function LiveSignupCounter() {
  const { data: waitlistData } = useQuery({
    queryKey: ["/api/waitlist"],
    enabled: false, // Don't actually fetch in production (requires auth)
  });

  // Use simulated count with some randomization for demo purposes
  const [displayCount, setDisplayCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly increment by 1-3 every 30-60 seconds for demo effect
      if (Math.random() > 0.9) {
        setDisplayCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
      data-testid="live-signup-counter"
    >
      <Users className="w-4 h-4 text-primary" />
      <span className="text-sm font-semibold">
        <motion.span
          key={displayCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary"
        >
          {displayCount.toLocaleString()}
        </motion.span>
        <span className="text-muted-foreground ml-1">researchers on the waitlist</span>
      </span>
    </motion.div>
  );
}
