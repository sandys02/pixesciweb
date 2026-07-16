"use client"

import * as React from "react"
import { Building2, HelpCircle, Plus } from "lucide-react"

import { FloatingLabelInput, FloatingLabelSelect } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { portalOrganizationTypes, portalUsStates } from "@/data/portal"

import { requestAdminApi } from "../api/admin-client"
import { emptyCreateForm } from "../constants/forms"
import type { CreateOrganizationForm } from "../types/admin"
import { addOneYear } from "../utils/date"

export function CreateOrganizationPanel({
  onCreated,
  onError,
}: {
  onCreated: (oneTimeLink?: string) => Promise<void>
  onError: (message: string) => void
}) {
  const [form, setForm] = React.useState<CreateOrganizationForm>(emptyCreateForm)
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<keyof CreateOrganizationForm, string>>
  >({})
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  function update<K extends keyof CreateOrganizationForm>(
    key: K,
    value: CreateOrganizationForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function validateForm() {
    const errors: Partial<Record<keyof CreateOrganizationForm, string>> = {}
    const domain = form.domain.trim().toLowerCase()

    if (!form.state.trim()) errors.state = "Select a state."
    if (!form.name.trim()) errors.name = "Enter the organization name."
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errors.email = "Enter a valid organization email."
    }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
      errors.domain = "Enter a valid organization domain."
    }
    if (!form.researchField.trim()) {
      errors.researchField = "Enter the research field."
    }
    if (!form.label.trim()) errors.label = "Enter a license label."
    if (!addOneYear(form.startsAt)) errors.startsAt = "Select a valid start date."
    if (!Number.isInteger(form.seatLimit) || form.seatLimit <= 0) {
      errors.seatLimit = "Enter a positive seat limit."
    }

    return errors
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onError("")
    const errors = validateForm()
    setFieldErrors(errors)

    const firstError = Object.values(errors)[0]
    if (firstError) {
      onError(firstError)
      return
    }

    setPending(true)
    const endsAt = addOneYear(form.startsAt)
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
              email: form.email,
              createSetupLink: form.createSetupLink,
            },
            license: {
              licenseId: form.licenseId,
              generateLicenseId: form.generateLicenseId,
              label: form.label,
              startsAt: form.startsAt,
              endsAt,
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
            id="admin-org-country"
            label="Country"
            value={form.country}
            options={[{ label: "United States", value: "United States" }]}
            disabled
            onValueChange={(value) =>
              update("country", value as CreateOrganizationForm["country"])
            }
            helperText="Only United States is available now."
          />
          <FloatingLabelSelect
            id="admin-org-state"
            label="State"
            value={form.state}
            options={portalUsStates.map((state) => ({ label: state, value: state }))}
            placeholder="Select state"
            onValueChange={(value) => update("state", value)}
            error={Boolean(fieldErrors.state)}
            helperText={fieldErrors.state}
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
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name}
          />
          <FloatingLabelInput
            id="admin-org-email"
            type="email"
            label="Organization email"
            value={form.email}
            onChangeAction={(value) => update("email", value)}
            error={Boolean(fieldErrors.email)}
            helperText={
              fieldErrors.email ||
              "Used for the organization profile and the first portal admin account."
            }
          />
          <FloatingLabelInput
            id="admin-org-domain"
            label="Organization domain"
            value={form.domain}
            onChangeAction={(value) => update("domain", value)}
            error={Boolean(fieldErrors.domain)}
            helperText={fieldErrors.domain}
          />
          <FloatingLabelInput
            id="admin-org-research"
            label="Research field"
            value={form.researchField}
            onChangeAction={(value) => update("researchField", value)}
            error={Boolean(fieldErrors.researchField)}
            helperText={fieldErrors.researchField}
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
          <FieldWithHelp
            label="License label"
            help="A staff-facing name for the license, such as Annual organization license. It is not the license ID."
          >
            <FloatingLabelInput
              id="admin-license-label"
              label="License label"
              value={form.label}
              onChangeAction={(value) => update("label", value)}
              error={Boolean(fieldErrors.label)}
              helperText={fieldErrors.label}
            />
          </FieldWithHelp>
          <FloatingLabelInput
            id="admin-license-start"
            type="date"
            label="Start date"
            value={form.startsAt}
            onChangeAction={(value) => update("startsAt", value)}
            error={Boolean(fieldErrors.startsAt)}
            helperText={
              fieldErrors.startsAt ||
              `End date: ${addOneYear(form.startsAt) || "select a valid start date"}`
            }
          />
          <FloatingLabelInput
            id="admin-license-seats"
            type="number"
            label="Seat limit"
            value={String(form.seatLimit)}
            onChangeAction={(value) =>
              update("seatLimit", Math.max(1, Number.parseInt(value, 10) || 1))
            }
            error={Boolean(fieldErrors.seatLimit)}
            helperText={fieldErrors.seatLimit}
          />
          <FieldWithHelp
            label="Create one-time setup link"
            help="Creates a single-use password setup link for the customer's first portal login. The dashboard shows it once."
          >
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.createSetupLink}
                onChange={(event) => update("createSetupLink", event.target.checked)}
              />
              Create one-time setup link
            </label>
          </FieldWithHelp>
          <Button type="submit" className="w-full" disabled={pending}>
            <Building2 className="size-4" />
            {pending ? "Creating..." : "Create organization"}
          </Button>
        </form>
      ) : null}
    </section>
  )
}

function FieldWithHelp({
  label,
  help,
  children,
}: {
  label: string
  help: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        <button
          type="button"
          className="inline-flex size-5 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${label}: ${help}`}
          title={help}
        >
          <HelpCircle className="size-3.5" />
        </button>
      </div>
      {children}
    </div>
  )
}
