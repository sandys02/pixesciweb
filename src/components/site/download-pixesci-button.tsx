"use client"

import * as React from "react"
import { Download, Loader2, LogIn, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { FloatingLabelInput } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import {
  getDownloadAuthState,
  loginForDownload,
  startPixeSciDownload,
} from "@/lib/download-access"
import { cn } from "@/lib/utils"

import { DemoBookingLink } from "./demo-booking-link"

type DialogState =
  | "idle"
  | "login"
  | "authenticating"
  | "downloading"
  | "error"

type SignInPortalButtonProps = {
  source: string
  className?: string
  buttonClassName?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  fullWidth?: boolean
  onOpenChange?: (open: boolean) => void
}

type SignInPortalDialogProps = {
  open: boolean
  source: string
  onOpenChange: (open: boolean) => void
}

type DownloadPixeSciButtonProps = {
  source: string
  className?: string
  buttonClassName?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  fullWidth?: boolean
}

export function SignInPortalButton({
  source,
  className,
  buttonClassName,
  variant = "outline",
  size = "lg",
  fullWidth,
  onOpenChange,
}: SignInPortalButtonProps) {
  const [open, setOpen] = React.useState(false)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  return (
    <div className={cn("inline-flex", fullWidth && "w-full", className)}>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("px-4", fullWidth && "w-full", buttonClassName)}
        onClick={() => handleOpenChange(true)}
        data-portal-sign-in-source={source}
      >
        <LogIn className="size-4" />
        Sign In
      </Button>
      <SignInPortalDialog
        open={open}
        source={source}
        onOpenChange={handleOpenChange}
      />
    </div>
  )
}

export function SignInPortalDialog({
  open,
  source,
  onOpenChange,
}: SignInPortalDialogProps) {
  const router = useRouter()
  const [state, setState] = React.useState<DialogState>("idle")
  const [error, setError] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
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
        if (nextAuthState.authenticated) {
          onOpenChange(false)
          router.push("/portal")
          return
        }

        setState("login")
      })
      .catch((nextError: unknown) => {
        if (cancelled) return
        setError(getErrorMessage(nextError))
        setState("error")
      })

    return () => {
      cancelled = true
    }
  }, [onOpenChange, open, router])

  function handleDialogClose() {
    onOpenChange(false)
    setState("idle")
    setError("")
    setPassword("")
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

    setState("authenticating")
    setError("")

    try {
      await loginForDownload({ email, password })
      onOpenChange(false)
      router.push("/portal")
      router.refresh()
    } catch (nextError) {
      setError(getErrorMessage(nextError))
      setState("login")
    }
  }

  const isChecking = open && state === "idle"
  const busy = isChecking || state === "authenticating"

  return (
    <>
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
              Sign In to Portal
            </h2>
            <p id={descriptionId} className="mt-1 text-xs text-muted-foreground">
              Authenticate with your registered PixeSci account.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={closeDialog}
            aria-label="Close sign-in dialog"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-h-[calc(min(90dvh,640px)-4rem)] overflow-y-auto p-5">
          {isChecking ? (
            <StatusMessage
              icon={<Loader2 className="size-4 animate-spin" />}
              title="Checking access"
              description="Confirming whether this browser already has portal access."
            />
          ) : null}

          {state === "login" || state === "authenticating" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <FloatingLabelInput
                id="download-email"
                name="email"
                type="email"
                label="Work email"
                value={email}
                placeholder="name@organization.org"
                required
                disabled={state === "authenticating"}
                error={Boolean(error)}
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                onChangeAction={setEmail}
              />
              <FloatingLabelInput
                id="download-password"
                name="password"
                type="password"
                label="Password"
                value={password}
                placeholder="Enter your password"
                required
                disabled={state === "authenticating"}
                error={Boolean(error)}
                helperText={error || undefined}
                autoComplete="current-password"
                minLength={8}
                onChangeAction={setPassword}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full px-4"
                disabled={busy}
              >
                {state === "authenticating" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Sign in
              </Button>
              <div className="rounded-md border border-border bg-muted/35 p-4 text-center">
                <p className="text-xs leading-5 text-muted-foreground">
                  Portal sign-in is available only to registered accounts. Need
                  access for your team?{" "}
                  <DemoBookingLink
                    source={`${source}_portal_contact`}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Contact PixeSci
                  </DemoBookingLink>
                  .
                </p>
              </div>
            </form>
          ) : null}

          {state === "error" ? (
            <div className="space-y-5">
              <ErrorMessage id={errorId}>{error}</ErrorMessage>
              <Button
                type="button"
                size="lg"
                className="w-full px-4"
                onClick={() => setState("login")}
              >
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  )
}

export function DownloadPixeSciButton({
  source,
  className,
  buttonClassName,
  variant = "default",
  size = "lg",
  fullWidth,
}: DownloadPixeSciButtonProps) {
  const [state, setState] = React.useState<DialogState>("idle")
  const [error, setError] = React.useState("")
  const errorId = React.useId()

  async function handleDownload() {
    setState("downloading")
    setError("")

    try {
      await startPixeSciDownload()
      setState("idle")
    } catch (nextError) {
      setError(getErrorMessage(nextError))
      setState("error")
    }
  }

  const busy = state === "downloading"

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-3",
        fullWidth && "w-full",
        className
      )}
    >
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("px-4", fullWidth && "w-full", buttonClassName)}
        onClick={handleDownload}
        disabled={busy}
        data-download-source={source}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        Download PixeSci
      </Button>
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
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
