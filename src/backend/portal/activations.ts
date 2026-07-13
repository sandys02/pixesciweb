import { and, eq } from "drizzle-orm"

import { writePortalAuditEvent } from "@/backend/portal/auth"
import { generateConnectedActivationLicenseBundle } from "@/backend/portal/bundles"
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
import type { OrganizationType } from "@/features/portal/types"

const ARMOR_BEGIN = "-----BEGIN PIXESCI SEAT ACTIVATION-----"
const ARMOR_END = "-----END PIXESCI SEAT ACTIVATION-----"

type PortalActor = {
  accountId: number
  organizationId: number
}

export type SeatActivationPayload = {
  activationVersion: number
  licenseId: string
  edition: OrganizationType
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

export type ConnectedSeatActivationAcceptResponse = {
  accepted: true
  seat: {
    seatId: string
    email: string
    role: "admin" | "member"
    status: "active"
    acceptedAt: string
  }
  license: {
    licenseId: string
    edition: OrganizationType
    organizationId: number
    organizationName: string
    startsAt: string
    endsAt: string
    seatLimit: number
  }
  licenseBundle: {
    armoredBundle: string
    keyId: string
  }
}

type ConnectedSeatActivationAcceptResult =
  | { ok: true; activation: ConnectedSeatActivationAcceptResponse }
  | { ok: false; status: number; message: string }

const CONNECTED_ACCEPTANCE_MESSAGE =
  "Activation could not be accepted. Ask your organization admin for a fresh activation file."

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
    edition: organizationEdition(scoped.organization.organizationType),
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

export async function acceptConnectedSeatActivation(
  armoredActivation: string
): Promise<ConnectedSeatActivationAcceptResult> {
  const wrapper = parseArmoredSeatActivation(armoredActivation)

  if (!wrapper) {
    return { ok: false, status: 400, message: CONNECTED_ACCEPTANCE_MESSAGE }
  }

  const keys = getPortalSigningKeys()
  if (
    wrapper.keyId !== keys.keyId ||
    wrapper.payload.keyId !== keys.keyId ||
    !verifyPortalSignedWrapper(wrapper, keys.publicKey)
  ) {
    return { ok: false, status: 400, message: CONNECTED_ACCEPTANCE_MESSAGE }
  }

  const payload = wrapper.payload
  if (
    payload.activationVersion !== 1 ||
    payload.seatStatus !== "invited" ||
    !isValidPortalPublicId(payload.seatId) ||
    !isValidPortalPublicId(payload.licenseId) ||
    !isSeatRole(payload.seatRole) ||
    !/^\S+@\S+\.\S+$/.test(payload.seatEmail) ||
    new Date(payload.expiresAt).getTime() <= Date.now()
  ) {
    await auditVerifiedActivationRejection(payload, "invalid_or_expired_payload")
    return { ok: false, status: 400, message: CONNECTED_ACCEPTANCE_MESSAGE }
  }

  const [row] = await db
    .select({ seat: seats, license: licenses, organization: organizations })
    .from(seats)
    .innerJoin(licenses, eq(licenses.id, seats.licenseId))
    .innerJoin(organizations, eq(organizations.id, seats.organizationId))
    .where(
      and(
        eq(seats.seatId, payload.seatId),
        eq(seats.organizationId, payload.organizationId),
        eq(licenses.licenseId, payload.licenseId)
      )
    )
    .limit(1)

  if (!row) {
    await auditVerifiedActivationRejection(payload, "seat_not_found")
    return { ok: false, status: 400, message: CONNECTED_ACCEPTANCE_MESSAGE }
  }

  if (row.seat.status !== "invited") {
    await auditConnectedActivationBlocked(row, "seat_not_invited")
    return { ok: false, status: 409, message: CONNECTED_ACCEPTANCE_MESSAGE }
  }

  if (
    row.license.status !== "active" ||
    row.license.startsAt !== payload.licenseStartsAt ||
    row.license.endsAt !== payload.licenseEndsAt ||
    row.license.seatLimit !== payload.seatLimit ||
    organizationEdition(row.organization.organizationType) !== payload.edition ||
    row.organization.name !== payload.organizationName ||
    row.seat.email !== payload.seatEmail ||
    row.seat.role !== payload.seatRole ||
    !row.seat.inviteExpiresAt ||
    new Date(row.seat.inviteExpiresAt).getTime() <= Date.now()
  ) {
    await auditConnectedActivationBlocked(row, "activation_state_mismatch")
    return { ok: false, status: 400, message: CONNECTED_ACCEPTANCE_MESSAGE }
  }

  const acceptedAt = nowIso()
  const [acceptedSeat] = await db
    .update(seats)
    .set({
      status: "active",
      inviteTokenHash: null,
      inviteExpiresAt: null,
      inviteAcceptedAt: acceptedAt,
      updatedAt: acceptedAt,
    })
    .where(
      and(
        eq(seats.id, row.seat.id),
        eq(seats.organizationId, row.seat.organizationId),
        eq(seats.status, "invited")
      )
    )
    .returning()

  if (!acceptedSeat) {
    await auditConnectedActivationBlocked(row, "seat_already_consumed")
    return { ok: false, status: 409, message: CONNECTED_ACCEPTANCE_MESSAGE }
  }

  await writePortalAuditEvent({
    organizationId: row.organization.id,
    actorAccountId: null,
    actorSeatId: acceptedSeat.id,
    eventType: "seat_activation_accepted",
    targetType: "seat",
    targetId: acceptedSeat.seatId,
    metadata: {
      acceptedVia: "connected_activation_file",
      keyId: payload.keyId,
      licenseId: row.license.licenseId,
    },
  })

  const bundle = await generateConnectedActivationLicenseBundle({
    organizationId: row.organization.id,
    license: row.license,
    organization: row.organization,
    acceptedSeatId: acceptedSeat.seatId,
  })

  return {
    ok: true,
    activation: {
      accepted: true,
      seat: {
        seatId: acceptedSeat.seatId,
        email: acceptedSeat.email as string,
        role: acceptedSeat.role as "admin" | "member",
        status: "active",
        acceptedAt,
      },
      license: {
        licenseId: row.license.licenseId,
        edition: organizationEdition(row.organization.organizationType),
        organizationId: row.organization.id,
        organizationName: row.organization.name,
        startsAt: row.license.startsAt,
        endsAt: row.license.endsAt,
        seatLimit: row.license.seatLimit,
      },
      licenseBundle: {
        armoredBundle: bundle.armoredBundle,
        keyId: bundle.keyId,
      },
    },
  }
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
    isOrganizationEdition(payload.edition) &&
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

function isOrganizationEdition(value: unknown): value is OrganizationType {
  return value === "academia" || value === "enterprise" || value === "pixesci"
}

function organizationEdition(value: string): OrganizationType {
  return isOrganizationEdition(value) ? value : "enterprise"
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

async function auditVerifiedActivationRejection(
  payload: SeatActivationPayload,
  reason: string
) {
  await writePortalAuditEvent({
    organizationId: payload.organizationId,
    actorAccountId: null,
    eventType: "seat_activation_acceptance_rejected",
    targetType: "seat",
    targetId: payload.seatId,
    metadata: {
      reason,
      keyId: payload.keyId,
      licenseId: payload.licenseId,
    },
  })
}

async function auditConnectedActivationBlocked(
  row: {
    seat: typeof seats.$inferSelect
    license: typeof licenses.$inferSelect
    organization: typeof organizations.$inferSelect
  },
  reason: string
) {
  await writePortalAuditEvent({
    organizationId: row.organization.id,
    actorAccountId: null,
    actorSeatId: row.seat.id,
    eventType: "seat_activation_acceptance_rejected",
    targetType: "seat",
    targetId: row.seat.seatId,
    metadata: {
      reason,
      licenseId: row.license.licenseId,
    },
  })
}

function nowIso() {
  return new Date().toISOString()
}
