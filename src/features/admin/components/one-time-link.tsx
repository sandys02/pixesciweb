"use client"

import { Button } from "@/components/ui/button"

export function OneTimeLink({
  value,
  onDismiss,
}: {
  value: string
  onDismiss: () => void
}) {
  return (
    <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-medium">One-time setup/reset link</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Copy this now. The plaintext token is not stored and will not be shown again.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-border bg-background p-2 text-xs">
          {value}
        </code>
        <Button
          type="button"
          variant="outline"
          onClick={() => void navigator.clipboard.writeText(value)}
        >
          Copy
        </Button>
        <Button type="button" variant="ghost" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}
