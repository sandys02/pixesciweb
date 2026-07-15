"use client"

import * as React from "react"
import {
  Archive,
  Building2,
  KeyRound,
  LogOut,
  Plus,
  RefreshCw,
  ShieldAlert,
} from "lucide-react"

import { FloatingLabelInput, FloatingLabelSelect } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { portalOrganizationTypes, portalUsStates } from "@/data/portal"
import { cn } from "@/lib/utils"

type AdminRole = "owner" | "admin" | "support"
type RuntimeEnvironment = "local" | "development" | "preview" | "production"

type AuthState =
  | { authenticated: false }
  | { authenticated: true; adminEmail: string; role: AdminRole }

type EnvironmentState = {
  runtime: RuntimeEnvironment
  previewUsingProduction: boolean
  databaseLabel: string
}

type OrganizationListItem = {
  id: number
  name: string
  domain: string
  email: string
  country: string
  state: string
  edition: "enterprise" | "academia" | "pixesci"
  researchField: string
  status: "active" | "deactivated" | "archived"
  activeLicenseId?: string
  seatLimit?: number
  allocatedSeats?: number
  updatedAt: string
}

type OrganizationDetail = {
  organization: OrganizationListItem
  profile: {
    country: "United States"
    state: string
    name: string
    email: string
    domain: string
    organizationType: "enterprise" | "academia" | "pixesci"
    researchField: string
    status: "active" | "deactivated" | "archived"
  }
  portalAccounts: Array<{
    id: number
    email: string
    active: boolean
    role: string
    mustChangePassword: boolean
    setupCompletedAt: string | null
    updatedAt: string
  }>
  licenses: Array<{
    id: number
    licenseId: string
    label: string
    status: "active" | "inactive"
    startsAt: string
    endsAt: string
    seatLimit: number
    signedBundleVersion: number | null
  }>
  seats: Array<{
    id: number
    seatId: string
    licenseId: string
    email: string | null
    role: string | null
    status: string
    inviteExpiresAt: string | null
    inviteAcceptedAt: string | null
    updatedAt: string
  }>
  auditEvents: Array<AuditEvent>
}

type AuditEvent = {
  id: number
  organizationId?: number | null
  actorType: string
  actorAdminAccountId?: number | null
  actorAccountId?: number | null
  eventType: string
  targetType: string
  targetId: string
  metadataJson: string | null
  createdAt: string
}

type CreateOrganizationForm = {
  country: "United States"
  state: string
  name: string
  email: string
  domain: string
  organizationType: "enterprise" | "academia" | "pixesci"
  researchField: string
  portalAccountEmail: string
  licenseId: string
  generateLicenseId: boolean
  label: string
  startsAt: string
  endsAt: string
  seatLimit: number
  createSetupLink: boolean
}

const emptyCreateForm: CreateOrganizationForm = {
  country: "United States",
  state: "",
  name: "",
  email: "",
  domain: "",
  organizationType: "enterprise",
  researchField: "",
  portalAccountEmail: "",
  licenseId: "",
  generateLicenseId: true,
  label: "Enterprise controlled deployment",
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10),
  seatLimit: 5,
  createSetupLink: true,
}

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

function AdminLogin({
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

function AdminDashboard({
  auth,
  environment,
  onLogout,
}: {
  auth: Extract<AuthState, { authenticated: true }>
  environment: EnvironmentState
  onLogout: () => void
}) {
  const [organizations, setOrganizations] = React.useState<OrganizationListItem[]>([])
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [detail, setDetail] = React.useState<OrganizationDetail | null>(null)
  const [auditEvents, setAuditEvents] = React.useState<AuditEvent[]>([])
  const [message, setMessage] = React.useState("")
  const [oneTimeLink, setOneTimeLink] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const selectedOrganization =
    organizations.find((organization) => organization.id === selectedId) ?? null

  const loadOrganizations = React.useCallback(async () => {
    const result = await requestAdminApi<{ organizations: OrganizationListItem[] }>(
      "/api/admin/organizations"
    )
    setOrganizations(result.organizations)
    setSelectedId((current) => current ?? result.organizations[0]?.id ?? null)
  }, [])

  const loadAuditEvents = React.useCallback(async () => {
    const result = await requestAdminApi<{ auditEvents: AuditEvent[] }>(
      "/api/admin/audit-events"
    )
    setAuditEvents(result.auditEvents)
  }, [])

  const loadDetail = React.useCallback(async (organizationId: number) => {
    const result = await requestAdminApi<{ detail: OrganizationDetail }>(
      `/api/admin/organizations/${organizationId}`
    )
    setDetail(result.detail)
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

  React.useEffect(() => {
    if (!selectedId) return
    const timeoutId = window.setTimeout(() => {
      void loadDetail(selectedId).catch((error) =>
        setMessage(error instanceof Error ? error.message : "Organization unavailable.")
      )
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadDetail, selectedId])

  async function refresh() {
    setLoading(true)
    setMessage("")
    try {
      await loadOrganizations()
      if (selectedId) await loadDetail(selectedId)
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
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCw className="size-4" />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
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

        <div className="mt-6 grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="space-y-6">
            <CreateOrganizationPanel
              onCreated={async (link) => {
                setOneTimeLink(link ?? "")
                await refresh()
              }}
              onError={setMessage}
            />
            <OrganizationList
              organizations={organizations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </aside>

          <div className="space-y-6">
            {selectedOrganization && detail ? (
              <OrganizationDetailPanel
                detail={detail}
                environment={environment}
                onOneTimeLink={setOneTimeLink}
                onRefresh={refresh}
                onError={setMessage}
              />
            ) : (
              <EmptyState />
            )}
            <AuditPanel events={detail?.auditEvents ?? auditEvents} />
          </div>
        </div>
      </section>
    </main>
  )
}

function CreateOrganizationPanel({
  onCreated,
  onError,
}: {
  onCreated: (oneTimeLink?: string) => Promise<void>
  onError: (message: string) => void
}) {
  const [form, setForm] = React.useState<CreateOrganizationForm>(emptyCreateForm)
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  function update<K extends keyof CreateOrganizationForm>(
    key: K,
    value: CreateOrganizationForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    onError("")
    try {
      const result = await requestAdminApi<{ setupLink?: string }>(
        "/api/admin/organizations",
        {
          method: "POST",
          body: JSON.stringify({
            organization: {
              country: "United States",
              state: form.state,
              name: form.name,
              email: form.email,
              domain: form.domain,
              organizationType: form.organizationType,
              researchField: form.researchField,
            },
            portalAccount: {
              email: form.portalAccountEmail,
              createSetupLink: form.createSetupLink,
            },
            license: {
              licenseId: form.licenseId,
              generateLicenseId: form.generateLicenseId,
              label: form.label,
              startsAt: form.startsAt,
              endsAt: form.endsAt,
              seatLimit: form.seatLimit,
              status: "active",
            },
          }),
        }
      )
      setForm(emptyCreateForm)
      setOpen(false)
      await onCreated(result.setupLink)
    } catch (error) {
      onError(error instanceof Error ? error.message : "Organization creation failed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          <span className="eyebrow">Onboarding</span>
          <span className="mt-1 block font-semibold">Add organization</span>
        </span>
        <Plus className="size-4" />
      </button>
      {open ? (
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <FloatingLabelSelect
            id="admin-org-state"
            label="State"
            value={form.state}
            options={portalUsStates.map((state) => ({ label: state, value: state }))}
            placeholder="Select state"
            onValueChange={(value) => update("state", value)}
          />
          <FloatingLabelSelect
            id="admin-org-edition"
            label="Edition"
            value={form.organizationType}
            options={portalOrganizationTypes}
            onValueChange={(value) =>
              update(
                "organizationType",
                value as CreateOrganizationForm["organizationType"]
              )
            }
          />
          <FloatingLabelInput
            id="admin-org-name"
            label="Organization name"
            value={form.name}
            onChangeAction={(value) => update("name", value)}
          />
          <FloatingLabelInput
            id="admin-org-email"
            type="email"
            label="Organization email"
            value={form.email}
            onChangeAction={(value) => update("email", value)}
          />
          <FloatingLabelInput
            id="admin-org-domain"
            label="Organization domain"
            value={form.domain}
            onChangeAction={(value) => update("domain", value)}
          />
          <FloatingLabelInput
            id="admin-org-research"
            label="Research field"
            value={form.researchField}
            onChangeAction={(value) => update("researchField", value)}
          />
          <FloatingLabelInput
            id="admin-portal-email"
            type="email"
            label="Portal account email"
            value={form.portalAccountEmail}
            onChangeAction={(value) => update("portalAccountEmail", value)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.generateLicenseId}
              onChange={(event) => update("generateLicenseId", event.target.checked)}
            />
            Generate license ID
          </label>
          {!form.generateLicenseId ? (
            <FloatingLabelInput
              id="admin-license-id"
              label="License ID"
              value={form.licenseId}
              onChangeAction={(value) => update("licenseId", value)}
            />
          ) : null}
          <FloatingLabelInput
            id="admin-license-label"
            label="License label"
            value={form.label}
            onChangeAction={(value) => update("label", value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FloatingLabelInput
              id="admin-license-start"
              type="date"
              label="Start date"
              value={form.startsAt}
              onChangeAction={(value) => update("startsAt", value)}
            />
            <FloatingLabelInput
              id="admin-license-end"
              type="date"
              label="End date"
              value={form.endsAt}
              onChangeAction={(value) => update("endsAt", value)}
            />
          </div>
          <FloatingLabelInput
            id="admin-license-seats"
            type="number"
            label="Seat limit"
            value={String(form.seatLimit)}
            onChangeAction={(value) =>
              update("seatLimit", Math.max(1, Number.parseInt(value, 10) || 1))
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.createSetupLink}
              onChange={(event) => update("createSetupLink", event.target.checked)}
            />
            Create one-time setup link
          </label>
          <Button type="submit" className="w-full" disabled={pending}>
            <Building2 className="size-4" />
            {pending ? "Creating..." : "Create organization"}
          </Button>
        </form>
      ) : null}
    </section>
  )
}

function OrganizationList({
  organizations,
  selectedId,
  onSelect,
}: {
  organizations: OrganizationListItem[]
  selectedId: number | null
  onSelect: (id: number) => void
}) {
  return (
    <section className="rounded-lg border border-border bg-background shadow-sm">
      <div className="border-b border-border p-4">
        <p className="eyebrow">Organizations</p>
        <h2 className="mt-1 font-semibold">Customer organizations</h2>
      </div>
      <div className="max-h-[36rem] overflow-y-auto">
        {organizations.map((organization) => (
          <button
            key={organization.id}
            type="button"
            className={cn(
              "block w-full border-b border-border/70 p-4 text-left text-sm hover:bg-muted/40",
              selectedId === organization.id && "bg-muted"
            )}
            onClick={() => onSelect(organization.id)}
          >
            <span className="font-medium">{organization.name}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {organization.domain} / {organization.status}
            </span>
          </button>
        ))}
        {organizations.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No organizations are available.
          </p>
        ) : null}
      </div>
    </section>
  )
}

function OrganizationDetailPanel({
  detail,
  environment,
  onOneTimeLink,
  onRefresh,
  onError,
}: {
  detail: OrganizationDetail
  environment: EnvironmentState
  onOneTimeLink: (link: string) => void
  onRefresh: () => Promise<void>
  onError: (message: string) => void
}) {
  return (
    <section className="rounded-lg border border-border bg-background shadow-sm">
      <div className="border-b border-border p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow">Organization detail</p>
            <h2 className="mt-1 text-xl font-semibold">{detail.profile.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {detail.profile.domain} / {detail.profile.status}
            </p>
          </div>
          <OrganizationLifecycleActions
            detail={detail}
            environment={environment}
            onRefresh={onRefresh}
            onError={onError}
          />
        </div>
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <InfoPanel title="Profile">
          <Info label="Email" value={detail.profile.email} />
          <Info label="State" value={detail.profile.state} />
          <Info label="Edition" value={detail.profile.organizationType} />
          <Info label="Research field" value={detail.profile.researchField} />
        </InfoPanel>
        <InfoPanel title="Portal accounts">
          <div className="space-y-3">
            {detail.portalAccounts.map((account) => (
              <div key={account.id} className="rounded-md border border-border p-3">
                <p className="text-sm font-medium">{account.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {account.role} / {account.active ? "active" : "inactive"} /
                  {account.mustChangePassword ? " setup required" : " setup complete"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    void resetPassword(account.id, onOneTimeLink, onRefresh, onError)
                  }
                >
                  <KeyRound className="size-4" />
                  Reset password
                </Button>
              </div>
            ))}
          </div>
        </InfoPanel>
      </div>
      <LicenseTable detail={detail} onRefresh={onRefresh} onError={onError} />
      <SeatTable seats={detail.seats} />
    </section>
  )
}

function OrganizationLifecycleActions({
  detail,
  environment,
  onRefresh,
  onError,
}: {
  detail: OrganizationDetail
  environment: EnvironmentState
  onRefresh: () => Promise<void>
  onError: (message: string) => void
}) {
  async function run(action: "deactivate" | "archive") {
    const confirmation =
      environment.runtime === "production"
        ? window.prompt(`Enter ${detail.profile.domain} to confirm ${action}.`) ?? ""
        : detail.profile.domain
    try {
      await requestAdminApi(
        `/api/admin/organizations/${detail.organization.id}/${action}`,
        {
          method: "POST",
          body: JSON.stringify({ confirmation }),
        }
      )
      await onRefresh()
    } catch (error) {
      onError(error instanceof Error ? error.message : `${action} failed.`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={detail.profile.status !== "active"}
        onClick={() => void run("deactivate")}
      >
        <ShieldAlert className="size-4" />
        Deactivate
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={detail.profile.status === "archived"}
        onClick={() => void run("archive")}
      >
        <Archive className="size-4" />
        Archive
      </Button>
    </div>
  )
}

function LicenseTable({
  detail,
  onRefresh,
  onError,
}: {
  detail: OrganizationDetail
  onRefresh: () => Promise<void>
  onError: (message: string) => void
}) {
  return (
    <div className="border-t border-border p-5">
      <h3 className="font-semibold">Licenses</h3>
      <div className="mt-3 max-w-full overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">License ID</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Term</th>
              <th className="px-3 py-2 font-medium">Seats</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {detail.licenses.map((license) => (
              <tr key={license.id} className="border-b border-border/70">
                <td className="px-3 py-2 font-mono text-xs">{license.licenseId}</td>
                <td className="px-3 py-2">{license.status}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {license.startsAt} to {license.endsAt}
                </td>
                <td className="px-3 py-2">{license.seatLimit}</td>
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void editLicense(license, onRefresh, onError)
                    }
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SeatTable({ seats }: { seats: OrganizationDetail["seats"] }) {
  return (
    <div className="border-t border-border p-5">
      <h3 className="font-semibold">Seats</h3>
      <div className="mt-3 max-w-full overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Seat ID</th>
              <th className="px-3 py-2 font-medium">License</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {seats.map((seat) => (
              <tr key={seat.id} className="border-b border-border/70">
                <td className="px-3 py-2 font-mono text-xs">{seat.seatId}</td>
                <td className="px-3 py-2 font-mono text-xs">{seat.licenseId}</td>
                <td className="px-3 py-2">{seat.email ?? "No email"}</td>
                <td className="px-3 py-2">{seat.role ?? "No role"}</td>
                <td className="px-3 py-2">{seat.status}</td>
              </tr>
            ))}
            {seats.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-5 text-center text-muted-foreground">
                  No seats are recorded for this organization.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AuditPanel({ events }: { events: AuditEvent[] }) {
  return (
    <section className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <p className="eyebrow">Audit</p>
      <h2 className="mt-1 font-semibold">Recent events</h2>
      <div className="mt-4 divide-y divide-border">
        {events.slice(0, 12).map((event) => (
          <div key={event.id} className="py-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{event.eventType}</p>
              <time className="text-xs text-muted-foreground">{event.createdAt}</time>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {event.actorType} / {event.targetType} / {event.targetId}
            </p>
          </div>
        ))}
        {events.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No audit events.</p>
        ) : null}
      </div>
    </section>
  )
}

function InfoPanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium">{value}</p>
    </div>
  )
}

function EnvironmentBadge({ environment }: { environment: EnvironmentState }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
        environment.runtime === "production"
          ? "border-destructive/40 text-destructive"
          : "border-border text-muted-foreground"
      )}
    >
      {environment.databaseLabel}
    </span>
  )
}

function OneTimeLink({
  value,
  onDismiss,
}: {
  value: string
  onDismiss: () => void
}) {
  return (
    <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-medium">One-time setup/reset link</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Copy this now. The plaintext token is not stored and will not be shown again.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-border bg-background p-2 text-xs">
          {value}
        </code>
        <Button
          type="button"
          variant="outline"
          onClick={() => void navigator.clipboard.writeText(value)}
        >
          Copy
        </Button>
        <Button type="button" variant="ghost" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <section className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
      Select or create an organization.
    </section>
  )
}

async function resetPassword(
  accountId: number,
  onOneTimeLink: (link: string) => void,
  onRefresh: () => Promise<void>,
  onError: (message: string) => void
) {
  try {
    const result = await requestAdminApi<{ resetLink: string }>(
      `/api/admin/portal-accounts/${accountId}/password-reset`,
      { method: "POST" }
    )
    onOneTimeLink(result.resetLink)
    await onRefresh()
  } catch (error) {
    onError(error instanceof Error ? error.message : "Password reset failed.")
  }
}

async function editLicense(
  license: OrganizationDetail["licenses"][number],
  onRefresh: () => Promise<void>,
  onError: (message: string) => void
) {
  const seatLimit = window.prompt("Seat limit", String(license.seatLimit))
  if (!seatLimit) return
  try {
    await requestAdminApi(`/api/admin/licenses/${license.licenseId}`, {
      method: "PATCH",
      body: JSON.stringify({
        label: license.label,
        startsAt: license.startsAt,
        endsAt: license.endsAt,
        seatLimit: Number.parseInt(seatLimit, 10),
        status: license.status,
      }),
    })
    await onRefresh()
  } catch (error) {
    onError(error instanceof Error ? error.message : "License update failed.")
  }
}

async function requestAdminApi<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "Admin request failed."
    throw new Error(message)
  }

  return response.json() as Promise<T>
}
