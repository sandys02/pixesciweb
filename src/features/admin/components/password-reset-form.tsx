"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"

import { FloatingLabelInput } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { validatePasswordChange } from "@/features/portal/helpers"

export function AdminPasswordResetForm({ token }: { token: string }) {
  const [form, setForm] = React.useState({
    currentPassword: "placeholder",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const errors = validatePasswordChange(form)
  delete errors.currentPassword

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")

    if (Object.keys(errors).length > 0) {
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
      setForm({ currentPassword: "placeholder", newPassword: "", confirmPassword: "" })
      setMessage("Password changed. Return to the staff admin sign-in form.")
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
          <h1 className="mt-2 text-2xl font-semibold">Reset staff password</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Enter a new password for the staff admin account.
          </p>
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
          {message ? (
            <p
              role="status"
              className={`mt-4 text-sm ${success ? "text-muted-foreground" : "text-destructive"}`}
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
