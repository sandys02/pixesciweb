import { cn } from "@/lib/utils"

import type { EnvironmentState } from "../types/admin"

export function EnvironmentBadge({ environment }: { environment: EnvironmentState }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
        environment.runtime === "production"
          ? "border-destructive/40 text-destructive"
          : "border-border text-muted-foreground"
      )}
    >
      {environment.databaseLabel}
    </span>
  )
}
