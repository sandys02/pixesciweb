import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const stories = [
  {
    role: "PhD Student",
    institution: "Major Research University",
    before: "Struggled to integrate imaging and RNA-seq data",
    after: "'Analyze tumor microenvironment' → Complete analysis in minutes",
  },
  {
    role: "Core Facility Manager",
    institution: "Research Institute",
    before: "Training every user on 10 different software packages",
    after: "Everyone just describes what they need",
  },
  {
    role: "Postdoc",
    institution: "Academic Medical Center",
    before: "Analysis bottleneck delayed my publication",
    after: "Generated all figures in one afternoon",
  },
];

export function UserStoriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-background" data-testid="section-user-stories">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real Scientists, Real Results
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Card className="p-6 hover-elevate h-full transition-all duration-300">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {story.role}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {story.institution}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className={`transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-50' : 'opacity-100'}`}>
                    <p className="text-sm font-semibold text-destructive mb-1">
                      Before:
                    </p>
                    <p className="text-sm text-foreground">
                      {story.before}
                    </p>
                  </div>

                  <div className={`transition-all duration-300 ${hoveredIndex === index ? 'opacity-100 scale-105' : 'opacity-70'}`}>
                    <p className="text-sm font-semibold text-success mb-1">
                      After:
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {story.after}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
