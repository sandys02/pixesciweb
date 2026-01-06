import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function FloatingOrbs() {
  const prefersReducedMotion = useReducedMotion();
  
  const orbs = useMemo(() => [
    { size: 300, x: -10, y: 20, duration: 25, delay: 0 },
    { size: 200, x: 90, y: 60, duration: 20, delay: 5 },
    { size: 150, x: 50, y: 80, duration: 22, delay: 3 },
  ], []);

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function PilotSignupSection() {
  return (
    <section className="relative py-24 bg-muted/30 overflow-hidden" data-testid="signup-section" id="signup-section">
      <FloatingOrbs />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
              Early Access
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Get Started with PixeSci
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your account to experience the future of scientific software automation.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border overflow-hidden shadow-lg"
          >
            <div 
              className="w-full"
              style={{ height: '520px' }}
              data-testid="typeform-embed"
            >
              <iframe
                src="https://form.typeform.com/to/k7NQu5WS"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="camera; microphone; autoplay; encrypted-media;"
                style={{ border: 'none' }}
                title="PixeSci Signup"
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            By signing up, you agree to our Terms of Service and Privacy Policy.
            We'll never share your information with third parties.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
