// @/content/integrations.ts

export type IntegrationCategory = {
  name: string
  description: string
  examples: readonly string[]
  outcomes: readonly string[]
  workflow: string
}

export const integrationCategories: IntegrationCategory[] = [
  {
    name: "Data Analysis & Statistics",
    description:
      "Turn repeated calculations, statistics, figures, and exports into workflows your team can run again.",
    examples: ["Python", "R", "MATLAB", "GraphPad Prism", "SigmaPlot"],
    outcomes: [
      "Repeatable calculations",
      "Saved settings",
      "Review-ready figures",
    ],
    workflow: "Prepared data -> analysis -> figures -> report",
  },
  {
    name: "Laboratory Productivity / Lab Software",
    description:
      "Move results, run details, sample IDs, and review steps between the systems your lab already relies on.",
    examples: [
      "LIMS",
      "ELN",
      "Benchling",
      "Facility repositories",
      "Spreadsheets",
    ],
    outcomes: ["Less re-entry", "Connected records", "Clear review handoffs"],
    workflow: "Analysis output -> review -> LIMS / ELN update",
  },
  {
    name: "Reporting & Visualization",
    description:
      "Build spreadsheets, plots, slides, reports, and export packages from approved results.",
    examples: ["Excel", "PowerPoint", "PDF", "CSV", "OriginPro"],
    outcomes: [
      "Faster reports",
      "Approved outputs",
      "Reusable report packages",
    ],
    workflow: "Reviewed results -> visualization -> report package",
  },
  {
    name: "AI & Automation",
    description:
      "Talk to your lab! Turn requests into checked workflow steps before the work runs.",
    examples: ["Workflow planning", "Review checkpoints", "Reusable templates"],
    outcomes: ["Plain-language requests", "Checked steps", "Human approval"],
    workflow: "Request -> reviewed steps -> controlled run",
  },
  {
    name: "Imaging & Microscopy",
    description:
      "Move microscope files through image processing, measurement, statistics, and review.",
    examples: ["ImageJ / Fiji", "CellProfiler", "QuPath", "OMERO", "Napari"],
    outcomes: [
      "Consistent processing",
      "Measured results",
      "Reviewable image data",
    ],
    workflow: "Microscope output -> measurement -> statistics -> review",
  },
  {
    name: "Bioinformatics & Omics",
    description:
      "Connect sequence, omics, reference data, sample IDs, quality checks, and final records.",
    examples: ["FastQC", "BLAST", "samtools", "Python", "R"],
    outcomes: ["Repeatable pipelines", "Linked sample IDs", "Saved outputs"],
    workflow: "FASTQ -> QC -> analysis -> final record",
  },
  {
    name: "Analytical Chemistry",
    description:
      "Track instrument files, settings, reruns, reviews, and reports without losing context.",
    examples: ["Chromeleon", "Empower", "HPLC exports", "OriginPro"],
    outcomes: [
      "Linked instrument files",
      "Exception review",
      "Batch-ready records",
    ],
    workflow: "Instrument output -> processing -> review -> record",
  },
  {
    name: "Flow Cytometry & Immunology",
    description:
      "Connect gating results, statistics, figures, reviews, and final records.",
    examples: ["FlowJo", "GraphPad Prism", "LIMS / ELN"],
    outcomes: ["Saved gating context", "Linked statistics", "Reviewed records"],
    workflow: "FCS -> gating -> statistics -> review -> record",
  },
]

export const capabilityFields = [
  "Supported software",
  "Local availability",
  "Required inputs",
  "Expected outputs",
  "Review points",
  "Workflow templates",
  "Version notes",
  "Run history",
] as const
