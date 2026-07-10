"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronRight,
  KeyRound,
  MailPlus,
  MoreHorizontal,
  Save,
  Settings,
  ShieldCheck,
  UserMinus,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { portalOrganizationTypes, portalUsStates } from "@/data/portal"
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/shared/inputs"
import { DownloadPixeSciButton } from "@/components/site/download-pixesci-button"
import { PortalLogoutButton } from "@/components/site/portal-logout-button"
import { ThemeSwitcher } from "@/components/site/theme-switcher"
import { Button } from "@/components/ui/button"
import {
  changePortalPassword as requestPortalPasswordChange,
  completePortalSetup,
  getPortalLicenseSeats,
  getPortalLicenses,
  invitePortalSeat as requestPortalSeatInvite,
  removePortalSeat as requestPortalSeatRemove,
  resendPortalSeatInvite as requestPortalSeatResend,
  revokePortalSeatInvite as requestPortalSeatRevoke,
  updatePortalOrganization,
} from "@/lib/portal-access"
import { cn } from "@/lib/utils"
import {
  countAllocatedSeats,
  countActiveSeats,
  formatPortalDate,
  normalizeDomain,
  validatePasswordChange,
  validateSetupForm,
} from "@/features/portal/helpers"
import type {
  LicenseStatus,
  OrganizationType,
  PortalAccount,
  PortalAccountSetupForm,
  PortalLicense,
  PortalOrganization,
  PortalSeat,
  SeatRole,
  SeatStatus,
} from "@/features/portal/types"

type PortalShellProps = {
  initialOrganization: PortalOrganization
  sessionEmail: string
  setupRequired: boolean
}

type PortalView = "licenses" | "settings"

type InviteForm = {
  email: string
  role: SeatRole
}

type PasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const emptyPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

export function PortalShell({
  initialOrganization,
  sessionEmail,
  setupRequired,
}: PortalShellProps) {
  const [setupComplete, setSetupComplete] = React.useState(!setupRequired)
  const [view, setView] = React.useState<PortalView>("licenses")
  const [account, setAccount] = React.useState<PortalAccount>({
    organization: initialOrganization,
    licenses: [],
  })
  const [expandedLicenseId, setExpandedLicenseId] = React.useState("")
  const [licensesLoading, setLicensesLoading] = React.useState(false)
  const [licensesError, setLicensesError] = React.useState("")
  const [loadingSeatLicenseId, setLoadingSeatLicenseId] = React.useState("")

  const loadLicenseSeats = React.useCallback(async (licenseId: string) => {
    setLoadingSeatLicenseId(licenseId)
    setLicensesError("")

    try {
      const result = await getPortalLicenseSeats(licenseId)
      setAccount((current) => ({
        ...current,
        licenses: current.licenses.map((license) =>
          license.id === licenseId
            ? { ...result.license, seats: result.seats }
            : license
        ),
      }))
    } catch (error) {
      setLicensesError(
        error instanceof Error
          ? error.message
          : "License seats are temporarily unavailable."
      )
    } finally {
      setLoadingSeatLicenseId("")
    }
  }, [])

  const loadLicenses = React.useCallback(async () => {
    setLicensesLoading(true)
    setLicensesError("")

    try {
      const result = await getPortalLicenses()
      setAccount((current) => ({
        ...current,
        licenses: result.licenses.map((license) => {
          const existing = current.licenses.find((item) => item.id === license.id)
          return { ...license, seats: existing?.seats ?? [] }
        }),
      }))
      setExpandedLicenseId((current) => current || result.licenses[0]?.id || "")
      if (result.licenses[0]?.id) {
        await loadLicenseSeats(result.licenses[0].id)
      }
    } catch (error) {
      setLicensesError(
        error instanceof Error
          ? error.message
          : "Licenses are temporarily unavailable."
      )
    } finally {
      setLicensesLoading(false)
    }
  }, [loadLicenseSeats])

  React.useEffect(() => {
    if (setupComplete) {
      void loadLicenses()
    }
  }, [loadLicenses, setupComplete])

  async function completeSetup(form: PortalAccountSetupForm) {
    await completePortalSetup(form)
    const nextAccount: PortalAccount = {
      ...account,
      organization: {
        country: "United States",
        state: form.state.trim(),
        organizationType: form.organizationType,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        domain: normalizeDomain(form.domain),
        researchField: form.researchField.trim(),
      },
      licenses: [],
    }
    setAccount(nextAccount)
    setSetupComplete(true)
    setExpandedLicenseId("")
    setView("licenses")
  }

  function updateOrganization(organization: PortalOrganization) {
    setAccount({ ...account, organization })
  }

  async function expandLicense(licenseId: string) {
    const nextLicenseId = expandedLicenseId === licenseId ? "" : licenseId
    setExpandedLicenseId(nextLicenseId)

    if (nextLicenseId) {
      await loadLicenseSeats(nextLicenseId)
    }
  }

  async function inviteSeat(licenseId: string, input: InviteForm) {
    const result = await requestPortalSeatInvite(licenseId, input)
    await loadLicenseSeats(licenseId)
    return result.inviteLink
  }

  async function resendSeat(licenseId: string, seatId: string) {
    const result = await requestPortalSeatResend(seatId)
    await loadLicenseSeats(licenseId)
    return result.inviteLink
  }

  async function revokeSeat(licenseId: string, seatId: string) {
    await requestPortalSeatRevoke(seatId)
    await loadLicenseSeats(licenseId)
  }

  async function removeSeat(licenseId: string, seatId: string) {
    await requestPortalSeatRemove(seatId)
    await loadLicenseSeats(licenseId)
  }

  return (
    <PortalFrame sessionEmail={sessionEmail}>
      {!setupComplete ? (
        <AccountSetup
          initialOrganization={account.organization}
          onComplete={completeSetup}
        />
      ) : (
        <div className="py-8 sm:py-10">
          <PortalTabs view={view} onViewChange={setView} />
          {view === "licenses" ? (
            <LicenseDashboard
              account={account}
              expandedLicenseId={expandedLicenseId}
              loading={licensesLoading}
              loadingSeatLicenseId={loadingSeatLicenseId}
              error={licensesError}
              onExpandedLicenseChange={expandLicense}
              onInviteSeat={inviteSeat}
              onRefreshLicenses={loadLicenses}
              onRemoveSeat={removeSeat}
              onResendSeat={resendSeat}
              onRevokeSeat={revokeSeat}
            />
          ) : (
            <SettingsPage
              account={account}
              onOrganizationChange={updateOrganization}
            />
          )}
        </div>
      )}
    </PortalFrame>
  )
}

function PortalFrame({
  children,
  sessionEmail,
}: {
  children: React.ReactNode
  sessionEmail: string
}) {
  return (
    <main id="main-content" className="min-h-dvh bg-muted/20">
      <section className="site-container py-8 sm:py-10">
        <div className="flex flex-row items-end justify-between gap-5 border-b border-border pb-6">
          <div>
            <p className="eyebrow">PixeSci Portal</p>
            <h1 className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl">
              Organization Portal
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Organization portal account: {sessionEmail}
            </p>
          </div>
          <div className="flex items-start justify-end gap-2 sm:items-center">
            <ThemeSwitcher />
            <PortalLogoutButton className="items-start sm:items-end" />
          </div>
        </div>
        {children}
      </section>
    </main>
  )
}

function PortalTabs({
  onViewChange,
  view,
}: {
  onViewChange: (view: PortalView) => void
  view: PortalView
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={view === "licenses" ? "default" : "outline"}
          onClick={() => onViewChange("licenses")}
        >
          <ShieldCheck className="size-4" />
          Licenses
        </Button>
        <Button
          type="button"
          variant={view === "settings" ? "default" : "outline"}
          onClick={() => onViewChange("settings")}
        >
          <Settings className="size-4" />
          Settings
        </Button>
      </div>
      <DownloadPixeSciButton source="portal" />
    </div>
  )
}

function AccountSetup({
  initialOrganization,
  onComplete,
}: {
  initialOrganization: PortalOrganization
  onComplete: (form: PortalAccountSetupForm) => Promise<void>
}) {
  const [form, setForm] = React.useState<PortalAccountSetupForm>({
    ...initialOrganization,
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof PortalAccountSetupForm, string>>
  >({})
  const [message, setMessage] = React.useState("")
  const [pending, setPending] = React.useState(false)

  function updateField<K extends keyof PortalAccountSetupForm>(
    field: K,
    value: PortalAccountSetupForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setMessage("")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateSetupForm(form, { validatePassword: true })
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    setMessage("")

    try {
      await onComplete({ ...form, domain: normalizeDomain(form.domain) })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Account Setup is temporarily unavailable."
      )
      setPending(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100dvh-11rem)] items-start gap-8 py-10 lg:grid-cols-[0.78fr_1.22fr] lg:py-14">
      <div className="lg:pt-8">
        <p className="eyebrow">First sign-in</p>
        <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
          Account Setup
        </h2>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          Set a new portal password before opening the dashboard. The
          organization account is not a PixeSci app user. It manages licenses
          and creates seats for human admins and members.
        </p>
        <div className="mt-6 rounded-lg border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
          PixeSci connects and automates scientific software, runs work locally
          or in customer-controlled infrastructure, and tracks actions, files,
          settings, decisions, reviews, and results.
        </div>
      </div>

      <form
        noValidate
        className="rounded-lg border border-border bg-background p-5 shadow-sm sm:p-6"
        onSubmit={handleSubmit}
      >
        <OrganizationFields
          errors={errors}
          form={form}
          lockEmail={false}
          onFieldChange={updateField}
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FloatingLabelInput
            id="portal-password"
            type="password"
            label="New password"
            value={form.newPassword}
            placeholder="Create a new password"
            required
            autoComplete="new-password"
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword}
            minLength={10}
            onChangeAction={(value) => updateField("newPassword", value)}
          />
          <FloatingLabelInput
            id="portal-confirm-password"
            type="password"
            label="Confirm password"
            value={form.confirmPassword}
            placeholder="Re-enter the new password"
            required
            autoComplete="new-password"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            minLength={10}
            onChangeAction={(value) => updateField("confirmPassword", value)}
          />
        </div>

        {message ? (
          <p role="alert" className="mt-5 text-sm text-destructive">
            {message}
          </p>
        ) : null}

        <Button type="submit" className="mt-5 w-full" disabled={pending}>
          <KeyRound className="size-4" />
          {pending ? "Saving..." : "Save password and open dashboard"}
        </Button>
      </form>
    </div>
  )
}

function OrganizationFields({
  errors,
  form,
  lockEmail,
  onFieldChange,
}: {
  errors: Partial<Record<keyof PortalAccountSetupForm, string>>
  form: PortalAccountSetupForm
  lockEmail: boolean
  onFieldChange: <K extends keyof PortalAccountSetupForm>(
    field: K,
    value: PortalAccountSetupForm[K]
  ) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FloatingLabelInput
        id="portal-country"
        label="Country"
        value="United States"
        disabled
        onChangeAction={() => undefined}
      />
      <FloatingLabelSelect
        id="portal-state"
        label="State"
        value={form.state}
        required
        error={Boolean(errors.state)}
        helperText={errors.state}
        options={portalUsStates.map((state) => ({ value: state, label: state }))}
        placeholder="Select state"
        onValueChange={(value) => onFieldChange("state", value)}
      />
      <FloatingLabelSelect
        id="portal-edition"
        label="Edition"
        value={form.organizationType}
        options={portalOrganizationTypes}
        placeholder="Select edition"
        onValueChange={(value) =>
          onFieldChange("organizationType", value as OrganizationType)
        }
      />
      <FloatingLabelInput
        id="portal-email"
        type="email"
        label="Organization email"
        value={form.email}
        required
        disabled={lockEmail}
        error={Boolean(errors.email)}
        helperText={lockEmail ? "Email is set by the portal account." : errors.email}
        autoComplete="email"
        inputMode="email"
        onChangeAction={(value) => onFieldChange("email", value)}
      />
      <FloatingLabelInput
        id="portal-organization"
        label="Organization name"
        value={form.name}
        required
        error={Boolean(errors.name)}
        helperText={errors.name}
        onChangeAction={(value) => onFieldChange("name", value)}
      />
      <FloatingLabelInput
        id="portal-domain"
        label="Organization domain"
        value={form.domain}
        required
        error={Boolean(errors.domain)}
        helperText={errors.domain}
        onChangeAction={(value) => onFieldChange("domain", value)}
      />
      <FloatingLabelInput
        id="portal-research"
        label="Research field"
        value={form.researchField}
        required
        error={Boolean(errors.researchField)}
        helperText={errors.researchField}
        className="sm:col-span-2"
        onChangeAction={(value) => onFieldChange("researchField", value)}
      />
    </div>
  )
}

function LicenseDashboard({
  account,
  expandedLicenseId,
  onExpandedLicenseChange,
  onSeatsChange,
}: {
  account: PortalAccount
  expandedLicenseId: string
  onExpandedLicenseChange: (licenseId: string) => void
  onSeatsChange: (
    licenseId: string,
    updater: (seats: PortalSeat[]) => PortalSeat[]
  ) => void
}) {
  const activeLicense = account.licenses.find(
    (license) => license.status === "active"
  )
  const activeSeatCount = activeLicense ? countActiveSeats(activeLicense) : 0

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Organization"
          value={account.organization.name}
          detail={`${organizationTypeLabel(account.organization.organizationType)} / ${account.organization.state}`}
        />
        <Metric
          label="Active app seats"
          value={
            activeLicense
              ? `${activeSeatCount} of ${activeLicense.seatLimit}`
              : "0 of 0"
          }
          detail="Human app users only; the portal account is not counted."
        />
        <Metric
          label="Deployment posture"
          value="Customer-controlled"
          detail="Use signed license bundles for air-gapped operation."
        />
      </div>

      <div className="mt-6 min-w-0">
        <section className="min-w-0 rounded-lg border border-border bg-background shadow-sm">
          <div className="border-b border-border p-5">
            <p className="eyebrow">Licenses</p>
            <h2 className="mt-2 text-xl font-semibold">License dashboard</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Current and past license IDs are scoped to this organization.
              Expand a license to create the first human admin, invite members,
              revoke invites, or remove seats. The organization portal account
              is not an app user.
            </p>
          </div>

          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">License ID</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Term</th>
                  <th className="px-4 py-3 font-medium">Seats</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {account.licenses.map((license) => (
                  <React.Fragment key={license.id}>
                    <tr className="border-b border-border/70">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 font-mono text-xs font-medium"
                          aria-expanded={expandedLicenseId === license.id}
                          onClick={() =>
                            onExpandedLicenseChange(
                              expandedLicenseId === license.id ? "" : license.id
                            )
                          }
                        >
                          {expandedLicenseId === license.id ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                          {license.id}
                        </button>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {license.label}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={license.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatPortalDate(license.startsAt)} to{" "}
                        {formatPortalDate(license.endsAt)}
                      </td>
                      <td className="px-4 py-3">
                        {countActiveSeats(license)} of {license.seatLimit}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onExpandedLicenseChange(license.id)}
                        >
                          Review seats
                        </Button>
                      </td>
                    </tr>
                    {expandedLicenseId === license.id ? (
                      <tr>
                        <td colSpan={5} className="bg-muted/20 p-4">
                          <SeatsPanel
                            license={license}
                            onSeatsChange={(updater) =>
                              onSeatsChange(license.id, updater)
                            }
                          />
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

function SettingsPage({
  account,
  onOrganizationChange,
}: {
  account: PortalAccount
  onOrganizationChange: (organization: PortalOrganization) => void
}) {
  const [profile, setProfile] = React.useState<PortalAccountSetupForm>({
    ...account.organization,
    newPassword: "",
    confirmPassword: "",
  })
  const [profileErrors, setProfileErrors] = React.useState<
    Partial<Record<keyof PortalAccountSetupForm, string>>
  >({})
  const [passwordForm, setPasswordForm] =
    React.useState<PasswordForm>(emptyPasswordForm)
  const [passwordErrors, setPasswordErrors] = React.useState<
    Partial<Record<keyof PasswordForm, string>>
  >({})
  const [message, setMessage] = React.useState("")
  const [profilePending, setProfilePending] = React.useState(false)

  function updateProfileField<K extends keyof PortalAccountSetupForm>(
    field: K,
    value: PortalAccountSetupForm[K]
  ) {
    setProfile((current) => ({ ...current, [field]: value }))
    setProfileErrors((current) => ({ ...current, [field]: undefined }))
    setMessage("")
  }

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateSetupForm(profile, { validatePassword: false })
    setProfileErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setProfilePending(true)
    setMessage("")

    try {
      const result = await updatePortalOrganization({
        country: "United States",
        state: profile.state.trim(),
        organizationType: profile.organizationType,
        name: profile.name.trim(),
        email: account.organization.email,
        domain: normalizeDomain(profile.domain),
        researchField: profile.researchField.trim(),
      })
      onOrganizationChange(result.organization)
      setProfile({
        ...result.organization,
        newPassword: "",
        confirmPassword: "",
      })
      setMessage("Organization settings saved.")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Organization settings are temporarily unavailable."
      )
    } finally {
      setProfilePending(false)
    }
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validatePasswordChange(passwordForm)
    setPasswordErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await requestPortalPasswordChange(passwordForm)
      setPasswordForm(emptyPasswordForm)
      setMessage("Portal password changed.")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Portal password change is temporarily unavailable."
      )
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form
        noValidate
        className="rounded-lg border border-border bg-background p-5 shadow-sm sm:p-6"
        onSubmit={submitProfile}
      >
        <p className="eyebrow">Organization profile</p>
        <h2 className="mt-2 text-xl font-semibold">Settings</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          These fields mirror the old app registration form. They are
          non-sensitive organization details PixeSci can store for license
          issuance, renewal, and support.
        </p>
        <div className="mt-6">
          <OrganizationFields
            errors={profileErrors}
            form={profile}
            lockEmail
            onFieldChange={updateProfileField}
          />
        </div>
        <Button type="submit" className="mt-5" disabled={profilePending}>
          <Save className="size-4" />
          {profilePending ? "Saving..." : "Save settings"}
        </Button>
      </form>

      <aside className="space-y-6">
        <form
          noValidate
          className="rounded-lg border border-border bg-background p-5 shadow-sm"
          onSubmit={submitPassword}
        >
          <p className="eyebrow">Security</p>
          <h2 className="mt-2 text-base font-semibold">Portal password</h2>
          <div className="mt-5 space-y-4">
            <FloatingLabelInput
              id="settings-current-password"
              type="password"
              label="Current password"
              value={passwordForm.currentPassword}
              placeholder="Current password"
              error={Boolean(passwordErrors.currentPassword)}
              helperText={passwordErrors.currentPassword}
              autoComplete="current-password"
              onChangeAction={(value) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: value,
                }))
              }
            />
            <FloatingLabelInput
              id="settings-new-password"
              type="password"
              label="New password"
              value={passwordForm.newPassword}
              placeholder="New password"
              error={Boolean(passwordErrors.newPassword)}
              helperText={passwordErrors.newPassword}
              autoComplete="new-password"
              minLength={10}
              onChangeAction={(value) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPassword: value,
                }))
              }
            />
            <FloatingLabelInput
              id="settings-confirm-password"
              type="password"
              label="Confirm password"
              value={passwordForm.confirmPassword}
              placeholder="Confirm password"
              error={Boolean(passwordErrors.confirmPassword)}
              helperText={passwordErrors.confirmPassword}
              autoComplete="new-password"
              minLength={10}
              onChangeAction={(value) =>
                setPasswordForm((current) => ({
                  ...current,
                  confirmPassword: value,
                }))
              }
            />
          </div>
          <Button type="submit" variant="outline" className="mt-5 w-full">
            <KeyRound className="size-4" />
            Change password
          </Button>
        </form>

        <div className="rounded-lg border border-border bg-background p-5 text-sm leading-6 text-muted-foreground shadow-sm">
          <ShieldCheck className="mb-3 size-5 text-primary" />
          The portal stores enough information for licensing and seats. The
          scientific work, files, results, and local execution records remain in
          customer-controlled PixeSci environments. This organization portal
          account is separate from human PixeSci app users.
        </div>
        {message ? (
          <p role="status" className="text-sm text-primary">
            {message}
          </p>
        ) : null}
      </aside>
    </div>
  )
}

function SeatsPanel({
  license,
  onSeatsChange,
}: {
  license: PortalLicense
  onSeatsChange: (updater: (seats: PortalSeat[]) => PortalSeat[]) => void
}) {
  const [invite, setInvite] = React.useState<InviteForm>({
    email: "",
    role: "member",
  })
  const [openSeatMenuId, setOpenSeatMenuId] = React.useState("")
  const allocatedCount = license.seats.filter(
    (seat) => seat.status === "active" || seat.status === "invited"
  ).length
  const activeAdminCount = license.seats.filter(
    (seat) => seat.status === "active" && seat.role === "admin"
  ).length
  const seatLimitReached = allocatedCount >= license.seatLimit
  const isActiveLicense = license.status === "active"

  function submitInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (seatLimitReached) return
    if (!/^\S+@\S+\.\S+$/.test(invite.email.trim())) return

    onSeatsChange((seats) => [createInvitedSeat(invite.email, invite.role), ...seats])
    setInvite({ email: "", role: "member" })
  }

  return (
    <div className="min-w-0 rounded-lg border border-border bg-background">
      <div className="grid gap-4 border-b border-border p-4">
        <div>
          <h3 className="text-base font-semibold">Seats</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Use seats for human PixeSci app users only. Create the first human
            admin here; the portal account itself is not an app user. TODO
            backend: hash tokens, expire them, rate-limit resends, and audit
            every action.
          </p>
        </div>
        {isActiveLicense ? (
          <form
            className="grid max-w-2xl gap-2 sm:grid-cols-[minmax(14rem,1fr)_8rem_auto]"
            onSubmit={submitInvite}
          >
            <FloatingLabelInput
              id={`invite-email-${license.id}`}
              type="email"
              label="Invite email"
              value={invite.email}
              placeholder="user@example.org"
              disabled={seatLimitReached}
              inputMode="email"
              onChangeAction={(value) =>
                setInvite((current) => ({ ...current, email: value }))
              }
            />
            <FloatingLabelSelect
              id={`invite-role-${license.id}`}
              label="Role"
              value={invite.role}
              options={[
                { value: "member", label: "Member" },
                { value: "admin", label: "Admin" },
              ]}
              disabled={seatLimitReached}
              onValueChange={(value) =>
                setInvite((current) => ({ ...current, role: value }))
              }
            />
            <Button
              type="submit"
              size="sm"
              className="h-10"
              disabled={seatLimitReached}
            >
              <MailPlus className="size-4" />
              Invite
            </Button>
          </form>
        ) : null}
      </div>

      {isActiveLicense ? (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="border-b border-border bg-muted/35 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Seat/user ID</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Invite state</th>
                <th className="px-3 py-2 text-right font-medium">Options</th>
              </tr>
            </thead>
            <tbody>
              {license.seats.map((seat) => (
                <tr key={seat.id} className="border-b border-border/70">
                  <td className="px-3 py-2 font-mono">{seat.id}</td>
                  <td className="px-3 py-2">{seat.email}</td>
                  <td className="px-3 py-2 capitalize">{seat.role}</td>
                  <td className="px-3 py-2">
                    <SeatStatusBadge status={seat.status} />
                  </td>
                  <td className="max-w-56 truncate px-3 py-2 text-muted-foreground">
                    {seat.inviteLink}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <SeatActions
                      open={openSeatMenuId === seat.id}
                      seat={seat}
                      canInvite={!seatLimitReached}
                      protectActiveAdmin={
                        seat.status === "active" &&
                        seat.role === "admin" &&
                        activeAdminCount <= 1
                      }
                      onOpenChange={(open) =>
                        setOpenSeatMenuId(open ? seat.id : "")
                      }
                      onInvite={() =>
                        onSeatsChange((seats) =>
                          seats.map((item) =>
                            item.id === seat.id
                              ? {
                                  ...item,
                                  status: "invited",
                                  temporaryCredentialState: "resent",
                                  inviteLink: item.inviteLink?.startsWith("https://")
                                    ? item.inviteLink
                                    : `https://portal.pixesci.example/invite/${item.id}`,
                                }
                              : item
                          )
                        )
                      }
                      onRemove={() =>
                        onSeatsChange((seats) =>
                          seats.map((item) =>
                            item.id === seat.id
                              ? {
                                  ...item,
                                  status: "revoked",
                                  temporaryCredentialState: "revoked",
                                  inviteLink: "Removed seat",
                                }
                              : item
                          )
                        )
                      }
                      onRevoke={() =>
                        onSeatsChange((seats) =>
                          seats.map((item) =>
                            item.id === seat.id
                              ? {
                                  ...item,
                                  status: "revoked",
                                  temporaryCredentialState: "revoked",
                                  inviteLink: "Revoked invite",
                                }
                              : item
                          )
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead className="border-b border-border bg-muted/35 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Seat/user ID</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {license.seats.map((seat) => (
                <tr key={seat.id} className="border-b border-border/70">
                  <td className="px-3 py-2 font-mono">{seat.id}</td>
                  <td className="px-3 py-2">
                    <SeatStatusBadge status={seat.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SeatActions({
  canInvite,
  onInvite,
  onOpenChange,
  onRemove,
  onRevoke,
  open,
  protectActiveAdmin,
  seat,
}: {
  canInvite: boolean
  onInvite: () => void
  onOpenChange: (open: boolean) => void
  onRemove: () => void
  onRevoke: () => void
  open: boolean
  protectActiveAdmin: boolean
  seat: PortalSeat
}) {
  const menuRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [menuPosition, setMenuPosition] = React.useState({ right: 0, top: 0 })
  const actions = React.useMemo(
    () =>
      getSeatActions({
        canInvite,
        onInvite,
        onRemove,
        onRevoke,
        protectActiveAdmin,
        status: seat.status,
      }),
    [canInvite, onInvite, onRemove, onRevoke, protectActiveAdmin, seat.status]
  )

  React.useLayoutEffect(() => {
    if (!open) return

    const buttonRect = buttonRef.current?.getBoundingClientRect()
    if (!buttonRect) return

    setMenuPosition({
      right: Math.max(12, window.innerWidth - buttonRect.right),
      top: Math.min(
        window.innerHeight - 12,
        buttonRect.bottom + 6
      ),
    })
  }, [open])

  React.useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        onOpenChange(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onOpenChange, open])

  function run(action: () => void) {
    action()
    onOpenChange(false)
  }

  if (actions.length === 0) return null

  return (
    <div ref={menuRef} className="relative inline-flex">
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Seat options for ${seat.id}`}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <MoreHorizontal className="size-4" />
      </Button>
      {open && actions.length > 0 ? (
        <div
          className="fixed z-[9999] w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-xl"
          style={{ right: menuPosition.right, top: menuPosition.top }}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex h-8 w-full items-center gap-2 rounded-sm px-2 text-left text-xs hover:bg-muted focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-45"
              onClick={() => run(action.run)}
            >
              <action.icon className="size-3.5" />
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

type SeatAction = {
  icon: LucideIcon
  label: string
  run: () => void
}

function getSeatActions({
  canInvite,
  onInvite,
  onRemove,
  onRevoke,
  protectActiveAdmin,
  status,
}: {
  canInvite: boolean
  onInvite: () => void
  onRemove: () => void
  onRevoke: () => void
  protectActiveAdmin: boolean
  status: SeatStatus
}): SeatAction[] {
  if (status === "active") {
    return protectActiveAdmin
      ? []
      : [{ icon: UserMinus, label: "Remove seat", run: onRemove }]
  }

  if (status === "invited") {
    return [{ icon: UserMinus, label: "Revoke invite", run: onRevoke }]
  }

  return canInvite ? [{ icon: MailPlus, label: "Invite again", run: onInvite }] : []
}

function Metric({
  detail,
  label,
  value,
}: {
  detail: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 truncate text-lg font-semibold">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{detail}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: LicenseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-1 text-xs font-medium capitalize",
        status === "active"
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  )
}

function SeatStatusBadge({ status }: { status: SeatStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-1 text-xs font-medium capitalize",
        status === "active" &&
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        status === "invited" &&
          "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        status === "revoked" && "border-border bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  )
}

function organizationTypeLabel(value: string) {
  return (
    portalOrganizationTypes.find((type) => type.value === value)?.label ?? value
  )
}
