"use client"

import * as React from "react"
import { KeyRound, Save, ShieldCheck } from "lucide-react"

import { FloatingLabelInput } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { changePortalPassword as requestPortalPasswordChange, updatePortalOrganization } from "@/lib/portal-access"

import { emptyPasswordForm } from "../constants/forms"
import type { PortalAccount, PortalAccountSetupForm, PortalOrganization } from "../types/portal"
import type { PasswordForm } from "../types/shell"
import { normalizeDomain, validatePasswordChange, validateSetupForm } from "../utils/portal-helpers"
import { OrganizationFields } from "./account-setup-panel"

export function SettingsPage({
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
