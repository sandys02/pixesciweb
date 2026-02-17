import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";

const CALENDAR_URL = "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true";

const typewriterPhrases = [
  "analyzing flow cytometry data",
  "processing microscopy images", 
  "running genomics pipelines",
  "orchestrating lab workflows",
  "generating publication figures",
];

function useTypewriter(phrases: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return currentText;
}

function FloatingParticles() {
  const prefersReducedMotion = useReducedMotion();
  
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: 3 + (i % 6),
      x: (i * 3.3) % 100,
      y: (i * 7) % 100,
      duration: 12 + (i % 8),
      delay: i * 0.2,
    })), []
  );

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-primary/15"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, -20, 0],
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGradient() {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return (
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, hsl(221 83% 56% / 0.2) 0%, transparent 60%)",
        }}
      />
    );
  }
  
  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 30%, hsl(221 83% 56% / 0.2) 0%, transparent 60%)",
            "radial-gradient(ellipse at 80% 40%, hsl(221 83% 56% / 0.2) 0%, transparent 60%)",
            "radial-gradient(ellipse at 50% 60%, hsl(221 83% 56% / 0.2) 0%, transparent 60%)",
            "radial-gradient(ellipse at 20% 30%, hsl(221 83% 56% / 0.2) 0%, transparent 60%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        animate={{
          background: [
            "radial-gradient(ellipse at 70% 70%, hsl(16 100% 59% / 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 30% 20%, hsl(16 100% 59% / 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 70% 70%, hsl(16 100% 59% / 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

function TerminalPreview() {
  const [step, setStep] = useState(0);
  const steps = [
    { type: "input", text: "> Analyze flow cytometry data and graph in Prism" },
    { type: "output", text: "Connecting to FlowJo..." },
    { type: "output", text: "Processing 12 samples..." },
    { type: "output", text: "Exporting to GraphPad Prism..." },
    { type: "success", text: "Analysis complete. Publication-ready figures generated." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % (steps.length + 2));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-16 max-w-2xl mx-auto"
    >
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-warning/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">PixeSci Terminal</span>
        </div>
        <div className="p-4 font-mono text-sm h-[200px] bg-background/50 overflow-y-auto">
          {steps.slice(0, Math.min(step + 1, steps.length)).map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-2 ${
                s.type === "input" ? "text-primary font-semibold" :
                s.type === "success" ? "text-success" :
                "text-muted-foreground"
              }`}
            >
              {s.text}
            </motion.div>
          ))}
          {step < steps.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-primary ml-1"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const typewriterText = useTypewriter(typewriterPhrases);
  
  const scrollToSignupForm = () => {
    const signupSection = document.querySelector('[data-testid="signup-section"]');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDemo = () => {
    const demoSection = document.querySelector('[data-testid="section-demo"]');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCalendar = () => {
    window.open(CALENDAR_URL, '_blank');
  };

  return (
    <section id="hero-section" className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-background overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <FloatingParticles />
      <AnimatedGradient />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight"
          >
            Stop Fighting Software.
            <br className="hidden md:block" />
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Start Doing Science.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed max-w-3xl mx-auto"
          >
            PixeSci is an AI-powered automation layer that orchestrates complex workflows across your entire scientific software ecosystem.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-foreground mb-10 h-8"
          >
            Currently <span className="text-primary font-semibold">{typewriterText}</span>
            <span className="animate-pulse">|</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="text-base px-8 min-h-12 font-semibold group"
              onClick={scrollToSignupForm}
              data-testid="button-hero-get-early-access"
            >
              Get early access
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 min-h-12 font-semibold group"
              onClick={scrollToDemo}
              data-testid="button-hero-see-demo"
            >
              <Play className="mr-2 w-4 h-4" />
              See it in action
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-base px-8 min-h-12 font-semibold"
              onClick={openCalendar}
              data-testid="button-hero-get-demo"
            >
              Schedule a demo
            </Button>
          </motion.div>
        </motion.div>

        <TerminalPreview />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
