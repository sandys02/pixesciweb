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

export type LabItemStatus = "linked" | "flagged" | "step" | "pending"

export type LabItem = {
  label: string
  detail: string
  status: LabItemStatus
}

export type LabScript = {
  mode: LabMode
  tab: string
  speaker: "you" | "lab"
  prompt: string
  sources: [LabSource, LabSource, LabSource]
  reply: string
  items: LabItem[]
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
    reply:
      "Injection 7 was repeated at 14:02. No reason was recorded in the run log or in LIMS.",
    items: [
      {
        label: "Run log",
        detail: "injection 7 / repeated 14:02",
        status: "linked",
      },
      { label: "LIMS result", detail: "batch-042 / assay", status: "linked" },
      {
        label: "Reason for repeat",
        detail: "not documented",
        status: "flagged",
      },
    ],
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
    reply: "Here are 4 steps. Nothing runs until you approve them.",
    items: [
      { label: "Pull stability results", detail: "last 7 days", status: "step" },
      { label: "Compare to spec limits", detail: "3 products", status: "step" },
      {
        label: "Chart chamber temperatures",
        detail: "chambers 1–3",
        status: "step",
      },
      {
        label: "Draft the review record",
        detail: "for your sign-off",
        status: "step",
      },
    ],
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
    reply:
      "12 stability samples were stored there overnight. I recommend opening a deviation.",
    items: [
      { label: "Sensor log", detail: "03:40–04:15 / above limit", status: "flagged" },
      { label: "Affected samples", detail: "12 samples / 3 batches", status: "linked" },
      { label: "Deviation draft", detail: "not opened", status: "pending" },
    ],
    outcome: "A qualified reviewer decides",
  },
]
