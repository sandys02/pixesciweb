// @/content/solutions.ts

import {
  Blocks,
  BookOpenCheck,
  FileClock,
  ListChecks,
  LockKeyhole,
  Network,
  RadioTower,
  ScanLine,
  ScanSearch,
  ShieldCheck,
  Unplug,
  Variable,
} from "lucide-react"

import type { PageSection } from "@/content/pages"

export type SolutionProduct = {
  id: string
  label: string
  obstacle: string
  gift: string
  section: PageSection
  href: string
  linkLabel: string
}

export const qualityCore = {
  id: "quality-core",
  label: "Quality Core",
  obstacle: "Evidence gets rebuilt after the fact.",
  gift: "One connected record, so the answer is already there when someone asks.",
  eyebrow: "Quality Core",
  title: "Everything you need to show, in one place.",
  description:
    "Samples, deviations, materials, batches, equipment, documents, and reports live in one connected record with one audit trail. When someone asks what happened, you have the answer without going hunting through systems.",
} as const

export const solutionProducts: SolutionProduct[] = [
  {
    id: "integrations",
    label: "Integrations",
    obstacle: "Your systems don't talk to each other.",
    gift: "We connect them, so your team stops being the glue.",
    href: "/integrations",
    linkLabel: "See what's connected today",
    section: {
      eyebrow: "Integrations",
      title: "Your tools start working together.",
      description: [
        "We connect the instruments, software, and records you already use, so your team stops being the glue between them. You keep every system you have.",
        "We're starting with chromatography data and checking for missing or bad records as they arrive. See exactly what's connected today, and what's coming.",
      ],
      visual: "catalog",
      features: [
        {
          title: "Keep the tools you have",
          description: "Nothing to rip out or replace.",
          icon: Unplug,
        },
        {
          title: "See records side by side",
          description:
            "Compare what different systems say about the same event.",
          icon: Network,
        },
        {
          title: "Bad data caught on arrival",
          description:
            "Missing or malformed records are flagged when they arrive, not when a reviewer goes looking.",
          icon: ScanSearch,
        },
        {
          title: "Know what's connected",
          description:
            "Every connection is labeled connected today or on the roadmap, so there are no surprises after the demo.",
          icon: ListChecks,
        },
      ],
    },
  },
  {
    id: "agentic-automation",
    label: "Agentic Automation",
    obstacle: "Someone has to connect it all by hand.",
    gift: "Routine QC work runs for you, with your sign-off.",
    href: "/platform/workflow-automation",
    linkLabel: "See how a request becomes a run",
    section: {
      eyebrow: "Agentic Automation",
      title: "Routine work gets done, and you stay in charge.",
      description: [
        "Tell PixeSci what needs to happen in plain language. You review the steps, then it runs them across your systems, on your own hardware and inside your permissions.",
        "It only does what you've approved. It can't approve, close, release, invalidate, or sign a record, and anything that could affect a live instrument goes to a person first.",
      ],
      visual: "console",
      dark: true,
      features: [
        {
          title: "Ask in plain language",
          description:
            "Start from a request, a repeated handoff, or an SOP.",
          icon: Blocks,
        },
        {
          title: "Review before it runs",
          description: "See the steps, inputs, settings, and limits first.",
          icon: BookOpenCheck,
        },
        {
          title: "Approval where it matters",
          description: "Higher-risk actions wait for a person.",
          icon: LockKeyhole,
        },
        {
          title: "A record of every run",
          description:
            "Every action, file, setting, and approval is saved with the run.",
          icon: FileClock,
        },
      ],
    },
  },
  {
    id: "continuous-quality-monitoring",
    label: "Continuous Quality Monitoring",
    obstacle: "Problems surface late.",
    gift: "We watch around the clock and flag early.",
    href: "/platform/agents",
    linkLabel: "See how you stay in control",
    section: {
      eyebrow: "Continuous Quality Monitoring",
      title: "Know about problems while they're still small.",
      description: [
        "Around the clock, PixeSci watches instrument runs, audit-trail entries, environmental readings, and record completeness across your connected systems, and flags exceptions to the right person as they happen.",
        "Every flag becomes a quality workflow for you to investigate. PixeSci recommends; you decide.",
      ],
      visual: "agent-orchestrator",
      features: [
        {
          title: "See exactly why it flagged",
          description:
            "Flags come from clear rules you can read, not a black box.",
          icon: Variable,
        },
        {
          title: "Spot records that disagree",
          description:
            "Catch it when two systems tell different stories about the same event.",
          icon: ScanLine,
        },
        {
          title: "No waiting for review day",
          description: "Events are checked as they happen, not on a schedule.",
          icon: RadioTower,
        },
        {
          title: "Flags become investigations",
          description:
            "An exception, including an environmental excursion, becomes a quality record, not a lost alert.",
          icon: ShieldCheck,
        },
      ],
    },
  },
]
