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
  description: string
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
    "Pixesci turns plain-language scientific intent into a reviewable graph built from capability profiles, then executes locally with templates, run summaries, artifacts, and audit records.",
  primaryCta: "Request a demo",
  primaryHref: "/contact",
  secondaryCta: "See workflow automation",
  secondaryHref: "/workflow-automation",
  sections: [
    {
      eyebrow: "Authoring",
      title: "Build the execution plan as a graph.",
      description:
        "Nodes reference software capabilities and execution units. Edges carry dependencies, variables, and data bindings without making a legacy ordered step list the source of truth.",
      visual: "workflow",
      features: [
        {
          title: "Workflow canvas",
          description: "Nodes, edges, layout, variables, data bus, and add-step validation.",
          icon: GitBranch,
        },
        {
          title: "Operator surfaces",
          description: "Console, preview, notes, IDE, local files, and integration palette.",
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
      description:
        "Backend-owned profiles describe setup, requirements, formats, supported workflows, channels, risk, and user-input requirements. Local detection remains a separate machine-specific signal.",
      visual: "catalog",
      features: [
        {
          title: "Software catalog",
          description: "Profiles and capabilities stay backend-owned and packageable.",
          icon: Blocks,
        },
        {
          title: "Local detection",
          description: "Overlay machine availability without changing canonical metadata.",
          icon: MonitorCog,
        },
        {
          title: "Offline profile packs",
          description: "Distribute approved profile content in controlled environments.",
          icon: PackageCheck,
        },
      ],
    },
    {
      eyebrow: "Runtime",
      title: "Execute locally and stream what happens.",
      description:
        "The local FastAPI sidecar runs workflows, emits WebSocket progress, manages artifacts, and pauses for human input when a controlled step requires it.",
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
        "Scientists can describe a goal without learning every application sequence first. Chat sessions carry working-directory context, attachments, software mentions, artifacts, and activity events, while deterministic adapters and operator review remain central.",
      features: [
        {
          title: "Context-aware workspace",
          description: "Sessions, tabs, local files, attachments, and software references.",
          icon: MessageSquareText,
        },
        {
          title: "Local model routing",
          description: "Ollama or embedded GGUF options for controlled deployments.",
          icon: BrainCircuit,
        },
        {
          title: "Constrained decisions",
          description: "Move from intent to capability schema, explicit choices, and reviewed execution.",
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
        "A result often crosses instrument software, analysis tools, spreadsheets, LIMS or ELN, and a review queue. Pixesci connects those handoffs into a reusable workflow with explicit inputs, parameters, outputs, actors, and review points. The same graph can preserve process context as work moves from early R&D and publication through CRO handoff, SOP development, MSAT, tech transfer, and manufacturing.",
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
      description:
        "Capture source files, processing parameters, operator identity, event order, output artifacts, and change reasons around the execution path.",
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
          description: "Version workflow templates, settings, and execution logic.",
          icon: FileCog,
        },
      ],
    },
    {
      eyebrow: "Controlled deployment",
      title: "Keep the runtime close to the software and data.",
      description:
        "Deploy on workstations or managed on-prem infrastructure. The canonical runtime is a desktop interface talking to a local backend and local data stores.",
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
        "Pixesci turns file-based and software-specific procedures into explicit graphs with identifiers, versions, variables, processing steps, and output registration.",
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
        "Use local model packs, software profile packages, and approved internal shares. Deployment policy can block connector tiers that require external connectivity.",
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
          description: "Separate local, on-prem, and internet-dependent connector tiers.",
          icon: CloudOff,
        },
        {
          title: "Local secrets",
          description: "Keep provider and runtime credentials out of frontend code.",
          icon: KeyRound,
        },
      ],
    },
    {
      eyebrow: "Reproducibility",
      title: "Preserve enough context to run the work again.",
      description:
        "Keep raw-data references, identifiers, package versions, parameters, scripts, processing events, and produced artifacts tied to one execution history.",
      features: [
        {
          title: "File lineage",
          description: "Track source, transform, destination, and durable identifiers.",
          icon: Network,
        },
        {
          title: "Scripted processing",
          description: "Use Python, R, MATLAB, or CLI steps where deterministic replay matters.",
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
        "Catalog metadata describes capabilities while local detection and setup configuration reflect each workstation.",
      visual: "catalog",
      features: [
        {
          title: "Local detection",
          description: "Show availability without rewriting the shared software profile.",
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
      description:
        "FDA data-integrity guidance emphasizes complete, consistent, accurate, attributable, contemporaneous, and reviewable records. Pixesci audit concepts include event ID, actor and role, action, resource, timestamp, source module, status, severity, request context, checksum, metadata, and review status.",
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
        "Completeness and reproducibility depend on source references, metadata, identifiers, versions, parameters, scripts, changes, and documented processing. Run summaries and workflow graphs provide a high-level view without replacing the underlying dynamic records.",
      features: [
        {
          title: "Metadata",
          description: "Preserve timestamps, actor, software, formats, parameters, and outputs.",
          icon: FileKey2,
        },
        {
          title: "Versioning",
          description: "Track workflow templates, capability references, and processing logic.",
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
      description:
        "Human checkpoints, session controls, role concepts, backups, retention, and local deployment support controlled operation when configured and validated appropriately.",
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Access controls",
          description: "Authentication, sessions, roles, and permission-aware endpoints.",
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
    "The Pixesci desktop interface talks to a local FastAPI sidecar, local data stores, local models, profile packs, and scientific software adapters.",
  primaryCta: "Discuss deployment requirements",
  primaryHref: "/contact",
  secondaryCta: "Explore the platform",
  secondaryHref: "/product",
  sections: [
    {
      title: "The default control plane is the workstation.",
      description:
        "Product data, logs, models, profile packs, and execution services can remain local. Managed deployments can use approved internal shares without requiring an external hosted service for correctness.",
      visual: "architecture",
      dark: true,
      bullets: [
        "Tauri desktop shell and Next.js interface",
        "FastAPI over localhost HTTP and WebSocket",
        "SQLite by default with SQLCipher support",
        "Ollama or embedded GGUF local model routing",
        "Local profile packs, model packs, logs, and audit data",
      ],
    },
    {
      eyebrow: "Controls",
      title: "Keep connectivity, paths, and credentials explicit.",
      description:
        "Deployment mode, connector tier, directory access, session policy, and backend secrets define what the runtime may reach.",
      features: [
        {
          title: "Airgap policy",
          description: "Block internet-required connector tiers in airgapped mode.",
          icon: CloudOff,
        },
        {
          title: "Filesystem boundaries",
          description: "Use approved working directories and controlled local paths.",
          icon: FolderLock,
        },
        {
          title: "Secret handling",
          description: "Keep credentials in backend or local runtime configuration.",
          icon: KeyRound,
        },
        {
          title: "Session and RBAC concepts",
          description: "Protect endpoints and audit access with authenticated sessions and roles.",
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
      description:
        "Use the same local runtime pattern for standalone workstations, managed lab installs, and enterprise on-prem environments.",
      features: [
        {
          title: "Standalone workstation",
          description: "Desktop app supervises one local backend and local data store.",
          icon: Laptop,
        },
        {
          title: "Managed lab install",
          description: "Distribute approved configuration, profiles, and model packs.",
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
    "Use natural language to clarify scientific intent, then author capability-aware nodes, bind variables and files, review high-risk actions, stream execution events, and reuse the result as a template.",
  primaryCta: "See a workflow demo",
  primaryHref: "/contact",
  secondaryCta: "Explore integrations",
  secondaryHref: "/integrations",
  sections: [
    {
      title: "Build the workflow around real product mechanics.",
      description:
        "The canvas brings graph layout, integration palette, add-step schemas, variables, local files, notes, preview, console, and IDE surfaces into one authoring environment.",
      visual: "workflow",
      features: [
        {
          title: "Nodes and edges",
          description: "Represent software, control, human, and processing steps explicitly.",
          icon: GitBranch,
        },
        {
          title: "Variables and data bus",
          description: "Bind step inputs and outputs without losing context.",
          icon: Variable,
        },
        {
          title: "Capability validation",
          description: "Load adapter schemas and validate node configuration before creation.",
          icon: CheckCheck,
        },
      ],
    },
    {
      eyebrow: "Execution",
      title: "Stream progress and finish with a reviewable run summary.",
      description:
        "Execution records can include status, completion, duration, attempts, step logs, outputs, screenshots, artifacts, errors, approvals, blocked actions, and a summary of the completed path.",
      visual: "console",
      dark: true,
      features: [
        {
          title: "Live events",
          description: "Use authenticated WebSocket updates for execution monitoring.",
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
        "High-risk external, instrument, GUI, or file mutations can pause for approval. AI-generated plans remain subject to capability constraints and operator review.",
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
