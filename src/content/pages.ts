// @/content/pages.ts

import type { LucideIcon } from "lucide-react"
import {
  Archive,
  BadgeCheck,
  Blocks,
  BookOpenCheck,
  BrainCircuit,
  CheckCheck,
  ClipboardCheck,
  CloudOff,
  Code2,
  DatabaseBackup,
  FileClock,
  FileCog,
  FileKey2,
  FileSearch,
  FileText,
  Fingerprint,
  FolderLock,
  GitBranch,
  History,
  KeyRound,
  Laptop,
  Library,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  MonitorCog,
  Network,
  PackageCheck,
  PanelTop,
  RadioTower,
  ScanLine,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  Users,
  Variable,
} from "lucide-react"

export type PageFeature = {
  title: string
  description: string
  icon: LucideIcon
}

export type PageSection = {
  eyebrow?: string
  title: string
  description: string | string[]
  layout?: "split" | "stacked"
  features?: PageFeature[]
  bullets?: string[]
  visual?: "workflow" | "audit" | "architecture" | "catalog" | "console" | "templates"
  dark?: boolean
}

export type MarketingPageData = {
  eyebrow: string
  title: string
  description: string
  primaryCta: string
  primaryHref: string
  secondaryCta: string
  secondaryHref: string
  sections: PageSection[]
  finalTitle: string
  finalDescription: string
  finalCta: string
}

export const productPage: MarketingPageData = {
  eyebrow: "Product",
  title: "One orchestration layer across scientific software.",
  description:
    "PixeSci connects scientific software into reviewable, reusable workflows that run within your environment. Every run captures inputs, outputs, parameters, decisions, and execution history in a single traceable record for reproducible and compliant scientific operations.",
  primaryCta: "Request a demo",
  primaryHref: demoBookingUrl,
  secondaryCta: "See workflow automation",
  secondaryHref: "/workflow-automation",
  sections: [
    {
      eyebrow: "Authoring",
      title: "Build the execution plan as a graph.",
      description:
        "Model software steps, dependencies, inputs, outputs, and review points in a visual workflow graph. Teams can inspect the complete execution path before a run and reuse proven processes without rebuilding every handoff.",
      visual: "workflow",
      features: [
        {
          title: "Workflow canvas",
          description: "Map software steps, dependencies, variables, and required inputs in a visual workflow.",
          icon: GitBranch,
        },
        {
          title: "Operator surfaces",
          description: "Keep execution controls, files, notes, previews, and technical tools in the same workspace.",
          icon: PanelTop,
        },
        {
          title: "Reusable templates",
          description: "Browse, configure, run, and save templates for repeatable scientific workflows.",
          icon: Library,
        },
      ],
    },
    {
      eyebrow: "Capability contracts",
      title: "Know what each software step can do before execution.",
      description: [
        "PixeSci describes each connected application through its supported operations, required inputs, expected outputs, setup requirements, and operational constraints. Teams can confirm that a software step is suitable before adding it to a workflow.",
        "Environment checks show whether the required scientific software is available where the workflow will run. Teams can standardize processes while accounting for differences among workstations, instruments, and sites.",
      ],
      visual: "catalog",
      features: [
        {
          title: "Software catalog",
          description: "Review supported applications, operations, file formats, and setup requirements before execution.",
          icon: Blocks,
        },
        {
          title: "Local detection",
          description: "Confirm that required software is available in the target execution environment.",
          icon: MonitorCog,
        },
        {
          title: "Offline distribution",
          description: "Distribute approved software definitions through controlled or offline environments.",
          icon: PackageCheck,
        },
      ],
    },
    {
      eyebrow: "Runtime",
      title: "Execute locally and stream what happens.",
      description:
        "Run workflows close to scientific software and data while monitoring progress, outputs, failures, and required decisions in real time. Controlled steps can pause for operator input or approval before execution continues.",
      visual: "console",
      dark: true,
      features: [
        {
          title: "Execution events",
          description: "Record progress, attempts, duration, failures, outputs, and artifacts throughout each run.",
          icon: RadioTower,
        },
        {
          title: "Safety gates",
          description: "Require approval before controlled actions affect external systems, interfaces, instruments, or files.",
          icon: ShieldCheck,
        },
        {
          title: "Run history",
          description: "Review completed, failed, and interrupted workflow runs with their execution context.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Interface",
      title: "Start in plain language. Continue through validated capabilities.",
      description:
        "Scientists describe what they want to accomplish in plain language. PixeSci AI Agent converts that intent into reviewable workflow decisions based on supported software capabilities, helping teams move from objective to execution without manually orchestrating every step.\n",
      features: [
        {
          title: "Context-aware workspace",
          description: "Keep sessions, tabs, local files, attachments, and software references available during planning.",
          icon: MessageSquareText,
        },
        {
          title: "Local model routing",
          description: "Use private AI-assisted planning options within controlled local or on-prem deployments.",
          icon: BrainCircuit,
        },
        {
          title: "Constrained decisions",
          description: "Translate scientific intent into explicit, capability-aware workflow choices for review.",
          icon: CheckCheck,
        },
      ],
    },
  ],
  finalTitle: "Bring a real workflow. Leave with an execution map.",
  finalDescription:
    "We will map the software, files, review points, deployment constraints, and execution evidence required by your process.",
  finalCta: "Discuss your workflow",
}

export const regulatedPage: MarketingPageData = {
  eyebrow: "Regulated life sciences",
  title: "Traceable execution across QC and R&D software handoffs.",
  description:
    "Standardize multi-tool QC and R&D workflows for biotech, pharma, CRO, and CDMO teams while preserving the execution context, audit history, and review evidence behind each run.",
  primaryCta: "Map a regulated workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "Review compliance workflows",
  secondaryHref: "/compliance",
  sections: [
    {
      title: "Replace reconstruction with a linked execution record.",
      description:
        "Scientific results often move among instrument software, analysis tools, spreadsheets, LIMS or ELN systems, and review queues. PixeSci connects these handoffs in a reusable workflow that preserves inputs, parameters, outputs, responsibilities, and review points throughout the process.",
      visual: "workflow",
      bullets: [
        "FlowJo → GraphPad Prism → LIMS / ELN",
        "Chromeleon or Empower → LIMS → batch record",
        "CellProfiler or ImageJ → statistics → Benchling / review",
        "Mass spectrometry → MaxQuant → R or Python → LIMS",
      ],
    },
    {
      eyebrow: "Operational evidence",
      title: "Make exceptions and reprocessing easier to review.",
      description: [
        "Keep source references, parameters, operator actions, outputs, and documented reasons for change connected to each run. Reviewers can understand what happened without reconstructing the process from disconnected logs and notes.",
        "During deviations, exceptions, or reprocessing, teams can inspect the relevant execution history within their established investigation, validation, and quality procedures.",
      ],
      visual: "audit",
      features: [
        {
          title: "Audit-trail review",
          description: "Review who changed what, when it changed, which resource was affected, and the resulting outcome.",
          icon: FileSearch,
        },
        {
          title: "OOS and OOR context",
          description: "Preserve original results, sequence details, reruns, parameters, change reasons, and review history for investigation.",
          icon: ClipboardCheck,
        },
        {
          title: "Change control",
          description: "Track approved changes to workflow templates, versions, and controlled settings.",
          icon: FileCog,
        },
      ],
    },
    {
      eyebrow: "Controlled deployment",
      title: "Keep execution, data, and records under your control.",
      description: [
        "Deploy PixeSci on scientific workstations or managed on-prem infrastructure so workflow execution stays close to applications, instruments, files, and governed data stores.",
        "Its local-first architecture works within existing network boundaries, access policies, backup procedures, and infrastructure controls without requiring a cloud-hosted execution layer.",
      ],
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Local data paths",
          description: "Run workflows against controlled directories and locally installed scientific applications.",
          icon: FolderLock,
        },
        {
          title: "Review checkpoints",
          description: "Pause high-risk or controlled workflow steps for explicit human approval.",
          icon: UserCheck,
        },
        {
          title: "Validation boundary",
          description: "Keep responsibility for validating configured workflows within the customer’s quality system.",
          icon: BadgeCheck,
        },
      ],
    },
  ],
  finalTitle: "Map the handoffs behind a regulated process.",
  finalDescription:
    "Bring one QC, analytical development, or manufacturing sciences workflow, along with its evidence and review requirements.",
  finalCta: "Request a compliance workflow demo",
}

export const secureResearchPage: MarketingPageData = {
  eyebrow: "Secure research",
  title: "Scientific orchestration without an external cloud control plane.",
  description:
    "Orchestrate local scientific software, HPC outputs, internal repositories, and reproducible analysis within secure, customer-controlled research infrastructure.",
  primaryCta: "Discuss secure deployment",
  primaryHref: demoBookingUrl,
  secondaryCta: "Review architecture",
  secondaryHref: "/security",
  sections: [
    {
      title: "Connect complex research pipelines across local boundaries.",
      description:
        "Turn file-based and software-specific procedures into explicit, reusable workflows that preserve software versions, parameters, processing context, and recorded outputs.",
      visual: "workflow",
      bullets: [
        "VASP → VESTA → OriginPro → HDF5 / SQL",
        "LAMMPS → OVITO → Python",
        "EPICS / Bluesky → Python or MATLAB → facility repository",
        "FASTQ → FastQC → BWA / GATK → ELN",
      ],
    },
    {
      eyebrow: "Airgapped operation",
      title: "Distribute capabilities without depending on the public internet.",
      description:
        "Distribute approved software definitions and AI resources through controlled internal channels. Deployment policies can block workflow integrations that require external connectivity.",
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Offline packages",
          description: "Move approved software and model definitions through controlled internal or offline channels.",
          icon: PackageCheck,
        },
        {
          title: "Policy gates",
          description: "Restrict integrations according to the deployment’s security and connectivity policies.",
          icon: CloudOff,
        },
        {
          title: "Local secrets",
          description: "Keep integration credentials within controlled local runtime configuration.",
          icon: KeyRound,
        },
      ],
    },
    {
      eyebrow: "Reproducibility",
      title: "Preserve enough context to run the work again.",
      description:
        "Keep source references, software versions, parameters, scripts, processing history, and generated artifacts connected so teams can understand, review, and reproduce prior work.",
      features: [
        {
          title: "File lineage",
          description: "Connect source files to processing steps, destinations, outputs, and persistent identifiers.",
          icon: Network,
        },
        {
          title: "Scripted processing",
          description: "Include approved scripts when consistent, repeatable data processing is required.",
          icon: Code2,
        },
        {
          title: "HPC completion",
          description: "Continue downstream workflow steps when approved HPC jobs complete and files become available.",
          icon: ServerCog,
        },
      ],
    },
  ],
  finalTitle: "Fit PixeSci to your controlled research environment.",
  finalDescription:
    "Discuss workstation, on-prem, and airgapped deployment, including capability distribution and internal repository requirements.",
  finalCta: "Discuss secure deployment",
}

export const coreFacilitiesPage: MarketingPageData = {
  eyebrow: "Core facilities",
  title: "Turn proven operator procedures into reusable facility workflows.",
  description:
    "Standardize acquisition, local analysis, review, and reporting across core facility software with guided, reusable workflows and connected run history.",
  primaryCta: "Standardize a facility workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "Explore the platform",
  secondaryHref: "/product",
  sections: [
    {
      title: "Capture the workflow once. Run it consistently.",
      description:
        "Facility managers can define software steps, parameters, operator instructions, local paths, review points, and expected outputs in a reusable workflow template.",
      visual: "templates",
      features: [
        {
          title: "Template center",
          description: "Browse, inspect, configure, run, and save standardized facility workflow templates.",
          icon: Library,
        },
        {
          title: "Guided execution",
          description: "Keep variables, working directories, required inputs, and operator decisions explicit during execution.",
          icon: ListChecks,
        },
        {
          title: "Operator notes",
          description: "Keep practical instructions and process context alongside the workflow graph and run controls.",
          icon: FileText,
        },
      ],
    },
    {
      eyebrow: "Local operations",
      title: "Work with the software already installed at the facility.",
      description:
        "Maintain a shared catalog of supported scientific software while accounting for the applications, versions, and configuration available on each workstation.",
      visual: "catalog",
      features: [
        {
          title: "Local detection",
          description: "Show which supported scientific applications and versions are available on each workstation.",
          icon: ScanLine,
        },
        {
          title: "Working directory",
          description: "Keep source files, intermediate data, and outputs anchored to an explicit local working directory.",
          icon: FolderLock,
        },
        {
          title: "Batch execution",
          description: "Apply consistent, repeatable processing to defined sample or file sets.",
          icon: SlidersHorizontal,
        },
      ],
    },
    {
      eyebrow: "Facility evidence",
      title: "Give operators and reviewers one run history.",
      description:
        "Keep execution events, output artifacts, review checkpoints, operator decisions, and failure context connected to each workflow run.",
      visual: "audit",
      dark: true,
      features: [
        {
          title: "Run history",
          description: "Review run status, duration, completed steps, operator actions, and generated outputs.",
          icon: History,
        },
        {
          title: "Review points",
          description: "Require operator or reviewer confirmation before publication or external handoff.",
          icon: UserCheck,
        },
        {
          title: "Reporting",
          description: "Assemble approved results and artifacts into a consistent facility report or deliverable.",
          icon: FileText,
        },
      ],
    },
  ],
  finalTitle: "Standardize one facility workflow end to end.",
  finalDescription:
    "Map the acquisition software, analysis tools, operator decisions, review steps, and final reports your users depend on.",
  finalCta: "Standardize a facility workflow",
}

export const compliancePage: MarketingPageData = {
  eyebrow: "Compliance and data integrity",
  title: "Build reviewable evidence into scientific execution.",
  description:
    "PixeSci helps teams preserve audit events, metadata, attribution, outcomes, checksums, and review state across multi-tool scientific workflows. These controls support evaluation against ALCOA data-integrity principles but do not make a configured workflow automatically compliant.",
  primaryCta: "Review compliance workflows",
  primaryHref: demoBookingUrl,
  secondaryCta: "See regulated solutions",
  secondaryHref: "/solutions/regulated-life-sciences",
  sections: [
    {
      title: "A connected record of who did what, when, and why.",
      description: [
        "FDA data-integrity guidance emphasizes records that are complete, consistent, accurate, attributable, contemporaneous, and available for review. PixeSci connects actions, responsibilities, timestamps, outcomes, integrity signals, and review states to each workflow run.",
        "This history helps teams reconstruct activity, verify review steps, and prepare evidence for quality processes or inspections. Each organization remains responsible for configuring and validating records against its own requirements.",
      ],
      visual: "audit",
      features: [
        {
          title: "Attributable",
          description: "Associate workflow activity with the relevant user, role, session, and resource context.",
          icon: Fingerprint,
        },
        {
          title: "Contemporaneous",
          description: "Record execution and audit events as scientific work progresses.",
          icon: FileClock,
        },
        {
          title: "Reviewable",
          description: "Filter execution records, inspect supporting metadata, and prepare controlled exports for review.",
          icon: BookOpenCheck,
        },
      ],
    },
    {
      eyebrow: "Data integrity",
      title: "Keep data, metadata, and the execution path together.",
      description:
        "Keep source references, metadata, software versions, parameters, scripts, changes, and processing history connected. Workflow views and run summaries make this context easier to inspect without replacing the underlying records.",
      features: [
        {
          title: "Metadata",
          description: "Preserve timestamps, actors, software context, file formats, parameters, and outputs.",
          icon: FileKey2,
        },
        {
          title: "Versioning",
          description: "Track workflow versions and the software configuration associated with each run.",
          icon: GitBranch,
        },
        {
          title: "Checksums",
          description: "Use checksums and related integrity signals to support inspection of records and files.",
          icon: BadgeCheck,
        },
      ],
    },
    {
      eyebrow: "Controls",
      title: "Put review and access decisions in the workflow path.",
      description: [
        "Human checkpoints, role-based access, backups, retention policies, and local deployment help teams govern how workflows are accessed, reviewed, approved, and preserved.",
        "When configured and validated against the organization’s requirements, these controls support accountable decisions, traceable procedures, and compliance-ready workflow evidence.",
      ],
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Access controls",
          description: "Use authenticated sessions and role-based permissions to govern workflow access.",
          icon: LockKeyhole,
        },
        {
          title: "Review checkpoints",
          description: "Pause workflow execution for explicit approval before high-risk or controlled actions.",
          icon: UserCheck,
        },
        {
          title: "Retention and backup",
          description: "Support customer-controlled backup, retention, recovery, and export procedures.",
          icon: DatabaseBackup,
        },
      ],
    },
  ],
  finalTitle: "Review PixeSci against your workflow and quality system.",
  finalDescription:
    "We will review your evidence requirements, approval points, deployment controls, and customer validation responsibilities.",
  finalCta: "Review compliance workflows",
}

export const securityPage: MarketingPageData = {
  eyebrow: "Security and deployment",
  title: "A local-first runtime designed for deployment control.",
  description:
    "PixeSci provides local-first scientific workflow orchestration that keeps execution, operational data, and software connections within customer-controlled environments by default.",
  primaryCta: "Discuss deployment requirements",
  primaryHref: demoBookingUrl,
  secondaryCta: "Explore the platform",
  secondaryHref: "/product",
  sections: [
    {
      title: "The default control plane is the workstation.",
      description:
        "Workflow data, logs, AI resources, software definitions, and execution services can remain local. Managed deployments can use approved on-prem infrastructure without depending on an externally hosted control plane.",
      visual: "architecture",
      dark: true,
      bullets: [
        "Local desktop operation",
        "Customer-controlled execution services",
        "Local data storage with encryption options",
        "Private AI-assisted planning options",
        "Locally managed software definitions, logs, and audit records",
      ],
    },
    {
      eyebrow: "Controls",
      title: "Keep connectivity, paths, and credentials explicit.",
      description:
        "Define which integrations, directories, users, and internal services each deployment may access. Credentials remain in controlled runtime configuration rather than being exposed through the user interface.",
      layout: "stacked",
      features: [
        {
          title: "Airgap policy",
          description: "Block integrations that require internet access when operating in an airgapped environment.",
          icon: CloudOff,
        },
        {
          title: "Filesystem boundaries",
          description: "Restrict workflow access to approved working directories and controlled local paths.",
          icon: FolderLock,
        },
        {
          title: "Secret handling",
          description: "Keep integration credentials within controlled local runtime configuration.",
          icon: KeyRound,
        },
        {
          title: "Session and RBAC concepts",
          description: "Use authenticated sessions and role-based permissions to govern access.",
          icon: Users,
        },
        {
          title: "Audit logging",
          description: "Record relevant security, workflow, software, file, and compliance-supporting events.",
          icon: FileSearch,
        },
        {
          title: "Backup and retention",
          description: "Support customer-controlled local backup, retention, recovery, and lifecycle policies.",
          icon: Archive,
        },
      ],
    },
    {
      eyebrow: "Deployment shapes",
      title: "Start on one workstation. Operate under managed policy.",
      description: [
        "Begin on a standalone workstation, then extend the same operating model across managed laboratory or enterprise on-prem environments.",
        "Administrators can apply established policies for software versions, access, configuration, data location, retention, backup, and review while keeping execution close to scientific software and data.",
      ],
      features: [
        {
          title: "Standalone workstation",
          description: "Run scientific workflows and retain operational data on a single controlled workstation.",
          icon: Laptop,
        },
        {
          title: "Managed lab install",
          description: "Distribute approved configuration and software definitions across managed laboratory workstations.",
          icon: MonitorCog,
        },
        {
          title: "Enterprise on-prem",
          description: "Connect approved internal shares and services under customer-controlled enterprise policies.",
          icon: ServerCog,
        },
      ],
    },
  ],
  finalTitle: "Review your deployment boundary with PixeSci.",
  finalDescription:
    "Discuss workstation policies, on-prem services, airgapped operation, encryption options, access controls, and offline package distribution.",
  finalCta: "Discuss deployment requirements",
}

export const workflowAutomationPage: MarketingPageData = {
  eyebrow: "Workflow automation",
  title: "Describe the work. Review the graph. Execute with evidence.",
  description:
    "Turn plain-language scientific intent into capability-aware workflow graphs, then review controlled actions, monitor local execution, preserve run evidence, and reuse proven processes.",
  primaryCta: "See a workflow demo",
  primaryHref: demoBookingUrl,
  secondaryCta: "Explore integrations",
  secondaryHref: "/integrations",
  sections: [
    {
      title: "Build the workflow around real scientific work.",
      description:
        "Bring software steps, files, variables, notes, previews, and technical tools into one visual workflow environment. Teams can inspect dependencies, required inputs, and expected outputs before execution.",
      visual: "workflow",
      features: [
        {
          title: "Nodes and edges",
          description: "Represent software operations, control logic, human decisions, and processing steps explicitly.",
          icon: GitBranch,
        },
        {
          title: "Connected inputs and outputs",
          description: "Connect each step’s inputs and outputs while preserving file and execution context.",
          icon: Variable,
        },
        {
          title: "Capability validation",
          description: "Validate software capabilities, step requirements, and configuration before execution.",
          icon: CheckCheck,
        },
      ],
    },
    {
      eyebrow: "Execution",
      title: "Stream progress and finish with a reviewable run summary.",
      description:
        "Monitor status, timing, outputs, errors, approvals, and controlled actions as work progresses. Each run produces a connected execution summary for review, troubleshooting, and reproducibility.",
      visual: "console",
      dark: true,
      features: [
        {
          title: "Live events",
          description: "Monitor workflow status, step progress, and failures through secure live updates.",
          icon: RadioTower,
        },
        {
          title: "Artifacts",
          description: "Keep generated files, intermediate data, and final outputs connected to the originating run.",
          icon: FileText,
        },
        {
          title: "Execution history",
          description: "Inspect prior workflow runs without reconstructing their history from disconnected folders and logs.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Control",
      title: "Make human review part of the graph.",
      description:
        "Workflow actions involving instruments, external systems, interfaces, or files can pause for explicit approval. AI-assisted plans remain bounded by supported software capabilities and operator review.",
      visual: "audit",
      features: [
        {
          title: "Human steps",
          description: "Request operator decisions, confirmation, or domain-specific review within the workflow.",
          icon: UserCheck,
        },
        {
          title: "Safety gates",
          description: "Record approval decisions before high-risk or controlled actions continue.",
          icon: ShieldCheck,
        },
        {
          title: "Reusable templates",
          description: "Save a proven workflow graph as a template for consistent future execution.",
          icon: Library,
        },
      ],
    },
  ],
  finalTitle: "See your scientific workflow as an executable graph.",
  finalDescription:
    "Bring your current SOP, scientific software stack, file flow, and approval points. We will map them into an executable workflow.",
  finalCta: "See a workflow demo",
}
import { demoBookingUrl } from "@/content/site"
