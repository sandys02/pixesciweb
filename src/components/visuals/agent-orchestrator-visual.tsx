import { AlertTriangle, CheckCircle2, LockKeyhole } from "lucide-react"

import { cn } from "@/lib/utils"

const ruleChecks = [
  { label: "Raw data reference", status: "ok" as const },
  { label: "Reinjection", status: "flagged" as const },
  { label: "Shared account activity", status: "flagged" as const },
  { label: "Audit-trail review", status: "ok" as const },
  { label: "Run reconciliation", status: "ok" as const },
]

export function AgentOrchestratorVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Monitoring console showing rule checks with a status per check, and a recommendation panel stating PixeSci only recommends"
    >
      <figcaption className="visual-toolbar">
        <span>Continuous quality monitoring / console</span>
        <span className="text-muted-foreground">Continuous</span>
      </figcaption>
      <div className="grid sm:grid-cols-[1.1fr_1fr]">
        <div className="divide-y divide-border border-r border-border">
          {ruleChecks.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
            >
              <span className="flex items-center gap-2.5 text-sm">
                {check.status === "ok" ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                )}
                {check.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[9px] tracking-[0.1em] uppercase",
                  check.status === "ok"
                    ? "text-emerald-700"
                    : "text-amber-700"
                )}
              >
                {check.status === "ok" ? "OK" : "Flagged"}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between p-5">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Recommendation
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground/85">
              Reinjection has no documented justification. Review before
              release.
            </p>
          </div>
          <div className="mt-6 flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3">
            <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p className="text-[10px] leading-4 text-muted-foreground">
              Recommendation only — a qualified reviewer approves, closes,
              releases, and signs.
            </p>
          </div>
        </div>
      </div>
    </figure>
  )
}
