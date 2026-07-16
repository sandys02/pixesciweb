"use client"

import * as React from "react"

import { AdminDashboard } from "./dashboard-layout"
import { AdminLogin } from "./login-panel"
import type { AuthState, EnvironmentState } from "../types/admin"

export function AdminShell({
  initialAuthState,
  initialEnvironment,
}: {
  initialAuthState: AuthState
  initialEnvironment: EnvironmentState
}) {
  const [auth, setAuth] = React.useState<AuthState>(initialAuthState)
  const [environment, setEnvironment] =
    React.useState<EnvironmentState>(initialEnvironment)

  if (!auth.authenticated) {
    return <AdminLogin onAuthenticated={setAuth} onEnvironment={setEnvironment} />
  }

  return (
    <AdminDashboard
      auth={auth}
      environment={environment}
      onLogout={() => setAuth({ authenticated: false })}
    />
  )
}
