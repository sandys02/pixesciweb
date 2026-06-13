import {
  CheckCircle2,
  Database,
  FileBarChart,
  FileInput,
  Microscope,
  ShieldCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

type WorkflowVisualProps = {
  compact?: boolean
  dark?: boolean
  className?: string
}

const nodes = [
  {
    label: "Instrument output",
    meta: "source / sample-set-042",
    icon: Microscope,
  },
  {
    label: "Image analysis",
    meta: "capability / quantify-cells",
    icon: FileInput,
  },
  {
    label: "Statistics",
    meta: "parameters / analysis-v3",
    icon: FileBarChart,
  },
  {
    label: "Review checkpoint",
    meta: "operator / required",
    icon: ShieldCheck,
  },
  {
    label: "LIMS / ELN record",
    meta: "artifact / approved",
    icon: Database,
  },
]

export function WorkflowVisual({
  compact,
  dark,
  className,
}: WorkflowVisualProps) {
  return (
    <figure
      className={cn(
        "visual-frame relative overflow-hidden",
        dark && "border-white/12 bg-white/[0.035]",
        compact ? "min-h-[390px]" : "min-h-[500px]",
        className,
      )}
      aria-label="Illustrative Pixesci workflow graph connecting instrument output, analysis, statistics, review, and a system of record"
    >
      {/* TODO: Replace with real workflow canvas screenshot. */}
      <figcaption className="visual-toolbar">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          Flow cytometry review pipeline
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          workflow / v3.4
        </span>
      </figcaption>
      <div className="workflow-grid absolute inset-x-0 bottom-0 top-11" aria-hidden="true" />
      <div className="relative grid gap-3 p-5 pt-8 sm:p-8 lg:grid-cols-5 lg:items-center lg:gap-2">
        {nodes.map((node, index) => {
          const Icon = node.icon
          return (
            <div key={node.label} className="relative flex lg:block">
              <div
                className={cn(
                  "relative z-10 w-full rounded-md border bg-background p-4 shadow-sm",
                  dark && "border-white/12 bg-[#10171b]",
                  index === 3 && "border-amber-400/50",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon
                    className={cn(
                      "size-4 text-primary",
                      index === 3 && "text-amber-500",
                    )}
                  />
                  {index < 3 ? (
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                  ) : (
                    <span className="font-mono text-[9px] uppercase text-muted-foreground">
                      {index === 3 ? "review" : "queued"}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-xs font-semibold">{node.label}</h3>
                <p className="mt-1 font-mono text-[9px] leading-4 text-muted-foreground">
                  {node.meta}
                </p>
              </div>
              {index < nodes.length - 1 ? (
                <div
                  className={cn(
                    "mx-auto h-3 w-px bg-primary/40 lg:absolute lg:left-[calc(100%-2px)] lg:top-1/2 lg:h-px lg:w-[calc(100%+4px)]",
                    index >= 2 && "bg-border",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 divide-x divide-border rounded-md border border-border bg-background/90 text-center backdrop-blur sm:left-8 sm:right-auto sm:w-[420px]">
        {[
          ["05", "nodes"],
          ["12", "events"],
          ["03", "artifacts"],
        ].map(([value, label]) => (
          <div key={label} className="px-3 py-3">
            <div className="font-mono text-xs font-semibold">{value}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}
