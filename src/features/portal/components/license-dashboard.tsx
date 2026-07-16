"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { PortalAccount, PortalLicenseBundle, PortalSeatActivation } from "../types/portal"
import type { InviteForm } from "../types/shell"
import { countActiveSeats, countAllocatedSeats, formatPortalDate } from "../utils/portal-helpers"
import { LicenseBundlePanel } from "./license-bundle-panel"
import { Metric, StatusBadge, formatSeatCapacity, organizationTypeLabel } from "./metrics-and-status"
import { SeatsPanel } from "./seats-panel"

export function LicenseDashboard({
  account,
  error,
  expandedLicenseId,
  licenseBundles,
  loading,
  loadingBundleLicenseId,
  loadingSeatLicenseId,
  onExpandedLicenseChange,
  onGenerateBundle,
  onInviteSeat,
  onLoadLatestBundle,
  onRefreshLicenses,
  onExportSeatActivation,
  onRemoveSeat,
  onResendSeat,
  onRevokeSeat,
}: {
  account: PortalAccount
  error: string
  expandedLicenseId: string
  licenseBundles: Record<string, PortalLicenseBundle | null>
  loading: boolean
  loadingBundleLicenseId: string
  loadingSeatLicenseId: string
  onExpandedLicenseChange: (licenseId: string) => Promise<void>
  onGenerateBundle: (licenseId: string) => Promise<PortalLicenseBundle>
  onInviteSeat: (licenseId: string, input: InviteForm) => Promise<string | undefined>
  onLoadLatestBundle: (licenseId: string) => Promise<void>
  onRefreshLicenses: () => Promise<void>
  onExportSeatActivation: (seatId: string) => Promise<PortalSeatActivation>
  onRemoveSeat: (licenseId: string, seatId: string) => Promise<void>
  onResendSeat: (licenseId: string, seatId: string) => Promise<string | undefined>
  onRevokeSeat: (licenseId: string, seatId: string) => Promise<void>
}) {
  const activeLicense = account.licenses.find(
    (license) => license.status === "active"
  )
  const activeSeatCount = activeLicense ? countActiveSeats(activeLicense) : 0
  const activeSeatValue = activeLicense
    ? formatSeatCapacity(activeSeatCount, activeLicense)
    : "0 of 0"

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
          value={activeSeatValue}
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
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Licenses</p>
              <h2 className="mt-2 text-xl font-semibold">License dashboard</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Current and past license IDs are scoped to this organization.
                Expand a license to create the first human admin, invite
                members, revoke invites, or remove seats. The organization
                portal account is not an app user.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => {
                void onRefreshLicenses()
              }}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {error ? (
            <p role="alert" className="border-b border-border px-5 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

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
                {account.licenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      {loading
                        ? "Loading organization licenses..."
                        : "No licenses are available for this organization."}
                    </td>
                  </tr>
                ) : null}
                {account.licenses.map((license) => (
                  <React.Fragment key={license.id}>
                    <tr className="border-b border-border/70">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 font-mono text-xs font-medium"
                          aria-expanded={expandedLicenseId === license.id}
                          onClick={() => {
                            void onExpandedLicenseChange(license.id)
                          }}
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
                        {formatSeatCapacity(countAllocatedSeats(license), license)}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            void onExpandedLicenseChange(license.id)
                          }}
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
                            loading={loadingSeatLicenseId === license.id}
                            onExportSeatActivation={onExportSeatActivation}
                            onInviteSeat={onInviteSeat}
                            onRemoveSeat={onRemoveSeat}
                            onResendSeat={onResendSeat}
                            onRevokeSeat={onRevokeSeat}
                          />
                          {license.status === "active" ? (
                            <LicenseBundlePanel
                              bundle={licenseBundles[license.id] ?? null}
                              license={license}
                              loading={loadingBundleLicenseId === license.id}
                              onGenerate={onGenerateBundle}
                              onRefreshLatest={onLoadLatestBundle}
                            />
                          ) : null}
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
