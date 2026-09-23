"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FlaskConical,
  Gauge,
  Handshake,
  Layers,
  LockKeyhole,
  RadioTower,
  ShieldCheck,
  Thermometer,
} from "lucide-react"

import { BrandName } from "@/components/site/brand-name"
import { cn } from "@/lib/utils"

type CategoryId =
  | "environment"
  | "instruments"
  | "laboratory"
  | "quality"
  | "partners"

type MonitoredCategory = {
  id: CategoryId
  label: string
  meta: string
  icon: LucideIcon
}

type FeedStatus = "ok" | "flagged"

type FeedEvent = {
  label: string
  detail: string
  status: FeedStatus
  category: CategoryId
}

const monitoredCategories: MonitoredCategory[] = [
  {
    id: "environment",
    label: "Environmental conditions",
    meta: "Temperature · humidity · pressure",
    icon: Thermometer,
  },
  {
    id: "instruments",
    label: "QC instruments & equipment",
    meta: "HPLC · balances · calibration",
    icon: FlaskConical,
  },
  {
    id: "laboratory",
    label: "Laboratory records",
    meta: "LIMS · ELN · CDS audit trails",
    icon: Database,
  },
  {
    id: "quality",
    label: "Quality records",
    meta: "QMS · documents · training",
    icon: ClipboardCheck,
  },
  {
    id: "partners",
    label: "Partners & contractors",
    meta: "Contract labs · CDMOs · CoAs",
    icon: Handshake,
  },
]

const feedEvents: FeedEvent[] = [
  {
    label: "Run completed",
    detail: "batch-042 / analyst review",
    status: "ok",
    category: "instruments",
  },
  {
    label: "Reinjection logged",
    detail: "no documented reason",
    status: "flagged",
    category: "laboratory",
  },
  {
    label: "Temperature within limits",
    detail: "stability chamber 3",
    status: "ok",
    category: "environment",
  },
  {
    label: "Contractor report received",
    detail: "CoA-118 / matched to batch-044",
    status: "ok",
    category: "partners",
  },
  {
    label: "Calibration on schedule",
    detail: "HPLC-07",
    status: "ok",
    category: "instruments",
  },
  {
    label: "Shared account activity",
    detail: "audit trail entry",
    status: "flagged",
    category: "laboratory",
  },
  {
    label: "Partner result mismatch",
    detail: "contract lab vs LIMS / assay",
    status: "flagged",
    category: "partners",
  },
  {
    label: "Humidity excursion logged",
    detail: "cold room 2 / alert limit",
    status: "flagged",
    category: "environment",
  },
  {
    label: "Audit trail reviewed",
    detail: "batch-041 / closed",
    status: "ok",
    category: "laboratory",
  },
  {
    label: "Document revision issued",
    detail: "SOP-105 / training pending",
    status: "ok",
    category: "quality",
  },
]

const visibleRows = 5
const tickDuration = 2600

export function ContinuousMonitoringMockup() {
  const [tick, setTick] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReduceMotion(media.matches)

    updatePreference()
    media.addEventListener("change", updatePreference)

    return () => media.removeEventListener("change", updatePreference)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) {
      return
    }

    const timer = window.setTimeout(() => {
      setTick((current) => current + 1)
    }, tickDuration)

    return () => window.clearTimeout(timer)
  }, [tick, reduceMotion])

  const displayedTick = reduceMotion ? 2 : tick
  const rows = Array.from({ length: visibleRows }, (_, index) => {
    const eventIndex = (displayedTick + index) % feedEvents.length
    return { ...feedEvents[eventIndex], isNewest: index === visibleRows - 1 }
  })
  const openRecommendations = rows.filter(
    (row) => row.status === "flagged"
  ).length
  const eventsEvaluated = 128 + displayedTick * 3
  const flaggedCategories = new Set(
    rows.filter((row) => row.status === "flagged").map((row) => row.category)
  )

  return (
    <figure
      className="visual-frame hero-agent-mockup relative min-h-[520px] overflow-hidden bg-card text-card-foreground dark:border-white/12 dark:bg-deep dark:text-white"
      aria-label="Continuous monitoring console watching environmental conditions, QC instruments, laboratory records, quality records, and partner and contractor data, flagging exceptions and recording every recommendation"
    >
      <div
        className="workflow-grid absolute inset-0 opacity-65 dark:hidden"
        aria-hidden="true"
      />
      <div
        className="workflow-grid-dark absolute inset-0 hidden opacity-70 dark:block"
        aria-hidden="true"
      />
      <figcaption className="visual-toolbar relative z-10 bg-muted/45 text-foreground dark:border-white/10 dark:bg-white/[0.035] dark:text-white">
        <span className="flex items-center gap-2">
          <span className="hero-agent-status-dot size-2 rounded-full bg-emerald-400" />
          <BrandName /> Continuous Quality Monitoring
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-primary dark:text-icy">
          <ShieldCheck className="size-3.5" />
          Continuous
        </span>
      </figcaption>

      <div className="relative z-10 grid min-h-[475px] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b bg-muted/15 p-4 sm:p-5 lg:border-r lg:border-b-0 dark:border-white/10 dark:bg-white/[0.018]">
          <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            <RadioTower className="size-3.5 text-primary dark:text-icy" />
            Monitored categories
          </div>

          <div className="mt-5 space-y-3">
            {monitoredCategories.map((category) => {
              const Icon = category.icon
              const flagged = flaggedCategories.has(category.id)
              return (
                <div
                  key={category.id}
                  className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border bg-background/70 px-3.5 py-3 dark:border-white/10 dark:bg-black/15"
                >
                  <span
                    className="flex size-7 items-center justify-center rounded-md border border-primary/20 bg-primary/[0.06] text-primary dark:border-icy/20 dark:bg-icy/[0.08] dark:text-icy"
                    aria-hidden="true"
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs leading-snug font-medium text-foreground/85 dark:text-white/82">
                      {category.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[8px] leading-snug text-muted-foreground/75 dark:text-white/32">
                      {category.meta}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "hero-agent-status-dot size-1.5 shrink-0 rounded-full transition-colors duration-300",
                      flagged ? "bg-amber-400" : "bg-emerald-400"
                    )}
                    role="img"
                    aria-label={flagged ? "Flagged event" : "No flagged events"}
                  />
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x rounded-md border bg-background/70 dark:divide-white/10 dark:border-white/10 dark:bg-black/15">
            {[
              {
                value: String(monitoredCategories.length).padStart(2, "0"),
                label: "categories",
                icon: Layers,
              },
              {
                value: String(eventsEvaluated),
                label: "events today",
                icon: Gauge,
              },
              {
                value: String(openRecommendations).padStart(2, "0"),
                label: "flagged",
                icon: AlertTriangle,
              },
            ].map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="px-2 py-2.5 text-center">
                  <Icon className="mx-auto size-3 text-primary/80 dark:text-icy/75" />
                  <p className="mt-1 font-mono text-[10px] font-semibold text-foreground/85 dark:text-white/80">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-[7px] tracking-[0.1em] text-muted-foreground uppercase dark:text-white/28">
                    {metric.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Live monitoring feed
              </p>
              <p className="mt-1 text-xs font-medium text-foreground/85 dark:text-white/82">
                Watching every event, not a sample
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-1 text-[8px] font-medium tracking-[0.1em] text-primary uppercase dark:border-icy/20 dark:bg-icy/[0.08] dark:text-icy">
              <RadioTower className="hero-agent-running size-3" />
              Streaming
            </span>
          </div>

          <div className="mt-4 flex-1 rounded-md border bg-background/70 dark:border-white/10 dark:bg-black/15">
            {rows.map((row, index) => (
              <div
                key={`${row.label}-${index}`}
                className={cn(
                  "hero-agent-step grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 border-b px-3 py-2.5 transition-colors duration-300 last:border-b-0 dark:border-white/8",
                  row.status === "flagged" &&
                    "bg-amber-500/[0.05] dark:bg-amber-300/[0.04]",
                  row.status === "ok" &&
                    row.isNewest &&
                    "bg-primary/[0.035] dark:bg-icy/[0.035]"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border transition-colors duration-300",
                    row.status === "ok" &&
                      "border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-300/10 dark:text-emerald-300",
                    row.status === "flagged" &&
                      "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-300"
                  )}
                  aria-hidden="true"
                >
                  {row.status === "ok" ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <AlertTriangle className="size-3" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-medium text-foreground/80 dark:text-white/78">
                    {row.label}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[8px] text-muted-foreground/75 dark:text-white/32">
                    {row.detail}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-mono text-[7px] tracking-[0.08em] uppercase",
                    row.status === "ok"
                      ? "text-emerald-700 dark:text-emerald-300/75"
                      : "text-amber-700 dark:text-amber-300"
                  )}
                >
                  {row.status === "ok" ? "OK" : "Flagged"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-md border border-primary/15 bg-primary/[0.035] px-3 py-2.5 dark:border-icy/12 dark:bg-icy/[0.035]">
            <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-primary dark:text-icy" />
            <p className="text-[9px] leading-4 text-foreground/75 dark:text-white/62">
              Recommendation only — a qualified reviewer approves, closes,
              releases, and signs.
            </p>
          </div>
        </div>
      </div>
    </figure>
  )
}
