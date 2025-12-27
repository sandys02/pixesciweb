import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

export function PilotSignupSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Apollo tracks the form data automatically
    // Show success message
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

          <Card className="p-6 md:p-8 max-w-lg mx-auto">
            {!isSubmitted ? (
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-4 text-left"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    required
                    className="h-11"
                    data-testid="input-pilot-email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Organization</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your company or institution"
                    required
                    className="h-11"
                    data-testid="input-pilot-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="functions">What Scientific Software Do You Use In Your Day To Day?</Label>
                  <Textarea
                    id="functions"
                    name="functions"
                    placeholder="e.g., FlowJo, Prism, Benchling, ImageJ, Schrödinger..."
                    className="min-h-[80px] resize-none"
                    data-testid="input-pilot-functions"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website_url">Organisation Website</Label>
                  <Input
                    id="website_url"
                    type="url"
                    name="website_url"
                    placeholder="https://yourcompany.com"
                    className="h-11"
                    data-testid="input-pilot-website"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  data-testid="button-pilot-submit"
                >
                  Request Early Access
                </Button>
                <p className="text-xs text-muted-foreground text-center">
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
