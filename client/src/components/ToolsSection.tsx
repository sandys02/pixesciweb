import { motion } from "framer-motion";

const tools = [
  "ImageJ/Fiji",
  "MATLAB",
  "GraphPad Prism",
  "Napari",
  "CellProfiler",
  "Origin",
  "Imaris",
  "FlowJo",
  "R/RStudio",
  "Python/Jupyter",
  "Excel",
  "And 40+ more...",
];

export function ToolsSection() {
  return (
    <section className="py-20 bg-muted/30" data-testid="section-tools">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Works With Everything You Already Use
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-card hover-elevate rounded-md p-6 flex items-center justify-center border border-card-border"
            >
              <p className="text-center font-semibold text-sm md:text-base">
                {tool}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xl md:text-2xl font-semibold text-primary">
            No installation. No integration. Just start talking.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
