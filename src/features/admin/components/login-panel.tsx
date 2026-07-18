"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"
import { toast } from "sonner"

import { FloatingLabelInput } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"

import { requestAdminApi } from "../api/admin-client"
import type { AuthState, EnvironmentState } from "../types/admin"

export function AdminLogin({
  onAuthenticated,
  onEnvironment,
}: {
  onAuthenticated: (auth: AuthState) => void
  onEnvironment: (environment: EnvironmentState) => void
}) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [view, setView] = React.useState<"forgot" | "login">("login")
  const [message, setMessage] = React.useState("")
  const [pending, setPending] = React.useState(false)

  React.useEffect(() => {
    const url = new URL(window.location.href)
    const passwordChanged = url.searchParams.get("passwordChanged") === "1"
    const resetLinkUnavailable =
      url.searchParams.get("resetLinkUnavailable") === "1"

    if (!passwordChanged && !resetLinkUnavailable) return

    const toastTimeout = window.setTimeout(() => {
      if (passwordChanged) {
        toast.success(
          "Password changed. Sign in with your staff email and new password."
        )
        return
      }

      toast.error(
        "That reset link is no longer available. Request a new password reset link."
      )
    }, 100)

    url.searchParams.delete("passwordChanged")
    url.searchParams.delete("resetLinkUnavailable")
    const nextUrl = `${url.pathname}${url.search}${url.hash}`
    window.history.replaceState(window.history.state, "", nextUrl || "/admin")

    return () => {
      window.clearTimeout(toastTimeout)
    }
  }, [])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage("")

    try {
      const result = await requestAdminApi<AuthState & { environment?: EnvironmentState }>(
        "/api/admin/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      )
      const session = await requestAdminApi<
        AuthState & { environment: EnvironmentState }
      >("/api/admin/session")
      onAuthenticated(result)
      onEnvironment(session.environment)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Admin login failed.")
    } finally {
      setPending(false)
    }
  }

  async function submitForgot(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage("")

    try {
      const result = await requestAdminApi<{ message: string }>(
        "/api/admin/password/forgot",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      )
      setMessage(result.message)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "If that staff account is registered, PixeSci will send password reset instructions."
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
          onSubmit={view === "login" ? submit : submitForgot}
        >
          <p className="eyebrow">PixeSci internal</p>
          <h1 className="mt-2 text-2xl font-semibold">Staff Admin</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {view === "login"
              ? "Sign in with an authorized PixeSci staff account."
              : "Enter your staff email to receive reset instructions."}
          </p>
          <div className="mt-6 space-y-4">
            <FloatingLabelInput
              id="admin-email"
              type="email"
              label="Email"
              value={email}
              autoComplete="email"
              inputMode="email"
              onChangeAction={setEmail}
            />
            {view === "login" ? (
              <FloatingLabelInput
                id="admin-password"
                type="password"
                label="Password"
                value={password}
                autoComplete="current-password"
                onChangeAction={setPassword}
              />
            ) : null}
          </div>
          {message ? (
            <p
              role={view === "login" ? "alert" : "status"}
              className={`mt-4 text-sm ${
                view === "login" ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {message}
            </p>
          ) : null}
          <Button type="submit" className="mt-5 w-full" disabled={pending}>
            <KeyRound className="size-4" />
            {view === "login"
              ? pending
                ? "Signing in..."
                : "Sign in"
              : pending
                ? "Sending..."
                : "Send reset instructions"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="mt-3 w-full"
            onClick={() => {
              setMessage("")
              setPassword("")
              setView(view === "login" ? "forgot" : "login")
            }}
          >
            {view === "login" ? "Forgot password?" : "Return to sign in"}
          </Button>
        </form>
      </section>
    </main>
  )
}
