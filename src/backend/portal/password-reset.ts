import { createHash, randomBytes } from "node:crypto"

import { and, eq, isNull } from "drizzle-orm"

import { db } from "@/backend/portal/db"
import {
  auditEvents,
  organizations,
  portalAccountOrganizations,
  portalAccountResetTokens,
  portalAccounts,
} from "@/backend/portal/schema"
import {
  hashPortalPassword,
  normalizeEmail,
} from "@/backend/portal/auth"

const RESET_TOKEN_TTL_HOURS = 24

function nowIso() {
  return new Date().toISOString()
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("base64url")
}

function normalizeOrigin(origin: string) {
  return origin.replace(/\/$/, "")
}

export async function createPortalPasswordResetLink(input: {
  portalAccountId: number
  organizationId: number
  createdByAdminId: number
  origin: string
  purpose: "setup" | "password_reset"
}) {
  const [account] = await db
    .select({ id: portalAccounts.id, email: portalAccounts.email })
    .from(portalAccounts)
    .innerJoin(
      portalAccountOrganizations,
      eq(portalAccountOrganizations.accountId, portalAccounts.id)
    )
    .where(
      and(
        eq(portalAccounts.id, input.portalAccountId),
        eq(portalAccountOrganizations.organizationId, input.organizationId)
      )
    )
    .limit(1)

  if (!account) {
    return { ok: false as const, status: 404, message: "Portal account not found." }
  }

  const token = randomBytes(32).toString("base64url")
  const createdAt = nowIso()
  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000
  ).toISOString()

  await db.insert(portalAccountResetTokens).values({
    portalAccountId: account.id,
    organizationId: input.organizationId,
    tokenHash: hashToken(token),
    purpose: input.purpose,
    expiresAt,
    usedAt: null,
    createdByAdminId: input.createdByAdminId,
    createdAt,
  })

  await db
    .update(portalAccounts)
    .set({
      mustChangePassword: true,
      updatedAt: createdAt,
    })
    .where(eq(portalAccounts.id, account.id))

  await db.insert(auditEvents).values({
    organizationId: input.organizationId,
    actorAccountId: null,
    actorSeatId: null,
    actorAdminAccountId: input.createdByAdminId,
    actorType: "admin_account",
    eventType:
      input.purpose === "setup"
        ? "portal_account_setup_link_created"
        : "portal_account_password_reset_created",
    targetType: "portal_account",
    targetId: String(account.id),
    metadataJson: JSON.stringify({ email: account.email }),
    createdAt,
  })

  return {
    ok: true as const,
    account,
    expiresAt,
    resetLink: `${normalizeOrigin(input.origin)}/portal/reset-password/${token}`,
  }
}

export async function completePortalPasswordReset(input: {
  token: string
  newPassword: string
  confirmPassword: string
}) {
  if (
    !input.token.trim() ||
    input.newPassword.length < 10 ||
    input.newPassword !== input.confirmPassword
  ) {
    return { ok: false as const, status: 400, message: "Password reset is unavailable." }
  }

  const tokenHash = hashToken(input.token)
  const [row] = await db
    .select({
      token: portalAccountResetTokens,
      account: portalAccounts,
      organization: organizations,
    })
    .from(portalAccountResetTokens)
    .innerJoin(
      portalAccounts,
      eq(portalAccounts.id, portalAccountResetTokens.portalAccountId)
    )
    .innerJoin(
      organizations,
      eq(organizations.id, portalAccountResetTokens.organizationId)
    )
    .where(
      and(
        eq(portalAccountResetTokens.tokenHash, tokenHash),
        isNull(portalAccountResetTokens.usedAt)
      )
    )
    .limit(1)

  if (
    !row ||
    !row.account.active ||
    row.organization.status !== "active" ||
    Date.parse(row.token.expiresAt) <= Date.now()
  ) {
    return { ok: false as const, status: 400, message: "Password reset is unavailable." }
  }

  const timestamp = nowIso()

  await db
    .update(portalAccounts)
    .set({
      passwordHash: hashPortalPassword(input.newPassword),
      mustChangePassword: false,
      setupCompletedAt: row.account.setupCompletedAt ?? timestamp,
      failedLoginCount: 0,
      lockedUntil: null,
      updatedAt: timestamp,
    })
    .where(eq(portalAccounts.id, row.account.id))

  await db
    .update(portalAccountResetTokens)
    .set({ usedAt: timestamp })
    .where(eq(portalAccountResetTokens.id, row.token.id))

  await db.insert(auditEvents).values({
    organizationId: row.organization.id,
    actorAccountId: row.account.id,
    actorSeatId: null,
    actorAdminAccountId: null,
    actorType: "portal_account",
    eventType: "portal_password_reset_completed",
    targetType: "portal_account",
    targetId: String(row.account.id),
    metadataJson: JSON.stringify({ email: normalizeEmail(row.account.email) }),
    createdAt: timestamp,
  })

  return { ok: true as const, changed: true as const }
}

export function parsePortalPasswordResetBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const }
  }

  const newPassword = "newPassword" in body ? String(body.newPassword ?? "") : ""
  const confirmPassword =
    "confirmPassword" in body ? String(body.confirmPassword ?? "") : ""

  if (newPassword.length < 10 || newPassword !== confirmPassword) {
    return { ok: false as const }
  }

  return { ok: true as const, data: { newPassword, confirmPassword } }
}
