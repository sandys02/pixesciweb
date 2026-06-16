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
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"
import {
  AuditTimeline,
  CatalogVisual,
  EnvironmentControls,
  HeroAgentMockup,
} from "@/components/visuals"

import { FeatureGrid } from "./feature-grid"
import { SectionShell } from "./section-shell"

export function HomePage() {
  return (
    <>
      <main>
        <section className="hero-grid overflow-hidden border-b border-border">
          <div className="site-container pt-16 pb-16 sm:pb-22 lg:pb-24">
            <div className="grid items-center gap-4 lg:grid-cols-[0.75fr_1.1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                  <CircleDot className="size-3 text-emerald-500" />
                  Connect tools. Automate work. Track every step.
                </div>
                <h1 className="mt-7 text-4xl leading-[1.04] font-semibold md:text-5xl xl:text-6xl">
                  Talk to your lab!
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Connect and automate the scientific software you already use.
                  Describe the work in your own words, review the steps, run
                  locally, and track every action, file, decision, and result.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="px-4">
                    <DemoBookingLink source="home_hero">
                      Request a demo
                      <ArrowRight className="size-4" />
                    </DemoBookingLink>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-4">
                    <Link href="/workflow-automation">
                      Automate your workflow
                    </Link>
                  </Button>
                </div>
              </div>
              <HeroAgentMockup />
            </div>
            <div className="mt-12 grid grid-cols-2 border-t border-l border-border sm:grid-cols-6 lg:mt-16">
              {proofPoints.map((point) => (
                <div
                  key={point}
                  className="border-r border-b border-border px-3 py-4 text-center text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionShell
          eyebrow="The problem"
          title="Your scientific tools work. The handoffs do not."
          description="Labs use different apps for instruments, analysis, statistics, review, and records. People still move files and re-enter data by hand. This makes work slower, harder to repeat, and harder to review."
        >
          <FeatureGrid items={problems} columns={3} />
        </SectionShell>

        <section className="section-space border-t border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Connect your software</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-5xl">
                Connect the tools you already use.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Turn your request into a visual workflow, check each step before
                it runs, keep the work local, and save the results. Operators
                can review and approve controlled steps before they continue.
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
                Start building workflows
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-space dark-surface border-t border-white/10 text-white">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
              <div>
                <p className="eyebrow text-cyan-300">Run it locally</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Run workflows within your own environment.
                </h2>
                <p className="mt-5 text-base leading-7 text-white/62">
                  Keep workflow services, work data, AI models, and software
                  connections inside your own environment. Use lab workstations
                  or your own servers without relying on an outside cloud
                  service.
                </p>
                <ul className="mt-7 space-y-4">
                  {[
                    {
                      title: "Customer-controlled data",
                      description:
                        "Keep workflow data, run history, and audit records inside approved systems.",
                      icon: FolderLock,
                    },
                    {
                      title: "No outside cloud service required",
                      description:
                        "Run on workstations or your own servers without an outside execution service.",
                      icon: CloudOff,
                    },
                    {
                      title: "Controlled connections",
                      description:
                        "Choose which tools, folders, passwords, and networks each workflow can use.",
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
                  Review deployment controls
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <EnvironmentControls />
            </div>
          </div>
        </section>

        <section className="section-space border-t border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <p className="eyebrow">Track every run</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  See what happened during every experiment.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Keep each user, action, setting, result, file, approval, and
                  error with the run. Reviewers can see completed steps and
                  changes without searching through folders and app histories.
                </p>
                <div className="mt-7 space-y-4">
                  {[
                    "Users, roles, sessions, and times",
                    "Software actions, files, and results",
                    "File details, checksums, errors, and reviews",
                    "Human approval for controlled actions",
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
                <p className="eyebrow">Connect your software</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Use each tool the way it was built to work.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Check which apps are supported, which files they need, what
                  results they produce, and where human review belongs. Confirm
                  the right tools are installed before the workflow runs.
                </p>
                <Link
                  href="/integrations"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Explore integrations
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
              <p className="eyebrow">Built for controlled scientific work</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Automate work without losing control of data or records.
              </h2>
            </div>
            <div className="mt-10 grid border-t border-l border-border lg:grid-cols-3">
              {solutionCards.map((solution) => {
                const Icon = solution.icon
                return (
                  <article
                    key={solution.href}
                    className="border-r border-b border-border p-6 sm:p-8"
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
                      Automate this workflow
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
                <p className="eyebrow">Learn how it works</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Give technical and quality teams clear information to review.
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
            <div className="mt-10 grid border-t border-l border-border lg:grid-cols-3">
              {resourceCards.map((resource) => (
                <article
                  key={resource.title}
                  className="border-r border-b border-border p-6 sm:p-8"
                >
                  <p className="eyebrow">{resource.type}</p>
                  <h3 className="mt-8 text-lg font-semibold">
                    {resource.title}
                  </h3>
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
        title="Show us one scientific workflow."
        description="Bring the software, files, manual steps, and reviews. We will show how to connect the tools, run the workflow, and track the process."
        cta="Automate your workflow"
      />
    </>
  )
}
