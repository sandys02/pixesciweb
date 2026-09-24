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
    name: "Chromatography Data Systems",
    description:
      "Keep runs, reinjections, methods, and results tied together so a reviewer can follow what happened. Direct connectors for named chromatography data systems are on our integration roadmap. Ask us where your specific system sits.",
    examples: ["Empower", "Chromeleon", "OpenLab CDS", "HPLC / UPLC exports"],
    outcomes: [
      "Linked instrument files",
      "Reruns explained",
      "Batch-ready records",
    ],
    workflow: "Instrument run -> review -> record",
  },
  {
    name: "QC Instruments & Equipment Data",
    description:
      "Bring balance, pH meter, qPCR, and plate reader data into the record without retyping it.",
    examples: ["Balances", "pH meters", "qPCR", "Plate readers", "CSV exports"],
    outcomes: ["No re-entry", "Bad data caught on arrival", "Traceable results"],
    workflow: "Instrument output -> check -> record",
  },
  {
    name: "LIMS & ELN",
    description:
      "Keep samples, tests, and results moving between the systems your lab already relies on.",
    examples: ["LabWare", "STARLIMS", "Benchling", "Spreadsheets"],
    outcomes: ["Less re-entry", "Connected records", "Clear review handoffs"],
    workflow: "Result -> review -> LIMS / ELN update",
  },
  {
    name: "Quality Management (QMS)",
    description:
      "Turn a flagged exception into a deviation, CAPA, or investigation without re-entering the details.",
    examples: ["MasterControl", "Veeva Vault QMS", "ETQ", "Other eQMS platforms"],
    outcomes: [
      "Exceptions become records",
      "Complete case context",
      "Fewer dropped handoffs",
    ],
    workflow: "Exception -> deviation -> investigation -> CAPA",
  },
  {
    name: "Environmental Monitoring",
    description:
      "Connect temperature, humidity, pressure, and particle readings to the batches and tests they affect.",
    examples: [
      "Temperature and humidity monitors",
      "Particle counters",
      "Cleanroom monitoring",
      "Stability chambers",
    ],
    outcomes: [
      "Excursions caught early",
      "Readings linked to batches",
      "Investigation-ready trends",
    ],
    workflow: "Reading -> excursion check -> quality workflow",
  },
  {
    name: "Equipment & Calibration",
    description:
      "Keep calibration status and maintenance history next to the test they support.",
    examples: [
      "Calibration records",
      "Maintenance logs",
      "Asset registers",
      "CMMS",
    ],
    outcomes: [
      "Status always visible",
      "Out-of-tolerance flagged",
      "Audit-ready history",
    ],
    workflow: "Calibration due -> check -> asset status",
  },
  {
    name: "Documents & Training",
    description:
      "Keep SOPs, revisions, and training records connected so you know who is qualified to do what.",
    examples: [
      "SOPs",
      "Document control",
      "Training records",
      "Electronic signatures",
    ],
    outcomes: [
      "Current versions only",
      "Training linked to revisions",
      "Clear approvals",
    ],
    workflow: "SOP revision -> training -> effective",
  },
  {
    name: "Partners & Contract Labs",
    description:
      "Bring results and certificates from contractors and outside labs into the same record, so nobody rebuilds context by hand.",
    examples: [
      "Contract labs",
      "CDMO / CMO data",
      "Certificates of analysis",
      "PDF / CSV reports",
    ],
    outcomes: [
      "One record across partners",
      "Less rework at handoff",
      "Complete evidence",
    ],
    workflow: "Partner report -> intake -> review -> record",
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
