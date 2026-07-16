"use client"

import { Archive, KeyRound, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

import { requestAdminApi } from "../api/admin-client"
import type { EnvironmentState, OrganizationDetail } from "../types/admin"

export function OrganizationDetailPanel({
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
