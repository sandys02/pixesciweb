"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"

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
  const [message, setMessage] = React.useState("")
  const [pending, setPending] = React.useState(false)

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

  return (
    <main id="main-content" className="min-h-dvh bg-muted/20">
      <section className="site-container grid min-h-dvh items-center py-10">
        <form
          noValidate
          className="mx-auto w-full max-w-md rounded-lg border border-border bg-background p-5 shadow-sm sm:p-6"
          onSubmit={submit}
        >
          <p className="eyebrow">PixeSci internal</p>
          <h1 className="mt-2 text-2xl font-semibold">Staff Admin</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in with an authorized PixeSci staff account.
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
            <FloatingLabelInput
              id="admin-password"
              type="password"
              label="Password"
              value={password}
              autoComplete="current-password"
              onChangeAction={setPassword}
            />
          </div>
          {message ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {message}
            </p>
          ) : null}
          <Button type="submit" className="mt-5 w-full" disabled={pending}>
            <KeyRound className="size-4" />
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  )
}
