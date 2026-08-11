"use client"

import * as React from "react"
import { FileSignature, MailPlus, MoreHorizontal, UserMinus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { FloatingLabelInput } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  ADMIN_TIER_ROLE_KEYS,
  ROLE_TEMPLATES,
  type RoleTemplate,
} from "@/backend/portal/role-templates"

import type {
  PortalLicense,
  PortalSeat,
  PortalSeatActivation,
  SeatStatus,
} from "../types/portal"
import type { InviteForm } from "../types/shell"
import { SeatActivationPanel } from "./seat-activation-panel"
import { SeatStatusBadge, hasUnlimitedSeats } from "./metrics-and-status"

const ADMIN_ROLE_TEMPLATES = ROLE_TEMPLATES.filter((role) =>
  ADMIN_TIER_ROLE_KEYS.has(role.key)
)
const OPERATIONAL_ROLE_TEMPLATES = ROLE_TEMPLATES.filter(
  (role) => !ADMIN_TIER_ROLE_KEYS.has(role.key)
)
const ROLE_NAME_BY_KEY: Record<string, string> = Object.fromEntries(
  ROLE_TEMPLATES.map((role) => [role.key, role.name])
)

function hasAdminTierRole(roles: string[] | undefined) {
  return (roles ?? []).some((role) => ADMIN_TIER_ROLE_KEYS.has(role))
}

function isAdminSeat(seat: PortalSeat) {
  return hasAdminTierRole(seat.roles)
}

function formatSeatRoles(seat: PortalSeat) {
  if (!seat.roles || seat.roles.length === 0) return "—"
  return seat.roles.map((role) => ROLE_NAME_BY_KEY[role] ?? role).join(", ")
}

export function SeatsPanel({
  license,
  loading,
  onExportSeatActivation,
  onInviteSeat,
  onRemoveSeat,
  onResendSeat,
  onRevokeSeat,
}: {
  license: PortalLicense
  loading: boolean
  onExportSeatActivation: (seatId: string) => Promise<PortalSeatActivation>
  onInviteSeat: (licenseId: string, input: InviteForm) => Promise<string | undefined>
  onRemoveSeat: (licenseId: string, seatId: string) => Promise<void>
  onResendSeat: (licenseId: string, seatId: string) => Promise<string | undefined>
  onRevokeSeat: (licenseId: string, seatId: string) => Promise<void>
}) {
  const [invite, setInvite] = React.useState<InviteForm>({
    email: "",
    roles: [],
  })
  const [openSeatMenuId, setOpenSeatMenuId] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [pendingAction, setPendingAction] = React.useState("")
  const [activation, setActivation] =
    React.useState<PortalSeatActivation | null>(null)
  const allocatedCount = license.seats.filter(
    (seat) => seat.status === "active" || seat.status === "invited"
  ).length
  const activeAdminCount = license.seats.filter(
    (seat) => seat.status === "active" && isAdminSeat(seat)
  ).length
  const seatLimitReached =
    !hasUnlimitedSeats(license) && allocatedCount >= license.seatLimit
  const isActiveLicense = license.status === "active"

  function toggleInviteRole(key: string, checked: boolean) {
    setInvite((current) => ({
      ...current,
      roles: checked
        ? [...current.roles, key]
        : current.roles.filter((role) => role !== key),
    }))
  }

  async function submitInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (seatLimitReached) return
    if (!/^\S+@\S+\.\S+$/.test(invite.email.trim())) return
    if (invite.roles.length === 0) return

    await runSeatAction("invite", async () => {
      const inviteLink = await onInviteSeat(license.id, invite)
      setInvite({ email: "", roles: [] })
      setMessage(
        inviteLink
          ? `Invite created. One-time link: ${inviteLink}`
          : "Invite created."
      )
    })
  }

  async function runSeatAction(label: string, action: () => Promise<void>) {
    setPendingAction(label)
    setMessage("")

    try {
      await action()
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Seat action is unavailable."
      )
    } finally {
      setPendingAction("")
    }
  }

  return (
    <div className="min-w-0 rounded-lg border border-border bg-background">
      <div className="grid gap-4 border-b border-border p-4">
        <div>
          <h3 className="text-base font-semibold">Seats</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Use seats for human PixeSci app users only. Create the first human
            admin here; the portal account itself is not an app user. Pending
            invites count against license capacity.
          </p>
        </div>
        {isActiveLicense ? (
          <form className="grid max-w-2xl gap-3" onSubmit={submitInvite}>
            <div className="grid gap-2 sm:grid-cols-[minmax(14rem,1fr)_auto]">
              <FloatingLabelInput
                id={`invite-email-${license.id}`}
                type="email"
                label="Invite email"
                value={invite.email}
                placeholder="user@example.org"
                disabled={seatLimitReached || pendingAction === "invite"}
                inputMode="email"
                onChangeAction={(value) =>
                  setInvite((current) => ({ ...current, email: value }))
                }
              />
              <Button
                type="submit"
                size="sm"
                className="h-10"
                disabled={
                  seatLimitReached ||
                  pendingAction === "invite" ||
                  invite.roles.length === 0
                }
              >
                <MailPlus className="size-4" />
                {pendingAction === "invite" ? "Inviting..." : "Invite"}
              </Button>
            </div>
            <fieldset className="rounded-md border border-border p-3">
              <legend className="px-1 text-xs font-medium text-muted-foreground">
                Roles (select at least one)
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <RoleCheckboxGroup
                  title="Administration"
                  roles={ADMIN_ROLE_TEMPLATES}
                  selected={invite.roles}
                  disabled={seatLimitReached || pendingAction === "invite"}
                  idPrefix={`invite-role-${license.id}`}
                  onToggle={toggleInviteRole}
                />
                <RoleCheckboxGroup
                  title="Operational"
                  roles={OPERATIONAL_ROLE_TEMPLATES}
                  selected={invite.roles}
                  disabled={seatLimitReached || pendingAction === "invite"}
                  idPrefix={`invite-role-${license.id}`}
                  onToggle={toggleInviteRole}
                />
              </div>
            </fieldset>
          </form>
        ) : null}
      </div>

      {message ? (
        <p
          role={message.includes("unavailable") || message.includes("cannot") ? "alert" : "status"}
          className={cn(
            "border-b border-border px-4 py-3 text-sm",
            message.includes("unavailable") || message.includes("cannot")
              ? "text-destructive"
              : "text-primary"
          )}
        >
          {message}
        </p>
      ) : null}

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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    Loading seats...
                  </td>
                </tr>
              ) : null}
              {!loading && license.seats.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    No human app seats have been created for this license.
                  </td>
                </tr>
              ) : null}
              {license.seats.map((seat) => (
                <tr key={seat.id} className="border-b border-border/70">
                  <td className="px-3 py-2 font-mono">{seat.id}</td>
                  <td className="px-3 py-2">{seat.email}</td>
                  <td className="px-3 py-2">{formatSeatRoles(seat)}</td>
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
                        isAdminSeat(seat) &&
                        activeAdminCount <= 1
                      }
                      onOpenChange={(open) =>
                        setOpenSeatMenuId(open ? seat.id : "")
                      }
                      onInvite={() => {
                        void runSeatAction(`resend-${seat.id}`, async () => {
                          const inviteLink = await onResendSeat(license.id, seat.id)
                          setActivation(null)
                          setMessage(
                            inviteLink
                              ? `Invite resent. One-time link: ${inviteLink}`
                              : "Invite resent."
                          )
                        })
                      }}
                      onExportActivation={() => {
                        void runSeatAction(`activation-${seat.id}`, async () => {
                          const exported = await onExportSeatActivation(seat.id)
                          setActivation(exported)
                          setMessage("Seat activation exported.")
                        })
                      }}
                      onRemove={() => {
                        void runSeatAction(`remove-${seat.id}`, async () => {
                          await onRemoveSeat(license.id, seat.id)
                          setActivation(null)
                          setMessage("Seat removed.")
                        })
                      }}
                      onRevoke={() => {
                        void runSeatAction(`revoke-${seat.id}`, async () => {
                          await onRevokeSeat(license.id, seat.id)
                          setActivation(null)
                          setMessage("Invite revoked.")
                        })
                      }}
                      pending={pendingAction.endsWith(seat.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activation ? (
            <SeatActivationPanel activation={activation} />
          ) : null}
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
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    Loading seats...
                  </td>
                </tr>
              ) : null}
              {!loading && license.seats.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    No historical seat records are available.
                  </td>
                </tr>
              ) : null}
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

function RoleCheckboxGroup({
  disabled,
  idPrefix,
  onToggle,
  roles,
  selected,
  title,
}: {
  disabled: boolean
  idPrefix: string
  onToggle: (key: string, checked: boolean) => void
  roles: readonly RoleTemplate[]
  selected: string[]
  title: string
}) {
  return (
    <div className="grid gap-1.5">
      <p className="text-xs font-medium text-foreground">{title}</p>
      {roles.map((role) => {
        const id = `${idPrefix}-${role.key}`
        const checked = selected.includes(role.key)
        return (
          <label
            key={role.key}
            htmlFor={id}
            className="flex items-start gap-2 text-xs text-muted-foreground"
          >
            <Checkbox
              id={id}
              checked={checked}
              disabled={disabled}
              onCheckedChange={(value) => onToggle(role.key, value === true)}
              className="mt-0.5"
            />
            <span>
              <span className="text-foreground">{role.name}</span>
              <br />
              {role.description}
            </span>
          </label>
        )
      })}
    </div>
  )
}

function SeatActions({
  canInvite,
  onExportActivation,
  onInvite,
  onOpenChange,
  onRemove,
  onRevoke,
  open,
  pending,
  protectActiveAdmin,
  seat,
}: {
  canInvite: boolean
  onExportActivation: () => void
  onInvite: () => void
  onOpenChange: (open: boolean) => void
  onRemove: () => void
  onRevoke: () => void
  open: boolean
  pending: boolean
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
        onExportActivation,
        onInvite,
        onRemove,
        onRevoke,
        protectActiveAdmin,
        status: seat.status,
      }),
    [
      canInvite,
      onExportActivation,
      onInvite,
      onRemove,
      onRevoke,
      protectActiveAdmin,
      seat.status,
    ]
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
        disabled={pending}
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
              disabled={pending}
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
  onExportActivation,
  onInvite,
  onRemove,
  onRevoke,
  protectActiveAdmin,
  status,
}: {
  canInvite: boolean
  onExportActivation: () => void
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
    return [
      { icon: FileSignature, label: "Export activation", run: onExportActivation },
      { icon: UserMinus, label: "Revoke invite", run: onRevoke },
    ]
  }

  return canInvite ? [{ icon: MailPlus, label: "Invite again", run: onInvite }] : []
}
