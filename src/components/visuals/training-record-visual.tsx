import {
  CalendarClock,
  Check,
  CircleDashed,
  ClipboardCheck,
  FileText,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

type RecordStatus = "complete" | "scheduled"

const records: {
  label: string
  detail: string
  status: RecordStatus
  icon: typeof Check
}[] = [
  {
    label: "Read-and-understand",
    detail: "Rev C acknowledgment",
    status: "complete",
    icon: FileText,
  },
  {
    label: "Instructor-led session",
    detail: "Aseptic technique · 2026-09-02",
    status: "complete",
    icon: Users,
  },
  {
    label: "Competency assessment",
    detail: "Observation method",
    status: "scheduled",
    icon: ClipboardCheck,
  },
  {
    label: "Qualification",
    detail: "Renews 2027-01-15",
    status: "complete",
    icon: CalendarClock,
  },
]

export function TrainingRecordVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Training record showing read-and-understand, instructor-led, competency assessment, and qualification status for one document revision"
    >
      {/* TODO: Replace with real PixeSci TM training matrix screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Training record / SOP-105 · Rev C</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-600">
          <Check className="size-3.5" />3 of 4 complete
        </span>
      </figcaption>
      <div className="divide-y divide-border">
        {records.map((record) => {
          const Icon = record.icon
          return (
            <div
              key={record.label}
              className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border",
                  record.status === "complete"
                    ? "border-emerald-600/25 bg-emerald-500/10 text-emerald-700"
                    : "border-amber-600/30 bg-amber-500/10 text-amber-700"
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium">
                  {record.label}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[9px] text-muted-foreground">
                  {record.detail}
                </span>
              </span>
              <span
                className={cn(
                  "flex items-center gap-1.5 font-mono text-[9px] tracking-[0.08em] uppercase",
                  record.status === "complete"
                    ? "text-emerald-700"
                    : "text-amber-700"
                )}
              >
                {record.status === "complete" ? (
                  <Check className="size-3" />
                ) : (
                  <CircleDashed className="size-3" />
                )}
                {record.status === "complete" ? "Complete" : "Scheduled"}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-muted/20 px-4 py-3 text-[10px] text-muted-foreground sm:px-6">
        <FileText className="size-3.5 text-primary" />
        Tied to SOP-105 · Rev C — a new revision retriggers this record
      </div>
    </figure>
  )
}
