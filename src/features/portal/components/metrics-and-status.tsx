import type { LicenseStatus, PortalLicense, SeatStatus } from "../types/portal"
import { portalOrganizationTypes } from "@/data/portal"
import { cn } from "@/lib/utils"

export function Metric({
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

export function formatPortalTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value))
}

export function StatusBadge({ status }: { status: LicenseStatus }) {
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

export function SeatStatusBadge({ status }: { status: SeatStatus }) {
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

export function organizationTypeLabel(value: string) {
  return (
    portalOrganizationTypes.find((type) => type.value === value)?.label ?? value
  )
}

export function hasUnlimitedSeats(license: PortalLicense) {
  return license.edition === "pixesci"
}

export function formatSeatCapacity(count: number, license: PortalLicense) {
  return hasUnlimitedSeats(license)
    ? `${count} of Unlimited`
    : `${count} of ${license.seatLimit}`
}
