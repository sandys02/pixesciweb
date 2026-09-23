// @/components/sections/workflow-automation-page.tsx

import {
  ArrowRight,
  Blocks,
  BrainCircuit,
  CheckCheck,
  FileClock,
  FileText,
  GitBranch,
  Laptop,
  Library,
  ListChecks,
  MessageSquareText,
  MonitorCog,
  Network,
  PackageCheck,
  PanelTop,
  RadioTower,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import Link from "next/link"

import { TrademarkText } from "@/components/site/brand-name"
import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"
import { CatalogVisual, HeroAgentMockup } from "@/components/visuals"

import { FeatureGrid } from "./feature-grid"

const overviewLoop = [
  {
    title: "Describe the work",
    description:
      "Start from a plain-language request, a repeated handoff, or an SOP that needs to become a runnable process.",
    icon: MessageSquareText,
  },
  {
    title: "Review the workflow",
    description:
      "Inspect the software steps, inputs, settings, limits, and review points before the workflow runs.",
    icon: ListChecks,
  },
  {
    title: "Run in your environment",
    description:
      "Use approved workstations, local software, controlled folders, and customer-managed servers.",
    icon: Laptop,
  },
  {
    title: "Track the run record",
    description:
      "Keep actions, files, settings, decisions, approvals, errors, and results with the workflow history.",
    icon: FileClock,
  },
]

const authoringFeatures = [
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
]

const executionFeatures = [
  {
    title: "Execution events",
    description:
      "Record progress, retries, time, errors, and files during every run.",
    icon: RadioTower,
  },
  {
    title: "Output files",
    description:
      "Keep generated files, working data, and final results with the run that made them.",
    icon: FileText,
  },
  {
    title: "Human review steps",
    description:
      "Ask an operator to decide, confirm, or review a step, with each review step scored by risk level.",
    icon: UserCheck,
  },
  {
    title: "Safety gates",
    description:
      "Ask for approval before a step changes a system, instrument, or file.",
    icon: ShieldCheck,
  },
]

const aiInterfaceFeatures = [
  {
    title: "Local model routing",
    description: "Use approved local AI models inside your own environment.",
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
    title: "Choose what PixeSci can use",
    description:
      "Let PixeSci use the full workspace or limit it to one workflow, run, file, or investigation.",
    icon: Network,
  },
  {
    title: "Governed actions",
    description:
      "Every action — human, workflow, or AI-initiated — runs through a capability registry that knows its risk level, required permissions, and whether it's safe to run automatically.",
    icon: ShieldCheck,
  },
  {
    title: "Continuous compliance monitoring",
    description:
      "The same capability registry also runs a deterministic set of compliance rules continuously against connected systems — not just when a workflow runs.",
    icon: RadioTower,
  },
]

export function WorkflowAutomationPage() {
  return (
    <>
      <main>
        <section className="hero-grid overflow-hidden border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.05fr] lg:gap-12">
              <div>
                <p className="eyebrow">Agentic Automation</p>
                <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl">
                  Ask your lab to do the work, and check it before it runs.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  <TrademarkText text="Say what you need in plain language. You review the steps, then PixeSci runs them on your own systems and keeps a record you can repeat and review later." />
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="px-4">
                    <DemoBookingLink source="workflow_automation_hero">
                      Automate your workflow
                      <ArrowRight className="size-4" />
                    </DemoBookingLink>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-4">
                    <Link href="/integrations">Explore integrations</Link>
                  </Button>
                </div>
              </div>
              <HeroAgentMockup />
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Overview</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                From a request to a finished, recorded run.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text="PixeSci connects scientific software around a simple workflow loop: describe the work, check the steps, run them locally, and keep the record for repeat runs and review." />
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={overviewLoop} columns={3} />
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
              <div>
                <p className="eyebrow">Authoring</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Build a process once and reuse it every time.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Connect software steps, files, settings, and review points on
                  one canvas. Check the full process before it runs, then save
                  it for the next experiment.
                </p>
              </div>
              <FeatureGrid items={authoringFeatures} columns={2} />
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
              <div>
                <p className="eyebrow">Software catalog</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Check what each tool can do before you run it.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  See which apps are supported, which files they need, what
                  they produce, and what setup the run requires. Confirm the
                  required software is available on the computer that will
                  run the workflow, so teams can repeat the same process
                  across workstations and sites.
                </p>
              </div>
              <CatalogVisual />
            </div>
            <div className="mt-10">
              <FeatureGrid
                items={[
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
                ]}
                columns={3}
              />
            </div>
          </div>
        </section>

        <section className="section-space dark-surface border-b border-white/10 text-white">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow text-icy">Execution</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Watch every step as it runs on your own systems.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/62">
                Run workflows where your software and data already live.
                Watch progress, results, errors, and decisions as they
                happen. Pause any controlled step until a person approves it.
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={executionFeatures} dark columns={3} />
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Interface</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Talk to your lab!
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Describe the work in your own words. Turn the request into
                clear software steps that you can review before anything
                runs.{" "}
                <Link
                  href="/platform/agents"
                  className="font-medium text-primary hover:underline"
                >
                  See the full mechanism
                </Link>
                , including what PixeSci can never do on its own.
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={aiInterfaceFeatures} columns={3} />
            </div>
          </div>
        </section>
      </main>
      <CTASection
        title="Turn one manual handoff into an automated workflow."
        description="Bring your SOP, software, files, and approval steps. We will map them into a workflow you can review and run."
        cta="Automate your workflow"
      />
    </>
  )
}
