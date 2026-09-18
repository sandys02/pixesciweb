import type { LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  Blocks,
  BookOpenCheck,
  Boxes,
  BrainCircuit,
  CloudOff,
  FileCog,
  FileSearch,
  FileStack,
  FileText,
  Fingerprint,
  FlaskConical,
  History,
  LineChart,
  LockKeyhole,
  Microscope,
  Network,
  RadioTower,
  ScanLine,
  ScanSearch,
  ShieldCheck,
  UserCheck,
  Workflow,
} from "lucide-react"

export const siteUrl = "https://pixesci.com"
export const demoBookingUrl =
  "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true&layout=mobile"

export const categoryLine =
  "The agentic compliance operating system for the Quality Unit."

export const calculatorDisclaimer =
  "These cost figures are PixeSci's own internal illustrative models based on FDA-required remediation scope. They are not FDA-reported company spend, not a prediction for your organization, and not a guarantee that PixeSci prevents these outcomes. Actual costs depend on your operation, your products, and the scope of any compliance issue."

export const remediationScenarios = [
  {
    label: "Smaller-scope remediation",
    range: "$180,000–$540,000",
    description:
      "Illustrative base cost for a narrower FDA-derived remediation scope, before additional OOS review, retain testing, recall, or market-loss costs.",
  },
  {
    label: "Larger-scope remediation",
    range: "$415,000–$1,290,000",
    description:
      "Illustrative base cost for a broader FDA-derived remediation scope, before additional OOS review, retain testing, recall, or market-loss costs.",
  },
] as const

export type NavItem = {
  label: string
  href: string
  description?: string
}

export const platformNavigation: NavItem[] = [
  {
    label: "Agentic Compliance",
    href: "/platform/agents",
    description: "Continuous monitoring and a governed AI copilot.",
  },
  {
    label: "Workflow Automation",
    href: "/platform/workflow-automation",
    description: "Describe the work, review the steps, and run it locally.",
  },
  {
    label: "Laboratory",
    href: "/platform/laboratory",
    description: "Track samples from accessioning to Certificate of Analysis.",
  },
  {
    label: "Quality Management",
    href: "/platform/quality-management",
    description: "Track deviations, CAPA, nonconformances, and quality records.",
  },
  {
    label: "Materials & Products",
    href: "/platform/materials-products",
    description: "Track materials, lots, suppliers, products, and genealogy.",
  },
  {
    label: "Manufacturing Quality",
    href: "/platform/manufacturing-quality",
    description: "Run electronic batch records from dispensing to release.",
  },
  {
    label: "Equipment",
    href: "/platform/equipment",
    description:
      "Track qualification, calibration, and maintenance for every asset.",
  },
  {
    label: "Documents & Training",
    href: "/platform/documents-training",
    description: "Control documents and connect them to GxP training records.",
  },
  {
    label: "Reports & Analytics",
    href: "/platform/reports-analytics",
    description:
      "Check inspection readiness and quality metrics across the platform.",
  },
]

export const primaryNavigation: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    description: "See the whole platform and how every module fits together.",
  },
  {
    label: "Platform",
    href: "/platform/agents",
    description:
      "See every module: agentic compliance, workflow automation, lab, quality, materials, manufacturing.",
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
      { label: "Platform overview", href: "/product" },
      { label: "Integrations", href: "/integrations" },
      { label: "Security", href: "/security" },
      { label: "Compliance", href: "/compliance" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Agentic Compliance", href: "/platform/agents" },
      { label: "Workflow Automation", href: "/platform/workflow-automation" },
      { label: "Laboratory (LIMS)", href: "/platform/laboratory" },
      { label: "Quality Management", href: "/platform/quality-management" },
      { label: "Materials & Products", href: "/platform/materials-products" },
      {
        label: "Manufacturing Quality",
        href: "/platform/manufacturing-quality",
      },
      { label: "Equipment", href: "/platform/equipment" },
      { label: "Documents & Training", href: "/platform/documents-training" },
      { label: "Reports & Analytics", href: "/platform/reports-analytics" },
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
      { label: "Workflow examples", href: "/platform/workflow-automation" },
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

export const platformModules: (FeatureItem & { href: string })[] = [
  {
    title: "Agentic Compliance",
    description:
      "Continuous monitoring, governed recommendations, and evidence you don't have to reconstruct.",
    href: "/platform/agents",
    icon: BrainCircuit,
  },
  {
    title: "Workflow Automation",
    description:
      "Describe the work in plain language, review the steps, and run it locally.",
    href: "/platform/workflow-automation",
    icon: Workflow,
  },
  {
    title: "Laboratory",
    description: "Track samples from accessioning to Certificate of Analysis.",
    href: "/platform/laboratory",
    icon: FlaskConical,
  },
  {
    title: "Quality Management",
    description: "Track deviations, CAPA, nonconformances, and complaints.",
    href: "/platform/quality-management",
    icon: ShieldCheck,
  },
  {
    title: "Materials & Products",
    description: "Track material lots, suppliers, products, and genealogy.",
    href: "/platform/materials-products",
    icon: Boxes,
  },
  {
    title: "Manufacturing Quality",
    description: "Run electronic batch records from dispensing to release.",
    href: "/platform/manufacturing-quality",
    icon: FileCog,
  },
  {
    title: "Equipment",
    description: "Track qualification, calibration, and maintenance.",
    href: "/platform/equipment",
    icon: BadgeCheck,
  },
  {
    title: "Documents & Training",
    description: "Control documents and connect them to training records.",
    href: "/platform/documents-training",
    icon: FileText,
  },
  {
    title: "Reports & Analytics",
    description: "See every open item across your quality system in one view.",
    href: "/platform/reports-analytics",
    icon: LineChart,
  },
]

export const proofPoints = [
  "Continuous monitoring",
  "Governed AI, not autonomous AI",
  "On-prem ready",
  "Hash-chained audit trail",
  "Runs behind your existing systems",
  "Human review on every decision",
] as const

export const whatBreaks: FeatureItem[] = [
  {
    title: "Missing raw records",
    description:
      "Source data goes missing or incomplete, and nobody notices until a review or an inspection asks for it.",
    icon: FileSearch,
  },
  {
    title: "Records that disagree",
    description:
      "Source records, summaries, logs, calculations, and instrument histories tell different stories about the same event.",
    icon: ScanLine,
  },
  {
    title: "Unreconciled reruns",
    description:
      "Aborts, trial runs, reinjections, or repeat testing happen without a documented reason tying them back to the original result.",
    icon: History,
  },
  {
    title: "Weak investigation context",
    description:
      "Out-of-specification results and deviations get closed without the root-cause and CAPA context a reviewer would expect.",
    icon: FileSearch,
  },
  {
    title: "Disconnected equipment state",
    description:
      "Calibration status, equipment condition, temperature, humidity, and environmental readings sit apart from the test they affected.",
    icon: ShieldCheck,
  },
  {
    title: "Missed audit-trail events",
    description:
      "Warnings, user actions, approvals, and exceptions in an audit trail go unreviewed before release, not because no one cares, but because no one is watching continuously.",
    icon: History,
  },
] as const

export const reactiveColumn: FeatureItem[] = [
  {
    title: "Work happens",
    description: "Across instruments, software, and paper.",
    icon: FlaskConical,
  },
  {
    title: "Records scattered",
    description: "Across systems that don't talk to each other.",
    icon: FileStack,
  },
  {
    title: "Manual review",
    description: "A person reconciles what happened, later.",
    icon: ScanSearch,
  },
  {
    title: "Problem discovered",
    description: "Often at release, audit, or inspection.",
    icon: FileSearch,
  },
  {
    title: "Investigation & remediation",
    description: "Expensive, and after the fact.",
    icon: History,
  },
] as const

export const continuousColumn: FeatureItem[] = [
  {
    title: "Connect systems",
    description: "PixeSci reads events from what you already run.",
    icon: Network,
  },
  {
    title: "Agents monitor continuously",
    description:
      "Deterministic rules watch every event, not a sample of them.",
    icon: RadioTower,
  },
  {
    title: "Exceptions flagged early",
    description: "The same patterns regulators cite, caught as they happen.",
    icon: ShieldCheck,
  },
  {
    title: "Human review, always",
    description: "A qualified reviewer decides — the AI only recommends.",
    icon: UserCheck,
  },
  {
    title: "Evidence, continuously",
    description:
      "A hash-chained record, ready before you need it, not assembled after.",
    icon: Fingerprint,
  },
] as const

export const governedAiPrinciples: FeatureItem[] = [
  {
    title: "Clear intended use",
    description:
      "Every agent capability is scoped to a specific job — reading, flagging, or drafting a recommendation — never an open-ended mandate.",
    icon: Blocks,
  },
  {
    title: "Risk-tiered approval",
    description:
      "Higher-risk actions require human approval before they run, tiered by what the action could affect.",
    icon: LockKeyhole,
  },
  {
    title: "No autonomous regulated decisions",
    description:
      "The AI cannot approve, close, release, invalidate, or sign a record — that boundary is enforced in the software, not just written in a policy.",
    icon: ShieldCheck,
  },
  {
    title: "Evidence-grounded recommendations",
    description:
      "Recommendations cite the specific records and rule results behind them, and the AI is designed to decline rather than guess when evidence is missing or conflicting.",
    icon: BookOpenCheck,
  },
  {
    title: "Verifiable audit trail",
    description:
      "Every agent action is recorded in the same hash-chained trail as human actions, and the chain can be verified on demand.",
    icon: Fingerprint,
  },
  {
    title: "Local by default",
    description:
      "AI inference runs on-device by default — no cloud API required for the system to operate.",
    icon: CloudOff,
  },
] as const

export const riskPatterns: FeatureItem[] = [
  {
    title: "Raw data, blank on paper, complete in the summary",
    description:
      "A worksheet or batch record has blank fields, but the summary report shows a complete, passing result.",
    icon: FileSearch,
  },
  {
    title: "An instrument's own history disagrees with the record",
    description:
      "The chromatography or instrument audit trail shows aborts, reinjections, or method changes that the paper record doesn't mention.",
    icon: ScanLine,
  },
  {
    title: "A repeat test with no stated reason",
    description:
      "A test is repeated, and only the passing result is reported, with no documented justification for the repeat.",
    icon: History,
  },
  {
    title: "A deviation closed without root cause",
    description:
      "An out-of-specification result or deviation is closed with a corrective action but no investigation into why it happened.",
    icon: ShieldCheck,
  },
] as const

export const solutionCards = [
  {
    title: "Regulated life sciences",
    href: "/solutions/regulated-life-sciences",
    description:
      "Built for QC and QA teams scaling toward GMP readiness, tech transfer, or their first regulated manufacturing run.",
    icon: FlaskConical,
    examples: "Chromeleon or Empower → LIMS → batch record",
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
    href: "/platform/workflow-automation",
  },
] as const

export const complianceDisclaimer =
  "Teams can track work and produce records for review. Customers still must validate and configure the system, train users, maintain SOPs, and meet their own quality requirements."
