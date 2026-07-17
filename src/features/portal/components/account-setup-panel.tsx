"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"

import { FloatingLabelInput, FloatingLabelSelect } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { portalOrganizationTypes, portalUsStates } from "@/data/portal"

import type {
  OrganizationType,
  PortalAccountSetupForm,
  PortalOrganization,
} from "../types/portal"
import { normalizeDomain, validateSetupForm } from "../utils/portal-helpers"
import { organizationTypeLabel } from "./metrics-and-status"

export function AccountSetup({
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
          Set Portal Password
        </h2>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          PixeSci has already completed the organization setup. Review the
          organization details, then set a new portal password before opening
          the dashboard.
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
        <OrganizationReview organization={initialOrganization} />

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

function OrganizationReview({
  organization,
}: {
  organization: PortalOrganization
}) {
  const rows = [
    ["Country", organization.country],
    ["State", organization.state],
    ["Edition", organizationTypeLabel(organization.organizationType)],
    ["Organization email", organization.email],
    ["Organization name", organization.name],
    ["Organization domain", organization.domain || "No domain"],
    ["Research field", organization.researchField],
  ] as const

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <p className="text-sm font-medium">Organization details</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className={label === "Research field" ? "sm:col-span-2" : ""}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function OrganizationFields({
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
        placeholder="example.org (optional)"
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
