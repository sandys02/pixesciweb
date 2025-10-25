import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageSquare, RefreshCw, FileText, Users, Lock, Zap } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Plain English Commands",
    description: "No coding, no clicking, just conversation",
  },
  {
    icon: RefreshCw,
    title: "Automated Workflows",
    description: "From raw data to publication figure automatically",
  },
  {
    icon: FileText,
    title: "Publication Ready",
    description: "Professional outputs that pass peer review",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workflows instantly across your lab",
  },
  {
    icon: Lock,
    title: "Research Grade Security",
    description: "Your data stays private and secure",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Seconds, not hours",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30" data-testid="section-features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for How Scientists Actually Work
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover-elevate h-full">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
