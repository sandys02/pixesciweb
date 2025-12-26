import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

export function PilotSignupSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <section className="py-24 bg-muted/30" data-testid="pilot-signup-section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Limited Pilot Program
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Join Our Pilot Program
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Be among the first to experience PixeSci. Get early access, shape the product, and receive priority support.
          </p>

          <Card className="p-6 md:p-8 max-w-md mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                    data-testid="input-pilot-email"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-pilot-submit"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    "Request Early Access"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  No spam. We'll only reach out about the pilot program.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">You're on the list!</h3>
                <p className="text-sm text-muted-foreground">
                  We'll be in touch soon with next steps for the pilot program.
                </p>
              </motion.div>
            )}
          </Card>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Early access
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Priority support
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Shape the product
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
