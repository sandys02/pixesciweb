import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolInfo {
  name: string;
  description: string;
}

const toolCategories = [
  {
    category: "Lab Data & Analysis",
    tools: [
      { name: "FlowJo", description: "Flow cytometry analysis and gating" },
      { name: "GraphPad Prism", description: "Statistical graphing and analysis" },
      { name: "ImageJ", description: "Image processing and analysis" },
      { name: "CellProfiler", description: "Automated cell image analysis" },
      { name: "Imaris", description: "3D/4D microscopy visualization" },
      { name: "PyMOL", description: "Molecular visualization system" },
    ],
  },
  {
    category: "Molecular Biology & ELN",
    tools: [
      { name: "Benchling", description: "Cloud biology software for R&D" },
      { name: "SnapGene", description: "DNA cloning and visualization" },
      { name: "Geneious Prime", description: "Molecular biology and NGS analysis" },
      { name: "ChemDraw", description: "Chemical structure drawing" },
      { name: "Labguru", description: "Electronic lab notebook" },
      { name: "LabCollector", description: "LIMS and sample management" },
    ],
  },
  {
    category: "Analytical Chemistry",
    tools: [
      { name: "Chromeleon", description: "Chromatography data system" },
      { name: "MassLynx", description: "Mass spectrometry software" },
      { name: "SoftMax Pro", description: "Microplate reader analysis" },
      { name: "OriginLab", description: "Data analysis and graphing" },
      { name: "Xcalibur", description: "Mass spec data acquisition" },
      { name: "NMR/FTIR Tools", description: "Spectroscopy analysis software" },
    ],
  },
  {
    category: "Bioinformatics & Omics",
    tools: [
      { name: "CLC Genomics", description: "NGS data analysis platform" },
      { name: "BaseSpace", description: "Illumina genomics cloud platform" },
      { name: "Seurat", description: "Single-cell RNA-seq analysis" },
      { name: "Cell Ranger", description: "10X Genomics analysis pipeline" },
      { name: "GSEA", description: "Gene set enrichment analysis" },
      { name: "Cytoscape", description: "Network visualization and analysis" },
    ],
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
            PixeSci™ learns your tools and connects them — from benchtop instruments to analysis software
          </p>
        </motion.div>

        <TooltipProvider>
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
                    <Tooltip key={toolIndex}>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: toolIndex * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-card hover-elevate rounded-md p-4 flex items-center justify-center border border-card-border cursor-pointer"
                          data-testid={`tool-${tool.name.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          <p className="text-center font-semibold text-xs md:text-sm">
                            {tool.name}
                          </p>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{tool.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>

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
