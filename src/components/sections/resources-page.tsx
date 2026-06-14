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
      "See where PixeSci runs, stores data, uses local models, and connects software.",
    href: "/security",
    icon: Network,
  },
  {
    title: "Compliance workflow guide",
    type: "Quality evaluation",
    description:
      "See how PixeSci records actions, file details, checksums, reviews, and approvals.",
    href: "/compliance",
    icon: BookOpenCheck,
  },
  {
    title: "Graph workflow mechanics",
    type: "Product guide",
    description:
      "See how PixeSci connects steps, files, settings, checks, notes, and results.",
    href: "/workflow-automation",
    icon: GitBranch,
  },
  {
    title: "Integration capability model",
    type: "Technical note",
    description:
      "See how PixeSci records setup, file types, connection methods, risk, and user input.",
    href: "/integrations",
    icon: Boxes,
  },
  {
    title: "Security and deployment brief",
    type: "Deployment guide",
    description:
      "Compare workstation, lab, local server, and air-gapped setup options.",
    href: "/security",
    icon: ShieldCheck,
  },
  {
    title: "Data integrity evaluation checklist",
    type: "Buyer checklist",
    description:
      "Check how PixeSci tracks users, files, versions, scripts, changes, and reviews.",
    href: "/compliance",
    icon: FileKey2,
  },
] as const
export const resourceFaqs = [
  [
    "What is PixeSci?",
    "PixeSci connects and automates scientific software. Scientists can describe work in their own words, review the steps, run the workflow, and track every action, file, setting, and result.",
  ],

  [
    "Is PixeSci a cloud workflow platform?",
    "No. PixeSci runs locally by default. Its desktop app talks to a local service on the same computer. Teams can also connect approved internal systems and run PixeSci on their own servers.",
  ],

  [
    "Can PixeSci be deployed on-premises or air-gapped?",
    "Yes. Teams can run PixeSci on their own servers or in an air-gapped environment. Workflows do not need a cloud service to run.",
  ],

  [
    "Can PixeSci use AI without sending data to the cloud?",
    "Yes. PixeSci can use approved AI models that run locally or inside your own infrastructure. Available features depend on the models and setup your team approves.",
  ],

  [
    "Does PixeSci replace LIMS, ELN, CDS, or QMS platforms?",
    "No. PixeSci connects these systems and moves work between them. Your LIMS, ELN, CDS, QMS, and data stores can remain the official systems of record.",
  ],

  [
    "How does PixeSci integrate with existing scientific software?",
    "PixeSci connects tools through command lines, APIs, scripts, files, and desktop controls. Each tool and version must be tested in the environment where it will run.",
  ],

  [
    "Is PixeSci built for regulated scientific workflows?",
    "Yes. PixeSci helps teams track workflows, records, changes, reviews, and data integrity. Customers still must validate the system, maintain SOPs, train users, and meet their own regulatory duties.",
  ],

  [
    "How are audit trails and workflow history handled?",
    "PixeSci can record workflow steps, file movement, user actions, system events, and results. Your setup and policies determine how long records are kept and how teams review them.",
  ],

  [
    "How does PixeSci help teams repeat and track work?",
    "PixeSci records steps, files, settings, users, and results. Teams can use this history to review, repeat, investigate, and standardize their work.",
  ],

  [
    "What about validation and change control?",
    "PixeSci tracks workflow versions, settings, changes, and run history. Each organization must decide how to validate and control those changes.",
  ],

  [
    "Does PixeSci guarantee regulatory compliance?",
    "No. Software alone cannot guarantee compliance. PixeSci helps teams run controlled workflows and produce records, audit trails, file history, user links, and review history. Compliance still depends on how the customer validates, configures, and operates the system.",
  ],

  [
    "Are all named software integrations production-ready?",
    "No. The catalog shows target software and possible ways to connect it. Teams must confirm readiness for each tool, version, setup, and use case.",
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
                See how PixeSci connects, runs, and tracks scientific work.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Read clear guides for technical teams, quality teams, lab IT,
                facility operators, and workflow owners.
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
                Get clear answers to common questions.
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
                We plan each setup around the customer&apos;s software,
                workflow, environment, and review needs.
              </p>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                Test each software connection and complete the validation your
                environment requires.
              </p>
            </div>
          </div>
        </section>
      </main>
      <CTASection
        title="Review one workflow with PixeSci."
        description="Bring your software, setup rules, data flow, and record needs."
        cta="Contact PixeSci"
      />
    </>
  )
}
