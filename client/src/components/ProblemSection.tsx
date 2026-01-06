import { motion } from "framer-motion";
import { MousePointer, BookOpen, Clock, DollarSign, RefreshCcw, TrendingDown, Target } from "lucide-react";

const painPoints = [
  {
    icon: MousePointer,
    title: "\"I spend more time copying data between FlowJo and Prism than analyzing it.\"",
    description: "You shouldn't need 5 tools open just to make one figure.",
  },
  {
    icon: BookOpen,
    title: "\"It takes months to train new lab members on all our software.\"",
    description: "Your postdocs should be doing science, not software tutorials.",
  },
  {
    icon: Clock,
    title: "\"I'm manually moving data between Benchling and ImageJ every single day.\"",
    description: "You keep thinking 'there has to be a better way.' There is.",
  },
  {
    icon: DollarSign,
    title: "\"We pay thousands for Imaris but barely use half its features.\"",
    description: "Your expensive tools should work for you, not collect dust.",
  },
  {
    icon: RefreshCcw,
    title: "\"I do the same 20-click workflow every morning before I can start real work.\"",
    description: "Your routine tasks should run themselves.",
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function ProblemSection() {
  return (
    <section className="py-16 bg-background border-t border-border/50" data-testid="section-problem">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive mb-4">
            <TrendingDown className="w-3.5 h-3.5" />
            The Problem
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Does This Sound Like Your Day?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You didn't get a PhD to fight with software. Here's what we hear from researchers like you.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
              className="group flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-destructive/30 hover:shadow-lg hover:shadow-destructive/5 transition-all duration-300 cursor-default"
              data-testid={`problem-${index}`}
            >
              <motion.div 
                className="flex-shrink-0 w-11 h-11 rounded-lg bg-destructive/10 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <point.icon className="w-5 h-5 text-destructive/70 group-hover:text-destructive transition-colors duration-200" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-destructive/90 transition-colors duration-200">
                  {point.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-primary/5 border border-primary/20">
            <Target className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-foreground font-medium">
              PixeSci eliminates these bottlenecks with intelligent automation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
