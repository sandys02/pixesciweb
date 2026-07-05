"use client"

import * as React from "react"
import { CheckCircle2, Download, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  clearDownloadAuthState,
  getDownloadAuthState,
  loginForDownload,
  startPixeSciDownload,
  type DownloadAuthState,
} from "@/lib/download-access"
import { cn } from "@/lib/utils"

type DialogState =
  | "idle"
  | "checking"
  | "login"
  | "authenticating"
  | "ready"
  | "downloading"
  | "error"

type DownloadPixeSciButtonProps = {
  source: string
  className?: string
  buttonClassName?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  fullWidth?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DownloadPixeSciButton({
  source,
  className,
  buttonClassName,
  variant = "outline",
  size = "lg",
  fullWidth,
  onOpenChange,
}: DownloadPixeSciButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<DialogState>("idle")
  const [authState, setAuthState] = React.useState<DownloadAuthState>({
    authenticated: false,
  })
  const [error, setError] = React.useState("")
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const titleId = React.useId()
  const descriptionId = React.useId()
  const errorId = React.useId()

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  React.useEffect(() => {
    if (!open) return

    let cancelled = false

    getDownloadAuthState()
      .then((nextAuthState) => {
        if (cancelled) return
        setAuthState(nextAuthState)
        setState(nextAuthState.authenticated ? "ready" : "login")
      })
      .catch((nextError: unknown) => {
        if (cancelled) return
        setError(getErrorMessage(nextError))
        setState("error")
      })

    return () => {
      cancelled = true
    }
  }, [open])

  function handleDialogClose() {
    setOpen(false)
    setState("idle")
    setError("")
    setAuthState({ authenticated: false })
    void clearDownloadAuthState()
    onOpenChange?.(false)
  }

  function openDialog() {
    setState("checking")
    setError("")
    setOpen(true)
    onOpenChange?.(true)
  }

  function closeDialog() {
    const dialog = dialogRef.current

    if (dialog?.open) {
      dialog.close()
      return
    }

    handleDialogClose()
  }

  function handleDialogBackdropClick(
    event: React.MouseEvent<HTMLDialogElement>
  ) {
    if (event.target === event.currentTarget) {
      closeDialog()
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    setState("authenticating")
    setError("")

    try {
      const nextAuthState = await loginForDownload({ email, password })
      setAuthState(nextAuthState)
      setState("ready")
    } catch (nextError) {
      setError(getErrorMessage(nextError))
      setState("login")
    }
  }

  async function handleDownload() {
    setState("downloading")
    setError("")

    try {
      await startPixeSciDownload()
      closeDialog()
    } catch (nextError) {
      setError(getErrorMessage(nextError))
      setState("error")
    }
  }

  const busy =
    state === "checking" ||
    state === "authenticating" ||
    state === "downloading"

  return (
    <div className={cn("inline-flex", fullWidth && "w-full", className)}>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("px-4", fullWidth && "w-full", buttonClassName)}
        onClick={openDialog}
        data-download-source={source}
      >
        <Download className="size-4" />
        Download PixeSci
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={handleDialogBackdropClick}
        onClose={handleDialogClose}
        className="m-auto max-h-[min(90dvh,640px)] w-[min(calc(100vw-2rem),440px)] max-w-none overflow-hidden rounded-lg border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/35"
      >
        <div className="flex h-16 items-center justify-between gap-4 border-b border-border px-5">
          <div>
            <h2 id={titleId} className="text-base font-semibold">
              Download PixeSci
            </h2>
            <p id={descriptionId} className="mt-1 text-xs text-muted-foreground">
              Sign in to access the application installer.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={closeDialog}
            aria-label="Close download dialog"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-h-[calc(min(90dvh,640px)-4rem)] overflow-y-auto p-5">
          {state === "checking" ? (
            <StatusMessage
              icon={<Loader2 className="size-4 animate-spin" />}
              title="Checking access"
              description="Confirming whether this browser already has download access."
            />
          ) : null}

          {state === "login" || state === "authenticating" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="download-email">Work email</Label>
                <Input
                  id="download-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={state === "authenticating"}
                  aria-describedby={error ? errorId : undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="download-password">Password</Label>
                <Input
                  id="download-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  minLength={8}
                  required
                  disabled={state === "authenticating"}
                  aria-describedby={error ? errorId : undefined}
                />
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Access is limited to approved download accounts. Sign in to
                continue to the installer.
              </p>
              {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
              <Button
                type="submit"
                size="lg"
                className="w-full px-4"
                disabled={state === "authenticating"}
              >
                {state === "authenticating" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Sign in
              </Button>
            </form>
          ) : null}

          {state === "ready" || state === "downloading" ? (
            <div className="space-y-5">
              <StatusMessage
                icon={<CheckCircle2 className="size-4 text-emerald-600" />}
                title="Download access ready"
                description={
                  authState.userEmail
                    ? `Signed in as ${authState.userEmail}.`
                    : "You are signed in for this download."
                }
              />
              <div className="rounded-md border border-border bg-muted/35 p-4">
                <p className="text-sm font-medium">
                  PixeSci application installer
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Use PixeSci to connect scientific software, run workflows
                  locally, and keep the run record with the work.
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                className="w-full px-4"
                disabled={busy}
                onClick={handleDownload}
              >
                {state === "downloading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Download PixeSci
              </Button>
            </div>
          ) : null}

          {state === "error" ? (
            <div className="space-y-5">
              <ErrorMessage id={errorId}>{error}</ErrorMessage>
              <Button
                type="button"
                size="lg"
                className="w-full px-4"
                onClick={() => setState(authState.authenticated ? "ready" : "login")}
              >
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </dialog>
    </div>
  )
}

function StatusMessage({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

function ErrorMessage({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) {
  return (
    <p
      id={id}
      role="alert"
      className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm leading-5 text-destructive"
    >
      {children}
    </p>
  )
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "Download access is temporarily unavailable."
}
