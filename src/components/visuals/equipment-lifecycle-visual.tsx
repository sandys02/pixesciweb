import {
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  PlayCircle,
  Wrench,
} from "lucide-react"

import { cn } from "@/lib/utils"

const stages = [
  { label: "Registered", icon: ClipboardCheck },
  { label: "Qualified", icon: BadgeCheck },
  { label: "In service", icon: PlayCircle },
  { label: "Calibration due", icon: CalendarClock },
  { label: "Maintenance", icon: Wrench },
]

export function EquipmentLifecycleVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Equipment lifecycle bar from registration through qualification, service, calibration due date, and maintenance"
    >
      {/* TODO: Replace with real PixeSci TM equipment register screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Asset / EQ-0142 · Biosafety cabinet</span>
        <span className="text-muted-foreground">Tier B</span>
      </figcaption>
      <div className="grid gap-3 p-5 sm:grid-cols-5 sm:p-6">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          const active = index === 3
          return (
            <div key={stage.label} className="relative">
              <div
                className={cn(
                  "rounded-md border bg-background p-3.5",
                  active && "border-amber-400/50"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 text-primary",
                    active && "text-amber-500"
                  )}
                />
                <p className="mt-3 text-[11px] font-semibold">{stage.label}</p>
                {active ? (
                  <p className="mt-1 font-mono text-[9px] text-amber-600">
                    due 2026-09-30
                  </p>
                ) : (
                  <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                    {index < 3 ? "complete" : "scheduled"}
                  </p>
                )}
              </div>
              {index < stages.length - 1 ? (
                <div
                  className="mx-auto h-3 w-px bg-primary/40 sm:absolute sm:top-1/2 sm:left-[calc(100%-2px)] sm:h-px sm:w-[calc(100%+4px)]"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </figure>
  )
}
