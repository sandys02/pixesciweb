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
export const demoBookingUrl =
  "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true&layout=mobile"

export type NavItem = {
  label: string
  href: string
  description?: string
}

export const primaryNavigation: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    description: "Connect tools, automate work, and track every run.",
  },
  {
    label: "Solutions",
    href: "/solutions/regulated-life-sciences",
    description: "Run clear workflows in regulated and secure labs.",
  },
  {
    label: "Integrations",
    href: "/integrations",
    description: "Connect the scientific software you already use.",
  },
  {
    label: "Compliance",
    href: "/compliance",
    description: "Track actions, reviews, changes, and results.",
  },
  {
    label: "Security",
    href: "/security",
    description: "Keep software, data, and access under your control.",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Read clear guides about setup, workflows, and review.",
  },
  {
    label: "Company",
    href: "/company",
    description: "Meet the team connecting scientific software.",
  },
]

export const footerNavigation = [
  {
    title: "Product",
    links: [
      { label: "Connect your software", href: "/product" },
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
      { label: "Deployment controls", href: "/security" },
      { label: "Workflow examples", href: "/workflow-automation" },
      { label: "Software catalog", href: "/integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Privacy", href: "/privacy" },
      { label: "Request a demo", href: demoBookingUrl },
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
    title: "Visual workflows",
    description:
      "Build each process as connected steps with inputs, decisions, and review points.",
    icon: Workflow,
  },
  {
    title: "Software catalog",
    description:
      "Check supported tools, required files, review points, and local availability before a run.",
    icon: Boxes,
  },
  {
    title: "Run locally",
    description:
      "Run workflows with local files and software inside your own environment.",
    icon: TerminalSquare,
  },
  {
    title: "Plain-language control",
    description: "Talk to your lab! Review the steps before they run.",
    icon: Sparkles,
  },
  {
    title: "Execution history",
    description:
      "Track each run, including settings, files, results, errors, and decisions.",
    icon: History,
  },
  {
    title: "Audit records",
    description:
      "Record who did what, when they did it, what changed, and what happened.",
    icon: FileCheck2,
  },
]

export const platformOverviewSteps: FeatureItem[] = [
  {
    title: "Describe the work",
    description:
      "Start with a plain-language request, SOP, file set, or repeated handoff.",
    icon: Sparkles,
  },
  {
    title: "Review the workflow",
    description:
      "Check the software steps, required inputs, settings, limits, and review points before anything runs.",
    icon: Workflow,
  },
  {
    title: "Run locally",
    description:
      "Execute the workflow on approved workstations or customer-controlled servers close to the data.",
    icon: TerminalSquare,
  },
  {
    title: "Track the record",
    description:
      "Keep actions, files, settings, decisions, approvals, errors, and results with the run.",
    icon: History,
  },
]

export const connectedLabBenefits: FeatureItem[] = [
  {
    title: "Fewer manual handoffs",
    description:
      "Reduce copy, paste, renaming, transcription, and re-entry work between scientific tools.",
    icon: FileStack,
  },
  {
    title: "Clearer data movement",
    description:
      "Move files and results between instruments, analysis tools, LIMS, ELN, reports, and reviewers with context intact.",
    icon: Network,
  },
  {
    title: "Reusable workflow practice",
    description:
      "Save proven procedures so teams can repeat the same process across operators, workstations, and sites.",
    icon: CheckCircle2,
  },
  {
    title: "Review-ready history",
    description:
      "Give technical and quality teams a single place to inspect runs, changes, approvals, and results.",
    icon: ScanSearch,
  },
  {
    title: "Lower integration risk",
    description:
      "Connect tools through controlled workflows instead of relying on fragile point-to-point handoffs.",
    icon: ShieldCheck,
  },
  {
    title: "Local deployment control",
    description:
      "Keep workflow execution, data, credentials, and approved software access inside your environment.",
    icon: Building2,
  },
]

export const proofPoints = [
  "Compliance tracking",
  "On-prem ready",
  "Visual workflows",
  "Audit history",
  "Software connections",
  "Human review",
] as const

export const problems: FeatureItem[] = [
  {
    title: "Manual handoffs",
    description:
      "Teams export, rename, copy, and re-enter data as work moves between tools.",
    icon: FileStack,
  },
  {
    title: "Lost file history",
    description:
      "Files, settings, versions, and results lose their link as work moves between apps.",
    icon: Network,
  },
  {
    title: "Review gaps",
    description:
      "Reviewers must piece together who ran each step, what changed, and which result was final.",
    icon: ScanSearch,
  },
]

export const solutionCards = [
  {
    title: "Regulated life sciences",
    href: "/solutions/regulated-life-sciences",
    description:
      "Connect QC and R&D tools, automate handoffs, and keep a clear record of every run.",
    icon: FlaskConical,
    examples: "FlowJo → Prism → LIMS / Chromeleon → batch record",
  },
  {
    title: "Secure research",
    href: "/solutions/secure-research",
    description:
      "Connect local software, HPC jobs, and internal data without relying on a cloud service.",
    icon: ShieldCheck,
    examples: "VASP → VESTA → Origin / EPICS → MATLAB → repository",
  },
  {
    title: "Core facilities",
    href: "/solutions/core-facilities",
    description:
      "Save proven procedures as guided workflows that every operator can follow.",
    icon: Microscope,
    examples: "Acquisition → analysis → review → facility report",
  },
] as const

export const resourceCards = [
  {
    title: "Architecture overview",
    type: "Technical brief",
    description:
      "See how your workflows stay close to local data, models, and lab software.",
    href: "/security",
  },
  {
    title: "Compliance workflow guide",
    type: "Evaluation guide",
    description:
      "Check how runs, changes, approvals, and records stay ready for review.",
    href: "/compliance",
  },
  {
    title: "Workflow automation patterns",
    type: "Product guide",
    description:
      "See how a plain request becomes checked steps, live updates, and saved results.",
    href: "/workflow-automation",
  },
] as const

export const complianceDisclaimer =
  "Teams can track work and produce records for review. Customers still must validate and configure the system, train users, maintain SOPs, and meet their own quality requirements."

export const securityHighlights: FeatureItem[] = [
  {
    title: "Deployment control",
    description:
      "Run workflows on a workstation or your own servers without an outside cloud service.",
    icon: Building2,
  },
  {
    title: "Controlled connections",
    description:
      "Choose which tools can connect, block internet access, and keep passwords in the local service.",
    icon: ShieldCheck,
  },
  {
    title: "Controlled local paths",
    description:
      "Limit workflows to approved folders, files, models, and internal storage.",
    icon: CheckCircle2,
  },
]
