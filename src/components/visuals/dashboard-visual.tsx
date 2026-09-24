import { AlertTriangle, CalendarClock, Gauge, ListChecks } from "lucide-react"

const tiles = [
  {
    label: "Inspection readiness",
    value: "88%",
    icon: Gauge,
    tone: "text-emerald-600",
  },
  {
    label: "Open CAPAs",
    value: "14",
    icon: ListChecks,
    tone: "text-foreground",
  },
  {
    label: "Overdue calibrations",
    value: "2",
    icon: CalendarClock,
    tone: "text-amber-600",
  },
  {
    label: "Evidence gaps",
    value: "5",
    icon: AlertTriangle,
    tone: "text-amber-600",
  },
]

export function DashboardVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Metrics dashboard showing inspection readiness score, open CAPAs, overdue calibrations, and evidence gaps"
    >
      {/* TODO: Replace with real PixeSci TM reports dashboard screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Reports & analytics / cross-module</span>
        <span className="text-muted-foreground">Updated live</span>
      </figcaption>
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <div
              key={tile.label}
              className="rounded-md border border-border bg-background p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                  {tile.label}
                </p>
                <Icon className={`size-4 ${tile.tone}`} />
              </div>
              <p className="mt-4 font-mono text-xl font-semibold">
                {tile.value}
              </p>
            </div>
          )
        })}
      </div>
    </figure>
  )
}
