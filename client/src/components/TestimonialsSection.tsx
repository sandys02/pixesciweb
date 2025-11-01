import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import phdImage from "@assets/generated_images/PhD_student_testimonial_portrait_a1074dc6.png";
import professorImage from "@assets/generated_images/Professor_testimonial_portrait_5853a0d4.png";
import managerImage from "@assets/generated_images/Facility_manager_testimonial_portrait_7996bfc5.png";

const testimonials = [
  {
    quote: "PixeSci™ gave me my evenings back. What used to take me all weekend now happens while I grab coffee.",
    author: "Dr. Sarah Chen",
    role: "Cell Biology PhD",
    institution: "Stanford",
    image: phdImage,
  },
  {
    quote: "My students can now focus on experimental design instead of fighting with software interfaces.",
    author: "Prof. Michael Rodriguez",
    role: "Principal Investigator",
    institution: "MIT",
    image: professorImage,
  },
  {
    quote: "We increased our core facility throughput by 300% without hiring anyone.",
    author: "Jennifer Kim",
    role: "Core Facility Manager",
    institution: "UCSF",
    image: managerImage,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background" data-testid="section-testimonials">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join Scientists Who've Made the Switch
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover-elevate h-full flex flex-col">
                <p className="text-lg leading-relaxed mb-6 flex-1 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.image} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.institution}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
