import { motion } from "framer-motion";

const toolCategories = [
  {
    category: "Lab Data & Analysis",
    tools: ["FlowJo", "GraphPad Prism", "ImageJ", "CellProfiler", "Imaris", "PyMOL"],
  },
  {
    category: "Molecular Biology & ELN",
    tools: ["Benchling", "SnapGene", "Geneious Prime", "ChemDraw", "Labguru", "LabCollector"],
  },
  {
    category: "Analytical Chemistry",
    tools: ["Chromeleon", "MassLynx", "SoftMax Pro", "OriginLab", "Xcalibur", "NMR/FTIR Tools"],
  },
  {
    category: "Bioinformatics & Omics",
    tools: ["CLC Genomics", "BaseSpace", "Seurat", "Cell Ranger", "GSEA", "Cytoscape"],
  },
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
            Your Entire Biotech Stack, Orchestrated
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PixeSci learns your tools and connects them — from benchtop instruments to analysis software
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-12">
          {toolCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-semibold mb-4 text-primary"
              >
                {category.category}
              </motion.h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {category.tools.map((tool, toolIndex) => (
                  <motion.div
                    key={toolIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: toolIndex * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-card hover-elevate rounded-md p-4 flex items-center justify-center border border-card-border"
                  >
                    <p className="text-center font-semibold text-xs md:text-sm">
                      {tool}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-xl md:text-2xl font-semibold text-primary mb-2">
            And 40+ more tools across your R&D pipeline
          </p>
          <p className="text-muted-foreground">
            From LIMS (STARLIMS, Labguru) to imaging (Zeiss ZEN, QuPath) to molecular modeling (Schrödinger, MOE)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
