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
    <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10" data-testid="section-early-access">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Be Among the First to Experience the Future
          </h2>
          <Badge variant="destructive" className="text-base px-4 py-2">
            Only 200 early access spots available
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover-elevate h-full text-center">
                <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
