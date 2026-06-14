import { Check, Clock3, FileWarning, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

type AuditTimelineProps = {
  dark?: boolean
}

const events = [
  {
    time: "09:42:16",
    action: "Workflow execution started",
    resource: "wf-flow-review-042",
    category: "workflow",
    severity: "info",
    status: "success",
  },
  {
    time: "09:43:08",
    action: "Analysis parameters applied",
    resource: "analysis-v3.json",
    category: "data",
    severity: "info",
    status: "success",
  },
  {
    time: "09:44:51",
    action: "Output checksum recorded",
    resource: "sha256: 8c7a…9f2e",
    category: "compliance",
    severity: "success",
    status: "success",
  },
  {
    time: "09:46:03",
    action: "Operator review requested",
    resource: "review / qc-director",
    category: "compliance",
    severity: "warning",
    status: "review",
  },
]

export function AuditTimeline({ dark }: AuditTimelineProps) {
  return (
    <figure
      className={cn(
        "visual-frame overflow-hidden",
        dark && "border-white/12 bg-white/[0.035]",
      )}
      aria-label="Illustrative audit timeline with workflow events, resources, timestamps, checksums, and review state"
    >
      {/* TODO: Replace with real PixeSci audit log screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Audit logs / current user</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-600">
          <ShieldCheck className="size-3.5" />
          Integrity checks present
        </span>
      </figcaption>
      <div className="grid grid-cols-4 divide-x divide-border border-b border-border bg-muted/20 text-center">
        {[
          ["12", "events"],
          ["00", "failed"],
          ["01", "review"],
          ["12", "tamper"],
        ].map(([value, label]) => (
          <div key={label} className="px-2 py-2.5">
            <p className="font-mono text-[10px] font-semibold">{value}</p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-0 md:grid-cols-[1fr_210px]">
        <div className="divide-y divide-border">
          {events.map((event, index) => (
            <div
              key={event.action}
              className="grid grid-cols-[72px_1fr_auto] items-start gap-3 p-4 sm:grid-cols-[82px_1fr_auto] sm:p-5"
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {event.time}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-xs font-medium">{event.action}</p>
                  <span className="rounded border border-border px-1.5 py-0.5 text-[8px] text-muted-foreground">
                    {event.category}
                  </span>
                  <span
                    className={cn(
                      "text-[8px]",
                      event.severity === "warning"
                        ? "text-amber-600"
                        : event.severity === "success"
                          ? "text-emerald-600"
                          : "text-muted-foreground",
                    )}
                  >
                    {event.severity}
                  </span>
                </div>
                <p className="mt-1 break-all font-mono text-[9px] text-muted-foreground">
                  {event.resource}
                </p>
              </div>
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full border",
                  event.status === "review"
                    ? "border-amber-400/50 bg-amber-400/10 text-amber-600"
                    : "border-emerald-400/40 bg-emerald-400/10 text-emerald-600",
                )}
              >
                {event.status === "review" ? (
                  <Clock3 className="size-3" />
                ) : (
                  <Check className="size-3" />
                )}
              </span>
              {index < events.length - 1 ? null : (
                <span className="sr-only">Latest event</span>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-muted/40 p-5 md:border-l md:border-t-0">
          <p className="eyebrow">Record detail</p>
          <dl className="mt-5 space-y-4 text-xs">
            {[
              ["Actor", "A. Mensah"],
              ["Role", "researcher"],
              ["Category", "workflow"],
              ["Severity", "info"],
              ["Review", "required"],
              ["Tamper evident", "yes"],
              ["Change reason", "parameter set approved"],
              ["Event ID", "evt_01J8QF"],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="mt-1 font-mono text-[10px]">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex items-start gap-2 border-t border-border pt-4 text-[10px] leading-4 text-muted-foreground">
            <FileWarning className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
            Customer review policy determines final disposition.
          </div>
        </div>
      </div>
    </figure>
  )
}
