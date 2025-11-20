import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Target, GraduationCap, DollarSign, Rocket, Trophy } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Early access to beta",
    description: "Limited spots available",
  },
  {
    icon: GraduationCap,
    title: "Free training sessions",
    description: "Direct access to our team",
  },
  {
    icon: DollarSign,
    title: "Founding user pricing",
    description: "50% off first year",
  },
  {
    icon: Rocket,
    title: "Shape the product",
    description: "Direct input on features",
  },
  {
    icon: Trophy,
    title: "Founding partner recognition",
    description: "Be recognized as an early adopter",
  },
];

export function EarlyAccessSection() {
  return (
    <section className="py-24 bg-background" data-testid="section-early-access">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Join    the    Waitlist    Today
          </h2>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            Limited early access spots available
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {benefits.slice(0, 3).map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
