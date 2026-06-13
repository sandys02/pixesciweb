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
    "Is Pixesci a cloud workflow platform?",
    "No. The canonical runtime is a desktop interface communicating with a local FastAPI sidecar over localhost. On-prem services and internal shares can be added under customer policy.",
  ],
  [
    "Does Pixesci replace LIMS or ELN?",
    "Pixesci is an execution and orchestration layer. LIMS and ELN remain systems of record and can participate as destinations or workflow steps.",
  ],
  [
    "Does Pixesci guarantee regulatory compliance?",
    "No. Pixesci supports traceable workflows and reviewable evidence. Customers remain responsible for validation, SOPs, configuration, training, and quality-system use.",
  ],
  [
    "Are all named software integrations production-ready?",
    "No. The catalog represents software categories, profile concepts, and representative ecosystem examples. Readiness must be confirmed for the specific tool, version, and deployment.",
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
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
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
            <div className="grid border-l border-t border-border lg:grid-cols-3">
              {resources.map((resource) => {
                const Icon = resource.icon
                return (
                  <article
                    key={resource.title}
                    className="border-b border-r border-border p-6 sm:p-8"
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
          <div className="site-container grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div>
              <HelpCircle className="size-5 text-primary" />
              <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
                Questions technical evaluators ask first.
              </h2>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {resourceFaqs.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold">
                    {question}
                    <span className="text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
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
