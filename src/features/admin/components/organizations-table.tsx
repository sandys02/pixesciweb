"use client"

import * as React from "react"
import {
  Archive,
  CalendarClock,
  CircleMinus,
  CirclePlus,
  Copy,
  Edit3,
  KeyRound,
  MoreHorizontal,
  Plus,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react"

import { FloatingLabelInput, FloatingLabelSelect } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { portalOrganizationTypes, portalUsStates } from "@/data/portal"

import { requestAdminApi } from "../api/admin-client"
import { emptyCreateForm } from "../constants/forms"
import type {
  CreateOrganizationForm,
  EnvironmentState,
  OrganizationDetail,
  OrganizationListItem,
} from "../types/admin"
import { addOneYear } from "../utils/date"

type DetailCache = Record<number, OrganizationDetail | null>

type DialogState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; organizationId: number }
  | { type: "renew"; organizationId: number; licenseId: string }
  | { type: "seats"; organizationId: number; licenseId: string }

export function OrganizationsTable({
  organizations,
  environment,
  onError,
  onOneTimeLink,
  onRefresh,
}: {
  organizations: OrganizationListItem[]
  environment: EnvironmentState
  onError: (message: string) => void
  onOneTimeLink: (link: string) => void
  onRefresh: () => Promise<void>
}) {
  const [dialog, setDialog] = React.useState<DialogState>({ type: "none" })
  const [details, setDetails] = React.useState<DetailCache>({})
  const [loadingDetailId, setLoadingDetailId] = React.useState<number | null>(null)

  async function getDetail(organizationId: number) {
    const cached = details[organizationId]
    if (cached) return cached

    setLoadingDetailId(organizationId)
    try {
      const result = await requestAdminApi<{ detail: OrganizationDetail }>(
        `/api/admin/organizations/${organizationId}`
      )
      setDetails((current) => ({
        ...current,
        [organizationId]: result.detail,
      }))
      return result.detail
    } finally {
      setLoadingDetailId(null)
    }
  }

  function latestLicense(detail: OrganizationDetail) {
    return detail.licenses[0] ?? null
  }

  async function openEdit(organizationId: number) {
    try {
      await getDetail(organizationId)
      setDialog({ type: "edit", organizationId })
    } catch (error) {
      onError(error instanceof Error ? error.message : "Organization unavailable.")
    }
  }

  async function openRenew(organization: OrganizationListItem) {
    try {
      const detail = await getDetail(organization.id)
      const license =
        detail.licenses.find(
          (candidate) => candidate.licenseId === organization.activeLicenseId
        ) ?? latestLicense(detail)
      if (!license) {
        onError("No license is available to renew.")
        return
      }
      setDialog({
        type: "renew",
        organizationId: organization.id,
        licenseId: license.licenseId,
      })
    } catch (error) {
      onError(error instanceof Error ? error.message : "License unavailable.")
    }
  }

  async function openSeats(organization: OrganizationListItem) {
    try {
      const detail = await getDetail(organization.id)
      const license =
        detail.licenses.find(
          (candidate) => candidate.licenseId === organization.activeLicenseId
        ) ?? latestLicense(detail)
      if (!license) {
        onError("No license is available for seat management.")
        return
      }
      setDialog({
        type: "seats",
        organizationId: organization.id,
        licenseId: license.licenseId,
      })
    } catch (error) {
      onError(error instanceof Error ? error.message : "Seats unavailable.")
    }
  }

  async function resetPassword(organizationId: number) {
    try {
      const detail = await getDetail(organizationId)
      const account = detail.portalAccounts[0]
      if (!account) {
        onError("No portal account is available for password reset.")
        return
      }
      const result = await requestAdminApi<{ resetLink: string }>(
        `/api/admin/portal-accounts/${account.id}/password-reset`,
        { method: "POST" }
      )
      onOneTimeLink(result.resetLink)
      await onRefresh()
    } catch (error) {
      onError(error instanceof Error ? error.message : "Password reset failed.")
    }
  }

  async function copyInviteLink(organizationId: number) {
    try {
      const detail = await getDetail(organizationId)
      const account = detail.portalAccounts[0]
      if (!account) {
        onError("No portal account is available for invite link creation.")
        return
      }
      const result = await requestAdminApi<{
        setupLink: string
        detail: OrganizationDetail | null
      }>(`/api/admin/portal-accounts/${account.id}/setup-link`, {
        method: "POST",
      })
      const updatedDetail = result.detail
      if (updatedDetail) {
        setDetails((current) => ({
          ...current,
          [updatedDetail.organization.id]: updatedDetail,
        }))
      }
      onOneTimeLink(result.setupLink)
      await navigator.clipboard?.writeText(result.setupLink).catch(() => null)
      await onRefresh()
    } catch (error) {
      onError(error instanceof Error ? error.message : "Invite link creation failed.")
    }
  }

  async function lifecycle(
    organization: OrganizationListItem,
    action: "deactivate" | "archive"
  ) {
    const confirmation =
      environment.runtime === "production"
        ? window.prompt(`Enter ${organization.domain} to confirm ${action}.`) ?? ""
        : organization.domain
    try {
      await requestAdminApi(`/api/admin/organizations/${organization.id}/${action}`, {
        method: "POST",
        body: JSON.stringify({ confirmation }),
      })
      await onRefresh()
    } catch (error) {
      onError(error instanceof Error ? error.message : `${action} failed.`)
    }
  }

  async function afterMutation(detail?: OrganizationDetail | null, link?: string) {
    if (detail) {
      setDetails((current) => ({
        ...current,
        [detail.organization.id]: detail,
      }))
    }
    if (link) onOneTimeLink(link)
    setDialog({ type: "none" })
    await onRefresh()
  }

  const activeDetail =
    dialog.type !== "none" && dialog.type !== "create"
      ? details[dialog.organizationId]
      : null
  const activeLicense =
    activeDetail && "licenseId" in dialog
      ? activeDetail.licenses.find((license) => license.licenseId === dialog.licenseId)
      : null

  return (
    <section className="rounded-lg border border-border bg-background shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">Organizations</p>
          <h2 className="mt-1 text-xl font-semibold">Customer organizations</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage organization records, license terms, seats, and account access.
          </p>
        </div>
        <Button type="button" onClick={() => setDialog({ type: "create" })}>
          <Plus className="size-4" />
          Add organization
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Organization name</TableHead>
            <TableHead>Email address</TableHead>
            <TableHead>Edition</TableHead>
            <TableHead>License ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Research field</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <OrganizationTableRow
              key={organization.id}
              organization={organization}
              detail={details[organization.id]}
              loadingDetail={loadingDetailId === organization.id}
              onArchive={() => void lifecycle(organization, "archive")}
              onCopyInviteLink={() => void copyInviteLink(organization.id)}
              onDeactivate={() => void lifecycle(organization, "deactivate")}
              onEdit={() => void openEdit(organization.id)}
              onPrepareActions={() => {
                if (details[organization.id]) return
                void getDetail(organization.id).catch((error) =>
                  onError(
                    error instanceof Error
                      ? error.message
                      : "Organization actions unavailable."
                  )
                )
              }}
              onRenew={() => void openRenew(organization)}
              onResetPassword={() => void resetPassword(organization.id)}
              onSeats={() => void openSeats(organization)}
            />
          ))}
          {organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No organizations are available.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <CreateOrganizationDialog
        open={dialog.type === "create"}
        onOpenChange={(open) => setDialog(open ? { type: "create" } : { type: "none" })}
        onCreated={(link) => afterMutation(null, link)}
        onError={onError}
      />
      {dialog.type === "edit" && activeDetail ? (
        <EditOrganizationDialog
          detail={activeDetail}
          open
          onOpenChange={(open) => {
            if (!open) setDialog({ type: "none" })
          }}
          onUpdated={(detail) => afterMutation(detail)}
          onError={onError}
        />
      ) : null}
      {dialog.type === "renew" && activeLicense ? (
        <RenewLicenseDialog
          license={activeLicense}
          open
          onOpenChange={(open) => {
            if (!open) setDialog({ type: "none" })
          }}
          onRenewed={(detail) => afterMutation(detail)}
          onError={onError}
        />
      ) : null}
      {dialog.type === "seats" && activeDetail && activeLicense ? (
        <SeatManagementDialog
          detail={activeDetail}
          license={activeLicense}
          open
          onOpenChange={(open) => {
            if (!open) setDialog({ type: "none" })
          }}
          onUpdated={(detail) => afterMutation(detail)}
          onError={onError}
        />
      ) : null}
    </section>
  )
}

function OrganizationTableRow({
  detail,
  loadingDetail,
  organization,
  onArchive,
  onCopyInviteLink,
  onDeactivate,
  onEdit,
  onPrepareActions,
  onRenew,
  onResetPassword,
  onSeats,
}: {
  detail: OrganizationDetail | null | undefined
  loadingDetail: boolean
  organization: OrganizationListItem
  onArchive: () => void
  onCopyInviteLink: () => void
  onDeactivate: () => void
  onEdit: () => void
  onPrepareActions: () => void
  onRenew: () => void
  onResetPassword: () => void
  onSeats: () => void
}) {
  const portalAccount = detail?.portalAccounts[0]
  const actionMode =
    !detail || loadingDetail
      ? "loading"
      : portalAccount?.setupCompletedAt === null
        ? "copy-invite"
        : "reset-password"

  return (
    <TableRow>
      <TableCell className="w-16 font-mono text-xs">{organization.id}</TableCell>
      <TableCell className="min-w-52 font-medium">
        {organization.name}
        <span className="mt-1 block text-xs font-normal text-muted-foreground">
          {organization.domain}
        </span>
      </TableCell>
      <TableCell>{organization.email}</TableCell>
      <TableCell className="capitalize">{organization.edition}</TableCell>
      <TableCell className="font-mono text-xs">
        {organization.activeLicenseId ?? "No license"}
      </TableCell>
      <TableCell>
        <LicenseStatus
          organization={organization}
          onRenew={onRenew}
          loading={loadingDetail}
        />
      </TableCell>
      <TableCell>
        <SeatSummary
          organization={organization}
          onOpen={onSeats}
          loading={loadingDetail}
        />
      </TableCell>
      <TableCell className="max-w-56 whitespace-normal">
        {organization.researchField}
      </TableCell>
      <TableCell className="text-right">
        <OrganizationActions
          actionMode={actionMode}
          onArchive={onArchive}
          onCopyInviteLink={onCopyInviteLink}
          onDeactivate={onDeactivate}
          onEdit={onEdit}
          onOpenChange={(open) => {
            if (open) onPrepareActions()
          }}
          onResetPassword={onResetPassword}
        />
      </TableCell>
    </TableRow>
  )
}

function LicenseStatus({
  organization,
  onRenew,
  loading,
}: {
  organization: OrganizationListItem
  onRenew: () => void
  loading: boolean
}) {
  const pendingSetup =
    organization.activeLicenseStatus === "active" && !organization.portalSetupCompletedAt
  const expired = isExpired(organization.activeLicenseEndsAt)

  if (pendingSetup) {
    return <LicenseStatusBadge status="pending" />
  }

  if (expired) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
          Expired -
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Renew license for ${organization.name}`}
          title="Renew"
          onClick={onRenew}
          disabled={loading}
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>
    )
  }

  return <LicenseStatusBadge status={organization.activeLicenseStatus ?? "inactive"} />
}

function LicenseStatusBadge({
  status,
}: {
  status: "active" | "inactive" | "pending"
}) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-1 text-xs font-medium capitalize",
        status === "active" &&
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        status === "inactive" && "border-border bg-muted text-muted-foreground",
        status === "pending" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      )}
    >
      {status}
    </span>
  )
}

function SeatSummary({
  organization,
  onOpen,
  loading,
}: {
  organization: OrganizationListItem
  onOpen: () => void
  loading: boolean
}) {
  const allocated = organization.allocatedSeats ?? 0
  const limit = organization.seatLimit ?? 0

  return (
    <div className="flex items-center gap-2">
      <div>
        <p className="text-base leading-none font-semibold">
          {allocated}
          <span className="text-xs font-normal text-muted-foreground"> / {limit}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">allocated</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Manage seats for ${organization.name}`}
        title="Manage seats"
        onClick={onOpen}
        disabled={loading || !organization.activeLicenseId}
      >
        <Edit3 className="size-4" />
      </Button>
    </div>
  )
}

function OrganizationActions({
  actionMode,
  onArchive,
  onCopyInviteLink,
  onDeactivate,
  onEdit,
  onOpenChange,
  onResetPassword,
}: {
  actionMode: "copy-invite" | "loading" | "reset-password"
  onArchive: () => void
  onCopyInviteLink: () => void
  onDeactivate: () => void
  onEdit: () => void
  onOpenChange: (open: boolean) => void
  onResetPassword: () => void
}) {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Open organization actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit}>
          <Edit3 className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDeactivate} variant="destructive">
          <ShieldAlert className="size-4" />
          Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onArchive}>
          <Archive className="size-4" />
          Archive
        </DropdownMenuItem>
        {actionMode === "loading" ? (
          <DropdownMenuItem disabled>
            <RefreshCw className="size-4" />
            Loading actions...
          </DropdownMenuItem>
        ) : actionMode === "copy-invite" ? (
          <DropdownMenuItem onSelect={onCopyInviteLink}>
            <Copy className="size-4" />
            Copy Invite Link
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={onResetPassword}>
            <KeyRound className="size-4" />
            Reset password
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CreateOrganizationDialog({
  open,
  onOpenChange,
  onCreated,
  onError,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (oneTimeLink?: string) => Promise<void>
  onError: (message: string) => void
}) {
  const [form, setForm] = React.useState<CreateOrganizationForm>(emptyCreateForm)
  const [pending, setPending] = React.useState(false)

  function update<K extends keyof CreateOrganizationForm>(
    key: K,
    value: CreateOrganizationForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onError("")
    const endsAt = addOneYear(form.startsAt)
    if (!endsAt) {
      onError("Select a valid start date.")
      return
    }

    setPending(true)
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
      await onCreated(result.setupLink)
    } catch (error) {
      onError(error instanceof Error ? error.message : "Organization creation failed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add organization</DialogTitle>
          <DialogDescription>
            Create the organization profile and first annual license.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FloatingLabelSelect
              id="admin-org-country"
              label="Country"
              value={form.country}
              options={[{ label: "United States", value: "United States" }]}
              disabled
              onValueChange={(value) =>
                update("country", value as CreateOrganizationForm["country"])
              }
            />
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
              id="admin-license-start"
              type="date"
              label="License start date"
              value={form.startsAt}
              onChangeAction={(value) => update("startsAt", value)}
              helperText={`End date: ${addOneYear(form.startsAt) || "select a date"}`}
            />
            <FloatingLabelInput
              id="admin-license-seats"
              type="number"
              label="Seats"
              value={String(form.seatLimit)}
              onChangeAction={(value) =>
                update("seatLimit", Math.max(1, Number.parseInt(value, 10) || 1))
              }
            />
            <FloatingLabelInput
              id="admin-license-label"
              label="License label"
              value={form.label}
              onChangeAction={(value) => update("label", value)}
            />
          </div>
          <div className="flex flex-col gap-3 rounded-md border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.generateLicenseId}
                onChange={(event) => update("generateLicenseId", event.target.checked)}
              />
              Generate license ID
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.createSetupLink}
                onChange={(event) => update("createSetupLink", event.target.checked)}
              />
              Create setup link
            </label>
          </div>
          {!form.generateLicenseId ? (
            <FloatingLabelInput
              id="admin-license-id"
              label="License ID"
              value={form.licenseId}
              onChangeAction={(value) => update("licenseId", value)}
            />
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              <Plus className="size-4" />
              {pending ? "Creating..." : "Create organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditOrganizationDialog({
  detail,
  open,
  onOpenChange,
  onUpdated,
  onError,
}: {
  detail: OrganizationDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (detail: OrganizationDetail | null) => Promise<void>
  onError: (message: string) => void
}) {
  const [form, setForm] = React.useState(detail.profile)
  const [pending, setPending] = React.useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    onError("")
    try {
      const result = await requestAdminApi<{ detail: OrganizationDetail }>(
        `/api/admin/organizations/${detail.organization.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(form),
        }
      )
      await onUpdated(result.detail)
    } catch (error) {
      onError(error instanceof Error ? error.message : "Organization update failed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit organization</DialogTitle>
          <DialogDescription>
            Update organization-level details only.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FloatingLabelSelect
              id="edit-admin-org-state"
              label="State"
              value={form.state}
              options={portalUsStates.map((state) => ({ label: state, value: state }))}
              placeholder="Select state"
              onValueChange={(value) => setForm((current) => ({ ...current, state: value }))}
            />
            <FloatingLabelSelect
              id="edit-admin-org-edition"
              label="Edition"
              value={form.organizationType}
              options={portalOrganizationTypes}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  organizationType: value as typeof form.organizationType,
                }))
              }
            />
            <FloatingLabelInput
              id="edit-admin-org-name"
              label="Organization name"
              value={form.name}
              onChangeAction={(value) =>
                setForm((current) => ({ ...current, name: value }))
              }
            />
            <FloatingLabelInput
              id="edit-admin-org-email"
              type="email"
              label="Organization email"
              value={form.email}
              onChangeAction={(value) =>
                setForm((current) => ({ ...current, email: value }))
              }
            />
            <FloatingLabelInput
              id="edit-admin-org-domain"
              label="Organization domain"
              value={form.domain}
              onChangeAction={(value) =>
                setForm((current) => ({ ...current, domain: value }))
              }
            />
            <FloatingLabelInput
              id="edit-admin-org-research"
              label="Research field"
              value={form.researchField}
              onChangeAction={(value) =>
                setForm((current) => ({ ...current, researchField: value }))
              }
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RenewLicenseDialog({
  license,
  open,
  onOpenChange,
  onRenewed,
  onError,
}: {
  license: OrganizationDetail["licenses"][number]
  open: boolean
  onOpenChange: (open: boolean) => void
  onRenewed: (detail: OrganizationDetail | null) => Promise<void>
  onError: (message: string) => void
}) {
  const [startsAt, setStartsAt] = React.useState(new Date().toISOString().slice(0, 10))
  const [seatLimit, setSeatLimit] = React.useState(license.seatLimit)
  const [pending, setPending] = React.useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const endsAt = addOneYear(startsAt)
    if (!endsAt) {
      onError("Select a valid start date.")
      return
    }

    setPending(true)
    onError("")
    try {
      const result = await requestAdminApi<{ detail: OrganizationDetail }>(
        `/api/admin/licenses/${license.licenseId}/renew`,
        {
          method: "POST",
          body: JSON.stringify({
            label: license.label,
            startsAt,
            endsAt,
            seatLimit,
            status: "active",
          }),
        }
      )
      await onRenewed(result.detail)
    } catch (error) {
      onError(error instanceof Error ? error.message : "License renewal failed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew license</DialogTitle>
          <DialogDescription>
            Create a new active annual license from {license.licenseId}.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <FloatingLabelInput
            id="renew-license-start"
            type="date"
            label="Start date"
            value={startsAt}
            onChangeAction={setStartsAt}
            helperText={`End date: ${addOneYear(startsAt) || "select a date"}`}
          />
          <FloatingLabelInput
            id="renew-license-seats"
            type="number"
            label="Seats"
            value={String(seatLimit)}
            onChangeAction={(value) =>
              setSeatLimit(Math.max(1, Number.parseInt(value, 10) || 1))
            }
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              <CalendarClock className="size-4" />
              {pending ? "Renewing..." : "Renew license"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SeatManagementDialog({
  detail,
  license,
  open,
  onOpenChange,
  onUpdated,
  onError,
}: {
  detail: OrganizationDetail
  license: OrganizationDetail["licenses"][number]
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (detail: OrganizationDetail | null) => Promise<void>
  onError: (message: string) => void
}) {
  const registeredSeats = detail.seats.filter(
    (seat) => seat.licenseId === license.licenseId
  )
  const allocated = registeredSeats.filter(
    (seat) => seat.status === "active" || seat.status === "invited"
  ).length
  const [seatLimit, setSeatLimit] = React.useState(license.seatLimit)
  const [pending, setPending] = React.useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (seatLimit < allocated) {
      onError("Seat limit cannot be lower than active and invited seats.")
      return
    }

    setPending(true)
    onError("")
    try {
      const result = await requestAdminApi<{ detail: OrganizationDetail }>(
        `/api/admin/licenses/${license.licenseId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            label: license.label,
            startsAt: license.startsAt,
            endsAt: license.endsAt,
            seatLimit,
            status: license.status,
          }),
        }
      )
      await onUpdated(result.detail)
    } catch (error) {
      onError(error instanceof Error ? error.message : "Seat update failed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage seats</DialogTitle>
          <DialogDescription>
            Adjust seat capacity and review registered seat IDs.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={submit}>
          <div className="rounded-lg border border-border bg-muted/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label="Decrease seats"
                onClick={() => setSeatLimit((current) => Math.max(allocated, current - 1))}
              >
                <CircleMinus className="size-5" />
              </Button>
              <div className="text-center">
                <p className="text-5xl leading-none font-semibold tabular-nums">
                  {seatLimit}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  seats / {allocated} allocated
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label="Increase seats"
                onClick={() => setSeatLimit((current) => current + 1)}
              >
                <CirclePlus className="size-5" />
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Registered seat IDs</h3>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3.5" />
                {registeredSeats.length} registered
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              {registeredSeats.map((seat) => (
                <div
                  key={seat.id}
                  className="flex items-center justify-between gap-3 border-b border-border/70 p-3 last:border-b-0"
                >
                  <span className="font-mono text-xs">{seat.seatId}</span>
                  <span className="rounded-md border border-border bg-background px-2 py-1 text-xs capitalize">
                    {seat.status}
                  </span>
                </div>
              ))}
              {registeredSeats.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  No registered seats are recorded for this license.
                </p>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending || seatLimit < allocated}>
              {pending ? "Saving..." : "Save seats"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function isExpired(dateString?: string) {
  if (!dateString) return false
  return dateString < new Date().toISOString().slice(0, 10)
}
