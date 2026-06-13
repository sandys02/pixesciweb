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
      "Connect acquisition outputs to image processing, quantitative analysis, statistics, and review.",
    examples: ["ImageJ / Fiji", "CellProfiler", "QuPath", "OMERO", "Napari"],
    channels: ["Macro", "Python", "GUI", "File monitor"],
    pipeline: "Microscope output → segmentation → statistics → review",
  },
  {
    name: "Bioinformatics & Omics",
    description:
      "Coordinate command-line tools, scripts, reference data, sample identifiers, and result registration.",
    examples: ["FastQC", "BLAST", "samtools", "Python", "R"],
    channels: ["CLI", "Python / R", "Files", "Human review"],
    pipeline: "FASTQ → QC → alignment → variant output → ELN",
  },
  {
    name: "ELN & LIMS",
    description:
      "Move structured results and execution context into systems of record through approved interfaces.",
    examples: ["LIMS REST", "Benchling", "Facility repositories"],
    channels: ["REST / API", "Files", "Human review"],
    pipeline: "Analysis output → review checkpoint → LIMS / ELN",
  },
  {
    name: "Analytical Chemistry",
    description:
      "Preserve instrument output, processing parameters, reprocessing context, and downstream reporting.",
    examples: ["Chromeleon", "Empower", "HPLC exports", "Origin"],
    channels: ["Files", "GUI", "API", "Format conversion"],
    pipeline: "Chromatography → processing → exception review → batch record",
  },
  {
    name: "Flow Cytometry & Immunology",
    description:
      "Link gating outputs, statistics, figures, review decisions, and record destinations.",
    examples: ["FlowJo", "GraphPad Prism", "LIMS / ELN"],
    channels: ["GUI", "Files", "Human review"],
    pipeline: "FCS → gating → statistics → review → record",
  },
  {
    name: "Data Analysis & Statistics",
    description:
      "Run repeatable calculations and preserve code, variables, versions, and produced artifacts.",
    examples: ["Python", "R", "MATLAB", "GraphPad Prism", "SigmaPlot"],
    channels: ["CLI", "Script", "GUI", "Files"],
    pipeline: "Prepared data → analysis → figures → report",
  },
  {
    name: "Molecular Biology",
    description:
      "Coordinate sequence, structure, and experimental analysis steps with explicit inputs and outputs.",
    examples: ["PyMOL", "BLAST", "Benchling"],
    channels: ["CLI", "API", "GUI", "Files"],
    pipeline: "Sequence / structure → analysis → annotated result",
  },
  {
    name: "Reporting & Export",
    description:
      "Assemble approved outputs into spreadsheets, presentations, reports, and durable export packages.",
    examples: ["Excel", "PowerPoint", "PDF", "CSV"],
    channels: ["File export", "Format conversion", "GUI"],
    pipeline: "Reviewed artifacts → report package → controlled destination",
  },
  {
    name: "RPA Automation",
    description:
      "Automate desktop software where APIs are unavailable, with explicit risk and user-input flags.",
    examples: ["GUI steps", "Keyboard input", "Screen checks"],
    channels: ["GUI automation", "Human approval"],
    pipeline: "Validated instruction → controlled UI action → evidence",
  },
  {
    name: "API Connectors",
    description:
      "Call approved local or on-prem services through profile-defined contracts and policy gates.",
    examples: ["REST", "HTTP", "Internal services"],
    channels: ["REST / API", "Policy gate"],
    pipeline: "Workflow node → connector contract → response artifact",
  },
  {
    name: "File & Data Pipeline",
    description:
      "Watch directories, convert formats, preserve identifiers, and route outputs between tools.",
    examples: ["Filesystem", "HDF5", "CSV", "OME", "Zarr"],
    channels: ["File monitor", "Conversion", "Script"],
    pipeline: "Source file → validation → transform → destination",
  },
  {
    name: "Compliance & Quality",
    description:
      "Add review, exception, approval, export, and audit concepts around scientific execution.",
    examples: ["Audit logs", "Review queues", "Checksums", "Exports"],
    channels: ["Human review", "Audit event", "Policy gate"],
    pipeline: "Execution event → review → disposition → record",
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
