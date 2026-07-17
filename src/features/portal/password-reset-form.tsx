"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { FloatingLabelInput } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { validatePasswordChange } from "@/features/portal/helpers"

const REDIRECT_SECONDS = 5

export function PortalPasswordResetForm({ token }: { token: string }) {
  const router = useRouter()
  const [form, setForm] = React.useState({
    currentPassword: "placeholder",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [redirectSeconds, setRedirectSeconds] = React.useState(REDIRECT_SECONDS)
  const validationErrors = validatePasswordChange(form)
  delete validationErrors.currentPassword
  const errors = success ? {} : validationErrors

  React.useEffect(() => {
    if (!success) return

    const interval = window.setInterval(() => {
      setRedirectSeconds((current) => Math.max(current - 1, 0))
    }, 1000)
    const timeout = window.setTimeout(() => {
      router.replace("/?portal=sign-in&passwordChanged=1")
    }, REDIRECT_SECONDS * 1000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [router, success])

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
        `/api/portal/password/reset/${encodeURIComponent(token)}`,
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
        "Password changed. Sign in with your registered email and new password."
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
          <p className="eyebrow">PixeSci Portal</p>
          <h1 className="mt-2 text-2xl font-semibold">Set portal password</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Enter a new password for the organization portal account.
          </p>
          <div className="mt-6 space-y-4">
            <FloatingLabelInput
              id="reset-new-password"
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
              id="reset-confirm-password"
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
          {success ? (
            <p role="status" className="mt-4 text-sm text-muted-foreground">
              Password changed. Redirecting to sign in in {redirectSeconds}{" "}
              {redirectSeconds === 1 ? "second" : "seconds"}. Use your
              registered email and new password.
            </p>
          ) : message ? (
            <p
              role="status"
              className="mt-4 text-sm text-destructive"
            >
              {message}
            </p>
          ) : null}
          <Button type="submit" className="mt-5 w-full" disabled={pending || success}>
            <KeyRound className="size-4" />
            {pending ? "Saving..." : "Set password"}
          </Button>
        </form>
      </section>
    </main>
  )
}
