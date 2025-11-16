import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign } from "lucide-react";

export function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);

  const timeSavedPerWeek = Math.round(hoursPerWeek * 0.7); // 70% time savings
  const timeSavedPerYear = timeSavedPerWeek * 52;
  const costSavingsPerYear = Math.round(timeSavedPerYear * hourlyRate);

  return (
    <section className="py-20 bg-muted/30" data-testid="section-roi-calculator">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Calculate Your Time Savings
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how much time PixeSci™ could save you and your team
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Hours spent on manual workflows per week
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[hoursPerWeek]}
                      onValueChange={(value) => setHoursPerWeek(value[0])}
                      min={1}
                      max={40}
                      step={1}
                      className="flex-1"
                      data-testid="slider-hours"
                    />
                    <span className="text-2xl font-bold text-primary w-16 text-right">
                      {hoursPerWeek}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Estimated hourly cost ($/hour)
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[hourlyRate]}
                      onValueChange={(value) => setHourlyRate(value[0])}
                      min={20}
                      max={200}
                      step={10}
                      className="flex-1"
                      data-testid="slider-rate"
                    />
                    <span className="text-2xl font-bold text-primary w-16 text-right">
                      ${hourlyRate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div
                  key={timeSavedPerWeek}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="p-6 bg-primary/5 rounded-md border border-primary/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Time Saved Weekly</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary" data-testid="value-time-saved-weekly">
                    {timeSavedPerWeek} hours
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on 70% automation
                  </p>
                </motion.div>

                <motion.div
                  key={timeSavedPerYear}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 bg-success/5 rounded-md border border-success/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h3 className="font-semibold">Annual Time Savings</h3>
                  </div>
                  <p className="text-3xl font-bold text-success" data-testid="value-time-saved-yearly">
                    {timeSavedPerYear} hours
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    That's {Math.round(timeSavedPerYear / 8)} work days per year
                  </p>
                </motion.div>

                <motion.div
                  key={costSavingsPerYear}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-accent/5 rounded-md border border-accent/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">Estimated Cost Savings</h3>
                  </div>
                  <p className="text-3xl font-bold text-accent" data-testid="value-cost-savings">
                    ${costSavingsPerYear.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Per researcher, per year
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground text-center">
                Real PixeSci™ users report saving 10-20 hours per week on data analysis and software automation
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
