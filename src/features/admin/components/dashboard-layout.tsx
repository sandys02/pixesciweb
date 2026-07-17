"use client"

import * as React from "react"
import { LayoutDashboard, ListChecks, LogOut, RefreshCw } from "lucide-react"

import { ThemeSwitcher } from "@/components/site/theme-switcher"
import { Button } from "@/components/ui/button"

import { requestAdminApi } from "../api/admin-client"
import type { AuditEvent, AuthState, EnvironmentState, OrganizationListItem } from "../types/admin"
import { AuditPanel } from "./audit-events-panel"
import { EnvironmentBadge } from "./environment-badge"
import { OneTimeLink } from "./one-time-link"
import { OrganizationsTable } from "./organizations-table"

type AdminView = "dashboard" | "audit"

export function AdminDashboard({
  auth,
  environment,
  onLogout,
}: {
  auth: Extract<AuthState, { authenticated: true }>
  environment: EnvironmentState
  onLogout: () => void
}) {
  const [organizations, setOrganizations] = React.useState<OrganizationListItem[]>([])
  const [auditEvents, setAuditEvents] = React.useState<AuditEvent[]>([])
  const [view, setView] = React.useState<AdminView>("dashboard")
  const [message, setMessage] = React.useState("")
  const [oneTimeLink, setOneTimeLink] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const loadOrganizations = React.useCallback(async () => {
    const result = await requestAdminApi<{ organizations: OrganizationListItem[] }>(
      "/api/admin/organizations"
    )
    setOrganizations(result.organizations)
  }, [])

  const loadAuditEvents = React.useCallback(async () => {
    const result = await requestAdminApi<{ auditEvents: AuditEvent[] }>(
      "/api/admin/audit-events"
    )
    setAuditEvents(result.auditEvents)
  }, [])

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadOrganizations().catch((error) =>
        setMessage(error instanceof Error ? error.message : "Admin data unavailable.")
      )
      void loadAuditEvents()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadAuditEvents, loadOrganizations])

  async function refresh() {
    setLoading(true)
    setMessage("")
    try {
      await loadOrganizations()
      await loadAuditEvents()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Refresh failed.")
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await requestAdminApi("/api/admin/logout", { method: "POST" }).catch(() => null)
    onLogout()
  }

  return (
    <main id="main-content" className="min-h-dvh bg-muted/20">
      <section className="site-container py-6 sm:py-8">
        <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">PixeSci internal</p>
              <EnvironmentBadge environment={environment} />
            </div>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Staff Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {auth.adminEmail} / {auth.role}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeSwitcher />
            <Button type="button" variant="outline" onClick={logout}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>

        {environment.previewUsingProduction ? (
          <div className="mt-5 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Preview admin writes are blocked because this deployment appears to
            target production data.
          </div>
        ) : null}

        {message ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {message}
          </p>
        ) : null}
        {oneTimeLink ? (
          <OneTimeLink value={oneTimeLink} onDismiss={() => setOneTimeLink("")} />
        ) : null}

        <div className="mt-6">
          <AdminTabs
            loading={loading}
            onRefresh={refresh}
            view={view}
            onViewChange={setView}
          />
          {view === "dashboard" ? (
            <OrganizationsTable
              organizations={organizations}
              environment={environment}
              onError={setMessage}
              onOneTimeLink={setOneTimeLink}
              onRefresh={refresh}
            />
          ) : (
            <AuditPanel events={auditEvents} />
          )}
        </div>
      </section>
    </main>
  )
}

function AdminTabs({
  loading,
  onRefresh,
  onViewChange,
  view,
}: {
  loading: boolean
  onRefresh: () => void
  onViewChange: (view: AdminView) => void
  view: AdminView
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={view === "dashboard" ? "default" : "outline"}
          onClick={() => onViewChange("dashboard")}
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Button>
        <Button
          type="button"
          variant={view === "audit" ? "default" : "outline"}
          onClick={() => onViewChange("audit")}
        >
          <ListChecks className="size-4" />
          Audit Logs
        </Button>
      </div>
      <Button type="button" variant="outline" onClick={onRefresh} disabled={loading}>
        <RefreshCw className="size-4" />
        {loading ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  )
}
