// @/components/sections/home-page.tsx

import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  CloudOff,
  FolderLock,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"

import {
  complianceDisclaimer,
  platformCapabilities,
  problems,
  proofPoints,
  resourceCards,
  securityHighlights,
  solutionCards,
} from "@/content/site"

import { CTASection } from "@/components/site/cta-section"
import {
  ArchitectureDiagram,
  AuditTimeline,
  CatalogVisual,
  WorkflowVisual,
} from "@/components/visuals"

import { FeatureGrid } from "./feature-grid"
import { SectionShell } from "./section-shell"

export function HomePage() {
  return (
    <>
      <main>
        <section className="hero-grid overflow-hidden border-b border-border">
          <div className="site-container py-16 sm:py-22 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                  <CircleDot className="size-3 text-emerald-500" />
                  Compliance-first scientific workflow orchestration
                </div>
                <h1 className="mt-7 text-4xl font-semibold leading-[1.04] md:text-5xl xl:text-6xl">
                  Connect scientific software into traceable workflows.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Pixesci turns fragmented scientific software handoffs into
                  reusable workflow graphs with local execution, complete run
                  history, review checkpoints, and audit-ready evidence.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact" className="button button-primary">
                    Request a demo
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/workflow-automation"
                    className="button button-secondary"
                  >
                    See how it works
                  </Link>
                </div>
              </div>
              <WorkflowVisual />
            </div>
            <div className="mt-12 grid grid-cols-2 border-l border-t border-border sm:grid-cols-5 lg:mt-16">
              {proofPoints.map((point) => (
                <div
                  key={point}
                  className="border-b border-r border-border px-3 py-4 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionShell
          eyebrow="The structural problem"
          title="Powerful scientific software. Fragmented scientific execution."
          description="Scientific software evolved. Connectivity never did. Many modern laboratories still depend on specialized applications for every stage of research and quality control. Yet critical workflows still depend on manual handoffs between systems. Files, parameters, identifiers, review decisions, and records move across disconnected tools with limited traceability and significant operational risk."
        >
          <FeatureGrid items={problems} columns={3} />
        </SectionShell>

        <section className="section-space border-t border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">The Pixesci platform</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
                An orchestration layer between the tools you already use.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Compliance controls, natural-language planning, graph
                authoring, software capability profiles, local execution,
                templates, artifacts, and audit records operate as one system.
                AI-assisted planning helps express intent, while supported
                capabilities and operator review govern execution.
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={platformCapabilities} />
            </div>
            <div className="mt-8 flex">
              <Link
                href="/product"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Explore the platform
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-space border-t border-white/10 dark-surface text-white">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
              <div>
                <p className="eyebrow text-cyan-300">Local-first architecture</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  The runtime stays close to the data, software, and operator.
                </h2>
                <p className="mt-5 text-base leading-7 text-white/62">
                  Workflow services, operational data, AI resources, software
                  definitions, and scientific application adapters can remain
                  inside the customer-controlled environment. Managed
                  deployments can use approved on-prem infrastructure without
                  an external cloud control plane.
                </p>
                <ul className="mt-7 space-y-4">
                  {[
                    {
                      title: "Customer-controlled data",
                      description:
                        "Keep workflow data, run history, and audit records within approved infrastructure.",
                      icon: FolderLock,
                    },
                    {
                      title: "No hosted control plane required",
                      description:
                        "Operate on workstations or managed on-prem services without an external execution layer.",
                      icon: CloudOff,
                    },
                    {
                      title: "Policy-controlled connectivity",
                      description:
                        "Apply explicit controls to software integrations, paths, credentials, and network access.",
                      icon: ShieldCheck,
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.title} className="flex gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                        <div>
                          <p className="text-sm font-medium text-white/85">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/48">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <Link
                  href="/security"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:underline"
                >
                  Review architecture
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <ArchitectureDiagram />
            </div>
          </div>
        </section>

        <section className="section-space border-t border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <p className="eyebrow">Audit-ready traceability</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Every run ends with evidence teams can understand.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Preserve events, actor and resource context, parameters,
                  outcomes, checksums, artifacts, and review state across the
                  workflow run. A run summary and graphical execution path make
                  completed steps, exceptions, approvals, and produced outputs
                  easier to inspect without reconstructing the process from
                  folders and application histories.
                </p>
                <div className="mt-7 space-y-4">
                  {[
                    "User, role, session, and timestamp context",
                    "Workflow, software, file, and outcome events",
                    "Metadata, checksums, severity, and review state",
                    "Human checkpoints for controlled actions",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-7 border-l-2 border-amber-400 pl-4 text-xs leading-5 text-muted-foreground">
                  {complianceDisclaimer}
                </p>
                <Link
                  href="/compliance"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  See compliance workflows
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <AuditTimeline />
            </div>
          </div>
        </section>

        <section className="section-space border-t border-border bg-muted/25">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
              <div>
                <p className="eyebrow">Capability-based integrations</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Connect existing software without pretending every tool works
                  the same way.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Profiles describe setup, formats, requirements, channels,
                  operational constraints, and required user input for each
                  supported application. Local detection then confirms which
                  applications are available in the target execution
                  environment.
                </p>
                <Link
                  href="/integrations"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Explore integration categories
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <CatalogVisual />
            </div>
          </div>
        </section>

        <section className="section-space border-t border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">
                Built for high-compliance, high-control environments
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Start where compliance, traceability, and deployment control
                matter most.
              </h2>
            </div>
            <div className="mt-10 grid border-l border-t border-border lg:grid-cols-3">
              {solutionCards.map((solution) => {
                const Icon = solution.icon
                return (
                  <article
                    key={solution.href}
                    className="border-b border-r border-border p-6 sm:p-8"
                  >
                    <Icon className="size-5 text-primary" />
                    <h3 className="mt-10 text-lg font-semibold">
                      {solution.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {solution.description}
                    </p>
                    <p className="mt-6 border-t border-border pt-5 font-mono text-[10px] leading-5 text-muted-foreground">
                      {solution.examples}
                    </p>
                    <Link
                      href={solution.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      View solution
                      <ArrowRight className="size-4" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-space border-t border-border bg-muted/25">
          <div className="site-container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">Evaluation resources</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Give technical and quality teams concrete material to review.
                </h2>
              </div>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View all resources
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid border-l border-t border-border lg:grid-cols-3">
              {resourceCards.map((resource) => (
                <article
                  key={resource.title}
                  className="border-b border-r border-border p-6 sm:p-8"
                >
                  <p className="eyebrow">{resource.type}</p>
                  <h3 className="mt-8 text-lg font-semibold">{resource.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {resource.description}
                  </p>
                  <Link
                    href={resource.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Open resource
                    <ArrowRight className="size-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="site-container grid gap-6 py-8 sm:grid-cols-3">
            {securityHighlights.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <h2 className="text-sm font-semibold">{item.title}</h2>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <CTASection
        title="Map one scientific workflow with Pixesci."
        description="Show us the software, files, manual handoffs, review points, and deployment constraints. We will turn the process into an orchestration plan."
        cta="Request a demo"
      />
    </>
  )
}
