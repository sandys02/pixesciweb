import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const workflows = [
  {
    name: "Flow Cytometry Pipeline",
    steps: ["FlowJo", "Prism", "Benchling"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Image Analysis",
    steps: ["ImageJ", "CellProfiler", "Excel"],
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Genomics Workflow",
    steps: ["BaseSpace", "CLC Genomics", "Cytoscape"],
    color: "from-green-500 to-emerald-500",
  },
];

export function WorkflowVisualization() {
  return (
    <section className="py-20 bg-muted/30" data-testid="section-workflow-viz">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Multi-Tool Orchestration
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch PixeSci™ connect your tools automatically
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8">
          {workflows.map((workflow, workflowIdx) => (
            <motion.div
              key={workflowIdx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: workflowIdx * 0.2 }}
              className="bg-card border border-card-border rounded-md p-6"
              data-testid={`workflow-${workflowIdx}`}
            >
              <h3 className="text-lg font-semibold mb-6">{workflow.name}</h3>
              
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {workflow.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: workflowIdx * 0.2 + stepIdx * 0.3 }}
                      className="relative"
                    >
                      <div
                        className={`px-6 py-3 rounded-md bg-gradient-to-r ${workflow.color} text-white font-semibold text-sm shadow-lg min-w-[120px] text-center`}
                      >
                        {step}
                      </div>
                      
                      {stepIdx === 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: workflowIdx * 0.2 + stepIdx * 0.3 + 0.2 }}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                        >
                          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        </motion.div>
                      )}
                    </motion.div>

                    {stepIdx < workflow.steps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: workflowIdx * 0.2 + stepIdx * 0.3 + 0.15 }}
                      >
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center p-6 bg-primary/5 rounded-md border border-primary/20 max-w-3xl mx-auto"
        >
          <p className="text-lg">
            <span className="font-semibold text-primary">One natural language command</span> replaces hours of manual data transfer between tools
          </p>
        </motion.div>
      </div>
    </section>
  );
}
