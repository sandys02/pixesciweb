export type IntegrationCategory = {
  name: string
  description: string
  examples: readonly string[]
  channels: readonly string[]
  pipeline: string
}

export const integrationCategories: IntegrationCategory[] = [
  {
    name: "Imaging & Microscopy",
    description:
      "Move microscope files through image processing, measurement, statistics, and review.",
    examples: ["ImageJ / Fiji", "CellProfiler", "QuPath", "OMERO", "Napari"],
    channels: ["Macro", "Python", "GUI", "File monitor"],
    pipeline: "Microscope output → segmentation → statistics → review",
  },
  {
    name: "Bioinformatics & Omics",
    description:
      "Connect command-line tools, scripts, reference data, sample IDs, and final records.",
    examples: ["FastQC", "BLAST", "samtools", "Python", "R"],
    channels: ["CLI", "Python / R", "Files", "Human review"],
    pipeline: "FASTQ → QC → alignment → variant output → ELN",
  },
  {
    name: "ELN & LIMS",
    description:
      "Send approved results and run details to your LIMS, ELN, or data store.",
    examples: ["LIMS REST", "Benchling", "Facility repositories"],
    channels: ["REST / API", "Files", "Human review"],
    pipeline: "Analysis output → review checkpoint → LIMS / ELN",
  },
  {
    name: "Analytical Chemistry",
    description:
      "Track instrument files, settings, reruns, reviews, and reports.",
    examples: ["Chromeleon", "Empower", "HPLC exports", "Origin"],
    channels: ["Files", "GUI", "API", "Format conversion"],
    pipeline: "Chromatography → processing → exception review → batch record",
  },
  {
    name: "Flow Cytometry & Immunology",
    description:
      "Connect gating results, statistics, figures, reviews, and final records.",
    examples: ["FlowJo", "GraphPad Prism", "LIMS / ELN"],
    channels: ["GUI", "Files", "Human review"],
    pipeline: "FCS → gating → statistics → review → record",
  },
  {
    name: "Data Analysis & Statistics",
    description:
      "Repeat calculations and save the code, settings, versions, and output files.",
    examples: ["Python", "R", "MATLAB", "GraphPad Prism", "SigmaPlot"],
    channels: ["CLI", "Script", "GUI", "Files"],
    pipeline: "Prepared data → analysis → figures → report",
  },
  {
    name: "Molecular Biology",
    description:
      "Connect sequence, structure, and experiment steps with clear inputs and results.",
    examples: ["PyMOL", "BLAST", "Benchling"],
    channels: ["CLI", "API", "GUI", "Files"],
    pipeline: "Sequence / structure → analysis → annotated result",
  },
  {
    name: "Reporting & Export",
    description:
      "Build spreadsheets, slides, reports, and export packages from approved results.",
    examples: ["Excel", "PowerPoint", "PDF", "CSV"],
    channels: ["File export", "Format conversion", "GUI"],
    pipeline: "Reviewed files → report package → approved destination",
  },
  {
    name: "RPA Automation",
    description:
      "Automate desktop tools that have no API and require approval for risky actions.",
    examples: ["GUI steps", "Keyboard input", "Screen checks"],
    channels: ["GUI automation", "Human approval"],
    pipeline: "Validated instruction → controlled UI action → evidence",
  },
  {
    name: "API Connectors",
    description:
      "Connect approved local services and APIs under your access rules.",
    examples: ["REST", "HTTP", "Internal services"],
    channels: ["REST / API", "Policy gate"],
    pipeline: "Workflow step → approved connection → response file",
  },
  {
    name: "File & Data Pipeline",
    description:
      "Watch folders, convert files, keep sample IDs, and move results between tools.",
    examples: ["Filesystem", "HDF5", "CSV", "OME", "Zarr"],
    channels: ["File monitor", "Conversion", "Script"],
    pipeline: "Source file → validation → transform → destination",
  },
  {
    name: "Compliance & Quality",
    description:
      "Add reviews, approvals, exception handling, exports, and audit records to each workflow.",
    examples: ["Audit logs", "Review queues", "Checksums", "Exports"],
    channels: ["Human review", "Audit event", "Policy gate"],
    pipeline: "Workflow event → review → decision → record",
  },
]

export const capabilityFields = [
  "Readiness status",
  "Setup guide",
  "Requirements",
  "Input / output formats",
  "Execution channels",
  "Risk level",
  "GUI and user-input flags",
  "Versioning",
] as const

export const adapterChannels = [
  "CLI execution",
  "GUI automation",
  "Macro generation",
  "REST / API",
  "File monitor",
  "Format conversion",
  "Python / R / MATLAB",
  "Human-in-the-loop",
] as const
