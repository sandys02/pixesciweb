import { and, eq } from "drizzle-orm"

import { writePortalAuditEvent } from "@/backend/portal/auth"
import { db } from "@/backend/portal/db"
import { isValidPortalPublicId } from "@/backend/portal/licenses"
import {
  licenses,
  organizations,
  seats,
} from "@/backend/portal/schema"
import {
  armorPortalSignedWrapper,
  getPortalSigningKeys,
  parseArmoredPortalWrapper,
  signPortalPayload,
  verifyPortalSignedWrapper,
} from "@/backend/portal/signing"

const ARMOR_BEGIN = "-----BEGIN PIXESCI SEAT ACTIVATION-----"
const ARMOR_END = "-----END PIXESCI SEAT ACTIVATION-----"

type PortalActor = {
  accountId: number
  organizationId: number
}

export type SeatActivationPayload = {
  activationVersion: number
  licenseId: string
  organizationId: number
  organizationName: string
  seatId: string
  seatEmail: string
  seatRole: "admin" | "member"
  seatStatus: "invited"
  licenseStartsAt: string
  licenseEndsAt: string
  seatLimit: number
  issuedAt: string
  expiresAt: string
  keyId: string
}

export type ArmoredSeatActivation = {
  payload: SeatActivationPayload
  signature: string
  keyId: string
}

export type PortalSeatActivationResponse = {
  seatId: string
  licenseId: string
  keyId: string
  generatedAt: string
  expiresAt: string
  armoredActivation: string
  payload: SeatActivationPayload
}

type SeatActivationResult =
  | { ok: true; activation: PortalSeatActivationResponse }
  | { ok: false; status: number; message: string }

export async function generatePortalSeatActivation(
  actor: PortalActor,
  seatId: string
): Promise<SeatActivationResult> {
  const scoped = await requireExportableScopedSeat(actor, seatId)
  if (!scoped.ok) return scoped

  const keys = getPortalSigningKeys()
  const issuedAt = nowIso()
  const payload: SeatActivationPayload = {
    activationVersion: 1,
    licenseId: scoped.license.licenseId,
    organizationId: scoped.organization.id,
    organizationName: scoped.organization.name,
    seatId: scoped.seat.seatId,
    seatEmail: scoped.seat.email as string,
    seatRole: scoped.seat.role as "admin" | "member",
    seatStatus: "invited",
    licenseStartsAt: scoped.license.startsAt,
    licenseEndsAt: scoped.license.endsAt,
    seatLimit: scoped.license.seatLimit,
    issuedAt,
    expiresAt: scoped.seat.inviteExpiresAt as string,
    keyId: keys.keyId,
  }
  const wrapper = signPortalPayload(payload, keys)
  const armoredActivation = armorSeatActivation(wrapper)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "seat_activation_exported",
    targetType: "seat",
    targetId: scoped.seat.seatId,
    metadata: {
      licenseId: scoped.license.licenseId,
      keyId: keys.keyId,
      expiresAt: payload.expiresAt,
    },
  })

  return {
    ok: true,
    activation: {
      seatId: scoped.seat.seatId,
      licenseId: scoped.license.licenseId,
      keyId: keys.keyId,
      generatedAt: issuedAt,
      expiresAt: payload.expiresAt,
      armoredActivation,
      payload,
    },
  }
}

export function verifyArmoredSeatActivation(armoredActivation: string) {
  const wrapper = parseArmoredSeatActivation(armoredActivation)
  if (!wrapper) return false

  const keys = getPortalSigningKeys()
  if (wrapper.keyId !== keys.keyId || wrapper.payload.keyId !== keys.keyId) {
    return false
  }

  return verifyPortalSignedWrapper(wrapper, keys.publicKey)
}

export function parseArmoredSeatActivation(armoredActivation: string) {
  return parseArmoredPortalWrapper(
    armoredActivation,
    ARMOR_BEGIN,
    ARMOR_END,
    isArmoredSeatActivation
  )
}

function armorSeatActivation(wrapper: ArmoredSeatActivation) {
  return armorPortalSignedWrapper(wrapper, ARMOR_BEGIN, ARMOR_END)
}

async function requireExportableScopedSeat(actor: PortalActor, seatId: string) {
  if (!isValidPortalPublicId(seatId)) {
    await auditBlockedActivationAction(actor, "seat", seatId, "invalid_seat_id")
    return { ok: false as const, status: 404, message: "Seat not found." }
  }

  const [row] = await db
    .select({ seat: seats, license: licenses, organization: organizations })
    .from(seats)
    .innerJoin(licenses, eq(licenses.id, seats.licenseId))
    .innerJoin(organizations, eq(organizations.id, seats.organizationId))
    .where(
      and(
        eq(seats.organizationId, actor.organizationId),
        eq(seats.seatId, seatId)
      )
    )
    .limit(1)

  if (!row) {
    await auditBlockedActivationAction(actor, "seat", seatId, "seat_not_found")
    return { ok: false as const, status: 404, message: "Seat not found." }
  }

  if (row.license.status !== "active") {
    await auditBlockedActivationAction(actor, "seat", seatId, "license_not_active")
    return {
      ok: false as const,
      status: 400,
      message: "Seat activation can only be exported for an active license.",
    }
  }

  if (row.seat.status !== "invited") {
    await auditBlockedActivationAction(actor, "seat", seatId, "seat_not_invited")
    return {
      ok: false as const,
      status: 400,
      message: "Seat activation can only be exported for a pending invite.",
    }
  }

  if (
    !row.seat.email ||
    !row.seat.inviteExpiresAt ||
    !isSeatRole(row.seat.role ?? "")
  ) {
    await auditBlockedActivationAction(actor, "seat", seatId, "seat_incomplete")
    return {
      ok: false as const,
      status: 400,
      message: "This seat invite is missing activation details.",
    }
  }

  if (new Date(row.seat.inviteExpiresAt).getTime() <= Date.now()) {
    await auditBlockedActivationAction(actor, "seat", seatId, "invite_expired")
    return {
      ok: false as const,
      status: 400,
      message: "This invite has expired. Resend it before exporting activation.",
    }
  }

  return {
    ok: true as const,
    seat: row.seat,
    license: row.license,
    organization: row.organization,
  }
}

function isArmoredSeatActivation(value: unknown): value is ArmoredSeatActivation {
  if (!value || typeof value !== "object") {
    return false
  }

  const activation = value as Record<string, unknown>
  const payload = activation.payload as Record<string, unknown> | undefined

  return (
    typeof activation.keyId === "string" &&
    typeof activation.signature === "string" &&
    Boolean(payload) &&
    typeof payload === "object" &&
    payload.activationVersion === 1 &&
    typeof payload.licenseId === "string" &&
    typeof payload.organizationId === "number" &&
    typeof payload.organizationName === "string" &&
    typeof payload.seatId === "string" &&
    typeof payload.seatEmail === "string" &&
    (payload.seatRole === "admin" || payload.seatRole === "member") &&
    payload.seatStatus === "invited" &&
    typeof payload.licenseStartsAt === "string" &&
    typeof payload.licenseEndsAt === "string" &&
    typeof payload.seatLimit === "number" &&
    typeof payload.issuedAt === "string" &&
    typeof payload.expiresAt === "string" &&
    typeof payload.keyId === "string"
  )
}

function isSeatRole(role: string): role is "admin" | "member" {
  return role === "admin" || role === "member"
}

async function auditBlockedActivationAction(
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

function nowIso() {
  return new Date().toISOString()
}
