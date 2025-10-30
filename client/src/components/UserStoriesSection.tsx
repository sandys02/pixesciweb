import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const stories = [
  {
    role: "R&D Scientist",
    institution: "Biotech Startup",
    before: "Manually moving data between FlowJo, Prism, and Benchling",
    after: "One command runs my entire flow cytometry pipeline",
  },
  {
    role: "Bioinformatics Lead",
    institution: "Pharma Company",
    before: "Training every scientist on CLC Genomics and Seurat",
    after: "Team just says 'analyze single-cell data' — PixeSci handles the rest",
  },
  {
    role: "PhD Student",
    institution: "Research University",
    before: "Weeks clicking through ImageJ and CellProfiler menus",
    after: "All my image analysis done while I grab coffee",
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
            Trusted by Biotech & Academic Researchers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From startup R&D teams to university labs, scientists rely on PixeSci to accelerate discovery
          </p>
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
