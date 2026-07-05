"use client"

import * as React from "react"
import { Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { clearDownloadAuthState } from "@/lib/download-access"
import { cn } from "@/lib/utils"

type PortalLogoutButtonProps = {
  className?: string
}

export function PortalLogoutButton({ className }: PortalLogoutButtonProps) {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleLogout() {
    setPending(true)
    setError("")

    try {
      await clearDownloadAuthState()
      router.replace("/")
      router.refresh()
    } catch {
      setError("Sign out is temporarily unavailable. Try again.")
      setPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col items-end gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="md:hidden"
        onClick={handleLogout}
        disabled={pending}
        aria-label="Sign out"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="hidden px-4 md:inline-flex"
        onClick={handleLogout}
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        Sign out
      </Button>
      {error ? (
        <p role="alert" className="max-w-56 text-right text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
