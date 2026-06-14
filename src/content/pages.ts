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
  visual?:
    | "workflow"
    | "audit"
    | "architecture"
    | "catalog"
    | "console"
    | "templates"
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
  title: "Connect and automate your scientific software.",
  description:
    "PixeSci connects the tools your lab already uses. Tell PixeSci what to do in your own words, review the steps, run them locally, and track every file, setting, decision, and result.",
  primaryCta: "Request a demo",
  primaryHref: demoBookingUrl,
  secondaryCta: "See workflow automation",
  secondaryHref: "/workflow-automation",
  sections: [
    {
      eyebrow: "Authoring",
      title: "Build each process as a visual workflow.",
      description:
        "Connect software steps, files, settings, and review points on one canvas. Check the full process before it runs, then save it for the next experiment.",
      visual: "workflow",
      features: [
        {
          title: "Workflow canvas",
          description:
            "Connect software steps, files, settings, and required inputs on one canvas.",
          icon: GitBranch,
        },
        {
          title: "Operator surfaces",
          description:
            "Keep controls, files, notes, previews, and tools in one workspace.",
          icon: PanelTop,
        },
        {
          title: "Reusable templates",
          description:
            "Choose, set up, run, and save workflows that your team can repeat.",
          icon: Library,
        },
      ],
    },
    {
      eyebrow: "Software catalog",
      title: "Check what each tool can do before you run it.",
      description: [
        "PixeSci shows what each connected software can do, which files it needs, what it produces, and how to set it up. Teams can check a step before adding it to a workflow.",
        "PixeSci also checks whether the required software is available on the computer that will run the workflow. This helps teams use the same process across different workstations and sites.",
      ],
      visual: "catalog",
      features: [
        {
          title: "Software catalog",
          description:
            "Check supported apps, actions, file types, and setup needs before a run.",
          icon: Blocks,
        },
        {
          title: "Local detection",
          description:
            "Confirm that the required software is installed where the workflow will run.",
          icon: MonitorCog,
        },
        {
          title: "Offline distribution",
          description:
            "Move approved software setup files through secure or offline environments.",
          icon: PackageCheck,
        },
      ],
    },
    {
      eyebrow: "Run workflows",
      title: "Run locally and watch each step.",
      description:
        "Run workflows where your software and data already live. Watch progress, results, errors, and decisions as they happen. Pause any controlled step until a person approves it.",
      visual: "console",
      dark: true,
      features: [
        {
          title: "Execution events",
          description:
            "Record progress, retries, time, errors, and files during every run.",
          icon: RadioTower,
        },
        {
          title: "Safety gates",
          description:
            "Ask for approval before a step changes a system, instrument, or file.",
          icon: ShieldCheck,
        },
        {
          title: "Run history",
          description:
            "Review completed, failed, and stopped runs with all their details.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Interface",
      title: "Tell PixeSci what you want to do.",
      description:
        "Describe the work in your own words. PixeSci turns the request into clear software steps that you can review before anything runs.",
      features: [
        {
          title: "Local model routing",
          description:
            "Use approved local AI models inside your own environment.",
          icon: BrainCircuit,
        },
        {
          title: "Checked decisions",
          description:
            "Turn your request into clear steps based on what each tool can do.",
          icon: CheckCheck,
        },
        {
          title: "Workspace details",
          description:
            "Keep chats, tabs, files, attachments, and software details ready while you plan.",
          icon: MessageSquareText,
        },
        {
          title: "Choose what the AI can use",
          description:
            "Let the AI use the full workspace or limit it to one workflow, run, file, or investigation.",
          icon: Network,
        },
      ],
    },
  ],
  finalTitle:
    "Describe a your workflow in simple language. See how PixeSci optimizes and runs it.",
  finalDescription:
    "PixeSci will map your software, files, review steps, setup needs, and required records.",
  finalCta: "Discuss your workflow",
}

export const regulatedPage: MarketingPageData = {
  eyebrow: "Regulated life sciences",
  title: "Connect QC and R&D tools and track every handoff.",
  description:
    "PixeSci automates work across QC and R&D software. It records each input, setting, action, review, and result so teams can repeat and inspect the process.",
  primaryCta: "Map a regulated workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "Review compliance workflows",
  secondaryHref: "/compliance",
  sections: [
    {
      title: "Keep one record across every tool.",
      description:
        "Results move between instruments, analysis tools, spreadsheets, LIMS or ELN systems, and reviewers. PixeSci connects these steps and keeps the files, settings, owners, results, and approvals together.",
      visual: "workflow",
      bullets: [
        "FlowJo → GraphPad Prism → LIMS / ELN",
        "Chromeleon or Empower → LIMS → batch record",
        "CellProfiler or ImageJ → statistics → Benchling / review",
        "Mass spectrometry → MaxQuant → R or Python → LIMS",
      ],
    },
    {
      eyebrow: "Run records",
      title: "Review errors, changes, and reruns faster.",
      description: [
        "Keep source files, settings, operator actions, results, and reasons for change with each run. Reviewers can see what happened without searching through separate logs and notes.",
        "When a deviation, exception, or rerun occurs, teams can inspect the full history and use it in their existing quality process.",
      ],
      visual: "audit",
      features: [
        {
          title: "Audit-trail review",
          description:
            "See who changed what, when it changed, what it affected, and what happened next.",
          icon: FileSearch,
        },
        {
          title: "OOS and OOR records",
          description:
            "Keep original results, run details, settings, change reasons, and reviews for an investigation.",
          icon: ClipboardCheck,
        },
        {
          title: "Change control",
          description:
            "Track approved changes to workflows, versions, and settings.",
          icon: FileCog,
        },
      ],
    },
    {
      eyebrow: "Controlled deployment",
      title: "Keep software, data, and records under your control.",
      description: [
        "Run PixeSci on lab workstations or your own servers. Work stays close to your apps, instruments, files, and approved data stores.",
        "PixeSci works within your network, access rules, and backup process. It does not need a cloud service to run workflows.",
      ],
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Local data paths",
          description:
            "Run workflows with approved folders and locally installed scientific apps.",
          icon: FolderLock,
        },
        {
          title: "Review checkpoints",
          description: "Pause high-risk steps until a person approves them.",
          icon: UserCheck,
        },
        {
          title: "Validation boundary",
          description:
            "Validate each configured workflow under your own quality system.",
          icon: BadgeCheck,
        },
      ],
    },
  ],
  finalTitle: "Show us one regulated process.",
  finalDescription:
    "Bring a QC, development, or manufacturing workflow and the records and reviews it requires.",
  finalCta: "Request a compliance workflow demo",
}

export const secureResearchPage: MarketingPageData = {
  eyebrow: "Secure research",
  title: "Automate scientific work without an outside cloud service.",
  description:
    "PixeSci connects local software, HPC results, and internal data inside infrastructure that you control.",
  primaryCta: "Discuss secure deployment",
  primaryHref: demoBookingUrl,
  secondaryCta: "Review architecture",
  secondaryHref: "/security",
  sections: [
    {
      title: "Connect research tools across your local environment.",
      description:
        "Turn file-based procedures into clear workflows that save software versions, settings, steps, and results.",
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
      title: "Set up tools without using the public internet.",
      description:
        "Move approved software setup and AI models through your internal network or offline packages. Block any connection that needs the public internet.",
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Offline packages",
          description:
            "Move approved software setup and models through internal or offline channels.",
          icon: PackageCheck,
        },
        {
          title: "Policy gates",
          description:
            "Allow or block each connection based on your security rules.",
          icon: CloudOff,
        },
        {
          title: "Local secrets",
          description: "Keep connection passwords and keys in local settings.",
          icon: KeyRound,
        },
      ],
    },
    {
      eyebrow: "Repeat the work",
      title: "Save what your team needs to run the work again.",
      description:
        "Keep source files, software versions, settings, scripts, steps, and results together so teams can review and repeat past work.",
      features: [
        {
          title: "File history",
          description:
            "Link source files to each step, destination, result, and saved ID.",
          icon: Network,
        },
        {
          title: "Scripted processing",
          description: "Run approved scripts the same way each time.",
          icon: Code2,
        },
        {
          title: "HPC completion",
          description:
            "Continue the workflow when an approved HPC job finishes and returns its files.",
          icon: ServerCog,
        },
      ],
    },
  ],
  finalTitle: "Fit PixeSci to your controlled research environment.",
  finalDescription:
    "Review your workstations, servers, offline setup, software packages, and internal data stores.",
  finalCta: "Discuss secure deployment",
}

export const coreFacilitiesPage: MarketingPageData = {
  eyebrow: "Core facilities",
  title: "Turn proven lab procedures into workflows everyone can follow.",
  description:
    "PixeSci connects acquisition, analysis, review, and reporting tools. Save the process once, guide each operator, and track every run.",
  primaryCta: "Standardize a facility workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "Explore the platform",
  secondaryHref: "/product",
  sections: [
    {
      title: "Save the process once. Run it the same way each time.",
      description:
        "Facility managers can save software steps, settings, instructions, folders, reviews, and expected results in one reusable workflow.",
      visual: "templates",
      features: [
        {
          title: "Template center",
          description:
            "Choose, review, set up, run, and save facility workflows.",
          icon: Library,
        },
        {
          title: "Guided execution",
          description:
            "Show required settings, folders, files, and operator choices during a run.",
          icon: ListChecks,
        },
        {
          title: "Operator notes",
          description:
            "Keep instructions beside the workflow and its controls.",
          icon: FileText,
        },
      ],
    },
    {
      eyebrow: "Local operations",
      title: "Use the software already installed in your facility.",
      description:
        "Keep one list of supported software and show which apps, versions, and settings are available on each workstation.",
      visual: "catalog",
      features: [
        {
          title: "Local detection",
          description:
            "Show which scientific apps and versions are installed on each workstation.",
          icon: ScanLine,
        },
        {
          title: "Working directory",
          description:
            "Keep source files, working data, and results in a named local folder.",
          icon: FolderLock,
        },
        {
          title: "Batch execution",
          description:
            "Run the same process across a defined set of samples or files.",
          icon: SlidersHorizontal,
        },
      ],
    },
    {
      eyebrow: "Facility evidence",
      title: "Give operators and reviewers one clear run history.",
      description:
        "Keep each step, result, review, operator decision, and error with the workflow run.",
      visual: "audit",
      dark: true,
      features: [
        {
          title: "Run history",
          description:
            "Review status, time, completed steps, operator actions, and results.",
          icon: History,
        },
        {
          title: "Review points",
          description:
            "Require approval before publishing or sending results outside the facility.",
          icon: UserCheck,
        },
        {
          title: "Reporting",
          description:
            "Build a standard facility report from approved results and files.",
          icon: FileText,
        },
      ],
    },
  ],
  finalTitle: "Standardize one facility workflow from start to finish.",
  finalDescription:
    "Show us the acquisition tools, analysis apps, operator choices, reviews, and reports you use.",
  finalCta: "Standardize a facility workflow",
}

export const compliancePage: MarketingPageData = {
  eyebrow: "Compliance and data integrity",
  title: "Track compliance work throughout every experiment.",
  description:
    "PixeSci records who did what, when it happened, what changed, and what result followed. These records can support ALCOA data integrity reviews, but software alone does not make a workflow compliant.",
  primaryCta: "Review compliance workflows",
  primaryHref: demoBookingUrl,
  secondaryCta: "See regulated solutions",
  secondaryHref: "/solutions/regulated-life-sciences",
  sections: [
    {
      title: "See who did what, when they did it, and why.",
      description: [
        "FDA guidance calls for records that are complete, consistent, accurate, linked to a person, recorded on time, and ready for review. PixeSci links actions, owners, times, results, file checks, and reviews to each run.",
        "Teams can use this history to check reviews and prepare records for quality work or inspections. Each organization must still set up and validate those records for its own needs.",
      ],
      visual: "audit",
      features: [
        {
          title: "Attributable",
          description:
            "Link each workflow action to the right user, role, session, and item.",
          icon: Fingerprint,
        },
        {
          title: "Contemporaneous",
          description:
            "Record workflow and audit events while the work happens.",
          icon: FileClock,
        },
        {
          title: "Reviewable",
          description:
            "Filter records, check their details, and prepare approved exports for review.",
          icon: BookOpenCheck,
        },
      ],
    },
    {
      eyebrow: "Data integrity",
      title: "Keep data, details, and workflow steps together.",
      description:
        "Link source files, file details, software versions, settings, scripts, changes, and processing steps. Workflow views make this information easier to inspect without replacing the original records.",
      features: [
        {
          title: "Run details",
          description:
            "Save times, users, software, file types, settings, and results.",
          icon: FileKey2,
        },
        {
          title: "Versioning",
          description:
            "Track each workflow version and the software settings used for every run.",
          icon: GitBranch,
        },
        {
          title: "Checksums",
          description:
            "Use checksums to help reviewers confirm that records and files have not changed.",
          icon: BadgeCheck,
        },
      ],
    },
    {
      eyebrow: "Controls",
      title: "Add reviews and access rules to the workflow.",
      description: [
        "Use approval steps, role-based access, backups, retention rules, and local deployment to control who can run, review, approve, and keep each workflow.",
        "When your organization sets up and validates these controls, they can help teams show how decisions were made and procedures were followed.",
      ],
      visual: "architecture",
      dark: true,
      features: [
        {
          title: "Access controls",
          description:
            "Use signed-in sessions and roles to control workflow access.",
          icon: LockKeyhole,
        },
        {
          title: "Review checkpoints",
          description:
            "Pause the workflow for approval before a high-risk action.",
          icon: UserCheck,
        },
        {
          title: "Retention and backup",
          description:
            "Use your own backup, retention, recovery, and export process.",
          icon: DatabaseBackup,
        },
      ],
    },
  ],
  finalTitle: "Review PixeSci against your workflow and quality system.",
  finalDescription:
    "We will review the records, approvals, setup controls, and validation work your process requires.",
  finalCta: "Review compliance workflows",
}

export const securityPage: MarketingPageData = {
  eyebrow: "Security and deployment",
  title: "Run PixeSci inside the environment you control.",
  description:
    "PixeSci runs workflows, stores work data, and connects software inside your environment by default.",
  primaryCta: "Discuss deployment requirements",
  primaryHref: demoBookingUrl,
  secondaryCta: "Explore the platform",
  secondaryHref: "/product",
  sections: [
    {
      title: "Keep scientific work inside your environment.",
      description:
        "Keep workflow data, logs, AI models, and software setup local. Use approved workstations or your own servers without relying on an outside cloud service.",
      visual: "architecture",
      dark: true,
      bullets: [
        "Run on approved workstations or customer-managed servers",
        "Keep data in approved storage with encryption options",
        "Use approved local AI models",
        "Control software setup and access",
        "Keep logs and audit records inside your environment",
      ],
    },
    {
      eyebrow: "Controls",
      title: "Control connections, folders, and passwords.",
      description:
        "Choose which tools, folders, users, and internal services PixeSci can access. Keep passwords and keys in the local service instead of showing them in the interface.",
      layout: "stacked",
      features: [
        {
          title: "Airgap policy",
          description:
            "Block tools that need internet access in an air-gapped environment.",
          icon: CloudOff,
        },
        {
          title: "Filesystem boundaries",
          description: "Limit workflows to approved folders and local paths.",
          icon: FolderLock,
        },
        {
          title: "Secret handling",
          description: "Keep connection passwords and keys in local settings.",
          icon: KeyRound,
        },
        {
          title: "Sessions and roles",
          description: "Use signed-in sessions and roles to control access.",
          icon: Users,
        },
        {
          title: "Audit logging",
          description:
            "Record important security, workflow, software, file, and review events.",
          icon: FileSearch,
        },
        {
          title: "Backup and retention",
          description:
            "Use your own rules for backup, retention, recovery, and removal.",
          icon: Archive,
        },
      ],
    },
    {
      eyebrow: "Deployment shapes",
      title: "Start on one workstation. Expand under your rules.",
      description: [
        "Start on one workstation, then use the same setup across managed lab computers or your own servers.",
        "Administrators can control software versions, access, settings, data location, retention, backups, and reviews while keeping workflows close to lab software and data.",
      ],
      features: [
        {
          title: "Standalone workstation",
          description:
            "Run workflows and keep work data on one controlled workstation.",
          icon: Laptop,
        },
        {
          title: "Managed lab install",
          description:
            "Send approved settings and software setup to managed lab workstations.",
          icon: MonitorCog,
        },
        {
          title: "Enterprise on-prem",
          description:
            "Connect approved internal storage and services under your company rules.",
          icon: ServerCog,
        },
      ],
    },
  ],
  finalTitle: "Review your deployment boundary with PixeSci.",
  finalDescription:
    "Review workstation rules, local servers, air-gapped use, encryption, access, and offline packages.",
  finalCta: "Discuss deployment requirements",
}

export const workflowAutomationPage: MarketingPageData = {
  eyebrow: "Workflow automation",
  title: "Describe the work. Review the steps. Run the workflow.",
  description:
    "Tell PixeSci what you want to do in plain language. Review the workflow, run it locally, track each step, and save it for the next experiment.",
  primaryCta: "See a workflow demo",
  primaryHref: demoBookingUrl,
  secondaryCta: "Explore integrations",
  secondaryHref: "/integrations",
  sections: [
    {
      title: "Build the workflow around the way your lab works.",
      description:
        "Put software steps, files, settings, notes, previews, and tools in one visual workflow. Check what each step needs and produces before it runs.",
      visual: "workflow",
      features: [
        {
          title: "Connected steps",
          description:
            "Show software actions, rules, human decisions, and processing steps clearly.",
          icon: GitBranch,
        },
        {
          title: "Connected inputs and outputs",
          description:
            "Link the files each step needs to the results it produces.",
          icon: Variable,
        },
        {
          title: "Step checks",
          description:
            "Check the software, required files, and settings before a step runs.",
          icon: CheckCheck,
        },
      ],
    },
    {
      eyebrow: "Execution",
      title: "Watch progress and finish with a clear run summary.",
      description:
        "Watch status, time, results, errors, approvals, and controlled actions as they happen. Each run ends with one summary for review, problem solving, and repeat work.",
      visual: "console",
      dark: true,
      features: [
        {
          title: "Live events",
          description:
            "Watch workflow status, step progress, and errors through live updates.",
          icon: RadioTower,
        },
        {
          title: "Output files",
          description:
            "Keep generated files, working data, and final results with the run that made them.",
          icon: FileText,
        },
        {
          title: "Execution history",
          description:
            "Review past runs without searching through separate folders and logs.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Control",
      title: "Make human review part of the workflow.",
      description:
        "Pause before a workflow changes an instrument, outside system, interface, or file. PixeSci only plans supported software actions, and operators review them before they run.",
      visual: "audit",
      features: [
        {
          title: "Human steps",
          description:
            "Ask an operator to decide, confirm, or review a step inside the workflow.",
          icon: UserCheck,
        },
        {
          title: "Safety gates",
          description: "Record approval before a high-risk action continues.",
          icon: ShieldCheck,
        },
        {
          title: "Reusable templates",
          description:
            "Save a proven workflow as a template that the team can run again.",
          icon: Library,
        },
      ],
    },
  ],
  finalTitle: "See how PixeSci can run your scientific workflow.",
  finalDescription:
    "Bring your SOP, software, files, and approval steps. We will map them into a workflow PixeSci can run.",
  finalCta: "See a workflow demo",
}
import { demoBookingUrl } from "@/content/site"
