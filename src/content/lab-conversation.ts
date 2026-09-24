import type { LucideIcon } from "lucide-react"
import {
  ClipboardCheck,
  Database,
  FileClock,
  FlaskConical,
  ListChecks,
  Thermometer,
} from "lucide-react"

export type LabMode = "ask" | "tell" | "watch"

export type LabSource = {
  label: string
  detail: string
  icon: LucideIcon
}

export type LabTaskStatus = "linked" | "flagged" | "step" | "pending"

export type LabTask = {
  working: string
  label: string
  detail: string
  status: LabTaskStatus
  source: 0 | 1 | 2
  ms: number
}

export type LabScript = {
  mode: LabMode
  tab: string
  speaker: "you" | "lab"
  prompt: string
  sources: [LabSource, LabSource, LabSource]
  tasks: LabTask[]
  reply: string
  outcome: string
}

export const labBoundary =
  "Recommendation only. It cannot approve, close, release, or sign a record."

export const labScripts: LabScript[] = [
  {
    mode: "ask",
    tab: "Ask",
    speaker: "you",
    prompt: "Why was batch-042 reinjected?",
    sources: [
      { label: "CDS", detail: "run log", icon: FlaskConical },
      { label: "LIMS", detail: "batch-042", icon: Database },
      { label: "Audit trail", detail: "user activity", icon: FileClock },
    ],
    tasks: [
      {
        working: "Reading the CDS run log",
        label: "Run log",
        detail: "injection 7 / repeated 14:02",
        status: "linked",
        source: 0,
        ms: 1100,
      },
      {
        working: "Matching the LIMS result",
        label: "LIMS result",
        detail: "batch-042 / assay",
        status: "linked",
        source: 1,
        ms: 1000,
      },
      {
        working: "Checking the audit trail for a reason",
        label: "Reason for repeat",
        detail: "not documented",
        status: "flagged",
        source: 2,
        ms: 1300,
      },
    ],
    reply:
      "Injection 7 was repeated at 14:02. No reason was recorded in the run log or in LIMS.",
    outcome: "Flagged for a reviewer",
  },
  {
    mode: "tell",
    tab: "Tell",
    speaker: "you",
    prompt: "Start the weekly stability trend review.",
    sources: [
      { label: "LIMS", detail: "stability results", icon: Database },
      { label: "Chambers", detail: "temperature logs", icon: Thermometer },
      { label: "QMS", detail: "review procedure", icon: ClipboardCheck },
    ],
    tasks: [
      {
        working: "Finding this week's stability results",
        label: "Pull stability results",
        detail: "last 7 days / ready",
        status: "step",
        source: 0,
        ms: 1000,
      },
      {
        working: "Checking spec limits for each product",
        label: "Compare to spec limits",
        detail: "3 products / ready",
        status: "step",
        source: 0,
        ms: 900,
      },
      {
        working: "Locating chamber temperature logs",
        label: "Chart chamber temperatures",
        detail: "chambers 1–3 / ready",
        status: "step",
        source: 1,
        ms: 1100,
      },
      {
        working: "Drafting the review record",
        label: "Draft the review record",
        detail: "for your sign-off",
        status: "step",
        source: 2,
        ms: 1200,
      },
    ],
    reply: "Here are 4 steps. Nothing runs until you approve them.",
    outcome: "Waiting for your approval",
  },
  {
    mode: "watch",
    tab: "Watch",
    speaker: "lab",
    prompt: "Cold room 2 humidity passed its alert limit at 03:40.",
    sources: [
      { label: "Monitoring", detail: "cold room 2", icon: Thermometer },
      { label: "LIMS", detail: "stored samples", icon: Database },
      { label: "QMS", detail: "deviation procedure", icon: ListChecks },
    ],
    tasks: [
      {
        working: "Reading the sensor log",
        label: "Sensor log",
        detail: "03:40–04:15 / above limit",
        status: "flagged",
        source: 0,
        ms: 1100,
      },
      {
        working: "Finding samples stored in cold room 2",
        label: "Affected samples",
        detail: "12 samples / 3 batches",
        status: "linked",
        source: 1,
        ms: 1200,
      },
      {
        working: "Preparing a deviation draft",
        label: "Deviation draft",
        detail: "not opened / for your review",
        status: "pending",
        source: 2,
        ms: 1100,
      },
    ],
    reply:
      "12 stability samples were stored there overnight. I recommend opening a deviation.",
    outcome: "A qualified reviewer decides",
  },
]
