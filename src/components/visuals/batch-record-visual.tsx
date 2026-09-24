import { Check, CircleDashed, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const stages = [
  { label: "Dispensing", status: "done" },
  { label: "Line clearance", status: "done" },
  { label: "In-process controls", status: "done" },
  { label: "QA review", status: "in-progress" },
  { label: "Disposition", status: "pending" },
] as const

export function BatchRecordVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Batch record showing the batch number, product, status, and its stage checklist from dispensing to disposition"
    >
      {/* TODO: Replace with real PixeSci TM batch record screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Batch / BR-2026-0087</span>
        <span className="inline-flex items-center gap-1.5 text-amber-600">
          <CircleDashed className="size-3.5" />
          In review
        </span>
      </figcaption>
      <div className="border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
        <p className="text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
          Product
        </p>
        <p className="mt-1 text-xs font-medium">Reagent Kit A · Rev C</p>
      </div>
      <div className="divide-y divide-border">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
          >
            <span className="text-xs">{stage.label}</span>
            {stage.status === "done" ? (
              <span className="grid size-5 place-items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-600">
                <Check className="size-3" />
              </span>
            ) : stage.status === "in-progress" ? (
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full border border-amber-400/50 bg-amber-400/10 text-amber-600"
                )}
              >
                <CircleDashed className="size-3" />
              </span>
            ) : (
              <span className="grid size-5 place-items-center rounded-full border border-border text-muted-foreground">
                <Minus className="size-3" />
              </span>
            )}
          </div>
        ))}
      </div>
    </figure>
  )
}
