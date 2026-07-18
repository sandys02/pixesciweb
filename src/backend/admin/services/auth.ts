import { createHash, randomBytes } from "node:crypto"

import { and, eq, isNull } from "drizzle-orm"
import { SignJWT, jwtVerify } from "jose"

import { getEmailLinkOrigin } from "@/backend/email/link-origin"
import { sendPasswordResetEmail } from "@/backend/email/resend"
import { db } from "@/backend/portal/db"
import {
  adminAccountResetTokens,
  adminAccounts,
  auditEvents,
  type AdminAccount,
} from "@/backend/portal/schema"
import {
  hashPortalPassword,
  jsonResponse,
  normalizeEmail,
  verifyPortalPassword,
} from "@/backend/portal/auth"
import { getRuntimeEnvironment } from "@/backend/admin/environment"

export const ADMIN_SESSION_COOKIE = "pixesci_admin_session"

export const ADMIN_MESSAGES = {
  invalidCredentials: "Invalid email or password.",
  sessionExpired: "Admin access expired. Sign in again.",
  forbidden: "You are not authorized to perform this admin action.",
  malformedInput: "Enter valid admin details.",
  unavailable: "Admin is temporarily unavailable.",
  productionConfirmationRequired: "Production action confirmation is required.",
} as const

const LOGIN_LOCK_THRESHOLD = 5
const LOGIN_LOCK_MINUTES = 15
const ADMIN_RESET_TOKEN_TTL_HOURS = 24
const ADMIN_ROLES = new Set(["owner", "admin", "support"])

export type AdminRole = "owner" | "admin" | "support"

export type AdminSession = {
  adminId: number
  email: string
  role: AdminRole
}

type AdminSessionClaims = {
  adminId: number
  email: string
  role: AdminRole
}

function nowIso() {
  return new Date().toISOString()
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("base64url")
}

function isAdminRole(value: string): value is AdminRole {
  return ADMIN_ROLES.has(value)
}

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET

  if (secret && secret.length >= 32) {
    return secret
  }

  if (process.env.NODE_ENV === "development") {
    return "development-only-admin-session-secret-32chars"
  }

  throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.")
}

export function getAdminSessionTtlSeconds() {
  const value = Number.parseInt(process.env.ADMIN_SESSION_TTL_SECONDS ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : 20 * 60
}

export function getAdminSessionCookieOptions(maxAgeSeconds: number) {
  const runtime = getRuntimeEnvironment()

  return {
    httpOnly: true,
    secure:
      runtime === "production" ||
      process.env.VERCEL_ENV === "production" ||
      process.env.VERCEL_ENV === "preview",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  }
}

async function signAdminSession(claims: AdminSessionClaims) {
  const secret = new TextEncoder().encode(getAdminSessionSecret())

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${getAdminSessionTtlSeconds()}s`)
    .sign(secret)
}

async function readAdminSessionToken(token: string | undefined) {
  if (!token) return null

  try {
    const secret = new TextEncoder().encode(getAdminSessionSecret())
    const { payload } = await jwtVerify(token, secret)
    const adminId = payload.adminId
    const email = payload.email
    const role = payload.role

    if (
      typeof adminId !== "number" ||
      typeof email !== "string" ||
      typeof role !== "string" ||
      !isAdminRole(role)
    ) {
      return null
    }

    return { adminId, email, role }
  } catch {
    return null
  }
}

async function findAdminByEmail(email: string) {
  const [account] = await db
    .select()
    .from(adminAccounts)
    .where(eq(adminAccounts.email, normalizeEmail(email)))
    .limit(1)

  return account ?? null
}

async function lockFailedLogin(account: AdminAccount) {
  const nextCount = account.failedLoginCount + 1
  const lockedUntil =
    nextCount >= LOGIN_LOCK_THRESHOLD
      ? new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000).toISOString()
      : null

  await db
    .update(adminAccounts)
    .set({
      failedLoginCount: nextCount,
      lockedUntil,
      updatedAt: nowIso(),
    })
    .where(eq(adminAccounts.id, account.id))
}

async function clearFailedLogin(accountId: number) {
  const timestamp = nowIso()

  await db
    .update(adminAccounts)
    .set({
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: timestamp,
      updatedAt: timestamp,
    })
    .where(eq(adminAccounts.id, accountId))
}

export async function writeAdminAuditEvent(input: {
  organizationId?: number | null
  actorAdminAccountId: number | null
  eventType: string
  targetType: string
  targetId: string
  metadata?: Record<string, unknown>
}) {
  await db.insert(auditEvents).values({
    organizationId: input.organizationId ?? null,
    actorAccountId: null,
    actorSeatId: null,
    actorAdminAccountId: input.actorAdminAccountId,
    actorType: input.actorAdminAccountId ? "admin_account" : "system",
    eventType: input.eventType,
    targetType: input.targetType,
    targetId: input.targetId,
    metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: nowIso(),
  })
}

export async function loginAdminAccount(email: string, password: string) {
  const account = await findAdminByEmail(email)

  if (!account?.active || !isAdminRole(account.role)) {
    return { ok: false as const, message: ADMIN_MESSAGES.invalidCredentials }
  }

  const lockedUntilMs = account.lockedUntil
    ? Date.parse(account.lockedUntil)
    : Number.NaN
  const locked = Number.isFinite(lockedUntilMs) && lockedUntilMs > Date.now()

  if (locked || !verifyPortalPassword(password, account.passwordHash)) {
    await lockFailedLogin(account)
    return { ok: false as const, message: ADMIN_MESSAGES.invalidCredentials }
  }

  await clearFailedLogin(account.id)
  await writeAdminAuditEvent({
    actorAdminAccountId: account.id,
    eventType: "admin_login_succeeded",
    targetType: "admin_account",
    targetId: String(account.id),
    metadata: { email: account.email, role: account.role },
  })

  const token = await signAdminSession({
    adminId: account.id,
    email: account.email,
    role: account.role,
  })

  return {
    ok: true as const,
    email: account.email,
    role: account.role as AdminRole,
    token,
  }
}

export async function requireAdminSession(
  token: string | undefined,
  allowedRoles: AdminRole[] = ["owner", "admin", "support"]
) {
  const claims = await readAdminSessionToken(token)

  if (!claims) {
    return {
      ok: false as const,
      message: ADMIN_MESSAGES.sessionExpired,
      status: 401,
    }
  }

  const [account] = await db
    .select()
    .from(adminAccounts)
    .where(and(eq(adminAccounts.id, claims.adminId), eq(adminAccounts.active, true)))
    .limit(1)

  if (!account || !isAdminRole(account.role)) {
    return {
      ok: false as const,
      message: ADMIN_MESSAGES.sessionExpired,
      status: 401,
    }
  }

  if (!allowedRoles.includes(account.role)) {
    return {
      ok: false as const,
      message: ADMIN_MESSAGES.forbidden,
      status: 403,
    }
  }

  return {
    ok: true as const,
    user: {
      adminId: account.id,
      email: account.email,
      role: account.role,
    },
  }
}

export async function getAdminAuthState(token: string | undefined) {
  const session = await requireAdminSession(token)

  if (!session.ok) {
    return { authenticated: false as const }
  }

  return {
    authenticated: true as const,
    adminEmail: session.user.email,
    role: session.user.role,
  }
}

export function parseAdminLoginBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, message: ADMIN_MESSAGES.malformedInput }
  }

  const email = "email" in body ? String(body.email ?? "") : ""
  const password = "password" in body ? String(body.password ?? "") : ""

  if (!email.includes("@") || password.length < 8) {
    return { ok: false as const, message: ADMIN_MESSAGES.malformedInput }
  }

  return { ok: true as const, email, password }
}

export async function requestAdminPasswordResetEmail(input: {
  email: string
  origin: string
}) {
  const account = await findAdminByEmail(input.email)

  if (!account?.active || !isAdminRole(account.role)) {
    return { ok: true as const, emailStatus: "skipped" as const }
  }

  const token = randomBytes(32).toString("base64url")
  const createdAt = nowIso()
  const expiresAt = new Date(
    Date.now() + ADMIN_RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000
  ).toISOString()

  await db.insert(adminAccountResetTokens).values({
    adminAccountId: account.id,
    tokenHash: hashToken(token),
    purpose: "password_reset",
    expiresAt,
    usedAt: null,
    createdByAdminId: null,
    createdAt,
  })

  await writeAdminAuditEvent({
    actorAdminAccountId: null,
    eventType: "admin_password_reset_requested",
    targetType: "admin_account",
    targetId: String(account.id),
    metadata: { email: account.email },
  })

  const emailResult = await sendPasswordResetEmail({
    to: account.email,
    resetLink: `${getEmailLinkOrigin(input.origin)}/admin/reset-password/${token}`,
    expiresAt,
    surface: "staff admin",
  })

  return { ok: true as const, emailStatus: emailResult.status }
}

export async function isAdminPasswordResetTokenAvailable(token: string) {
  if (!token.trim()) return false

  const tokenHash = hashToken(token)
  const [row] = await db
    .select({
      token: adminAccountResetTokens,
      account: adminAccounts,
    })
    .from(adminAccountResetTokens)
    .innerJoin(
      adminAccounts,
      eq(adminAccounts.id, adminAccountResetTokens.adminAccountId)
    )
    .where(
      and(
        eq(adminAccountResetTokens.tokenHash, tokenHash),
        isNull(adminAccountResetTokens.usedAt)
      )
    )
    .limit(1)

  return Boolean(
    row &&
      row.account.active &&
      isAdminRole(row.account.role) &&
      Date.parse(row.token.expiresAt) > Date.now()
  )
}

export async function completeAdminPasswordReset(input: {
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
      token: adminAccountResetTokens,
      account: adminAccounts,
    })
    .from(adminAccountResetTokens)
    .innerJoin(
      adminAccounts,
      eq(adminAccounts.id, adminAccountResetTokens.adminAccountId)
    )
    .where(
      and(
        eq(adminAccountResetTokens.tokenHash, tokenHash),
        isNull(adminAccountResetTokens.usedAt)
      )
    )
    .limit(1)

  if (
    !row ||
    !row.account.active ||
    !isAdminRole(row.account.role) ||
    Date.parse(row.token.expiresAt) <= Date.now()
  ) {
    return { ok: false as const, status: 400, message: "Password reset is unavailable." }
  }

  const timestamp = nowIso()

  await db
    .update(adminAccounts)
    .set({
      passwordHash: hashAdminPassword(input.newPassword),
      mustChangePassword: false,
      failedLoginCount: 0,
      lockedUntil: null,
      updatedAt: timestamp,
    })
    .where(eq(adminAccounts.id, row.account.id))

  await db
    .update(adminAccountResetTokens)
    .set({ usedAt: timestamp })
    .where(eq(adminAccountResetTokens.id, row.token.id))

  await writeAdminAuditEvent({
    actorAdminAccountId: row.account.id,
    eventType: "admin_password_reset_completed",
    targetType: "admin_account",
    targetId: String(row.account.id),
    metadata: { email: row.account.email },
  })

  return { ok: true as const, changed: true as const }
}

export function parseAdminPasswordResetBody(body: unknown) {
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

export function hashAdminPassword(password: string) {
  return hashPortalPassword(password)
}

export { jsonResponse }
