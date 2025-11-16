import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FlaskConical, GraduationCap, Building2, Check } from "lucide-react";

const useCases = [
  {
    id: "rd-scientist",
    title: "R&D Scientist",
    icon: FlaskConical,
    challenge: "Managing data across FlowJo, Prism, Benchling, and Excel — every experiment means hours of manual data transfer.",
    solution: "One command runs your entire pipeline: 'Analyze flow data, graph in Prism, log to Benchling.'",
    results: [
      "Cut analysis time from 3 hours to 20 minutes",
      "Eliminate copy-paste errors between tools",
      "Standardized workflows across the team",
    ],
    tools: ["FlowJo", "GraphPad Prism", "Benchling"],
  },
  {
    id: "phd-student",
    title: "PhD Student",
    icon: GraduationCap,
    challenge: "Spending weekends learning ImageJ, CellProfiler, and R instead of doing actual science.",
    solution: "Natural language replaces complex software: 'Count cells in these images and show me the distribution.'",
    results: [
      "Process 100+ images in minutes, not days",
      "Focus on experimental design, not software manuals",
      "Publication-ready figures automatically",
    ],
    tools: ["ImageJ", "CellProfiler", "R/ggplot2"],
  },
  {
    id: "core-facility",
    title: "Core Facility Manager",
    icon: Building2,
    challenge: "Training every user on Chromeleon, MassLynx, and analysis software — constant support tickets.",
    solution: "Users submit samples with plain English instructions. PixeSci™ handles the rest.",
    results: [
      "300% increase in sample throughput",
      "90% reduction in training time",
      "Consistent, high-quality outputs",
    ],
    tools: ["Chromeleon", "MassLynx", "Custom LIMS"],
  },
];

export function UseCaseTabs() {
  return (
    <section className="py-20 bg-background" data-testid="section-use-cases">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for Your Role
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how PixeSci™ transforms workflows for different research roles
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="rd-scientist" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {useCases.map((useCase) => (
                <TabsTrigger
                  key={useCase.id}
                  value={useCase.id}
                  className="flex items-center gap-2"
                  data-testid={`tab-${useCase.id}`}
                >
                  <useCase.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{useCase.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {useCases.map((useCase) => (
              <TabsContent key={useCase.id} value={useCase.id} data-testid={`tab-content-${useCase.id}`}>
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-md">
                      <useCase.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{useCase.title}</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-destructive mb-2">
                        The Challenge
                      </h4>
                      <p className="text-muted-foreground">{useCase.challenge}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-success mb-2">
                        The Solution
                      </h4>
                      <p className="text-muted-foreground">{useCase.solution}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Real Results</h4>
                      <ul className="space-y-2">
                        {useCase.results.map((result, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                        Tools Integrated
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {useCase.tools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
