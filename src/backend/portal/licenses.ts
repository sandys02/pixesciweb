import { createHash, randomBytes } from "node:crypto"

import { and, eq, ne } from "drizzle-orm"

import { writePortalAuditEvent, normalizeEmail } from "@/backend/portal/auth"
import { db } from "@/backend/portal/db"
import { licenses, seats } from "@/backend/portal/schema"
import type {
  LicenseStatus,
  PortalLicense,
  PortalSeat,
  SeatRole,
  SeatStatus,
} from "@/features/portal/types"

const INVITE_TTL_DAYS = 7
const SEAT_ROLES = new Set(["admin", "member"])
const PUBLIC_ID_PATTERN = /^[a-z0-9._-]{3,128}$/i

type PortalActor = {
  accountId: number
  organizationId: number
}

type LicenseRow = typeof licenses.$inferSelect
type SeatRow = typeof seats.$inferSelect

export type SeatActionResult =
  | { ok: true; seat: PortalSeat; inviteLink?: string }
  | { ok: false; status: number; message: string }

export function isValidPortalPublicId(value: string) {
  return PUBLIC_ID_PATTERN.test(value)
}

export function parseSeatInviteBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const }
  }

  const email = "email" in body ? String(body.email ?? "") : ""
  const role = "role" in body ? String(body.role ?? "") : ""
  const normalizedEmail = normalizeEmail(email)

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || !isSeatRole(role)) {
    return { ok: false as const }
  }

  return {
    ok: true as const,
    data: { email: normalizedEmail, role },
  }
}

export async function listPortalLicenses(actor: PortalActor) {
  const rows = await db
    .select()
    .from(licenses)
    .where(eq(licenses.organizationId, actor.organizationId))
    .orderBy(licenses.endsAt)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "license_viewed",
    targetType: "organization",
    targetId: String(actor.organizationId),
    metadata: { count: rows.length },
  })

  return rows.map(serializeLicense)
}

export async function listPortalLicenseSeats(
  actor: PortalActor,
  licenseId: string
) {
  if (!isValidPortalPublicId(licenseId)) {
    await auditUnauthorized(actor, "license", licenseId, "invalid_license_id")
    return { ok: false as const, status: 404, message: "License not found." }
  }

  const license = await findScopedLicense(actor.organizationId, licenseId)

  if (!license) {
    await auditUnauthorized(actor, "license", licenseId, "license_not_found")
    return { ok: false as const, status: 404, message: "License not found." }
  }

  const rows = await db
    .select()
    .from(seats)
    .where(
      and(
        eq(seats.organizationId, actor.organizationId),
        eq(seats.licenseId, license.id)
      )
    )
    .orderBy(seats.createdAt)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "license_viewed",
    targetType: "license",
    targetId: license.licenseId,
    metadata: { seatCount: rows.length },
  })

  return {
    ok: true as const,
    license: serializeLicense(license),
    seats: rows.map((seat) => serializeSeat(seat, license.status)),
  }
}

export async function invitePortalSeat(
  actor: PortalActor,
  licenseId: string,
  input: { email: string; role: SeatRole }
): Promise<SeatActionResult> {
  if (!isValidPortalPublicId(licenseId)) {
    await auditUnauthorized(actor, "license", licenseId, "invalid_license_id")
    return { ok: false, status: 404, message: "License not found." }
  }

  const license = await findScopedLicense(actor.organizationId, licenseId)

  if (!license || !isActiveLicense(license)) {
    await auditUnauthorized(actor, "license", licenseId, "license_not_active")
    return { ok: false, status: 404, message: "License not found." }
  }

  const capacity = await ensureCapacity(actor, license)
  if (!capacity.ok) return capacity

  const duplicate = await findDuplicateAllocatedSeat({
    organizationId: actor.organizationId,
    licenseInternalId: license.id,
    email: input.email,
  })

  if (duplicate) {
    return {
      ok: false,
      status: 409,
      message: "That email already has an active seat or pending invite.",
    }
  }

  const invite = createInviteToken()
  const timestamp = nowIso()
  const seatId = `seat_${randomBytes(9).toString("base64url")}`

  await db.insert(seats).values({
    seatId,
    organizationId: actor.organizationId,
    licenseId: license.id,
    email: input.email,
    role: input.role,
    status: "invited",
    inviteTokenHash: invite.hash,
    inviteExpiresAt: invite.expiresAt,
    inviteAcceptedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  const created = await findScopedSeat(actor.organizationId, seatId)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "seat_invited",
    targetType: "seat",
    targetId: seatId,
    metadata: { licenseId: license.licenseId, role: input.role },
  })

  return {
    ok: true,
    seat: serializeSeat(created?.seat, license.status, invite.link),
    inviteLink: invite.link,
  }
}

export async function resendPortalSeatInvite(
  actor: PortalActor,
  seatId: string
): Promise<SeatActionResult> {
  const scoped = await requireScopedSeat(actor, seatId)
  if (!scoped.ok) return scoped

  const { license, seat } = scoped

  if (!isActiveLicense(license) || !isKnownSeatStatus(seat.status)) {
    await auditUnauthorized(actor, "seat", seatId, "seat_not_resendable")
    return { ok: false, status: 400, message: "This invite cannot be resent." }
  }

  if (seat.status === "active") {
    return { ok: false, status: 400, message: "This seat is already active." }
  }

  if (seat.status === "revoked") {
    const capacity = await ensureCapacity(actor, license)
    if (!capacity.ok) return capacity

    if (seat.email) {
      const duplicate = await findDuplicateAllocatedSeat({
        organizationId: actor.organizationId,
        licenseInternalId: license.id,
        email: normalizeEmail(seat.email),
        excludeSeatId: seat.seatId,
      })

      if (duplicate) {
        return {
          ok: false,
          status: 409,
          message: "That email already has an active seat or pending invite.",
        }
      }
    }
  }

  const invite = createInviteToken()

  await db
    .update(seats)
    .set({
      status: "invited",
      inviteTokenHash: invite.hash,
      inviteExpiresAt: invite.expiresAt,
      inviteAcceptedAt: null,
      updatedAt: nowIso(),
    })
    .where(and(eq(seats.id, seat.id), eq(seats.organizationId, actor.organizationId)))

  const updated = await findScopedSeat(actor.organizationId, seatId)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "seat_invite_resent",
    targetType: "seat",
    targetId: seatId,
    metadata: { licenseId: license.licenseId },
  })

  return {
    ok: true,
    seat: serializeSeat(updated?.seat, license.status, invite.link, "resent"),
    inviteLink: invite.link,
  }
}

export async function revokePortalSeatInvite(
  actor: PortalActor,
  seatId: string
): Promise<SeatActionResult> {
  const scoped = await requireScopedSeat(actor, seatId)
  if (!scoped.ok) return scoped

  const { license, seat } = scoped

  if (!isActiveLicense(license) || seat.status !== "invited") {
    await auditUnauthorized(actor, "seat", seatId, "seat_not_revokable")
    return { ok: false, status: 400, message: "This invite cannot be revoked." }
  }

  await db
    .update(seats)
    .set({
      status: "revoked",
      inviteTokenHash: null,
      inviteExpiresAt: null,
      updatedAt: nowIso(),
    })
    .where(and(eq(seats.id, seat.id), eq(seats.organizationId, actor.organizationId)))

  const updated = await findScopedSeat(actor.organizationId, seatId)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "seat_invite_revoked",
    targetType: "seat",
    targetId: seatId,
    metadata: { licenseId: license.licenseId },
  })

  return {
    ok: true,
    seat: serializeSeat(updated?.seat, license.status),
  }
}

export async function removePortalSeat(
  actor: PortalActor,
  seatId: string
): Promise<SeatActionResult> {
  const scoped = await requireScopedSeat(actor, seatId)
  if (!scoped.ok) return scoped

  const { license, seat } = scoped

  if (!isActiveLicense(license) || seat.status !== "active") {
    await auditUnauthorized(actor, "seat", seatId, "seat_not_removable")
    return { ok: false, status: 400, message: "This seat cannot be removed." }
  }

  if (seat.role === "owner" || (seat.role === "admin" && (await activeAdminCount(actor, license)) <= 1)) {
    await auditUnauthorized(actor, "seat", seatId, "protected_admin_seat")
    return {
      ok: false,
      status: 403,
      message: "The first active admin seat cannot be removed.",
    }
  }

  await db
    .update(seats)
    .set({
      status: "revoked",
      inviteTokenHash: null,
      inviteExpiresAt: null,
      updatedAt: nowIso(),
    })
    .where(and(eq(seats.id, seat.id), eq(seats.organizationId, actor.organizationId)))

  const updated = await findScopedSeat(actor.organizationId, seatId)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "seat_removed",
    targetType: "seat",
    targetId: seatId,
    metadata: { licenseId: license.licenseId },
  })

  return {
    ok: true,
    seat: serializeSeat(updated?.seat, license.status),
  }
}

function serializeLicense(license: LicenseRow): PortalLicense {
  return {
    id: license.licenseId,
    label: license.label,
    status: isLicenseStatus(license.status) ? license.status : "inactive",
    startsAt: license.startsAt,
    endsAt: license.endsAt,
    seatLimit: license.seatLimit,
    seats: [],
  }
}

function serializeSeat(
  seat: SeatRow | undefined,
  licenseStatus: string,
  inviteLink?: string,
  temporaryCredentialState?: PortalSeat["temporaryCredentialState"]
): PortalSeat {
  if (!seat) {
    return { id: "unknown", status: "revoked" }
  }

  const status = isKnownSeatStatus(seat.status) ? seat.status : "revoked"

  if (licenseStatus !== "active") {
    return { id: seat.seatId, status }
  }

  return {
    id: seat.seatId,
    email: seat.email ?? undefined,
    role: isSeatRole(seat.role ?? "") ? seat.role : undefined,
    status,
    inviteLink:
      inviteLink ??
      (status === "invited"
        ? "Invite issued"
        : status === "revoked"
          ? "Invite revoked"
          : undefined),
    temporaryCredentialState:
      temporaryCredentialState ??
      (status === "active"
        ? "accepted"
        : status === "invited"
          ? "issued"
          : "revoked"),
  }
}

async function findScopedLicense(organizationId: number, licenseId: string) {
  const rows = await db
    .select()
    .from(licenses)
    .where(
      and(
        eq(licenses.organizationId, organizationId),
        eq(licenses.licenseId, licenseId)
      )
    )
    .limit(1)

  return rows[0] ?? null
}

async function findScopedSeat(organizationId: number, seatId: string) {
  const rows = await db
    .select({ seat: seats, license: licenses })
    .from(seats)
    .innerJoin(licenses, eq(licenses.id, seats.licenseId))
    .where(
      and(eq(seats.organizationId, organizationId), eq(seats.seatId, seatId))
    )
    .limit(1)

  return rows[0] ?? null
}

async function requireScopedSeat(actor: PortalActor, seatId: string) {
  if (!isValidPortalPublicId(seatId)) {
    await auditUnauthorized(actor, "seat", seatId, "invalid_seat_id")
    return { ok: false as const, status: 404, message: "Seat not found." }
  }

  const row = await findScopedSeat(actor.organizationId, seatId)

  if (!row) {
    await auditUnauthorized(actor, "seat", seatId, "seat_not_found")
    return { ok: false as const, status: 404, message: "Seat not found." }
  }

  return {
    ok: true as const,
    seat: row.seat,
    license: row.license,
  }
}

async function ensureCapacity(actor: PortalActor, license: LicenseRow) {
  const allocated = await allocatedSeatCount(actor, license)

  if (allocated >= license.seatLimit) {
    await writePortalAuditEvent({
      organizationId: actor.organizationId,
      actorAccountId: actor.accountId,
      eventType: "seat_limit_exceeded",
      targetType: "license",
      targetId: license.licenseId,
      metadata: { allocated, seatLimit: license.seatLimit },
    })

    return {
      ok: false as const,
      status: 409,
      message: "This license has no available seats.",
    }
  }

  return { ok: true as const }
}

async function allocatedSeatCount(actor: PortalActor, license: LicenseRow) {
  const rows = await db
    .select()
    .from(seats)
    .where(
      and(
        eq(seats.organizationId, actor.organizationId),
        eq(seats.licenseId, license.id)
      )
    )

  return rows.filter((seat) => seat.status === "active" || seat.status === "invited")
    .length
}

async function activeAdminCount(actor: PortalActor, license: LicenseRow) {
  const rows = await db
    .select()
    .from(seats)
    .where(
      and(
        eq(seats.organizationId, actor.organizationId),
        eq(seats.licenseId, license.id),
        eq(seats.status, "active"),
        eq(seats.role, "admin")
      )
    )

  return rows.length
}

async function findDuplicateAllocatedSeat(input: {
  organizationId: number
  licenseInternalId: number
  email: string
  excludeSeatId?: string
}) {
  const rows = await db
    .select()
    .from(seats)
    .where(
      and(
        eq(seats.organizationId, input.organizationId),
        eq(seats.licenseId, input.licenseInternalId),
        eq(seats.email, input.email),
        input.excludeSeatId ? ne(seats.seatId, input.excludeSeatId) : undefined
      )
    )

  return rows.some((seat) => seat.status === "active" || seat.status === "invited")
}

async function auditUnauthorized(
  actor: PortalActor,
  targetType: string,
  targetId: string,
  reason: string
) {
  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "unauthorized_portal_action_blocked",
    targetType,
    targetId,
    metadata: { reason },
  })
}

function createInviteToken() {
  const token = randomBytes(32).toString("base64url")
  return {
    token,
    hash: createHash("sha256").update(token).digest("base64url"),
    expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000)
      .toISOString(),
    link: `/portal/invite/${token}`,
  }
}

function isActiveLicense(license: LicenseRow) {
  return license.status === "active"
}

function isLicenseStatus(status: string): status is LicenseStatus {
  return status === "active" || status === "inactive"
}

function isKnownSeatStatus(status: string): status is SeatStatus {
  return status === "active" || status === "invited" || status === "revoked"
}

function isSeatRole(role: string): role is SeatRole {
  return SEAT_ROLES.has(role)
}

function nowIso() {
  return new Date().toISOString()
}
