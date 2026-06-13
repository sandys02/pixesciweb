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
    "Pixesci turns scientific intent into reviewable, reusable workflows that run close to your software and data, with outputs, decisions, and execution history kept together.",
  primaryCta: "Request a demo",
  primaryHref: "/contact",
  secondaryCta: "See workflow automation",
  secondaryHref: "/workflow-automation",
  sections: [
    {
      eyebrow: "Authoring",
      title: "Build the execution plan as a graph.",
      description:
        "Model software steps, dependencies, inputs, outputs, and review points in a visual graph. Teams can inspect the full execution path before running it and reuse proven workflows without rebuilding each handoff.",
      visual: "workflow",
      features: [
        {
          title: "Workflow canvas",
          description: "Map software steps, dependencies, variables, and required inputs.",
          icon: GitBranch,
        },
        {
          title: "Operator surfaces",
          description: "Keep execution, files, notes, previews, and technical tools in context.",
          icon: PanelTop,
        },
        {
          title: "Reusable templates",
          description: "Browse, filter, instantiate, and save workflow templates.",
          icon: Library,
        },
      ],
    },
    {
      eyebrow: "Capability contracts",
      title: "Know what each software step can do before execution.",
      description: [
        "Pixesci describes each connected application in terms of supported work, required inputs, expected outputs, setup needs, and operational constraints. Teams can review whether a step is suitable before adding it to an execution path.",
        "Environment checks show whether the required software is available where the workflow will run. This helps teams standardize workflows while accounting for differences between workstations, instruments, and sites.",
      ],
      visual: "catalog",
      features: [
        {
          title: "Software catalog",
          description: "Review supported applications, operations, formats, and setup needs.",
          icon: Blocks,
        },
        {
          title: "Local detection",
          description: "Confirm software availability in the target execution environment.",
          icon: MonitorCog,
        },
        {
          title: "Offline distribution",
          description: "Distribute approved software definitions in controlled environments.",
          icon: PackageCheck,
        },
      ],
    },
    {
      eyebrow: "Runtime",
      title: "Execute locally and stream what happens.",
      description:
        "Run workflows close to scientific software and data while monitoring progress, outputs, failures, and required decisions. Controlled steps can pause for operator input or approval before execution continues.",
      visual: "console",
      dark: true,
      features: [
        {
          title: "Execution events",
          description: "Progress, attempts, duration, failures, outputs, and artifacts.",
          icon: RadioTower,
        },
        {
          title: "Safety gates",
          description: "Approval decisions for external, GUI, instrument, or filesystem writes.",
          icon: ShieldCheck,
        },
        {
          title: "Run history",
          description: "Review completed, failed, and interrupted workflow executions.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Interface",
      title: "Start in plain language. Continue through validated capabilities.",
      description:
        "Scientists can describe a goal without first mastering every application sequence. Pixesci turns that intent into explicit workflow choices that remain grounded in supported software capabilities and subject to operator review.",
      features: [
        {
          title: "Context-aware workspace",
          description: "Sessions, tabs, local files, attachments, and software references.",
          icon: MessageSquareText,
        },
        {
          title: "Local model routing",
          description: "Support private AI-assisted planning within controlled deployments.",
          icon: BrainCircuit,
        },
        {
          title: "Constrained decisions",
          description: "Turn intent into explicit, reviewable workflow choices.",
          icon: CheckCheck,
        },
      ],
    },
  ],
  finalTitle: "Bring a real workflow. Leave with an execution map.",
  finalDescription:
    "We will map the software, files, review points, deployment constraints, and evidence your process needs.",
  finalCta: "Discuss your workflow",
}

export const regulatedPage: MarketingPageData = {
  eyebrow: "Regulated life sciences",
  title: "Traceable execution across QC and R&D software handoffs.",
  description:
    "Use plain-language planning to standardize multi-tool workflows for biotech, pharma, CRO, and CDMO teams while preserving the context reviewers need to inspect what happened.",
  primaryCta: "Map a regulated workflow",
  primaryHref: "/contact",
  secondaryCta: "Review compliance workflows",
  secondaryHref: "/compliance",
  sections: [
    {
      title: "Replace reconstruction with a linked execution record.",
      description:
        "Scientific results often cross instrument software, analysis tools, spreadsheets, LIMS or ELN, and review queues. Pixesci connects those handoffs into a reusable workflow that preserves inputs, parameters, outputs, responsibilities, and review points across the process lifecycle.",
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
        "Keep source references, parameters, operator actions, outputs, and documented change reasons connected to each run. Reviewers gain a clearer view of what happened without piecing together disconnected logs and notes.",
        "For deviations, exceptions, or reprocessing, teams can inspect the relevant execution history within their established investigation, validation, and quality procedures.",
      ],
      visual: "audit",
      features: [
        {
          title: "Audit-trail review",
          description: "Who changed what, when, on which resource, and with what outcome.",
          icon: FileSearch,
        },
        {
          title: "OOS and OOR context",
          description: "Preserve original results, sequence, reruns, parameters, change reasons, and review history for investigation.",
          icon: ClipboardCheck,
        },
        {
          title: "Change control",
          description: "Track approved changes to workflow templates and settings.",
          icon: FileCog,
        },
      ],
    },
    {
      eyebrow: "Controlled deployment",
      title: "Keep the runtime close to the software and data.",
      description: [
        "Deploy Pixesci on scientific workstations or managed on-prem infrastructure so execution stays close to applications, instruments, files, and governed data stores.",
        "The local-first architecture fits existing network boundaries, access policies, backup procedures, and infrastructure controls without requiring a cloud-hosted execution layer.",
      ],
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Local data paths",
          description: "Work with controlled directories and local scientific applications.",
          icon: FolderLock,
        },
        {
          title: "Review checkpoints",
          description: "Pause high-risk steps for explicit human approval.",
          icon: UserCheck,
        },
        {
          title: "Validation boundary",
          description: "Customers validate configured workflows under their quality system.",
          icon: BadgeCheck,
        },
      ],
    },
  ],
  finalTitle: "Map the handoffs behind a regulated process.",
  finalDescription:
    "Bring one QC, analytical development, or manufacturing sciences workflow and its review requirements.",
  finalCta: "Request a compliance workflow demo",
}

export const secureResearchPage: MarketingPageData = {
  eyebrow: "Secure research",
  title: "Scientific orchestration without an external cloud control plane.",
  description:
    "Coordinate local software, HPC outputs, internal repositories, and reproducible analysis in controlled research infrastructure.",
  primaryCta: "Discuss secure deployment",
  primaryHref: "/contact",
  secondaryCta: "Review architecture",
  secondaryHref: "/security",
  sections: [
    {
      title: "Connect complex research pipelines across local boundaries.",
      description:
        "Turn file-based and software-specific procedures into explicit, reusable workflows that preserve versions, parameters, processing context, and registered outputs.",
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
        "Distribute approved software definitions and AI resources through controlled internal channels. Deployment policies can prevent workflows from using integrations that require external connectivity.",
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Offline packages",
          description: "Move approved software and model definitions through controlled channels.",
          icon: PackageCheck,
        },
        {
          title: "Policy gates",
          description: "Restrict integrations according to deployment and connectivity policy.",
          icon: CloudOff,
        },
        {
          title: "Local secrets",
          description: "Keep integration credentials within controlled local configuration.",
          icon: KeyRound,
        },
      ],
    },
    {
      eyebrow: "Reproducibility",
      title: "Preserve enough context to run the work again.",
      description:
        "Keep source references, software versions, parameters, scripts, processing history, and produced artifacts connected so teams can understand and reproduce prior work.",
      features: [
        {
          title: "File lineage",
          description: "Connect source files, processing steps, destinations, and identifiers.",
          icon: Network,
        },
        {
          title: "Scripted processing",
          description: "Include approved scripts where repeatable processing matters.",
          icon: Code2,
        },
        {
          title: "HPC completion",
          description: "Continue the pipeline when approved jobs and files become available.",
          icon: ServerCog,
        },
      ],
    },
  ],
  finalTitle: "Fit Pixesci to your controlled research environment.",
  finalDescription:
    "Discuss workstation, on-prem, airgapped, profile distribution, and internal repository requirements.",
  finalCta: "Discuss secure deployment",
}

export const coreFacilitiesPage: MarketingPageData = {
  eyebrow: "Core facilities",
  title: "Turn proven operator procedures into reusable facility workflows.",
  description:
    "Give users a guided path through acquisition, local analysis, review, and reporting without rebuilding every handoff from scratch.",
  primaryCta: "Standardize a facility workflow",
  primaryHref: "/contact",
  secondaryCta: "Explore the platform",
  secondaryHref: "/product",
  sections: [
    {
      title: "Capture the workflow once. Run it consistently.",
      description:
        "Facility managers can define software steps, parameters, operator notes, local paths, review points, and expected outputs as a reusable template.",
      visual: "templates",
      features: [
        {
          title: "Template center",
          description: "Browse, filter, inspect, instantiate, and save facility workflows.",
          icon: Library,
        },
        {
          title: "Guided execution",
          description: "Keep variables, working directories, and required inputs explicit.",
          icon: ListChecks,
        },
        {
          title: "Operator notes",
          description: "Keep practical context next to the graph and execution surfaces.",
          icon: FileText,
        },
      ],
    },
    {
      eyebrow: "Local operations",
      title: "Work with the software already installed at the facility.",
      description:
        "Maintain a shared view of supported software while accounting for the applications, versions, and setup available on each workstation.",
      visual: "catalog",
      features: [
        {
          title: "Local detection",
          description: "Show which supported applications are available on each workstation.",
          icon: ScanLine,
        },
        {
          title: "Working directory",
          description: "Keep source files and outputs anchored to an explicit local context.",
          icon: FolderLock,
        },
        {
          title: "Batch execution",
          description: "Apply repeatable processing to defined sample or file sets.",
          icon: SlidersHorizontal,
        },
      ],
    },
    {
      eyebrow: "Facility evidence",
      title: "Give operators and reviewers one run history.",
      description:
        "Execution events, output artifacts, review checkpoints, and failure context remain connected to the workflow instance.",
      visual: "audit",
      dark: true,
      features: [
        {
          title: "Run history",
          description: "See status, duration, completed steps, and produced outputs.",
          icon: History,
        },
        {
          title: "Review points",
          description: "Require confirmation before publication or external handoff.",
          icon: UserCheck,
        },
        {
          title: "Reporting",
          description: "Assemble approved artifacts into a consistent facility output.",
          icon: FileText,
        },
      ],
    },
  ],
  finalTitle: "Standardize one facility workflow end to end.",
  finalDescription:
    "Map the acquisition software, analysis tools, operator decisions, and final report your users depend on.",
  finalCta: "Standardize a facility workflow",
}

export const compliancePage: MarketingPageData = {
  eyebrow: "Compliance and data integrity",
  title: "Build reviewable evidence into scientific execution.",
  description:
    "Pixesci helps teams preserve workflow events, metadata, attribution, outcomes, checksums, and review state across multi-tool scientific work. These controls support evaluation against ALCOA data-integrity concepts; they do not make a configured workflow automatically compliant.",
  primaryCta: "Review compliance workflows",
  primaryHref: "/contact",
  secondaryCta: "See regulated solutions",
  secondaryHref: "/solutions/regulated-life-sciences",
  sections: [
    {
      title: "A connected record of who did what, when, and why.",
      description: [
        "FDA data-integrity guidance emphasizes records that are complete, consistent, accurate, attributable, contemporaneous, and available for review. Pixesci connects relevant actions, responsibilities, timestamps, outcomes, integrity signals, and review state around each workflow run.",
        "This history helps teams reconstruct activity, verify review steps, and prepare evidence for quality processes or inspections. Organizations remain responsible for configuring and validating records against their own requirements.",
      ],
      visual: "audit",
      features: [
        {
          title: "Attributable",
          description: "Associate activity with user, role, session, and resource context.",
          icon: Fingerprint,
        },
        {
          title: "Contemporaneous",
          description: "Emit execution and audit events as work progresses.",
          icon: FileClock,
        },
        {
          title: "Reviewable",
          description: "Filter records, inspect metadata, and request exports.",
          icon: BookOpenCheck,
        },
      ],
    },
    {
      eyebrow: "Data integrity",
      title: "Keep data, metadata, and the execution path together.",
      description:
        "Keep source references, metadata, versions, parameters, scripts, changes, and processing history connected. Workflow views and run summaries make that context easier to inspect without replacing underlying records.",
      features: [
        {
          title: "Metadata",
          description: "Preserve timestamps, actor, software, formats, parameters, and outputs.",
          icon: FileKey2,
        },
        {
          title: "Versioning",
          description: "Track workflow versions and the software context used for each run.",
          icon: GitBranch,
        },
        {
          title: "Checksums",
          description: "Use integrity signals to support inspection of records and files.",
          icon: BadgeCheck,
        },
      ],
    },
    {
      eyebrow: "Controls",
      title: "Put review and access decisions in the workflow path.",
      description: [
        "Human checkpoints, access controls, backups, retention policies, and local deployment help teams govern how workflows are accessed, reviewed, approved, and preserved.",
        "These controls support accountable decisions and traceable procedures when configured and validated against the organization’s quality, security, and compliance requirements.",
      ],
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Access controls",
          description: "Use authenticated sessions and roles to govern access.",
          icon: LockKeyhole,
        },
        {
          title: "Review checkpoints",
          description: "Pause execution for approval before high-risk actions.",
          icon: UserCheck,
        },
        {
          title: "Retention and backup",
          description: "Support local backup, retention, and export workflows.",
          icon: DatabaseBackup,
        },
      ],
    },
  ],
  finalTitle: "Review Pixesci against your workflow and quality system.",
  finalDescription:
    "We will walk through evidence requirements, review points, deployment controls, and the customer validation boundary.",
  finalCta: "Review compliance workflows",
}

export const securityPage: MarketingPageData = {
  eyebrow: "Security and deployment",
  title: "A local-first runtime designed for deployment control.",
  description:
    "Pixesci keeps workflow execution, operational data, and scientific software connections within customer-controlled environments by default.",
  primaryCta: "Discuss deployment requirements",
  primaryHref: "/contact",
  secondaryCta: "Explore the platform",
  secondaryHref: "/product",
  sections: [
    {
      title: "The default control plane is the workstation.",
      description:
        "Workflow data, logs, AI resources, software definitions, and execution services can remain local. Managed deployments can use approved internal infrastructure without depending on an external hosted control plane.",
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
        "Define which integrations, directories, users, and services each deployment may access. Credentials remain within controlled runtime configuration rather than exposed to the user interface.",
      layout: "stacked",
      features: [
        {
          title: "Airgap policy",
          description: "Block integrations that require internet access in airgapped environments.",
          icon: CloudOff,
        },
        {
          title: "Filesystem boundaries",
          description: "Use approved working directories and controlled local paths.",
          icon: FolderLock,
        },
        {
          title: "Secret handling",
          description: "Keep credentials within controlled local configuration.",
          icon: KeyRound,
        },
        {
          title: "Session and RBAC concepts",
          description: "Use authenticated sessions and roles to govern access.",
          icon: Users,
        },
        {
          title: "Audit logging",
          description: "Record security, workflow, software, file, and compliance events.",
          icon: FileSearch,
        },
        {
          title: "Backup and retention",
          description: "Support controlled local backup and lifecycle policies.",
          icon: Archive,
        },
      ],
    },
    {
      eyebrow: "Deployment shapes",
      title: "Start on one workstation. Operate under managed policy.",
      description: [
        "Begin on a standalone workstation, then extend the same operating model to managed laboratory or enterprise on-prem environments.",
        "Administrators can apply established policies for versions, access, configuration, data location, retention, backup, and review while keeping execution close to scientific software and data.",
      ],
      features: [
        {
          title: "Standalone workstation",
          description: "Run workflows and retain operational data on one workstation.",
          icon: Laptop,
        },
        {
          title: "Managed lab install",
          description: "Distribute approved configuration and software definitions across the lab.",
          icon: MonitorCog,
        },
        {
          title: "Enterprise on-prem",
          description: "Use internal shares and services under customer-controlled policy.",
          icon: ServerCog,
        },
      ],
    },
  ],
  finalTitle: "Review your deployment boundary with Pixesci.",
  finalDescription:
    "Discuss workstation policy, on-prem services, airgapped operation, encryption, access controls, and package distribution.",
  finalCta: "Discuss deployment requirements",
}

export const workflowAutomationPage: MarketingPageData = {
  eyebrow: "Workflow automation",
  title: "Describe the work. Review the graph. Execute with evidence.",
  description:
    "Use natural language to clarify scientific intent, shape it into a reviewable workflow, approve controlled actions, monitor execution, and reuse proven processes as templates.",
  primaryCta: "See a workflow demo",
  primaryHref: "/contact",
  secondaryCta: "Explore integrations",
  secondaryHref: "/integrations",
  sections: [
    {
      title: "Build the workflow around real scientific work.",
      description:
        "Bring software steps, files, variables, notes, previews, and technical tools into one visual authoring environment. Teams can inspect dependencies and required inputs before execution.",
      visual: "workflow",
      features: [
        {
          title: "Nodes and edges",
          description: "Represent software, control, human, and processing steps explicitly.",
          icon: GitBranch,
        },
        {
          title: "Connected inputs and outputs",
          description: "Connect step inputs and outputs while preserving context.",
          icon: Variable,
        },
        {
          title: "Capability validation",
          description: "Check step requirements and configuration before execution.",
          icon: CheckCheck,
        },
      ],
    },
    {
      eyebrow: "Execution",
      title: "Stream progress and finish with a reviewable run summary.",
      description:
        "Monitor status, timing, outputs, errors, approvals, and controlled actions as work progresses. Each run concludes with a connected summary that supports review and troubleshooting.",
      visual: "console",
      dark: true,
      features: [
        {
          title: "Live events",
          description: "Monitor workflow progress through secure live updates.",
          icon: RadioTower,
        },
        {
          title: "Artifacts",
          description: "Keep generated files and outputs connected to the run.",
          icon: FileText,
        },
        {
          title: "Execution history",
          description: "Inspect prior runs instead of reconstructing them from folders.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Control",
      title: "Make human review part of the graph.",
      description:
        "Controlled actions involving instruments, external systems, interfaces, or files can pause for approval. AI-assisted plans remain bounded by supported capabilities and operator review.",
      visual: "audit",
      features: [
        {
          title: "Human steps",
          description: "Request decisions, confirmation, or domain review.",
          icon: UserCheck,
        },
        {
          title: "Safety gates",
          description: "Record approval decisions before controlled actions continue.",
          icon: ShieldCheck,
        },
        {
          title: "Reusable templates",
          description: "Save a proven graph for consistent future execution.",
          icon: Library,
        },
      ],
    },
  ],
  finalTitle: "See your scientific workflow as an executable graph.",
  finalDescription:
    "Bring the current SOP, software stack, file flow, and approval points. We will map the runtime path.",
  finalCta: "See a workflow demo",
}
