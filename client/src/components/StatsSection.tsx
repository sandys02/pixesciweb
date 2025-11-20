import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Zap, Network } from "lucide-react";

interface Stat {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const stats: Stat[] = [
  {
    icon: Network,
    value: 40,
    suffix: "+",
    label: "Scientific Tools Integrated",
  },
  {
    icon: Clock,
    value: 15,
    suffix: " hrs",
    label: "Average Time Saved Per Week",
  },
  {
    icon: Zap,
    value: 300,
    suffix: "%",
    label: "Increase in Analysis Speed",
  },
  {
    icon: Users,
    value: 1000,
    suffix: "+",
    label: "Researchers on Waitlist",
  },
];

function CountUpAnimation({ value, suffix, prefix = "" }: { value: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary">
      {prefix}{count}{suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 bg-muted/20" data-testid="section-stats">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Built    for    Real    Impact
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Trusted by research teams across biotech and pharma
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
              data-testid={`stat-card-${index}`}
            >
              <CountUpAnimation 
                value={stat.value} 
                suffix={stat.suffix}
                prefix={stat.prefix}
              />
              <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
