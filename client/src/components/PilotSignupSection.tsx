import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

export function PilotSignupSection() {
  return (
    <section className="py-24 bg-muted/30" data-testid="pilot-signup-section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Limited Pilot Program
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Join Our Pilot Program
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Be among the first to experience PixeSci. Get early access, shape the product, and receive priority support.
          </p>
          <p className="text-base text-primary font-medium mb-8">
            Pilot participants receive exclusive founding member pricing — lock in early-bird rates before public launch.
          </p>

          <div 
            className="w-full rounded-lg overflow-hidden"
            style={{ height: '500px' }}
            data-testid="typeform-embed"
          >
            <iframe
              src="https://form.typeform.com/to/k7NQu5WS"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="camera; microphone; autoplay; encrypted-media;"
              style={{ border: 'none' }}
              title="PixeSci Pilot Program Signup"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Early access
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Founding member pricing
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
