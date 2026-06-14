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
    title: "Local-first deployment overview",
    type: "Technical brief",
    description:
      "See how workflows stay close to local data, approved models, and lab software.",
    href: "/security",
    icon: Network,
  },
  {
    title: "Compliance workflow guide",
    type: "Quality evaluation",
    description:
      "Check how actions, file details, checksums, reviews, and approvals stay ready for inspection.",
    href: "/compliance",
    icon: BookOpenCheck,
  },
  {
    title: "Workflow automation patterns",
    type: "Product guide",
    description:
      "Turn steps, files, settings, checks, notes, and results into a repeatable workflow.",
    href: "/workflow-automation",
    icon: GitBranch,
  },
  {
    title: "Software integration guide",
    type: "Evaluation guide",
    description:
      "Review which tools can connect, what outcomes they support, and where people approve the work.",
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
      "Check how users, files, versions, scripts, changes, and reviews stay linked to each run.",
    href: "/compliance",
    icon: FileKey2,
  },
] as const
export const resourceFaqs = [
  [
    "What can my team automate?",
    "Connect and automate scientific software. Scientists can describe work in their own words, review the steps, run the workflow, and track every action, file, setting, and result.",
  ],

  [
    "Is PixeSci a cloud workflow platform?",
    "No. Workflows run locally by default, close to the software and files your team already controls. Teams can also connect approved internal systems and run workflows on their own servers.",
  ],

  [
    "Can PixeSci be deployed on-premises or air-gapped?",
    "Yes. Teams can run workflows on their own servers or in an air-gapped environment. Workflows do not need a cloud service to run.",
  ],

  [
    "Can PixeSci use AI without sending data to the cloud?",
    "Yes. Teams can use approved AI models that run locally or inside their own infrastructure. Available features depend on the models and setup your team approves.",
  ],

  [
    "Does PixeSci replace LIMS, ELN, CDS, or QMS platforms?",
    "No. Keep those systems as your official records while workflows move approved work between them.",
  ],

  [
    "How does PixeSci integrate with existing scientific software?",
    "Start with the tools, file types, review points, and outcomes your team needs. Each tool and version must be tested in the environment where it will run.",
  ],

  [
    "Is PixeSci built for regulated scientific workflows?",
    "Yes. Teams can track workflows, records, changes, reviews, and data integrity. Customers still must validate the system, maintain SOPs, train users, and meet their own regulatory duties.",
  ],

  [
    "How are audit trails and workflow history handled?",
    "Workflow steps, file movement, user actions, system events, and results can stay with each run. Your setup and policies determine how long records are kept and how teams review them.",
  ],

  [
    "How does PixeSci help teams repeat and track work?",
    "Keep steps, files, settings, users, and results linked to each run. Teams can use this history to review, repeat, investigate, and standardize their work.",
  ],

  [
    "What about validation and change control?",
    "Track workflow versions, settings, changes, and run history. Each organization must decide how to validate and control those changes.",
  ],

  [
    "Does PixeSci guarantee regulatory compliance?",
    "No. Software alone cannot guarantee compliance. Teams can run controlled workflows and produce records, audit trails, file history, user links, and review history. Compliance still depends on how the customer validates, configures, and operates the system.",
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
                Connect software. Automate workflows. Track scientific work.
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
                    Read workflow guide
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
                Plan each setup around your software, workflow, environment,
                and review needs.
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
        title="Review one workflow from start to finish."
        description="Bring your software, setup rules, data flow, and record needs."
        cta="Start building workflows"
      />
    </>
  )
}
