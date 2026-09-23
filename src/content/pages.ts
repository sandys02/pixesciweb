// @/content/pages.ts

import type { LucideIcon } from "lucide-react"
import {
  Archive,
  BadgeCheck,
  BookOpenCheck,
  Boxes,
  CalendarClock,
  ClipboardCheck,
  FileClock,
  FileCog,
  FileKey2,
  FileSearch,
  FileText,
  Fingerprint,
  FolderLock,
  GitBranch,
  History,
  LifeBuoy,
  LineChart,
  LockKeyhole,
  Network,
  PackageCheck,
  RadioTower,
  ScanLine,
  ServerCog,
  ShieldCheck,
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
    | "lims"
    | "quality-record"
    | "genealogy"
    | "batch-record"
    | "equipment-lifecycle"
    | "document-lifecycle"
    | "dashboard"
    | "agent-orchestrator"
    | "training-record"
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

export type ModulePageData = Pick<
  MarketingPageData,
  "eyebrow" | "title" | "description" | "sections"
>

export const agenticCompliancePage: MarketingPageData = {
  eyebrow: "Continuous Quality Monitoring",
  title:
    "Hear about quality problems as they happen, with the evidence already attached.",
  description:
    "PixeSci watches the systems you connect, flags the gaps a reviewer or inspector would look for, and recommends what to do next. Every approval, closure, release, and signature stays with a qualified person on your team, and the software enforces that.",
  primaryCta: "See it on your workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "See the record system",
  secondaryHref: "/solutions#quality-management",
  sections: [
    {
      eyebrow: "How it works",
      title: "It works behind the systems you already use.",
      description: [
        "PixeSci is not a replacement for your LIMS, QMS, CDS, or instrument software. It connects to what you already run, resolves the execution context around each event — the approved method, the sample, the analyst's authorization, the equipment state — and carries that context, plus the approvals and evidence it generates, through the workflow as it happens.",
        "The result is a record that doesn't need to be reconstructed after the fact, because it was carried through the work in the first place.",
      ],
      visual: "architecture",
      bullets: [
        "Runs behind your existing CDS, LIMS/ELN, QMS, instruments, and documents",
        "No new instruments and no rip-and-replace software required",
        "One governed layer instead of separate point-to-point handoffs",
      ],
    },
    {
      eyebrow: "Continuous monitoring",
      title: "Every event gets checked as it happens.",
      description: [
        "PixeSci evaluates a deterministic set of rules against the event history from every system you connect — instrument runs, audit-trail entries, user and account activity, and record completeness — continuously, not on a schedule or a sample.",
        "These rules look for the same patterns a quality reviewer or an inspector would: aborted or repeated runs without a documented reason, activity attributed to a shared or ambiguous account, missing raw-data references, and records that disagree with each other about the same event.",
      ],
      visual: "agent-orchestrator",
      features: [
        {
          title: "Deterministic rule engine",
          description:
            "Rules are explicit and versioned, not a black-box model guessing at risk — you can see exactly what triggered a flag.",
          icon: Variable,
        },
        {
          title: "Cross-record reconciliation",
          description:
            "Compare identity, timing, and outcome fields across records of the same event to catch records that disagree.",
          icon: ScanLine,
        },
        {
          title: "Continuous, not periodic",
          description:
            "Evaluate events as they happen, instead of waiting for a scheduled review or an audit to surface a gap.",
          icon: RadioTower,
        },
        {
          title: "Routed into Quality records",
          description:
            "A flagged event becomes a real Quality Management record — a deviation, OOS, or investigation — not a siloed alert.",
          icon: ShieldCheck,
        },
      ],
    },
    {
      eyebrow: "Governed execution",
      title: "Anything risky waits for your approval.",
      description: [
        "Each capability an agent can use is a typed, registered contract with a declared risk level and required permissions — reads run automatically; anything that writes to a record, or that could affect a live instrument, requires human approval first.",
        "Actions that pattern-match to live-instrument control — acquiring, injecting, calibrating, arming, or operating a connected instrument — are always routed to a person, regardless of risk tier.",
      ],
      visual: "console",
      dark: true,
      bullets: [
        "Typed capability registry with a declared risk level per action",
        "Risk-tiered approval gates, not a single blanket permission",
        "Live-instrument actions always require human approval",
        "Every execution is checked against role and permission before it runs",
      ],
    },
    {
      eyebrow: "Recommendation only",
      title: "PixeSci recommends. It cannot approve, close, release, or sign.",
      description: [
        "PixeSci's compliance copilot answers questions only from the records, rule results, and evidence it can cite — and it is designed to decline rather than guess when the evidence is missing or contradictory.",
        "Its ability to approve, close, release, invalidate, sign, or write to a source system isn't just discouraged in a prompt — it's absent from what the software will let it do, and an automated evaluation suite tests for exactly this boundary before any change ships.",
      ],
      layout: "stacked",
      features: [
        {
          title: "Cited recommendations",
          description:
            "Every answer is grounded in specific records and rule results the copilot can point to, not a general impression.",
          icon: BookOpenCheck,
        },
        {
          title: "Enforced authority boundary",
          description:
            "Approve, close, release, invalidate, sign, and write-to-source-system are outside what the copilot can do — enforced in the software.",
          icon: LockKeyhole,
        },
        {
          title: "Tested, not just described",
          description:
            "An automated evaluation suite checks the copilot resists claiming authority it doesn't have, before any change reaches production.",
          icon: ShieldCheck,
        },
      ],
    },
    {
      eyebrow: "Verifiable evidence",
      title: "An audit trail you can check whenever you want.",
      description: [
        "Every record change and agent action is written into the same hash-chained trail, with each entry linked to the one before it. Run a chain-integrity check at any time and see exactly where it breaks, if it ever does — the check is recomputed live, not served from a cache.",
        "When you need to hand over evidence, export a checksum-manifested bundle for a specific finding — one download, one hash you can verify independently.",
        "FDA guidance calls for records that are complete, consistent, accurate, linked to a person, recorded on time, and ready for review. Teams can use this history to check reviews and prepare records for quality work or inspections. Each organization must still set up and validate those records for its own needs.",
      ],
      visual: "audit",
      bullets: [
        "On-demand, live-recomputed audit-chain verification",
        "Checksum-manifested evidence export per finding",
        "The same trail records human and agent actions alike",
      ],
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
      title: "Your data, settings, and steps stay together.",
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
      eyebrow: "Built on FDA and EMA good-AI-practice principles",
      title: "How we built the AI around FDA and EMA guidance.",
      description:
        "These ten principles summarize current FDA and EMA guidance on using AI in regulated environments. PixeSci's agent architecture was built against them directly, not retrofitted afterward.",
      layout: "stacked",
      bullets: [
        "Start with the intended use — every capability is scoped to a specific, declared job",
        "Assess and manage risk — actions are risk-tiered, with approval gates proportionate to impact",
        "Use appropriate and trustworthy data — recommendations cite the records and rule results behind them",
        "Keep training and testing independent — the copilot's authority boundary is checked by an automated evaluation suite, not self-assessed",
        "Validate the complete system — the model runs inside the same permission, approval, and audit infrastructure as every other action on the platform",
        "Demonstrate performance for the real-world context — rules evaluate real event data from connected systems, not a synthetic benchmark",
        "Define limitations and ensure human oversight — the copilot is designed to decline rather than guess, and every regulated decision stays with a person",
        "Assign accountability — every action, human or agent, is attributed to an identity and a role",
        "Monitor and manage changes — capability and rule changes go through the same controlled-change process as the rest of the platform",
        "Maintain transparent and auditable records — every agent action is written into the same hash-chained trail as every human action",
      ],
    },
  ],
  finalTitle: "Show us one gap you've had to reconstruct after the fact.",
  finalDescription:
    "Bring one real example — a repeat test, a closed deviation, a disconnected calibration record. We will show you how PixeSci's agents would have flagged it as it happened, and what stays with your team to decide.",
  finalCta: "See it on your workflow",
}

export const regulatedPage: MarketingPageData = {
  eyebrow: "Regulated life sciences",
  title: "Your QC and QA work is growing faster than your team.",
  description:
    "If you're heading toward GMP readiness, moving a method or process into regulated manufacturing, running your first regulated batches or tests, or juggling outsourced testing across partners, we help you keep the quality work connected as it grows.",
  primaryCta: "Map a regulated workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "See continuous quality monitoring",
  secondaryHref: "/platform/agents",
  sections: [
    {
      eyebrow: "Who this is for",
      title: "Built for the moment QC operations start to strain.",
      description:
        "Most teams reach for PixeSci at a specific trigger point, not on a generic timeline: preparing for a GMP inspection, transferring a method or process from R&D into regulated manufacturing, standing up QC for the first time, or watching investigation and reconciliation time climb as volume grows.",
      bullets: [
        "GMP readiness and first regulated manufacturing or testing runs",
        "Technology transfer from R&D into a regulated process",
        "Rising QC volume outpacing manual reconciliation and review",
        "Fragmented, outsourced, or multi-vendor testing that's hard to reconcile",
      ],
    },
    {
      title: "Keep one record across every tool.",
      description:
        "Results move between instruments, analysis tools, spreadsheets, LIMS or ELN systems, and reviewers. Connect those steps and keep the files, settings, owners, results, and approvals together.",
      visual: "workflow",
      bullets: [
        "Balance or pH meter → LIMS → batch record",
        "Chromeleon or Empower → LIMS → batch record",
        "Environmental monitor → excursion check → deviation in your QMS",
        "Contract lab report → intake → review → record",
        "Lab results and CoAs → PixeSci TM Laboratory and Quality Management records",
        "Every handoff above watched continuously by PixeSci's Continuous Quality Monitoring",
      ],
    },
    {
      eyebrow: "Run records",
      title: "Review errors, changes, and reruns faster.",
      description: [
        "Keep source files, settings, operator actions, results, and reasons for change with each run. Reviewers can see what happened without searching through separate logs and notes.",
        "When a deviation, exception, or rerun occurs, teams can inspect the full history and use it in their existing quality process. These investigations are also where PixeSci's compliance agents flag gaps before release, not just after.",
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
            "Keep original results, run details, settings, change reasons, and reviews for an investigation — and block release automatically until it closes.",
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
        "PixeSci runs on a PixeSci Node installed at your site. Work stays close to your apps, instruments, files, and approved data stores.",
        "Keep workflows within your network, access rules, and backup process. You do not need a cloud service to run the work.",
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
    "Bring a QC, development, or manufacturing workflow and the records and reviews it requires — including a batch record, if you run one, in the Manufacturing Quality module.",
  finalCta: "Request a compliance workflow demo",
}

export const securityPage: MarketingPageData = {
  eyebrow: "Security and deployment",
  title: "Run workflows inside the environment you control.",
  description:
    "Keep workflow runs, work data, and software connections inside your environment by default.",
  primaryCta: "Discuss deployment requirements",
  primaryHref: demoBookingUrl,
  secondaryCta: "Start building workflows",
  secondaryHref: "/solutions",
  sections: [
    {
      title: "Keep scientific work inside your environment.",
      description:
        "Keep workflow data, logs, AI models, and software setup local. PixeSci runs on a PixeSci Node at your site, without relying on an outside cloud service. See and control what PixeSci can do, and audit what it did, the same way you audit any other user action. Every PixeSci action is governed by the same permission and audit system as every other user action — see how on the Continuous Quality Monitoring page.",
      visual: "architecture",
      dark: true,
      bullets: [
        "Runs on a PixeSci Node installed at your site",
        "Keep data in approved storage with encryption options",
        "Use approved local AI models",
        "Control software setup and access",
        "Keep logs and audit records inside your environment",
      ],
    },
    {
      eyebrow: "Deployment",
      title: "A PixeSci Node, installed at your site.",
      description: [
        "PixeSci ships you a PixeSci Node, hardware that runs everything locally at your site. Your data and everything PixeSci runs stay on your own premises.",
        "We prepare it before it arrives, so you are up and running fast instead of running an install project.",
      ],
      features: [
        {
          title: "Arrives ready to use",
          description: "We set it up for you before it ships.",
          icon: PackageCheck,
        },
        {
          title: "Runs at your site",
          description:
            "Your data and workflows stay on hardware at your own premises.",
          icon: ServerCog,
        },
        {
          title: "Support from us",
          description: "We stay on hand after install to keep it running.",
          icon: LifeBuoy,
        },
      ],
    },
  ],
  finalTitle: "Review your deployment boundary.",
  finalDescription:
    "Talk through how a PixeSci Node would be installed at your site, and what your team needs to review first.",
  finalCta: "Discuss deployment requirements",
}

export const laboratoryPage: ModulePageData = {
  eyebrow: "Laboratory",
  title: "Track every sample from accessioning to Certificate of Analysis.",
  description:
    "Run your lab's sample workflow in one system: intake, chain of custody, testing, review, and release. Keep every result, correction, and approval tied to the sample record, from the first container to the final CoA.",
  sections: [
    {
      title: "One record from intake to release.",
      description: [
        "Accession a sample, then track every container, aliquot, and transfer that follows it. Assign tests from a controlled catalog, generate worksheets, and enter results manually or from instrument import.",
        "Every sample moves through analyst review, then a separate quality-unit review, before it can be released. A result that falls out of specification or out of trend opens an investigation that blocks release until it closes.",
      ],
      visual: "lims",
      features: [
        {
          title: "Accessioning and chain of custody",
          description:
            "Record every transfer of a sample, container, or aliquot, with the receiving custodian confirming or rejecting each transfer.",
          icon: ClipboardCheck,
        },
        {
          title: "Worksheets and result entry",
          description:
            "Generate worksheets, assign analysts, and enter results manually or from instrument import.",
          icon: FileText,
        },
        {
          title: "Two-step review",
          description:
            "Route results through analyst review, then a separate quality-unit review, before disposition.",
          icon: UserCheck,
        },
        {
          title: "Certificate of Analysis",
          description:
            "Generate a CoA only after release, from versioned templates, to an authorized-recipient list you control.",
          icon: BadgeCheck,
        },
      ],
    },
    {
      eyebrow: "Controlled definitions",
      title: "Keep your test catalog, methods, and specifications versioned.",
      description:
        "Test catalog entries, analytical methods, specifications and limits, and calculations are each version-controlled registries. Editing one creates a new version instead of silently changing what past results were tested against.",
      layout: "stacked",
      bullets: [
        "Versioned test catalog, methods, specifications, and calculations",
        "Corrections to a sample record capture the prior value and a reason",
        "Container and aliquot lineage, with a reconciliation check",
        "Barcode and UID scan-to-locate for containers and aliquots",
      ],
    },
    {
      eyebrow: "Investigations",
      title: "Out-of-specification and out-of-trend results block release.",
      description: [
        "When a result evaluates out-of-specification or trips an out-of-trend rule, PixeSci TM opens an investigation and blocks the sample from release until it closes. The quality-unit review screen shows exactly which results are blocking a sample, with a direct link into the open investigation.",
        "Investigations opened here are real Quality Management records — the same CAPA and deviation system every other module reports into. These investigations are also evaluated continuously by PixeSci's Continuous Quality Monitoring, which can flag the same out-of-specification and out-of-trend patterns before a quality-unit reviewer opens the sample.",
      ],
      visual: "audit",
      dark: true,
      features: [
        {
          title: "Release gating",
          description:
            "Block release automatically until every open OOS or OOT investigation on a sample closes.",
          icon: ShieldCheck,
        },
        {
          title: "Linked investigations",
          description:
            "Follow a direct link from a blocked result to its open investigation record.",
          icon: FileSearch,
        },
        {
          title: "Shared audit trail",
          description:
            "See every accessioning, testing, review, and release event in one record trail per sample.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Studies and retention",
      title: "Track stability, environmental monitoring, and retention samples.",
      description:
        "Stability studies run on a pull-point calendar. Environmental monitoring tracks alert and action limits. Retention samples carry their own retain, extend, and dispose lifecycle, separate from active testing.",
      features: [
        {
          title: "Stability studies",
          description:
            "Schedule and track stability protocols by pull point, on a real calendar view.",
          icon: History,
        },
        {
          title: "Environmental monitoring",
          description:
            "Track alert and action limits for environmental samples alongside your test workflow.",
          icon: FileSearch,
        },
        {
          title: "Retention samples",
          description:
            "Track retention quantity, retain-until date, and disposition separately from active testing.",
          icon: Archive,
        },
      ],
    },
  ],
}

export const qualityManagementPage: ModulePageData = {
  eyebrow: "Quality management",
  title: "Track every deviation, CAPA, and complaint in one record system.",
  description:
    "Sixteen quality record types share one hash-chained audit trail: deviations, nonconformances, CAPA, complaints, change control, audits, supplier issues, risk, and more. Every other module reports into the same system.",
  sections: [
    {
      title: "One system for every kind of quality event.",
      description: [
        "Deviations, nonconformances, OOS and OOT investigations, incidents, CAPA and action items, change control, complaints, audits and findings, supplier qualification and issues, risk management, management review, and regulatory commitments — each is a first-class, versioned record type, not a generic ticket with custom fields.",
        "Records move through a defined lifecycle with approvals and electronic signatures, not a freeform status field. A generic edit cannot change a record's status — only a defined transition can. The same event patterns that open these records — reruns, aborts, missing raw data — are also watched continuously by PixeSci's Continuous Quality Monitoring, which routes a flagged event into this system automatically.",
      ],
      visual: "quality-record",
      features: [
        {
          title: "CAPA and effectiveness checks",
          description:
            "Link CAPA to the deviation, complaint, or audit finding that raised it, and schedule effectiveness checks to confirm it worked.",
          icon: ClipboardCheck,
        },
        {
          title: "Complaint intake and routing",
          description:
            "Route complaints on a computed deadline, assign an investigator, and record an adverse-event determination where it applies.",
          icon: FileSearch,
        },
        {
          title: "Change control",
          description:
            "Assess training impact and affected documents before a change is implemented.",
          icon: FileCog,
        },
        {
          title: "Supplier and risk records",
          description:
            "Track supplier qualification, supplier issues, and risk assessments alongside the rest of your quality records.",
          icon: ShieldCheck,
        },
      ],
    },
    {
      eyebrow: "Audit trail",
      title: "Every record change is hash-chained and independently verifiable.",
      description:
        "Each audit event carries a checksum linked to the one before it. Run a chain verification at any time to confirm nothing was altered, and generate an ALCOA+ data integrity report scored against your real audit history.",
      visual: "audit",
      dark: true,
      features: [
        {
          title: "Hash-chained events",
          description:
            "Verify your full audit chain on demand and see exactly where it breaks, if it ever does.",
          icon: Fingerprint,
        },
        {
          title: "Electronic signatures",
          description:
            "Capture a printed name, meaning, and timestamp for each approval, with independent tamper verification.",
          icon: FileKey2,
        },
        {
          title: "ALCOA+ reporting",
          description:
            "Generate a data integrity report scored against your real audit history, attribute by attribute.",
          icon: BookOpenCheck,
        },
      ],
    },
    {
      eyebrow: "Validation evidence",
      title: "Generate your own validation evidence.",
      description: [
        "PixeSci TM can generate installation qualification (IQ) and operational qualification (OQ) reports for its own deployment, a GAMP-categorized risk assessment, and a requirements traceability matrix linking your requirements through design and test coverage.",
        "Self-assessments against 21 CFR Part 11, GMP, and ISO 13485 checklists are generated from your real audit and configuration data, with cited evidence for each control — a starting point for your own validation work, not a replacement for it.",
      ],
      layout: "stacked",
      bullets: [
        "Auto-generated IQ and OQ reports",
        "GAMP-categorized risk assessment",
        "Requirements traceability matrix",
        "Part 11, GMP, and ISO 13485 self-assessments with cited evidence",
      ],
    },
    {
      eyebrow: "Reporting",
      title: "Prepare management review from the same records.",
      description:
        "Build a management review package from open CAPA, effectiveness-check results, and regulatory commitments already in the system, instead of assembling one by hand before every meeting.",
      features: [
        {
          title: "Management review packages",
          description:
            "Assemble CAPA inputs, effectiveness checks, and regulatory commitments into one scheduled review.",
          icon: Users,
        },
        {
          title: "Regulatory commitment tracking",
          description:
            "Track commitments to agencies by due date, with the deliverable and evidence attached.",
          icon: CalendarClock,
        },
      ],
    },
  ],
}

export const materialsProductsPage: ModulePageData = {
  eyebrow: "Materials & products",
  title:
    "Track materials and products from receipt to release, with full genealogy.",
  description:
    "Manage suppliers, material lots, and inventory on one side, and product SKUs, intermediate lots, and Certificates of Analysis on the other, linked by one shared record system and one controlled vocabulary.",
  sections: [
    {
      eyebrow: "Materials",
      title: "Control incoming materials from receipt through release.",
      description: [
        "Qualify suppliers, place purchase orders, and receive material lots into quarantine. Sample and evaluate each lot before it can be released, and track storage conditions, expiry, and retest dates against it.",
        "Every field change is recorded in a change log, and every mutation requires a stated reason — nothing changes silently.",
      ],
      visual: "genealogy",
      features: [
        {
          title: "Supplier qualification",
          description:
            "Qualify, suspend, disqualify, or conditionally approve suppliers, with a real performance record.",
          icon: ShieldCheck,
        },
        {
          title: "Receipt and quarantine",
          description:
            "Receive lots into quarantine, sample them, and release or reject based on your criteria.",
          icon: ClipboardCheck,
        },
        {
          title: "Lot genealogy and ledger",
          description:
            "Track parent-child lot relationships and every inventory transaction against a lot.",
          icon: Network,
        },
        {
          title: "Reorder alerts",
          description:
            "Track purchase orders against real inventory levels and reorder thresholds.",
          icon: PackageCheck,
        },
      ],
    },
    {
      eyebrow: "Products",
      title: "Build finished products on top of traceable material lots.",
      description: [
        "Track product SKUs, finished-good product lots, and in-process intermediate lots as first-class, linked records. Each product lot can cite the intermediate lots and material lots it was built from.",
        "Issue Certificates of Analysis against released product lots. Reissuing a CoA supersedes the prior revision automatically, with the old and new versions linked.",
      ],
      features: [
        {
          title: "Product register",
          description:
            "Track SKUs, product lots, and variant configurations in one register.",
          icon: Boxes,
        },
        {
          title: "Intermediate lot tracking",
          description:
            "Track in-process intermediate lots and cite their source material lots directly.",
          icon: GitBranch,
        },
        {
          title: "Certificates of Analysis",
          description:
            "Issue CoAs against released product lots, with automatic supersession on reissue.",
          icon: BadgeCheck,
        },
      ],
    },
    {
      eyebrow: "Shared registry",
      title: "One controlled vocabulary across materials and products.",
      description:
        "Material and product codes share a single controlled vocabulary registry. Adding a new code doesn't require a document revision, and retiring a code is blocked if it's still in use anywhere in the system. Field-level changes here are the same event stream PixeSci's compliance agents watch continuously across the rest of the platform.",
      visual: "architecture",
      dark: true,
      bullets: [
        "Shared controlled vocabulary across materials and products",
        "Server-side guard against retiring an in-use code",
        "Field-level change log across every register",
        "No client-side actor field — every change is tied to the signed-in user automatically",
      ],
    },
  ],
}

export const manufacturingQualityPage: ModulePageData = {
  eyebrow: "Manufacturing quality",
  title: "Run electronic batch records from dispensing to release.",
  description:
    "Build a batch from an approved Master Batch Record, clear the line, dispense against real material lots, record in-process controls, and release with a built-in e-signature at every approval step.",
  sections: [
    {
      title: "Batches open only from an approved Master Batch Record.",
      description: [
        "Register your product formula and Bill of Materials as controlled documents, then author a Master Batch Record against an approved formula and BOM revision. A production batch can only be opened from an approved MBR revision — the system enforces it, not just the process.",
        "The Electronic Batch Record for that batch derives its product, formula, and BOM linkage automatically, so operators aren't re-entering data the system already knows.",
      ],
      visual: "batch-record",
      features: [
        {
          title: "Versioned MBR",
          description:
            "Author Master Batch Records with the same review, approval, supersede, and obsolete lifecycle as any controlled document.",
          icon: FileCog,
        },
        {
          title: "Line clearance",
          description:
            "Clear the line with a checklist and a captured e-signature before a batch can run.",
          icon: ClipboardCheck,
        },
        {
          title: "Material dispensing",
          description:
            "Dispense against real, released material lots picked from your inventory, not free text.",
          icon: Boxes,
        },
        {
          title: "In-process controls",
          description:
            "Record process parameter results per step, with a failed result automatically raising a deviation.",
          icon: ShieldCheck,
        },
      ],
    },
    {
      eyebrow: "Genealogy",
      title: "See the full batch history in one tree.",
      description:
        "Follow one batch from formula and BOM through the MBR, EBR, dispensing events, in-process control results, finished goods lot, Certificates of Analysis, and any linked deviations — in a single traceability view. PixeSci's Continuous Quality Monitoring watches this same batch history continuously, not just at QA review.",
      visual: "genealogy",
      dark: true,
      bullets: [
        "Formula → BOM → MBR → EBR → dispensing → IPC results → finished lot → CoA",
        "Linked deviations shown in the same view",
        "The same traceability view drives QA review and disposition",
      ],
    },
    {
      eyebrow: "Release",
      title: "Review and release with a captured e-signature.",
      description:
        "QA reviews the full batch context — record, materials, in-process results, lab results, and deviations — in one screen, then approves or rejects with a reason, a printed name, and a re-authentication reference captured on the record. Release shows a readiness view before the release action becomes available.",
      features: [
        {
          title: "QA batch review",
          description:
            "Review the full batch context in one screen before approving or rejecting.",
          icon: UserCheck,
        },
        {
          title: "Disposition and release",
          description:
            "See a release-readiness view before the release action becomes available.",
          icon: BadgeCheck,
        },
        {
          title: "Captured approvals",
          description:
            "Every approval, clearance, and release captures a reason, a printed name, and a re-authentication reference.",
          icon: FileKey2,
        },
      ],
    },
  ],
}

export const equipmentPage: ModulePageData = {
  eyebrow: "Equipment",
  title: "Track qualification, calibration, and maintenance for every asset.",
  description:
    "Register equipment, qualify it by tier, calibrate it on schedule, and track maintenance and repair. An out-of-tolerance calibration automatically opens an investigation, no manual follow-up step required.",
  sections: [
    {
      title: "Register, qualify, and calibrate every asset the same way.",
      description: [
        "Register an asset with its category, location, responsible owner, and qualification tier. Qualify it through installation, operational, and performance qualification, with the owner signing off and quality countersigning as two separate steps.",
        "Calibrate on schedule, with due dates tracked automatically. An out-of-tolerance result flips the asset to in-repair and opens an investigation in the same action, so a failed calibration can't be missed. That flip is also a flagged event in PixeSci's Continuous Quality Monitoring, which routes it the same way as any other exception.",
      ],
      visual: "equipment-lifecycle",
      features: [
        {
          title: "Tiered qualification",
          description:
            "Qualify assets by tier, with the highest tier flagged for continuous monitoring.",
          icon: BadgeCheck,
        },
        {
          title: "Two-party sign-off",
          description:
            "Require the responsible owner to sign, then quality to countersign, on qualification and maintenance.",
          icon: UserCheck,
        },
        {
          title: "Calibration with auto-investigation",
          description:
            "Flip an asset to in-repair and open an investigation automatically when a calibration fails.",
          icon: ShieldCheck,
        },
        {
          title: "Unified history",
          description:
            "See qualification, calibration, maintenance, and repair events for an asset in one timeline.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Register",
      title: "Keep one register for every asset, instrument, and its methods.",
      description:
        "Track instrument methods and firmware or software versions as first-class registers, not buried on each asset page. Track your calibration and maintenance service providers, with their accreditation and a suspend, reactivate, and recertify lifecycle.",
      layout: "stacked",
      bullets: [
        "Full asset register with a real responsible-owner picker from your team",
        "Instrument methods and firmware or software version tracking",
        "Service provider register with accreditation tracking",
        "Category registry you can extend without a new deployment",
      ],
    },
  ],
}

export const documentsTrainingPage: ModulePageData = {
  eyebrow: "Documents & training",
  title: "Connect every controlled document to the training it requires.",
  description:
    "Run Quality Manuals, Policies, SOPs, Work Instructions, and Forms through draft, review, approval, and periodic review — and keep read-and-understand training, competency, and qualification records tied to the exact revision they cover.",
  sections: [
    {
      title: "A real lifecycle, from draft to periodic review.",
      description: [
        "Draft a document, route it for review, approve it, and issue it as the active revision — or supersede, obsolete, or void it later, each a controlled action with a recorded reason, not a status field anyone can edit.",
        "Documents are authored in a structured content editor — named, numbered sections up to three levels deep, with tables, lists, and callout boxes — rendered into one consistent document layout, not a plain text box.",
      ],
      visual: "document-lifecycle",
      features: [
        {
          title: "Draft, review, approve, issue",
          description:
            "Route a new revision through review and approval before it becomes the active document.",
          icon: FileCog,
        },
        {
          title: "Structured authoring",
          description:
            "Author in named, numbered sections rendered into one consistent document layout.",
          icon: FileText,
        },
        {
          title: "Periodic review",
          description:
            "Schedule a review to confirm a document is still accurate, or flag it for revision.",
          icon: History,
        },
        {
          title: "Controlled copies",
          description:
            "Issue numbered copies to recipients, track acknowledgement, and recall a copy when it's replaced.",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      eyebrow: "Training",
      title: "Training tied to the document revision it covers.",
      description:
        "Assign read-and-understand training against a specific document revision, schedule instructor-led sessions, and record competency assessments and role qualifications — each a real record, not a spreadsheet checkbox.",
      visual: "training-record",
      bullets: [
        "Read-and-understand training tied to a specific revision",
        "Instructor-led training by course and instructor",
        "Competency assessments by method — observation, exam, or record review",
        "Qualification records with a renewal due date",
      ],
    },
    {
      eyebrow: "Connected lifecycle",
      title: "A document tagged Training Required can't go active without it.",
      description:
        "When a document is marked as requiring training, it can't be activated until that training is actually delivered and recorded — the connection is enforced, not just documented in a procedure. This kind of connected-record enforcement is the same pattern PixeSci's Continuous Quality Monitoring applies across every module.",
      visual: "audit",
      dark: true,
      bullets: [
        "Training-required documents gate on real delivered training",
        "A training matrix cross-references role requirements against completion",
        "Review frequency tracked per role — annual, biennial, triennial, or on-change",
      ],
    },
    {
      eyebrow: "Connected to the rest of the platform",
      title: "The same documents your other records point back to.",
      description:
        "A CAPA can require an SOP revision. A Master Batch Record is itself a controlled document. Training records here are the same records your quality and manufacturing modules already reference.",
      layout: "stacked",
      bullets: [
        "CAPA-driven document revisions, tracked back to the record that required them",
        "Master Batch Records share this same controlled-document lifecycle",
      ],
    },
  ],
}

export const reportsAnalyticsPage: ModulePageData = {
  eyebrow: "Reports & analytics",
  title: "See every open item across your quality system in one view.",
  description:
    "Roll up deviations, CAPA, complaints, calibrations, and inspection readiness from every module you use. Verify your audit chain, map your controls, and export evidence when you need it.",
  sections: [
    {
      title: "One dashboard, sourced from the modules that own the data.",
      description:
        "See open deviations, nonconformances, investigations, incidents, CAPA, change control, and complaints from Quality Management, alongside equipment, materials, laboratory, and manufacturing summaries — each number comes from the module that owns it, not a re-derived guess.",
      visual: "dashboard",
      features: [
        {
          title: "Per-module dashboards",
          description:
            "See a live summary from Quality, Equipment, Materials, Laboratory, and Manufacturing Quality in one place.",
          icon: LineChart,
        },
        {
          title: "Evidence-gap check",
          description:
            "Check a set of records for missing required approvals, signatures, or evidence links.",
          icon: FileSearch,
        },
        {
          title: "Regulatory commitments",
          description:
            "Track open and overdue commitments to agencies, with the deliverable and evidence attached.",
          icon: CalendarClock,
        },
      ],
    },
    {
      eyebrow: "Inspection readiness",
      title: "Verify your audit chain and map your controls.",
      description: [
        "Run a hash-chain integrity check on your full audit trail at any time. Map your controls against a 21 CFR Part 11 checklist, with each control cited against the real audit and configuration data behind it.",
        "When you need to hand over evidence, export a full audit trail, a complete record with every version and approval, a CSV register of one record type, an evidence manifest, or a bundled inspection pack — every export is a direct, authenticated download. This hash-chain verification and control mapping are the same evidence infrastructure PixeSci's Continuous Quality Monitoring writes into continuously.",
      ],
      visual: "audit",
      dark: true,
      bullets: [
        "On-demand audit chain integrity verification",
        "21 CFR Part 11 control mapping with cited evidence",
        "Audit trail, record, register, evidence, and inspection-pack exports",
      ],
    },
    {
      eyebrow: "Management review",
      title: "Review the same records your management review needs.",
      description:
        "Read a live rollup of open items by category, sourced from the same quality records used everywhere else in the system, instead of assembling a management review deck from separate spreadsheets.",
      features: [
        {
          title: "Management review summaries",
          description:
            "Read a live summary of open CAPA, effectiveness checks, and commitments ahead of your review.",
          icon: Users,
        },
      ],
    },
  ],
}
import { demoBookingUrl } from "@/content/site"
