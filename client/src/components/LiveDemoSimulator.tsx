import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface DemoResponse {
  trigger: string[];
  response: string;
  tools: string[];
}

const demoResponses: DemoResponse[] = [
  {
    trigger: ["flow cytometry", "flowjo", "prism"],
    response: "> Analyzed flow cytometry data in FlowJo\n> Generated statistical plots in GraphPad Prism\n> Exported publication-ready figures\n\nResults: Found 23.4% CD8+ T-cells with statistical significance (p < 0.001)",
    tools: ["FlowJo", "Prism"],
  },
  {
    trigger: ["sequence", "benchling", "snapgene"],
    response: "> Imported plasmid sequence into Benchling\n> Verified restriction sites in SnapGene\n> Generated cloning strategy\n\nRecommendation: Use EcoRI and BamHI sites for optimal insert orientation",
    tools: ["Benchling", "SnapGene"],
  },
  {
    trigger: ["image", "imagej", "cellprofiler"],
    response: "> Batch processed 147 microscopy images in ImageJ\n> Quantified cell counts with CellProfiler\n> Generated CSV with morphology metrics\n\nFound: Average cell diameter 12.3μm across 3 replicates",
    tools: ["ImageJ", "CellProfiler"],
  },
  {
    trigger: ["single cell", "seurat", "rna"],
    response: "> Loaded 10X scRNA-seq data\n> Performed clustering analysis with Seurat\n> Identified 8 distinct cell populations\n\nTop markers: CD3E, CD8A, GZMB for cytotoxic T-cells",
    tools: ["Seurat", "Cell Ranger"],
  },
  {
    trigger: ["chromatography", "chromeleon", "hplc"],
    response: "> Imported HPLC data from Chromeleon\n> Peak detection and integration complete\n> Purity analysis: 98.7%\n\nRetention time: 4.23 min (target compound confirmed)",
    tools: ["Chromeleon"],
  },
];

export function LiveDemoSimulator() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<DemoResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setResponse(null);

    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      const matchedResponse = demoResponses.find((demo) =>
        demo.trigger.some((trigger) => lowerInput.includes(trigger))
      );

      setResponse(
        matchedResponse || {
          trigger: [],
          response: `> Processing: "${input}"\n> Connecting relevant tools\n> Running analysis pipeline\n\nPixeSci™ would orchestrate the appropriate scientific tools to complete this workflow automatically.`,
          tools: ["Auto-detected tools"],
        }
      );
      setIsProcessing(false);
    }, 1500);
  };

  const examplePrompts = [
    "Analyze flow cytometry data and graph in Prism",
    "Process microscopy images and quantify cells",
    "Run single-cell RNA-seq clustering",
  ];

  return (
    <section className="py-20 bg-background" data-testid="section-demo-simulator">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try It Now
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Type any scientific workflow and see how PixeSci™ would handle it
          </p>
        </motion.div>

        <Card className="max-w-3xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g., 'Analyze flow cytometry data and create plots in Prism'"
                className="flex-1"
                data-testid="input-demo-command"
              />
              <Button
                type="submit"
                disabled={isProcessing || !input.trim()}
                data-testid="button-demo-submit"
              >
                {isProcessing ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(prompt)}
                  data-testid={`button-example-${idx}`}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </form>

          <AnimatePresence mode="wait">
            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-primary/5 rounded-md border border-primary/20"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    Processing your request...
                  </span>
                </div>
              </motion.div>
            )}

            {response && !isProcessing && (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
              >
                <div className="p-4 bg-success/10 rounded-md border border-success/20">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-foreground">
                    {response.response}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2">
                  {response.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  );
}
