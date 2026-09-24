import {
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  FlaskConical,
  UserCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

const steps = [
  { label: "Accessioned", icon: ClipboardCheck },
  { label: "In Testing", icon: FlaskConical },
  { label: "Under Review", icon: UserCheck },
  { label: "Released", icon: BadgeCheck },
]

const custody = ["Received", "Analyst A", "QA reviewer", "Released"]

export function LimsVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Sample record progressing through accessioning, testing, review, and release, with a chain-of-custody trail and a Certificate of Analysis"
    >
      {/* TODO: Replace with real PixeSci TM sample workspace screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Sample / SMP-2026-0198</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-600">
          <BadgeCheck className="size-3.5" />
          Released
        </span>
      </figcaption>
      <div className="border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
        <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
          Chain of custody
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] text-muted-foreground">
          {custody.map((holder, index) => (
            <span key={holder} className="flex items-center gap-2">
              {holder}
              {index < custody.length - 1 ? (
                <span aria-hidden="true" className="text-border">
                  →
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-4 sm:p-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          const done = index < 3
          return (
            <div key={step.label} className="relative">
              <div
                className={cn(
                  "rounded-md border bg-background p-4",
                  index === 2 && "border-amber-400/50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon
                    className={cn(
                      "size-4 text-primary",
                      index === 2 && "text-amber-500"
                    )}
                  />
                  {done ? (
                    <span className="text-[9px] text-emerald-600">done</span>
                  ) : (
                    <span className="font-mono text-[9px] text-muted-foreground uppercase">
                      {index === 2 ? "review" : "queued"}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-xs font-semibold">{step.label}</p>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className="mx-auto h-3 w-px bg-primary/40 sm:absolute sm:top-1/2 sm:left-[calc(100%-2px)] sm:h-px sm:w-[calc(100%+4px)]"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-muted/20 px-4 py-3 text-[10px] text-muted-foreground sm:px-6">
        <FileCheck2 className="size-3.5 text-primary" />
        Certificate of Analysis · CoA-2026-0198 issued
      </div>
    </figure>
  )
}
