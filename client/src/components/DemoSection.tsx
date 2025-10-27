import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

const prompts = [
  "Analyze tumor response to treatment",
  "Profile T-cell activation patterns",
  "Integrate imaging, genomics, and clinical data",
  "Compare treatment outcomes across datasets",
];

const benefits = [
  "90% faster than manual workflows",
  "Works with tools you already use",
  "Reproducible every time",
];

export function DemoSection() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePromptClick = (prompt: string) => {
    console.log("Prompt clicked:", prompt);
    setSelectedPrompt(prompt);
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <section className="py-20 bg-background" data-testid="section-demo">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI That Speaks Your Language
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => handlePromptClick(prompt)}
                    data-testid={`button-demo-prompt-${index}`}
                  >
                    <Sparkles className="w-4 h-4 mr-2 flex-shrink-0 text-accent" />
                    <span className="flex-1">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedPrompt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-6"
                >
                  <div className="bg-muted/50 rounded-md p-4 mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Your command:</p>
                    <p className="font-semibold">{selectedPrompt}</p>
                  </div>

                  {isProcessing ? (
                    <div className="flex items-center gap-3 text-primary">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span className="text-sm font-medium">AI is processing your request...</span>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 text-success">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Analysis complete!</span>
                      </div>
                      <div className="bg-primary/10 rounded-md p-4 border border-primary/20">
                        <p className="text-sm text-foreground">
                          Workflow executed successfully. Results ready for review.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-sm font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
