import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const researchAreas = [
  "Cell Biology",
  "Neuroscience",
  "Cancer Research",
  "Immunology",
  "Genomics",
  "Proteomics",
  "Bioinformatics",
  "Other",
];

const softwareOptions = [
  "ImageJ/Fiji",
  "MATLAB",
  "GraphPad Prism",
  "Python/Jupyter",
  "R/RStudio",
  "CellProfiler",
  "FlowJo",
  "Imaris",
  "Napari",
  "Other",
];

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  institution: z.string().optional(),
  researchArea: z.string().min(1, "Please select a research area"),
  software: z.array(z.string()).min(1, "Please select at least one software"),
  challenge: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      institution: "",
      researchArea: "",
      software: [],
      challenge: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    
    // TODO: remove mock functionality - Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <section id="waitlist-form" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="p-12">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">You're on the list!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for joining the PixeSci waitlist. We'll be in touch soon with your early access details.
              </p>
              <p className="text-sm text-muted-foreground">
                Check your email for confirmation.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist-form" className="py-20 bg-background" data-testid="section-waitlist-form">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Research?
          </h2>
        </motion.div>

        <Card className="max-w-2xl mx-auto p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@university.edu"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dr. Jane Smith"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="University or Research Center"
                        {...field}
                        data-testid="input-institution"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="researchArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Area *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-research-area">
                          <SelectValue placeholder="Select your research area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {researchAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="software"
                render={() => (
                  <FormItem>
                    <FormLabel>Primary Software You Use *</FormLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {softwareOptions.map((software) => (
                        <FormField
                          key={software}
                          control={form.control}
                          name="software"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(software)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), software]
                                      : field.value?.filter((v) => v !== software) || [];
                                    field.onChange(newValue);
                                  }}
                                  data-testid={`checkbox-software-${software}`}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {software}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="challenge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biggest Analysis Challenge</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your biggest workflow pain point..."
                        className="resize-none"
                        rows={4}
                        {...field}
                        data-testid="textarea-challenge"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-success hover:bg-success/90 text-success-foreground text-lg"
                  disabled={isSubmitting}
                  data-testid="button-submit-waitlist"
                >
                  {isSubmitting ? "Securing Your Spot..." : "Secure My Early Access"}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Join 1,247 researchers already on the waitlist
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We'll never share your email. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
}
