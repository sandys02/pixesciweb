import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  { value: 50, suffix: "+", label: "Scientific Tools", description: "Integrated platforms from FlowJo to Seurat" },
  { value: 90, suffix: "%", label: "Time Saved", description: "On repetitive analysis workflows" },
  { value: 10, suffix: "x", label: "Faster", description: "Than manual data processing" },
];

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-16 bg-muted/30 border-y border-border/50" data-testid="section-stats">
      <div className="container mx-auto px-4" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
              data-testid={`stat-${index}`}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-base font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
