import type { LucideIcon } from "lucide-react"
import {
  Blocks,
  BookOpenCheck,
  CloudOff,
  FileSearch,
  FileStack,
  Fingerprint,
  History,
  LockKeyhole,
  MessageSquareText,
  Network,
  RadioTower,
  ScanLine,
  ScanSearch,
  ShieldCheck,
  UserCheck,
} from "lucide-react"

export const siteUrl = "https://pixesci.com"
export const demoBookingUrl =
  "https://cal.com/pixesci/30min?user=pixesci&overlayCalendar=true&layout=mobile"

export const tagline = "Talk to your Lab!"

export const categoryLine =
  "The autonomous quality control operating system for regulated life sciences."

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

export const solutionsNavigation: NavItem[] = [
  {
    label: "Solutions overview",
    href: "/solutions",
    description: "See how the four products fit together.",
  },
  {
    label: "Quality Core",
    href: "/solutions#quality-core",
    description:
      "One connected record for samples, deviations, batches, equipment, and documents.",
  },
  {
    label: "Integrations",
    href: "/integrations",
    description: "Connect the instruments and software you already use.",
  },
  {
    label: "Agentic Automation",
    href: "/platform/workflow-automation",
    description: "Describe the work, review the steps, and let it run.",
  },
  {
    label: "Continuous Quality Monitoring",
    href: "/platform/agents",
    description: "Catch problems while they're still small.",
  },
]

export const primaryNavigation: NavItem[] = [
  {
    label: "Solutions",
    href: "/solutions",
    description: "Four products that connect your lab and keep the record.",
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
    title: "Solutions",
    links: [
      { label: "Solutions overview", href: "/solutions" },
      { label: "Quality Core", href: "/solutions#quality-core" },
      { label: "Integrations", href: "/integrations" },
      { label: "Agentic Automation", href: "/platform/workflow-automation" },
      { label: "Continuous Quality Monitoring", href: "/platform/agents" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resource center", href: "/resources" },
      {
        label: "Regulated life sciences",
        href: "/solutions/regulated-life-sciences",
      },
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

export const heroMessages = [
  "We help you reduce expensive errors and wasted time operating fragmented, retrospective quality control systems.",
  "We bring your fragmented partners together, so you never have to rebuild context between contractors.",
  "We keep your regulated team one step ahead of AI, without worrying about learning bandwidth.",
] as const

export const proofPoints = [
  "Problems caught early",
  "Every decision stays yours",
  "Fast deployment",
  "Evidence always in hand",
  "Works with what you already use",
  "Your data stays on your site",
] as const

export const painPoints: FeatureItem[] = [
  {
    title: "You move data between systems that don't talk",
    description:
      "Instruments, CDS, LIMS, QMS, spreadsheets. You are the copy and paste in the middle.",
    icon: FileStack,
  },
  {
    title: "You rebuild context at every handoff",
    description:
      "Between teams and between contractors, you re-explain what happened, again.",
    icon: History,
  },
  {
    title: "You check conditions and chase approvals by hand",
    description:
      "Environmental readings, calibration status, sign-offs. All manual, all on you.",
    icon: ScanSearch,
  },
  {
    title: "You piece together what happened, after the fact",
    description:
      "When a reviewer or auditor asks, you start digging through five systems.",
    icon: FileSearch,
  },
] as const

export const stakesLosers: FeatureItem[] = [
  {
    title: "Find gaps at release, audit, or inspection",
    description: "By then, the fix is an investigation.",
    icon: FileSearch,
  },
  {
    title: "Lose weeks to rework and batch holds",
    description:
      "Every disconnected record becomes a reconstruction project.",
    icon: History,
  },
  {
    title: "Watch a small team drown in reconciliation",
    description:
      "Your best people spend their days moving data between systems.",
    icon: FileStack,
  },
  {
    title: "Put timelines and revenue at risk",
    description: "Delayed release and slower market access follow.",
    icon: ScanSearch,
  },
] as const

export const stakesWinners: FeatureItem[] = [
  {
    title: "Catch problems while they're small",
    description: "Exceptions reach the right person as they happen.",
    icon: RadioTower,
  },
  {
    title: "Release and review on schedule",
    description: "The evidence is already there when the reviewer asks.",
    icon: Fingerprint,
  },
  {
    title: "Walk into audits with the record connected",
    description: "Every run, record, and exception is already linked.",
    icon: Network,
  },
  {
    title: "Do more with the team you have",
    description:
      "PixeSci does the watching and the connecting. You make the decisions.",
    icon: UserCheck,
  },
] as const

export const promisedLand: FeatureItem[] = [
  {
    title: "Ask your lab what's happening",
    description:
      "Talk to your lab in plain language and get an answer, instead of pulling data from five systems.",
    icon: MessageSquareText,
  },
  {
    title: "Problems surface while they're small",
    description:
      "You hear about an exception when it happens, not at release or inspection.",
    icon: RadioTower,
  },
  {
    title: "The evidence is already connected",
    description:
      "When someone asks what happened, every record, run, and exception is already linked.",
    icon: Network,
  },
  {
    title: "Your team decides, every time",
    description:
      "PixeSci does the watching and the connecting. Every approval, closure, release, and signature stays with a qualified person.",
    icon: UserCheck,
  },
] as const

export const governedAiPrinciples: FeatureItem[] = [
  {
    title: "You set what PixeSci can do",
    description:
      "Every capability is scoped to one job: reading, flagging, or drafting a recommendation. Never an open-ended mandate.",
    icon: Blocks,
  },
  {
    title: "Bigger actions need your approval",
    description:
      "The riskier the action, the more approval it needs before it runs.",
    icon: LockKeyhole,
  },
  {
    title: "No regulated decision without you",
    description:
      "PixeSci never approves, closes, releases, invalidates, or signs a record on its own. That limit is enforced in the software, not just written in a policy.",
    icon: ShieldCheck,
  },
  {
    title: "Answers you can check",
    description:
      "Every recommendation points to the records and results behind it, and PixeSci declines to guess when evidence is missing or conflicting.",
    icon: BookOpenCheck,
  },
  {
    title: "Nothing happens off the record",
    description:
      "Every action PixeSci takes lands in the same verifiable audit trail as your team's, and you can check that trail any time.",
    icon: Fingerprint,
  },
  {
    title: "Stays on your site",
    description:
      "PixeSci and its AI run on your own hardware by default. No cloud service required.",
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

export const complianceDisclaimer =
  "Teams can track work and produce records for review. Customers still must validate and configure the system, train users, maintain SOPs, and meet their own quality requirements."
