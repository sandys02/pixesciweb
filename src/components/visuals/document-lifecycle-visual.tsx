import { Check, User } from "lucide-react"

import { cn } from "@/lib/utils"

const steps = ["Draft", "In Review", "Approved", "Active", "Periodic Review"]

export function DocumentLifecycleVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Document lifecycle stepper from draft through review, approval, active status, and periodic review, with training assigned"
    >
      {/* TODO: Replace with real PixeSci TM document workbench screenshot. */}
      <figcaption className="visual-toolbar">
        <span>SOP-101-014 · Rev D</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-600">
          <Check className="size-3.5" />
          Active
        </span>
      </figcaption>
      <div className="flex flex-wrap items-center gap-2 p-5 sm:flex-nowrap sm:p-6">
        {steps.map((step, index) => {
          const active = index === 3
          const done = index < 3
          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex-1 rounded-md border px-3 py-2.5 text-center",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                )}
              >
                <p
                  className={cn(
                    "text-[10px] font-medium",
                    !done && !active && "text-muted-foreground"
                  )}
                >
                  {step}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden text-border sm:inline"
                >
                  →
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-muted/20 px-4 py-3 text-[10px] text-muted-foreground sm:px-6">
        <User className="size-3.5 text-primary" />
        Training assigned · 12 of 14 recipients complete
      </div>
    </figure>
  )
}
