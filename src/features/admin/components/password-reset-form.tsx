"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { FloatingLabelInput } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { validatePasswordChange } from "@/features/portal/helpers"

const REDIRECT_SECONDS = 5
type TokenStatus = "checking" | "available" | "unavailable"

export function AdminPasswordResetForm({ token }: { token: string }) {
  const [form, setForm] = React.useState({
    currentPassword: "placeholder",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [redirectSeconds, setRedirectSeconds] = React.useState(REDIRECT_SECONDS)
  const [tokenStatus, setTokenStatus] = React.useState<TokenStatus>("checking")
  const validationErrors = validatePasswordChange(form)
  delete validationErrors.currentPassword
  const errors = success ? {} : validationErrors

  React.useEffect(() => {
    let cancelled = false

    fetch(`/api/admin/password/reset/${encodeURIComponent(token)}`, {
      credentials: "include",
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}))
        if (cancelled) return
        setTokenStatus(
          response.ok && body?.available === true ? "available" : "unavailable"
        )
      })
      .catch(() => {
        if (!cancelled) setTokenStatus("unavailable")
      })

    return () => {
      cancelled = true
    }
  }, [token])

  React.useEffect(() => {
    if (!success) return

    const interval = window.setInterval(() => {
      setRedirectSeconds((current) => Math.max(current - 1, 0))
    }, 1000)
    const timeout = window.setTimeout(() => {
      window.location.assign("/admin?passwordChanged=1")
    }, REDIRECT_SECONDS * 1000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [success])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")

    if (Object.keys(validationErrors).length > 0) {
      setMessage("Enter matching passwords with at least 10 characters.")
      return
    }

    setPending(true)
    try {
      const response = await fetch(
        `/api/admin/password/reset/${encodeURIComponent(token)}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
          }),
        }
      )
      const body = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof body?.message === "string"
            ? body.message
            : "Password reset is unavailable."
        )
      }

      setSuccess(true)
      setRedirectSeconds(REDIRECT_SECONDS)
      setForm({ currentPassword: "placeholder", newPassword: "", confirmPassword: "" })
      toast.success(
        "Password changed. Sign in with your staff email and new password."
      )
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Password reset is unavailable."
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <main id="main-content" className="min-h-dvh bg-muted/20">
      <section className="site-container grid min-h-dvh items-center py-10">
        <form
          noValidate
          className="mx-auto w-full max-w-md rounded-lg border border-border bg-background p-5 shadow-sm sm:p-6"
          onSubmit={submit}
        >
          <p className="eyebrow">PixeSci internal</p>
          <h1 className="mt-2 text-2xl font-semibold">
            {tokenStatus === "unavailable"
              ? "Reset link unavailable"
              : success
                ? "Password changed"
                : "Reset staff password"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {tokenStatus === "checking"
              ? "Checking this staff admin reset link."
              : tokenStatus === "unavailable"
                ? "This password reset link is no longer available. It may have expired or already been used."
                : success
              ? "You will be redirected to the staff admin sign-in form."
              : "Enter a new password for the staff admin account."}
          </p>
          {tokenStatus === "unavailable" ? (
            <div className="mt-6 space-y-4">
              <p role="status" className="text-sm leading-6 text-muted-foreground">
                Return to staff sign-in and request a new reset link.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin?resetLinkUnavailable=1">
                  Return to staff sign-in
                </Link>
              </Button>
            </div>
          ) : null}
          {tokenStatus === "checking" ? (
            <p role="status" className="mt-4 text-sm text-muted-foreground">
              One moment while PixeSci checks the link.
            </p>
          ) : null}
          {tokenStatus === "available" && !success ? (
            <div className="mt-6 space-y-4">
              <FloatingLabelInput
                id="admin-reset-new-password"
                type="password"
                label="New password"
                value={form.newPassword}
                autoComplete="new-password"
                minLength={10}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
                onChangeAction={(value) =>
                  setForm((current) => ({ ...current, newPassword: value }))
                }
              />
              <FloatingLabelInput
                id="admin-reset-confirm-password"
                type="password"
                label="Confirm password"
                value={form.confirmPassword}
                autoComplete="new-password"
                minLength={10}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                onChangeAction={(value) =>
                  setForm((current) => ({ ...current, confirmPassword: value }))
                }
              />
            </div>
          ) : null}
          {tokenStatus === "available" && success ? (
            <p role="status" className="mt-4 text-sm text-muted-foreground">
              Redirecting to sign in in {redirectSeconds}{" "}
              {redirectSeconds === 1 ? "second" : "seconds"}. Use your staff
              email and new password.
            </p>
          ) : tokenStatus === "available" && message ? (
            <p
              role="status"
              className="mt-4 text-sm text-destructive"
            >
              {message}
            </p>
          ) : null}
          {tokenStatus === "available" && !success ? (
            <Button type="submit" className="mt-5 w-full" disabled={pending}>
              <KeyRound className="size-4" />
              {pending ? "Saving..." : "Set password"}
            </Button>
          ) : null}
        </form>
      </section>
    </main>
  )
}
