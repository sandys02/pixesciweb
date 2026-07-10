import { and, eq, isNull } from "drizzle-orm"

import { writePortalAuditEvent } from "@/backend/portal/auth"
import { db } from "@/backend/portal/db"
import {
  licenseBundles,
  licenses,
  organizations,
  seats,
} from "@/backend/portal/schema"
import { isValidPortalPublicId } from "@/backend/portal/licenses"
import {
  armorPortalSignedWrapper,
  canonicalJson,
  getPortalSigningKeys,
  parseArmoredPortalWrapper,
  signPortalPayload,
  verifyPortalSignedWrapper,
} from "@/backend/portal/signing"

const ARMOR_BEGIN = "-----BEGIN PIXESCI LICENSE BUNDLE-----"
const ARMOR_END = "-----END PIXESCI LICENSE BUNDLE-----"
const DEFAULT_FEATURES = [
  "local-workflows",
  "seat-management",
  "offline-license",
] as const

type PortalActor = {
  accountId: number
  organizationId: number
}

export type LicenseBundlePayload = {
  bundleVersion: number
  licenseId: string
  organizationId: number
  organizationName: string
  startsAt: string
  endsAt: string
  seatLimit: number
  features: string[]
  issuedAt: string
  keyId: string
  seats?: Array<{
    seatId: string
    email: string
    role: "admin" | "member"
    status: "active" | "invited"
  }>
}

export type ArmoredLicenseBundle = {
  payload: LicenseBundlePayload
  signature: string
  keyId: string
}

export type PortalLicenseBundleResponse = {
  id: number
  licenseId: string
  bundleVersion: number
  keyId: string
  generatedAt: string
  armoredBundle: string
  payload: LicenseBundlePayload
}

type BundleActionResult =
  | { ok: true; bundle: PortalLicenseBundleResponse }
  | { ok: true; bundle: null }
  | { ok: false; status: number; message: string }

export async function generatePortalLicenseBundle(
  actor: PortalActor,
  licenseId: string
): Promise<BundleActionResult> {
  const scoped = await requireActiveScopedLicense(actor, licenseId)
  if (!scoped.ok) return scoped

  const { license, organization } = scoped
  const existingRows = await db
    .select()
    .from(licenseBundles)
    .where(
      and(
        eq(licenseBundles.organizationId, actor.organizationId),
        eq(licenseBundles.licenseId, license.id)
      )
    )

  const bundleVersion =
    existingRows.reduce(
      (maxVersion, row) => Math.max(maxVersion, row.bundleVersion),
      0
    ) + 1
  const keys = getPortalSigningKeys()
  const payload = await buildBundlePayload({
    bundleVersion,
    issuedAt: nowIso(),
    keyId: keys.keyId,
    license,
    organization,
  })
  const wrapper = signPortalPayload(payload, keys)
  const payloadJson = canonicalJson(payload)
  const generatedAt = payload.issuedAt

  await db.insert(licenseBundles).values({
    licenseId: license.id,
    organizationId: actor.organizationId,
    bundleVersion,
    payloadJson,
    signature: wrapper.signature,
    publicKeyId: keys.keyId,
    generatedBy: actor.accountId,
    generatedAt,
    revokedAt: null,
  })

  await db
    .update(licenses)
    .set({
      signedBundleVersion: bundleVersion,
      updatedAt: generatedAt,
    })
    .where(
      and(
        eq(licenses.id, license.id),
        eq(licenses.organizationId, actor.organizationId)
      )
    )

  const [bundle] = await db
    .select()
    .from(licenseBundles)
    .where(
      and(
        eq(licenseBundles.organizationId, actor.organizationId),
        eq(licenseBundles.licenseId, license.id),
        eq(licenseBundles.bundleVersion, bundleVersion)
      )
    )
    .limit(1)

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "offline_license_bundle_generated",
    targetType: "license",
    targetId: license.licenseId,
    metadata: { bundleVersion, keyId: keys.keyId },
  })

  return {
    ok: true,
    bundle: serializeStoredBundle(bundle, license.licenseId),
  }
}

export async function getLatestPortalLicenseBundle(
  actor: PortalActor,
  licenseId: string
): Promise<BundleActionResult> {
  const scoped = await requireActiveScopedLicense(actor, licenseId)
  if (!scoped.ok) return scoped

  const rows = await db
    .select()
    .from(licenseBundles)
    .where(
      and(
        eq(licenseBundles.organizationId, actor.organizationId),
        eq(licenseBundles.licenseId, scoped.license.id),
        isNull(licenseBundles.revokedAt)
      )
    )
  const latest = rows.sort((left, right) => {
    if (left.bundleVersion !== right.bundleVersion) {
      return right.bundleVersion - left.bundleVersion
    }

    return right.generatedAt.localeCompare(left.generatedAt)
  })[0]

  if (!latest) {
    return { ok: true, bundle: null }
  }

  await writePortalAuditEvent({
    organizationId: actor.organizationId,
    actorAccountId: actor.accountId,
    eventType: "offline_license_bundle_exported",
    targetType: "license",
    targetId: scoped.license.licenseId,
    metadata: {
      bundleVersion: latest.bundleVersion,
      keyId: latest.publicKeyId,
    },
  })

  return {
    ok: true,
    bundle: serializeStoredBundle(latest, scoped.license.licenseId),
  }
}

export function verifyArmoredLicenseBundle(armoredBundle: string) {
  const wrapper = parseArmoredBundle(armoredBundle)
  if (!wrapper) return false

  const keys = getPortalSigningKeys()
  if (wrapper.keyId !== keys.keyId || wrapper.payload.keyId !== keys.keyId) {
    return false
  }

  return verifyLicenseBundleWrapper(wrapper, keys.publicKey)
}

export function verifyLicenseBundleWrapper(
  wrapper: ArmoredLicenseBundle,
  publicKeyPem = getPortalSigningKeys().publicKey
) {
  return verifyPortalSignedWrapper(wrapper, publicKeyPem)
}

export function parseArmoredBundle(armoredBundle: string) {
  return parseArmoredPortalWrapper(
    armoredBundle,
    ARMOR_BEGIN,
    ARMOR_END,
    isArmoredLicenseBundle
  )
}

async function requireActiveScopedLicense(actor: PortalActor, licenseId: string) {
  if (!isValidPortalPublicId(licenseId)) {
    await auditBlockedBundleAction(actor, "license", licenseId, "invalid_license_id")
    return { ok: false as const, status: 404, message: "License not found." }
  }

  const [row] = await db
    .select({ license: licenses, organization: organizations })
    .from(licenses)
    .innerJoin(organizations, eq(organizations.id, licenses.organizationId))
    .where(
      and(
        eq(licenses.organizationId, actor.organizationId),
        eq(licenses.licenseId, licenseId),
        eq(licenses.status, "active")
      )
    )
    .limit(1)

  if (!row) {
    await auditBlockedBundleAction(actor, "license", licenseId, "license_not_found")
    return { ok: false as const, status: 404, message: "License not found." }
  }

  return {
    ok: true as const,
    license: row.license,
    organization: row.organization,
  }
}

async function buildBundlePayload(input: {
  bundleVersion: number
  issuedAt: string
  keyId: string
  license: typeof licenses.$inferSelect
  organization: typeof organizations.$inferSelect
}): Promise<LicenseBundlePayload> {
  const seatRows = await db
    .select()
    .from(seats)
    .where(
      and(
        eq(seats.organizationId, input.license.organizationId),
        eq(seats.licenseId, input.license.id)
      )
    )
  const manifestSeats = seatRows
    .filter(
      (seat) =>
        (seat.status === "active" || seat.status === "invited") &&
        (seat.role === "admin" || seat.role === "member") &&
        Boolean(seat.email)
    )
    .map((seat) => ({
      seatId: seat.seatId,
      email: seat.email as string,
      role: seat.role as "admin" | "member",
      status: seat.status as "active" | "invited",
    }))
    .sort((left, right) => left.seatId.localeCompare(right.seatId))

  const payload: LicenseBundlePayload = {
    bundleVersion: input.bundleVersion,
    licenseId: input.license.licenseId,
    organizationId: input.organization.id,
    organizationName: input.organization.name,
    startsAt: input.license.startsAt,
    endsAt: input.license.endsAt,
    seatLimit: input.license.seatLimit,
    features: [...DEFAULT_FEATURES],
    issuedAt: input.issuedAt,
    keyId: input.keyId,
  }

  if (manifestSeats.length > 0) {
    payload.seats = manifestSeats
  }

  return payload
}

function serializeStoredBundle(
  bundle: typeof licenseBundles.$inferSelect,
  publicLicenseId: string
): PortalLicenseBundleResponse {
  const payload = JSON.parse(bundle.payloadJson) as LicenseBundlePayload
  const armoredBundle = armorBundle({
    payload,
    signature: bundle.signature,
    keyId: bundle.publicKeyId,
  })

  return {
    id: bundle.id,
    licenseId: publicLicenseId,
    bundleVersion: bundle.bundleVersion,
    keyId: bundle.publicKeyId,
    generatedAt: bundle.generatedAt,
    armoredBundle,
    payload,
  }
}

function armorBundle(wrapper: ArmoredLicenseBundle) {
  return armorPortalSignedWrapper(wrapper, ARMOR_BEGIN, ARMOR_END)
}

function isArmoredLicenseBundle(value: unknown): value is ArmoredLicenseBundle {
  if (!value || typeof value !== "object") {
    return false
  }

  const bundle = value as Record<string, unknown>
  return (
    typeof bundle.keyId === "string" &&
    typeof bundle.signature === "string" &&
    Boolean(bundle.payload) &&
    typeof bundle.payload === "object"
  )
}

async function auditBlockedBundleAction(
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
