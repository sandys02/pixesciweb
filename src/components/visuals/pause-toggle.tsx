import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"

type PauseToggleProps = {
  paused: boolean
  onToggle: () => void
  label: string
  className?: string
}

export function PauseToggle({
  paused,
  onToggle,
  label,
  className,
}: PauseToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? `Play ${label}` : `Pause ${label}`}
      className={cn(
        "flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
    >
      {paused ? (
        <Play className="size-3" aria-hidden="true" />
      ) : (
        <Pause className="size-3" aria-hidden="true" />
      )}
    </button>
  )
}
