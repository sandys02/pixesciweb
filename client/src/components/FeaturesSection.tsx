import { motion } from "framer-motion";
import { MessageSquare, RefreshCw, Video, Zap, Lightbulb, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "10x Faster Workflows",
    description: "Accelerate research timelines from weeks to hours by automating data pipelines across FlowJo, Prism, Benchling, and 40+ more tools.",
    highlight: "90% time saved",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Commands",
    description: "No coding required. Simply describe what you want in plain English and PixeSci orchestrates the entire workflow for you.",
    highlight: "Zero learning curve",
  },
  {
    icon: RefreshCw,
    title: "Reproducible Results",
    description: "Every workflow is logged and reproducible. Share protocols with team members and ensure consistent results across experiments.",
    highlight: "Audit-ready logs",
  },
  {
    icon: Video,
    title: "Show, Don't Code",
    description: "Simply demonstrate your workflow once and PixeSci learns it. Record your process and the AI replicates it perfectly every time.",
    highlight: "Learn by watching",
  },
  {
    icon: Lightbulb,
    title: "Intelligent Automation",
    description: "AI that understands scientific context. PixeSci learns your lab's unique procedures and adapts to your specific needs.",
    highlight: "Context-aware AI",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workflows across your team with standardized protocols. New lab members can be productive from day one.",
    highlight: "Onboard in minutes",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background border-t border-border/50" data-testid="section-features" id="section-features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-xs font-medium text-success mb-4">
            <Zap className="w-3.5 h-3.5" />
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Built for How Scientists Actually Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to automate your research workflows
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group relative p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              data-testid={`feature-${index}`}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                    {feature.highlight}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
