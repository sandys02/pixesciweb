// @/components/sections/resources-page.tsx

import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  ClipboardList,
  FileKey2,
  GitBranch,
  HelpCircle,
  Network,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"

import { CTASection } from "@/components/site/cta-section"

const resources = [
  {
    title: "Local-first architecture overview",
    type: "Technical brief",
    description:
      "Desktop interface, localhost backend, local state, local models, profile packs, and software adapters.",
    href: "/security",
    icon: Network,
  },
  {
    title: "Compliance workflow guide",
    type: "Quality evaluation",
    description:
      "Audit events, metadata, checksums, review checkpoints, retention posture, and validation responsibility.",
    href: "/compliance",
    icon: BookOpenCheck,
  },
  {
    title: "Graph workflow mechanics",
    type: "Product guide",
    description:
      "Nodes, edges, variables, data bus, capability validation, console, preview, notes, and IDE.",
    href: "/workflow-automation",
    icon: GitBranch,
  },
  {
    title: "Integration capability model",
    type: "Technical note",
    description:
      "Software setup, formats, execution channels, risk, local detection, and human-input flags.",
    href: "/integrations",
    icon: Boxes,
  },
  {
    title: "Security and deployment brief",
    type: "Deployment guide",
    description:
      "Workstation, managed lab, on-prem, airgapped policy, local secrets, and controlled paths.",
    href: "/security",
    icon: ShieldCheck,
  },
  {
    title: "Data integrity evaluation checklist",
    type: "Buyer checklist",
    description:
      "Assess attribution, metadata, versioning, scripted processing, file lineage, changes, and reviewability.",
    href: "/compliance",
    icon: FileKey2,
  },
] as const
export const resourceFaqs = [
  [
    "What is PixeSci?",
    "PixeSci is a compliance-first AI platform that connects fragmented scientific software into automated, traceable workflows. Instead of moving data manually between tools, scientists can orchestrate complex workflows through a single interface while maintaining execution history, reproducibility, and auditability.",
  ],

  [
    "Is PixeSci a cloud workflow platform?",
    "No. PixeSci is designed as a local-first platform. The canonical runtime is a desktop interface communicating with a local FastAPI sidecar over localhost. On-premises services, internal infrastructure, and controlled environments can be integrated according to customer policy.",
  ],

  [
    "Can PixeSci be deployed on-premises or air-gapped?",
    "Yes. PixeSci supports on-premises and air-gapped deployments where required. Organizations can operate within their own infrastructure and security boundaries without requiring cloud-hosted workflow execution.",
  ],

  [
    "Can PixeSci use AI without sending data to the cloud?",
    "Yes. PixeSci supports local-first AI deployment strategies, including locally hosted models and controlled infrastructure environments. Available AI capabilities depend on customer deployment requirements and approved model configurations.",
  ],

  [
    "Does PixeSci replace LIMS, ELN, CDS, or QMS platforms?",
    "No. PixeSci is an orchestration and execution layer. Existing systems such as LIMS, ELNs, CDS platforms, QMS solutions, and data repositories remain systems of record while participating in automated workflows.",
  ],

  [
    "How does PixeSci integrate with existing scientific software?",
    "PixeSci connects scientific software, instruments, databases, file systems, and internal services through adapters, connectors, APIs, workflow automation, and capability profiles. Integration readiness must be validated for each specific software product, version, and deployment environment.",
  ],

  [
    "Is PixeSci built for regulated scientific workflows?",
    "Yes. PixeSci is designed to support traceable workflows, electronic records, audit history, review processes, and data-integrity requirements commonly found in regulated scientific environments. Customers remain responsible for validation, SOPs, quality-system implementation, and regulatory compliance.",
  ],

  [
    "How are audit trails and workflow history handled?",
    "Workflow execution events, data movement, user actions, system activity, and workflow outcomes can be recorded as traceable execution history. Auditability, retention, and review processes depend on deployment configuration and organizational requirements.",
  ],

  [
    "How does PixeSci support reproducibility and traceability?",
    "PixeSci records workflow execution history, data movement, workflow variables, and system activity so scientific processes can be reviewed, repeated, investigated, and standardized more consistently. Available traceability depends on deployment configuration and organizational requirements.",
  ],

  [
    "What about validation and change control?",
    "PixeSci supports validation and change-management processes through documentation, configuration controls, workflow versioning, execution history, and traceability features. Validation requirements vary by organization, deployment model, and regulated use case.",
  ],

  [
    "Does PixeSci guarantee regulatory compliance?",
    "No software can guarantee regulatory compliance on its own. PixeSci is designed to orchestrate the workflows that compliance requires and, in doing so, produce execution records, data lineage, audit trails, attribution evidence, and reviewable workflow history. Final compliance depends on how the customer validates, configures, governs, trains users, and operates the system within their quality program.",
  ],

  [
    "Are all named software integrations production-ready?",
    "No. The catalog represents software categories, capability profiles, integration concepts, and representative ecosystem examples. Production readiness must be confirmed for the specific software, version, deployment model, and customer requirements.",
  ],
] as const

export function ResourcesPage() {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <p className="eyebrow">Resources</p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
                Evaluate Pixesci through architecture, workflow, and evidence.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                A starting library for technical buyers, quality teams, lab IT,
                facility operators, and scientific workflow owners.
              </p>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="grid border-t border-l border-border lg:grid-cols-3">
              {resources.map((resource) => {
                const Icon = resource.icon
                return (
                  <article
                    key={resource.title}
                    className="border-r border-b border-border p-6 sm:p-8"
                  >
                    <Icon className="size-5 text-primary" />
                    <p className="eyebrow mt-9">{resource.type}</p>
                    <h2 className="mt-3 text-lg font-semibold">
                      {resource.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {resource.description}
                    </p>
                    <Link
                      href={resource.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Read overview
                      <ArrowRight className="size-4" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container flex flex-col gap-10 lg:gap-16">
            <div>
              <HelpCircle className="size-5 text-primary" />
              <h2 className="mt-5 text-3xl leading-tight font-semibold sm:text-4xl">
                Questions technical evaluators ask first.
              </h2>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {resourceFaqs.map(([question, answer]) => (
                <details
                  key={question}
                  name="resource-faq"
                  className="group py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold">
                    {question}
                    <span className="text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="site-container grid gap-6 py-8 sm:grid-cols-2">
            <div className="flex gap-3">
              <ClipboardList className="mt-0.5 size-4 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                Implementation paths are scoped around the customer&apos;s
                software, workflow, deployment, and review requirements.
              </p>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                Product evaluation should confirm current connector readiness
                and required validation for the intended environment.
              </p>
            </div>
          </div>
        </section>
      </main>
      <CTASection
        title="Turn evaluation questions into a workflow review."
        description="Bring your software stack, deployment constraints, data flow, and evidence requirements."
        cta="Contact Pixesci"
      />
    </>
  )
}
