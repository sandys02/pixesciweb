"use client"

import * as React from "react"

import {
  completePortalSetup,
  generatePortalLicenseBundle as requestPortalBundleGeneration,
  getLatestPortalLicenseBundle,
  getPortalLicenseSeats,
  getPortalLicenses,
  generatePortalSeatActivation as requestPortalSeatActivation,
  invitePortalSeat as requestPortalSeatInvite,
  removePortalSeat as requestPortalSeatRemove,
  resendPortalSeatInvite as requestPortalSeatResend,
  revokePortalSeatInvite as requestPortalSeatRevoke,
} from "@/lib/portal-access"

import type {
  PortalAccount,
  PortalAccountSetupForm,
  PortalLicenseBundle,
  PortalOrganization,
} from "../types/portal"
import type { InviteForm, PortalShellProps, PortalView } from "../types/shell"
import { AccountSetup } from "./account-setup-panel"
import { LicenseDashboard } from "./license-dashboard"
import { PortalFrame, PortalTabs } from "./portal-frame"
import { SettingsPage } from "./settings-page"

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
  const [licenseBundles, setLicenseBundles] = React.useState<
    Record<string, PortalLicenseBundle | null>
  >({})
  const [loadingBundleLicenseId, setLoadingBundleLicenseId] = React.useState("")

  const loadLatestBundle = React.useCallback(async (licenseId: string) => {
    setLoadingBundleLicenseId(licenseId)

    try {
      const result = await getLatestPortalLicenseBundle(licenseId)
      setLicenseBundles((current) => ({
        ...current,
        [licenseId]: result.bundle,
      }))
    } catch (error) {
      setLicensesError(
        error instanceof Error
          ? error.message
          : "License bundle is temporarily unavailable."
      )
    } finally {
      setLoadingBundleLicenseId("")
    }
  }, [])

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
        if (result.licenses[0].status === "active") {
          await loadLatestBundle(result.licenses[0].id)
        }
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
  }, [loadLatestBundle, loadLicenseSeats])

  React.useEffect(() => {
    if (!setupComplete) return

    const timeoutId = window.setTimeout(() => {
      void loadLicenses()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadLicenses, setupComplete])

  async function completeSetup(form: PortalAccountSetupForm) {
    await completePortalSetup(form)
    const nextAccount: PortalAccount = {
      ...account,
      organization: account.organization,
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
      const license = account.licenses.find((item) => item.id === nextLicenseId)
      if (license?.status === "active") {
        await loadLatestBundle(nextLicenseId)
      }
    }
  }

  async function generateBundle(licenseId: string) {
    setLoadingBundleLicenseId(licenseId)
    setLicensesError("")

    try {
      const result = await requestPortalBundleGeneration(licenseId)
      setLicenseBundles((current) => ({
        ...current,
        [licenseId]: result.bundle,
      }))
      return result.bundle
    } finally {
      setLoadingBundleLicenseId("")
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

  async function exportSeatActivation(seatId: string) {
    const result = await requestPortalSeatActivation(seatId)
    return result.activation
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
              loadingBundleLicenseId={loadingBundleLicenseId}
              loadingSeatLicenseId={loadingSeatLicenseId}
              error={licensesError}
              licenseBundles={licenseBundles}
              onExpandedLicenseChange={expandLicense}
              onGenerateBundle={generateBundle}
              onInviteSeat={inviteSeat}
              onLoadLatestBundle={loadLatestBundle}
              onRefreshLicenses={loadLicenses}
              onExportSeatActivation={exportSeatActivation}
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
