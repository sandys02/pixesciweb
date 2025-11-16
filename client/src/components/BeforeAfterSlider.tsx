import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { X, Check } from "lucide-react";

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  return (
    <section className="py-20 bg-background" data-testid="section-before-after">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See the Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drag the slider to compare traditional workflows vs. PixeSci™
          </p>
        </motion.div>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div
            className="relative h-[400px] cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            data-testid="slider-container"
          >
            {/* Before (Left) */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50">
              <div className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-destructive mb-4">
                  Before: Traditional Workflow
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Open FlowJo, manually gate populations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Export data as CSV file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Import into Prism, recreate graphs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Copy-paste into Excel for calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Manually log results in Benchling</span>
                  </li>
                </ul>
                <p className="mt-6 text-lg font-semibold text-destructive">
                  Total time: 3-4 hours
                </p>
              </div>
            </div>

            {/* After (Right) */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-success/10 to-primary/10"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <div className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-success mb-4">
                  After: PixeSci™ Automation
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="font-mono text-sm bg-background/50 px-2 py-1 rounded">
                      "Analyze flow cytometry and graph in Prism"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>AI automatically processes all files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Generates publication-ready graphs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Runs statistical analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Logs everything to Benchling automatically</span>
                  </li>
                </ul>
                <p className="mt-6 text-lg font-semibold text-success">
                  Total time: 15-20 minutes
                </p>
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              data-testid="slider-handle"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full shadow-lg flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-0.5 h-4 bg-white"></div>
                  <div className="w-0.5 h-4 bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
