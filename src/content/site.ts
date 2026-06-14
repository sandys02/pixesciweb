import type { LucideIcon } from "lucide-react"
import {
  Boxes,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileStack,
  FlaskConical,
  History,
  Microscope,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Workflow,
} from "lucide-react"

export const siteUrl = "https://pixesci.com"

export type NavItem = {
  label: string
  href: string
  description?: string
}

export const primaryNavigation: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    description: "The orchestration layer, runtime, catalog, and audit system.",
  },
  {
    label: "Solutions",
    href: "/solutions/regulated-life-sciences",
    description: "Workflows for regulated, secure, and shared facilities.",
  },
  {
    label: "Integrations",
    href: "/integrations",
    description: "Capability profiles for the software you already use.",
  },
  {
    label: "Compliance",
    href: "/compliance",
    description: "Execution evidence, review history, and data integrity.",
  },
  {
    label: "Security",
    href: "/security",
    description: "Local-first deployment and policy-controlled connectivity.",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Architecture, workflow, and evaluation guides.",
  },
  {
    label: "Company",
    href: "/company",
    description: "Why Pixesci is building the missing scientific software layer.",
  },
]

export const footerNavigation = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: "/product" },
      { label: "Workflow automation", href: "/workflow-automation" },
      { label: "Integrations", href: "/integrations" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Solutions",
    links: [
      {
        label: "Regulated life sciences",
        href: "/solutions/regulated-life-sciences",
      },
      { label: "Secure research", href: "/solutions/secure-research" },
      { label: "Core facilities", href: "/solutions/core-facilities" },
      { label: "Compliance", href: "/compliance" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resource center", href: "/resources" },
      { label: "Architecture overview", href: "/security" },
      { label: "Workflow examples", href: "/workflow-automation" },
      { label: "Software catalog", href: "/integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Contact", href: "/contact" },
      { label: "Request a demo", href: "/contact" },
    ],
  },
] as const

export type FeatureItem = {
  title: string
  description: string
  icon: LucideIcon
}

export const platformCapabilities: FeatureItem[] = [
  {
    title: "Graph-native workflows",
    description:
      "Author nodes, edges, variables, bindings, and review checkpoints as an executable scientific plan.",
    icon: Workflow,
  },
  {
    title: "Capability catalog",
    description:
      "Describe software requirements, formats, setup, execution channels, and risk before a step runs.",
    icon: Boxes,
  },
  {
    title: "Local execution runtime",
    description:
      "Run workflows against local files and scientific applications within the customer-controlled environment.",
    icon: TerminalSquare,
  },
  {
    title: "Plain-language planning",
    description:
      "Describe the scientific goal in natural language, then review the capability-aware graph before execution.",
    icon: Sparkles,
  },
  {
    title: "Execution history",
    description:
      "Preserve run status, events, parameters, outputs, artifacts, failure context, and a reviewable run summary.",
    icon: History,
  },
  {
    title: "Audit records",
    description:
      "Record actor, action, resource, outcome, timestamp, metadata, checksum, and review state.",
    icon: FileCheck2,
  },
]

export const proofPoints = [
  "Compliance-first",
  "On-prem ready",
  "Graph execution",
  "Audit history",
  "Capability profiles",
] as const

export const problems: FeatureItem[] = [
  {
    title: "Manual handoffs",
    description:
      "Exports, renaming, re-entry, and analyst-specific sequences sit between otherwise capable scientific tools.",
    icon: FileStack,
  },
  {
    title: "Broken lineage",
    description:
      "Source files, parameters, versions, and processing context separate as work moves between applications.",
    icon: Network,
  },
  {
    title: "Review gaps",
    description:
      "Teams reconstruct who ran what, when it changed, and which output reached the final record.",
    icon: ScanSearch,
  },
]

export const solutionCards = [
  {
    title: "Regulated life sciences",
    href: "/solutions/regulated-life-sciences",
    description:
      "Standardize QC and R&D workflows while preserving reviewable execution evidence, audit history, and quality-system context.",
    icon: FlaskConical,
    examples: "FlowJo → Prism → LIMS / Chromeleon → batch record",
  },
  {
    title: "Secure research",
    href: "/solutions/secure-research",
    description:
      "Coordinate local software, HPC outputs, internal repositories, and reproducible analysis without a cloud control plane.",
    icon: ShieldCheck,
    examples: "VASP → VESTA → Origin / EPICS → MATLAB → repository",
  },
  {
    title: "Core facilities",
    href: "/solutions/core-facilities",
    description:
      "Turn proven operator procedures into guided templates that many users can run consistently.",
    icon: Microscope,
    examples: "Acquisition → analysis → review → facility report",
  },
] as const

export const resourceCards = [
  {
    title: "Architecture overview",
    type: "Technical brief",
    description:
      "Understand the desktop interface, localhost backend, local data stores, models, and adapter boundary.",
    href: "/security",
  },
  {
    title: "Compliance workflow guide",
    type: "Evaluation guide",
    description:
      "Review how execution records, metadata, audit events, and human checkpoints support controlled work.",
    href: "/compliance",
  },
  {
    title: "Workflow automation patterns",
    type: "Product guide",
    description:
      "See how intent becomes capability-aware nodes, validated parameters, runtime events, and artifacts.",
    href: "/workflow-automation",
  },
] as const

export const complianceDisclaimer =
  "Pixesci supports compliance-oriented workflows and reviewable execution evidence. Customers remain responsible for validation, configuration, SOPs, training, and use within their quality system."

export const securityHighlights: FeatureItem[] = [
  {
    title: "Deployment control",
    description:
      "Run on a workstation or managed on-prem environment without an external control plane.",
    icon: Building2,
  },
  {
    title: "Policy-gated connectivity",
    description:
      "Block internet-dependent connector tiers in airgapped mode and keep provider credentials in the backend runtime.",
    icon: ShieldCheck,
  },
  {
    title: "Controlled local paths",
    description:
      "Work with explicit directories, local files, profile packs, model packs, and approved internal shares.",
    icon: CheckCircle2,
  },
]
