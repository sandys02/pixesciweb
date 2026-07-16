import { randomBytes } from "node:crypto"

import { and, desc, eq, ne } from "drizzle-orm"

import { assertAdminWriteAllowed } from "@/backend/admin/environment"
import type { AdminSession } from "@/backend/admin/auth"
import { writeAdminAuditEvent } from "@/backend/admin/auth"
import { db } from "@/backend/portal/db"
import {
  auditEvents,
  licenses,
  organizations,
  portalAccountOrganizations,
  portalAccounts,
  seats,
} from "@/backend/portal/schema"
import {
  hashPortalPassword,
  normalizeDomain,
  normalizeEmail,
} from "@/backend/portal/auth"
import { createPortalPasswordResetLink } from "@/backend/portal/password-reset"

const ORGANIZATION_TYPES = new Set(["academia", "enterprise", "pixesci"])
const LICENSE_STATUSES = new Set(["active", "inactive"])
const ORG_STATUSES = new Set(["active", "deactivated", "archived"])
const SAFE_ID_PATTERN = /^[a-z0-9._-]{3,128}$/i

export type AdminCreateOrganizationInput = {
  organization: {
    country: "United States"
    state: string
    name: string
    email: string
    domain: string
    organizationType: "enterprise" | "academia" | "pixesci"
    researchField: string
  }
  portalAccount: {
    email?: string
    createSetupLink: boolean
  }
  license: {
    licenseId?: string
    generateLicenseId?: boolean
    label: string
    startsAt: string
    endsAt: string
    seatLimit: number
    status: "active" | "inactive"
  }
}

export type AdminOrganizationUpdateInput = {
  country: "United States"
  state: string
  name: string
  email: string
  domain: string
  organizationType: "enterprise" | "academia" | "pixesci"
  researchField: string
}

export type AdminLicenseInput = {
  organizationId: number
  licenseId?: string
  generateLicenseId?: boolean
  label: string
  startsAt: string
  endsAt: string
  seatLimit: number
  status: "active" | "inactive"
}

function nowIso() {
  return new Date().toISOString()
}

function temporaryPassword() {
  return randomBytes(24).toString("base64url")
}

function addOneYear(dateString: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return ""

  const [year, month, day] = dateString.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCFullYear(date.getUTCFullYear() + 1)

  return date.toISOString().slice(0, 10)
}

export function generateLicenseId() {
  const year = new Date().getUTCFullYear()
  const suffix = randomBytes(5).toString("hex").toUpperCase()
  return `LIC-PSCI-${year}-${suffix}`
}

function allocatedSeatCount(rows: Array<{ status: string }>) {
  return rows.filter((seat) => seat.status === "active" || seat.status === "invited")
    .length
}

function serializeOrganizationListItem(input: {
  organization: typeof organizations.$inferSelect
  activeLicense?: typeof licenses.$inferSelect
  allocatedSeats: number
  portalSetupCompletedAt: string | null
}) {
  return {
    id: input.organization.id,
    name: input.organization.name,
    domain: input.organization.domain,
    email: input.organization.email,
    country: input.organization.country,
    state: input.organization.state,
    edition: organizationType(input.organization.organizationType),
    researchField: input.organization.researchField,
    status: organizationStatus(input.organization.status),
    activeLicenseId: input.activeLicense?.licenseId,
    activeLicenseStatus: input.activeLicense
      ? licenseStatus(input.activeLicense.status)
      : undefined,
    activeLicenseStartsAt: input.activeLicense?.startsAt,
    activeLicenseEndsAt: input.activeLicense?.endsAt,
    portalSetupCompletedAt: input.portalSetupCompletedAt,
    seatLimit: input.activeLicense?.seatLimit,
    allocatedSeats: input.activeLicense ? input.allocatedSeats : undefined,
    updatedAt: input.organization.updatedAt,
  }
}

function organizationType(value: string) {
  return ORGANIZATION_TYPES.has(value)
    ? (value as "enterprise" | "academia" | "pixesci")
    : "enterprise"
}

function organizationStatus(value: string) {
  return ORG_STATUSES.has(value)
    ? (value as "active" | "deactivated" | "archived")
    : "active"
}

function licenseStatus(value: string) {
  return LICENSE_STATUSES.has(value) ? (value as "active" | "inactive") : "inactive"
}

async function organizationSummary(organization: typeof organizations.$inferSelect) {
  const licenseRows = await db
    .select()
    .from(licenses)
    .where(eq(licenses.organizationId, organization.id))
    .orderBy(desc(licenses.endsAt))
  const activeLicense =
    licenseRows.find((license) => license.status === "active") ?? licenseRows[0]
  const seatRows = activeLicense
    ? await db
        .select({ status: seats.status })
        .from(seats)
        .where(eq(seats.licenseId, activeLicense.id))
    : []
  const accountRows = await db
    .select({ setupCompletedAt: portalAccounts.setupCompletedAt })
    .from(portalAccountOrganizations)
    .innerJoin(
      portalAccounts,
      eq(portalAccounts.id, portalAccountOrganizations.accountId)
    )
    .where(eq(portalAccountOrganizations.organizationId, organization.id))

  return serializeOrganizationListItem({
    organization,
    activeLicense,
    allocatedSeats: allocatedSeatCount(seatRows),
    portalSetupCompletedAt:
      accountRows.find((account) => account.setupCompletedAt)?.setupCompletedAt ?? null,
  })
}

export async function listAdminOrganizations() {
  const rows = await db
    .select()
    .from(organizations)
    .orderBy(desc(organizations.updatedAt))

  return Promise.all(rows.map(organizationSummary))
}

export async function getAdminOrganization(organizationId: number) {
  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1)

  if (!organization) return null

  const accountRows = await db
    .select({
      account: portalAccounts,
      membership: portalAccountOrganizations,
    })
    .from(portalAccountOrganizations)
    .innerJoin(
      portalAccounts,
      eq(portalAccounts.id, portalAccountOrganizations.accountId)
    )
    .where(eq(portalAccountOrganizations.organizationId, organizationId))

  const licenseRows = await db
    .select()
    .from(licenses)
    .where(eq(licenses.organizationId, organizationId))
    .orderBy(desc(licenses.endsAt))
  const seatRows = await db
    .select({ seat: seats, license: licenses })
    .from(seats)
    .innerJoin(licenses, eq(licenses.id, seats.licenseId))
    .where(eq(seats.organizationId, organizationId))
    .orderBy(desc(seats.updatedAt))
  const recentAudit = await db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.organizationId, organizationId))
    .orderBy(desc(auditEvents.createdAt))
    .limit(20)

  return {
    organization: await organizationSummary(organization),
    profile: {
      country: "United States" as const,
      state: organization.state,
      name: organization.name,
      email: organization.email,
      domain: organization.domain,
      organizationType: organizationType(organization.organizationType),
      researchField: organization.researchField,
      status: organizationStatus(organization.status),
    },
    portalAccounts: accountRows.map(({ account, membership }) => ({
      id: account.id,
      email: account.email,
      active: account.active,
      role: membership.role,
      mustChangePassword: account.mustChangePassword,
      setupCompletedAt: account.setupCompletedAt,
      updatedAt: account.updatedAt,
    })),
    licenses: licenseRows.map((license) => ({
      id: license.id,
      licenseId: license.licenseId,
      label: license.label,
      status: licenseStatus(license.status),
      startsAt: license.startsAt,
      endsAt: license.endsAt,
      seatLimit: license.seatLimit,
      signedBundleVersion: license.signedBundleVersion,
    })),
    seats: seatRows.map(({ seat, license }) => ({
      id: seat.id,
      seatId: seat.seatId,
      licenseId: license.licenseId,
      email: seat.email,
      role: seat.role,
      status: seat.status,
      inviteExpiresAt: seat.inviteExpiresAt,
      inviteAcceptedAt: seat.inviteAcceptedAt,
      updatedAt: seat.updatedAt,
    })),
    auditEvents: recentAudit.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      actorType: event.actorType,
      actorAdminAccountId: event.actorAdminAccountId,
      actorAccountId: event.actorAccountId,
      targetType: event.targetType,
      targetId: event.targetId,
      metadataJson: event.metadataJson,
      createdAt: event.createdAt,
    })),
  }
}

export async function createAdminOrganization(input: {
  actor: AdminSession
  data: AdminCreateOrganizationInput
  origin: string
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const parsed = parseCreateOrganizationInput(input.data)
  if (!parsed.ok) return parsed

  const organizationEmail = normalizeEmail(parsed.data.organization.email)
  const accountEmail = organizationEmail
  const domain = normalizeDomain(parsed.data.organization.domain)
  const licenseId = parsed.data.license.generateLicenseId
    ? generateLicenseId()
    : parsed.data.license.licenseId?.trim() || generateLicenseId()
  const timestamp = nowIso()

  const duplicate = await findOnboardingDuplicate({
    domain,
    accountEmail,
    licenseId,
  })
  if (duplicate) return duplicate

  const [organization] = await db
    .insert(organizations)
    .values({
      organizationType: parsed.data.organization.organizationType,
      country: "United States",
      state: parsed.data.organization.state.trim(),
      name: parsed.data.organization.name.trim(),
      email: organizationEmail,
      domain,
      researchField: parsed.data.organization.researchField.trim(),
      status: "active",
      deactivatedAt: null,
      archivedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning()

  const [account] = await db
    .insert(portalAccounts)
    .values({
      email: accountEmail,
      passwordHash: hashPortalPassword(temporaryPassword()),
      active: true,
      role: "admin",
      mustChangePassword: true,
      setupCompletedAt: null,
      failedLoginCount: 0,
      lockedUntil: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning()

  await db.insert(portalAccountOrganizations).values({
    accountId: account.id,
    organizationId: organization.id,
    role: "owner",
    createdAt: timestamp,
  })

  const [license] = await db
    .insert(licenses)
    .values({
      licenseId,
      organizationId: organization.id,
      status: parsed.data.license.status,
      startsAt: parsed.data.license.startsAt,
      endsAt: parsed.data.license.endsAt,
      seatLimit: parsed.data.license.seatLimit,
      label: parsed.data.license.label.trim(),
      signedBundleVersion: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning()

  await writeAdminAuditEvent({
    organizationId: organization.id,
    actorAdminAccountId: input.actor.adminId,
    eventType: "admin_organization_created",
    targetType: "organization",
    targetId: String(organization.id),
    metadata: { domain, organizationEmail, licenseId },
  })

  let setupLink: string | undefined
  let setupLinkExpiresAt: string | undefined
  if (parsed.data.portalAccount.createSetupLink) {
    const reset = await createPortalPasswordResetLink({
      portalAccountId: account.id,
      organizationId: organization.id,
      createdByAdminId: input.actor.adminId,
      origin: input.origin,
      purpose: "setup",
    })
    if (reset.ok) {
      setupLink = reset.resetLink
      setupLinkExpiresAt = reset.expiresAt
    }
  }

  return {
    ok: true as const,
    organization: await organizationSummary(organization),
    portalAccount: {
      id: account.id,
      email: account.email,
    },
    license: {
      id: license.id,
      licenseId: license.licenseId,
      status: licenseStatus(license.status),
    },
    setupLink,
    setupLinkExpiresAt,
  }
}

export async function updateAdminOrganization(input: {
  actor: AdminSession
  organizationId: number
  profile: AdminOrganizationUpdateInput
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const parsed = parseOrganizationProfile(input.profile)
  if (!parsed.ok) return parsed

  const [existing] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, input.organizationId))
    .limit(1)

  if (!existing) {
    return { ok: false as const, status: 404, message: "Organization not found." }
  }

  const domain = normalizeDomain(parsed.data.domain)
  const [duplicateDomain] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(and(eq(organizations.domain, domain), ne(organizations.id, input.organizationId)))
    .limit(1)

  if (duplicateDomain) {
    return {
      ok: false as const,
      status: 409,
      message: "Another organization already uses that domain.",
    }
  }

  const timestamp = nowIso()
  await db
    .update(organizations)
    .set({
      organizationType: parsed.data.organizationType,
      country: "United States",
      state: parsed.data.state.trim(),
      name: parsed.data.name.trim(),
      email: normalizeEmail(parsed.data.email),
      domain,
      researchField: parsed.data.researchField.trim(),
      updatedAt: timestamp,
    })
    .where(eq(organizations.id, input.organizationId))

  await writeAdminAuditEvent({
    organizationId: input.organizationId,
    actorAdminAccountId: input.actor.adminId,
    eventType: "admin_organization_updated",
    targetType: "organization",
    targetId: String(input.organizationId),
    metadata: { domain },
  })

  return {
    ok: true as const,
    detail: await getAdminOrganization(input.organizationId),
  }
}

export async function setAdminOrganizationStatus(input: {
  actor: AdminSession
  organizationId: number
  status: "active" | "deactivated" | "archived"
  confirmation?: string
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, input.organizationId))
    .limit(1)

  if (!organization) {
    return { ok: false as const, status: 404, message: "Organization not found." }
  }

  if (
    writeAllowed.runtime === "production" &&
    input.status !== "active" &&
    input.confirmation !== organization.domain &&
    input.confirmation !== organization.name
  ) {
    return {
      ok: false as const,
      status: 400,
      message: "Enter the organization domain or name to confirm.",
    }
  }

  const timestamp = nowIso()
  await db
    .update(organizations)
    .set({
      status: input.status,
      deactivatedAt:
        input.status === "deactivated" ? timestamp : organization.deactivatedAt,
      archivedAt: input.status === "archived" ? timestamp : organization.archivedAt,
      updatedAt: timestamp,
    })
    .where(eq(organizations.id, input.organizationId))

  await writeAdminAuditEvent({
    organizationId: input.organizationId,
    actorAdminAccountId: input.actor.adminId,
    eventType: `admin_organization_${input.status}`,
    targetType: "organization",
    targetId: String(input.organizationId),
    metadata: { previousStatus: organization.status, nextStatus: input.status },
  })

  return { ok: true as const, detail: await getAdminOrganization(input.organizationId) }
}

export async function createPortalAccountForOrganization(input: {
  actor: AdminSession
  organizationId: number
  email: string
  createSetupLink: boolean
  origin: string
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const email = normalizeEmail(input.email)
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false as const, status: 400, message: "Enter a valid email." }
  }

  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, input.organizationId))
    .limit(1)
  const [existing] = await db
    .select({ id: portalAccounts.id })
    .from(portalAccounts)
    .where(eq(portalAccounts.email, email))
    .limit(1)

  if (!organization) {
    return { ok: false as const, status: 404, message: "Organization not found." }
  }
  if (existing) {
    return {
      ok: false as const,
      status: 409,
      message: "A portal account already uses that email.",
    }
  }

  const timestamp = nowIso()
  const [account] = await db
    .insert(portalAccounts)
    .values({
      email,
      passwordHash: hashPortalPassword(temporaryPassword()),
      active: true,
      role: "admin",
      mustChangePassword: true,
      setupCompletedAt: null,
      failedLoginCount: 0,
      lockedUntil: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning()

  await db.insert(portalAccountOrganizations).values({
    accountId: account.id,
    organizationId: input.organizationId,
    role: "admin",
    createdAt: timestamp,
  })

  await writeAdminAuditEvent({
    organizationId: input.organizationId,
    actorAdminAccountId: input.actor.adminId,
    eventType: "admin_portal_account_created",
    targetType: "portal_account",
    targetId: String(account.id),
    metadata: { email },
  })

  let setupLink: string | undefined
  let setupLinkExpiresAt: string | undefined
  if (input.createSetupLink) {
    const reset = await createPortalPasswordResetLink({
      portalAccountId: account.id,
      organizationId: input.organizationId,
      createdByAdminId: input.actor.adminId,
      origin: input.origin,
      purpose: "setup",
    })
    if (reset.ok) {
      setupLink = reset.resetLink
      setupLinkExpiresAt = reset.expiresAt
    }
  }

  return {
    ok: true as const,
    account: { id: account.id, email: account.email },
    setupLink,
    setupLinkExpiresAt,
    detail: await getAdminOrganization(input.organizationId),
  }
}

export async function resetPortalAccountPassword(input: {
  actor: AdminSession
  portalAccountId: number
  origin: string
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const [membership] = await db
    .select()
    .from(portalAccountOrganizations)
    .where(eq(portalAccountOrganizations.accountId, input.portalAccountId))
    .limit(1)

  if (!membership) {
    return { ok: false as const, status: 404, message: "Portal account not found." }
  }

  const reset = await createPortalPasswordResetLink({
    portalAccountId: input.portalAccountId,
    organizationId: membership.organizationId,
    createdByAdminId: input.actor.adminId,
    origin: input.origin,
    purpose: "password_reset",
  })

  if (!reset.ok) return reset

  return {
    ok: true as const,
    resetLink: reset.resetLink,
    expiresAt: reset.expiresAt,
    detail: await getAdminOrganization(membership.organizationId),
  }
}

export async function createPortalAccountSetupLink(input: {
  actor: AdminSession
  portalAccountId: number
  origin: string
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const [row] = await db
    .select({
      account: portalAccounts,
      membership: portalAccountOrganizations,
    })
    .from(portalAccountOrganizations)
    .innerJoin(
      portalAccounts,
      eq(portalAccounts.id, portalAccountOrganizations.accountId)
    )
    .where(eq(portalAccountOrganizations.accountId, input.portalAccountId))
    .limit(1)

  if (!row) {
    return { ok: false as const, status: 404, message: "Portal account not found." }
  }

  if (row.account.setupCompletedAt) {
    return {
      ok: false as const,
      status: 409,
      message: "Use reset password after portal setup is complete.",
    }
  }

  const reset = await createPortalPasswordResetLink({
    portalAccountId: input.portalAccountId,
    organizationId: row.membership.organizationId,
    createdByAdminId: input.actor.adminId,
    origin: input.origin,
    purpose: "setup",
  })

  if (!reset.ok) return reset

  return {
    ok: true as const,
    setupLink: reset.resetLink,
    expiresAt: reset.expiresAt,
    detail: await getAdminOrganization(row.membership.organizationId),
  }
}

export async function createAdminLicense(input: {
  actor: AdminSession
  data: AdminLicenseInput
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const parsed = parseLicenseInput(input.data)
  if (!parsed.ok) return parsed

  const licenseId = parsed.data.generateLicenseId
    ? generateLicenseId()
    : parsed.data.licenseId?.trim() || generateLicenseId()
  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, parsed.data.organizationId))
    .limit(1)
  const [existing] = await db
    .select({ id: licenses.id })
    .from(licenses)
    .where(eq(licenses.licenseId, licenseId))
    .limit(1)

  if (!organization) {
    return { ok: false as const, status: 404, message: "Organization not found." }
  }
  if (existing) {
    return {
      ok: false as const,
      status: 409,
      message: "A license already uses that license ID.",
    }
  }

  const timestamp = nowIso()
  const [license] = await db
    .insert(licenses)
    .values({
      licenseId,
      organizationId: organization.id,
      status: parsed.data.status,
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
      seatLimit: parsed.data.seatLimit,
      label: parsed.data.label.trim(),
      signedBundleVersion: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning()

  await writeAdminAuditEvent({
    organizationId: organization.id,
    actorAdminAccountId: input.actor.adminId,
    eventType: "admin_license_created",
    targetType: "license",
    targetId: license.licenseId,
    metadata: { seatLimit: license.seatLimit, status: license.status },
  })

  return {
    ok: true as const,
    license,
    detail: await getAdminOrganization(organization.id),
  }
}

export async function updateAdminLicense(input: {
  actor: AdminSession
  licenseId: string
  patch: {
    label: string
    startsAt: string
    endsAt: string
    seatLimit: number
    status: "active" | "inactive"
    confirmation?: string
  }
}) {
  const writeAllowed = assertAdminWriteAllowed()
  if (!writeAllowed.ok) return writeAllowed

  const parsed = parseLicensePatch(input.patch)
  if (!parsed.ok) return parsed

  const [license] = await db
    .select()
    .from(licenses)
    .where(eq(licenses.licenseId, input.licenseId))
    .limit(1)

  if (!license) {
    return { ok: false as const, status: 404, message: "License not found." }
  }

  const seatRows = await db
    .select({ status: seats.status })
    .from(seats)
    .where(eq(seats.licenseId, license.id))
  const allocated = allocatedSeatCount(seatRows)

  if (parsed.data.seatLimit < allocated) {
    return {
      ok: false as const,
      status: 409,
      message: "Seat limit cannot be lower than active and invited seats.",
    }
  }

  if (
    writeAllowed.runtime === "production" &&
    license.status === "active" &&
    parsed.data.status === "inactive" &&
    parsed.data.confirmation !== license.licenseId
  ) {
    return {
      ok: false as const,
      status: 400,
      message: "Enter the license ID to confirm deactivation.",
    }
  }

  const timestamp = nowIso()
  await db
    .update(licenses)
    .set({
      label: parsed.data.label.trim(),
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
      seatLimit: parsed.data.seatLimit,
      status: parsed.data.status,
      updatedAt: timestamp,
    })
    .where(eq(licenses.id, license.id))

  await writeAdminAuditEvent({
    organizationId: license.organizationId,
    actorAdminAccountId: input.actor.adminId,
    eventType: "admin_license_updated",
    targetType: "license",
    targetId: license.licenseId,
    metadata: {
      previousStatus: license.status,
      nextStatus: parsed.data.status,
      previousSeatLimit: license.seatLimit,
      nextSeatLimit: parsed.data.seatLimit,
    },
  })

  return {
    ok: true as const,
    detail: await getAdminOrganization(license.organizationId),
  }
}

export async function renewAdminLicense(input: {
  actor: AdminSession
  licenseId: string
  renewal: {
    licenseId?: string
    generateLicenseId?: boolean
    label: string
    startsAt: string
    endsAt: string
    seatLimit: number
  }
}) {
  const [license] = await db
    .select()
    .from(licenses)
    .where(eq(licenses.licenseId, input.licenseId))
    .limit(1)

  if (!license) {
    return { ok: false as const, status: 404, message: "License not found." }
  }

  await db
    .update(licenses)
    .set({ status: "inactive", updatedAt: nowIso() })
    .where(eq(licenses.id, license.id))

  return createAdminLicense({
    actor: input.actor,
    data: {
      organizationId: license.organizationId,
      licenseId: input.renewal.licenseId,
      generateLicenseId: input.renewal.generateLicenseId,
      label: input.renewal.label,
      startsAt: input.renewal.startsAt,
      endsAt: input.renewal.endsAt,
      seatLimit: input.renewal.seatLimit,
      status: "active",
    },
  })
}

export async function listAdminAuditEvents() {
  const rows = await db
    .select()
    .from(auditEvents)
    .orderBy(desc(auditEvents.createdAt))
    .limit(100)

  return rows.map((event) => ({
    id: event.id,
    organizationId: event.organizationId,
    actorType: event.actorType,
    actorAdminAccountId: event.actorAdminAccountId,
    actorAccountId: event.actorAccountId,
    eventType: event.eventType,
    targetType: event.targetType,
    targetId: event.targetId,
    metadataJson: event.metadataJson,
    createdAt: event.createdAt,
  }))
}

async function findOnboardingDuplicate(input: {
  domain: string
  accountEmail: string
  licenseId: string
}) {
  const [organization] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.domain, input.domain))
    .limit(1)
  if (organization) {
    return {
      ok: false as const,
      status: 409,
      message: "An organization already uses that domain.",
    }
  }

  const [account] = await db
    .select({ id: portalAccounts.id })
    .from(portalAccounts)
    .where(eq(portalAccounts.email, input.accountEmail))
    .limit(1)
  if (account) {
    return {
      ok: false as const,
      status: 409,
      message: "A portal account already uses that email.",
    }
  }

  const [license] = await db
    .select({ id: licenses.id })
    .from(licenses)
    .where(eq(licenses.licenseId, input.licenseId))
    .limit(1)
  if (license) {
    return {
      ok: false as const,
      status: 409,
      message: "A license already uses that license ID.",
    }
  }

  return null
}

export function parseCreateOrganizationBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, status: 400, message: "Enter valid organization details." }
  }
  return parseCreateOrganizationInput(body as AdminCreateOrganizationInput)
}

function parseCreateOrganizationInput(input: AdminCreateOrganizationInput) {
  const organization = parseOrganizationProfile(input.organization)
  if (!organization.ok) return organization

  const oneYearEndsAt = addOneYear(input.license?.startsAt ?? "")
  const license = parseLicensePatch({
    ...input.license,
    endsAt: oneYearEndsAt,
  })
  if (!license.ok) return license

  return {
    ok: true as const,
    data: {
      organization: organization.data,
      portalAccount: {
        email: organization.data.email,
        createSetupLink: Boolean(input.portalAccount?.createSetupLink),
      },
      license: {
        ...license.data,
        licenseId: input.license.licenseId,
        generateLicenseId: Boolean(input.license.generateLicenseId),
      },
    },
  }
}

export function parseOrganizationProfileBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, status: 400, message: "Enter valid organization details." }
  }
  return parseOrganizationProfile(body as AdminOrganizationUpdateInput)
}

function parseOrganizationProfile(input: AdminOrganizationUpdateInput) {
  const domain = normalizeDomain(input.domain ?? "")
  const email = normalizeEmail(input.email ?? "")

  if (input.country !== "United States") {
    return { ok: false as const, status: 400, message: "Select a supported country." }
  }
  if (!input.state?.trim()) {
    return { ok: false as const, status: 400, message: "Select a state." }
  }
  if (!input.name?.trim()) {
    return { ok: false as const, status: 400, message: "Enter the organization name." }
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false as const, status: 400, message: "Enter a valid organization email." }
  }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
    return { ok: false as const, status: 400, message: "Enter a valid organization domain." }
  }
  if (!ORGANIZATION_TYPES.has(input.organizationType)) {
    return { ok: false as const, status: 400, message: "Select an edition." }
  }
  if (!input.researchField?.trim()) {
    return { ok: false as const, status: 400, message: "Enter the research field." }
  }

  return {
    ok: true as const,
    data: {
      country: "United States" as const,
      state: input.state,
      name: input.name,
      email,
      domain,
      organizationType: input.organizationType,
      researchField: input.researchField,
    },
  }
}

export function parseLicenseBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, status: 400, message: "Enter valid license details." }
  }
  return parseLicenseInput(body as AdminLicenseInput)
}

function parseLicenseInput(input: AdminLicenseInput) {
  if (!Number.isInteger(input.organizationId) || input.organizationId <= 0) {
    return { ok: false as const, status: 400, message: "Select an organization." }
  }
  const patch = parseLicensePatch(input)
  if (!patch.ok) return patch
  if (input.licenseId?.trim() && !SAFE_ID_PATTERN.test(input.licenseId.trim())) {
    return { ok: false as const, status: 400, message: "Enter a valid license ID." }
  }
  return {
    ok: true as const,
    data: {
      ...patch.data,
      organizationId: input.organizationId,
      licenseId: input.licenseId,
      generateLicenseId: Boolean(input.generateLicenseId),
    },
  }
}

export function parseLicensePatchBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, status: 400, message: "Enter valid license details." }
  }
  return parseLicensePatch(body as AdminLicenseInput & { confirmation?: string })
}

function parseLicensePatch(input: {
  label: string
  startsAt: string
  endsAt: string
  seatLimit: number
  status: "active" | "inactive"
  confirmation?: string
}) {
  if (
    !input.label?.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.startsAt ?? "") ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.endsAt ?? "") ||
    input.endsAt < input.startsAt ||
    !Number.isInteger(input.seatLimit) ||
    input.seatLimit <= 0 ||
    !LICENSE_STATUSES.has(input.status)
  ) {
    return { ok: false as const, status: 400, message: "Enter valid license details." }
  }

  return {
    ok: true as const,
    data: {
      label: input.label,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      seatLimit: input.seatLimit,
      status: input.status,
      confirmation: input.confirmation,
    },
  }
}

export function parsePortalAccountBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, status: 400, message: "Enter a valid email." }
  }

  const email = "email" in body ? normalizeEmail(String(body.email ?? "")) : ""
  const createSetupLink =
    "createSetupLink" in body ? Boolean(body.createSetupLink) : true

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false as const, status: 400, message: "Enter a valid email." }
  }

  return { ok: true as const, data: { email, createSetupLink } }
}

export function parseStatusBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: true as const, confirmation: undefined }
  }

  const confirmation =
    "confirmation" in body ? String(body.confirmation ?? "") : undefined

  return { ok: true as const, confirmation }
}

export function parseNumericId(value: string) {
  const id = Number.parseInt(value, 10)
  return Number.isInteger(id) && id > 0 ? id : null
}

export function parsePublicLicenseId(value: string) {
  return SAFE_ID_PATTERN.test(value) ? value : null
}
