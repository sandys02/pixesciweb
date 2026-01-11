import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ArrowRight, Terminal, Beaker, Microscope, Dna, FlaskConical } from "lucide-react";

interface DemoScenario {
  id: string;
  icon: typeof Beaker;
  title: string;
  command: string;
  steps: string[];
  result: string;
  tools: string[];
}

const scenarios: DemoScenario[] = [
  {
    id: "flow",
    icon: Beaker,
    title: "Flow Cytometry",
    command: "Analyze flow cytometry data and create publication graphs",
    steps: [
      "Opening FlowJo workspace...",
      "Applying gating strategy to 24 samples...",
      "Exporting statistics to GraphPad Prism...",
      "Generating scatter plots and bar charts...",
    ],
    result: "Completed: 24 samples analyzed, 8 publication-ready figures exported",
    tools: ["FlowJo", "GraphPad Prism"],
  },
  {
    id: "imaging",
    icon: Microscope,
    title: "Cell Imaging",
    command: "Process microscopy images and quantify cell morphology",
    steps: [
      "Loading 147 microscopy images into ImageJ...",
      "Running background subtraction...",
      "Detecting cells with CellProfiler pipeline...",
      "Calculating morphology metrics...",
    ],
    result: "Completed: 3,842 cells detected, mean diameter 12.3um, CSV exported",
    tools: ["ImageJ", "CellProfiler"],
  },
  {
    id: "genomics",
    icon: Dna,
    title: "Single-Cell RNA",
    command: "Run single-cell clustering and identify cell populations",
    steps: [
      "Loading 10X Genomics data...",
      "Normalizing and scaling with Seurat...",
      "Running UMAP dimensionality reduction...",
      "Clustering and marker identification...",
    ],
    result: "Completed: 8 distinct populations identified, top markers exported",
    tools: ["Seurat", "Cell Ranger"],
  },
  {
    id: "cloning",
    icon: FlaskConical,
    title: "Molecular Cloning",
    command: "Design cloning strategy and document in ELN",
    steps: [
      "Importing plasmid sequence to Benchling...",
      "Analyzing restriction sites in SnapGene...",
      "Designing primers for Gibson assembly...",
      "Creating protocol documentation...",
    ],
    result: "Completed: Cloning strategy designed, primers ordered, protocol saved",
    tools: ["Benchling", "SnapGene"],
  },
];

export function InteractiveDemo() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleScenarioClick = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setIsComplete(false);
    setIsProcessing(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < scenario.steps.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsComplete(true);
      }
    }, 800);
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setCurrentStep(0);
    setIsProcessing(false);
    setIsComplete(false);
  };

  return (
    <section className="py-16 bg-background border-t border-border/50" data-testid="section-demo">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            See How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click a workflow to watch PixeSci orchestrate your tools automatically
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {scenarios.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleScenarioClick(scenario)}
                disabled={isProcessing}
                className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                  selectedScenario?.id === scenario.id
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                data-testid={`demo-scenario-${scenario.id}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  selectedScenario?.id === scenario.id ? "bg-primary/20" : "bg-muted"
                }`}>
                  <scenario.icon className={`w-5 h-5 ${
                    selectedScenario?.id === scenario.id ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="font-semibold text-sm mb-1">{scenario.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{scenario.command}</div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedScenario && (
              <motion.div
                key={selectedScenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                    <span className="ml-3 text-xs text-muted-foreground font-mono">PixeSci Workflow Engine</span>
                  </div>
                  
                  <div className="p-6 font-mono text-sm min-h-[400px]">
                    <div className="mb-4 text-primary">
                      <span className="text-muted-foreground">$</span> {selectedScenario.command}
                    </div>
                    
                    <div className="space-y-2 mb-4 min-h-[120px]">
                      {selectedScenario.steps.slice(0, currentStep + 1).map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          {i < currentStep || isComplete ? (
                            <Check className="w-4 h-4 text-success flex-shrink-0" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
                          )}
                          <span>{step}</span>
                        </motion.div>
                      ))}
                    </div>

                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                          <div className="flex items-center gap-2 text-success font-semibold mb-1">
                            <Check className="w-4 h-4" />
                            Success
                          </div>
                          <div className="text-foreground">{selectedScenario.result}</div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted-foreground">Tools used:</span>
                          {selectedScenario.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                          >
                            Try another workflow
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const signupSection = document.querySelector('[data-testid="signup-section"]');
                              signupSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Get started
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedScenario && (
            <div className="min-h-[453px] flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Terminal className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a workflow above to see the demo</p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
