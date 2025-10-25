import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Do I need to install anything?",
    answer: "Nope! PixeSci works with your existing software. No installation required.",
  },
  {
    question: "Will it work with my specific analysis workflow?",
    answer: "PixeSci learns your lab's unique procedures and adapts to your specific needs.",
  },
  {
    question: "What about data security?",
    answer: "Your data never leaves your computer. We take research-grade security seriously.",
  },
  {
    question: "How much will it cost?",
    answer: "Early access users get special pricing. Join the waitlist for details.",
  },
  {
    question: "When will it be available?",
    answer: "Beta launches in Q2 2024. Waitlist members get first access.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-muted/30" data-testid="section-faq">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Questions? We've Got Answers.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-card-border rounded-md px-6"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
