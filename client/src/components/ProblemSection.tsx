import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MousePointer, BookOpen, Clock, DollarSign, RefreshCcw } from "lucide-react";

const painPoints = [
  {
    icon: MousePointer,
    title: "Clicking through 50 menus just to open an image",
  },
  {
    icon: BookOpen,
    title: "Reading 200-page manuals for simple analysis",
  },
  {
    icon: Clock,
    title: "Spending weeks on what should take minutes",
  },
  {
    icon: DollarSign,
    title: "Expensive software sitting unused because it's too complex",
  },
  {
    icon: RefreshCcw,
    title: "Redoing analysis because you forgot one step",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-foreground text-background" data-testid="section-problem">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Recognize This Daily Struggle?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-background/10 backdrop-blur-sm border-background/20 hover-elevate h-full">
                <point.icon className="w-12 h-12 mb-4 text-accent" />
                <p className="text-lg font-medium text-background leading-relaxed">
                  {point.title}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-2xl md:text-3xl font-semibold text-accent">
            What if you could just... ask for what you need?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
