import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

import { and, eq } from "drizzle-orm"
import { SignJWT, jwtVerify } from "jose"

import { db } from "@/backend/portal/db"
import {
  auditEvents,
  organizations,
  portalAccountOrganizations,
  portalAccounts,
} from "@/backend/portal/schema"

export const PORTAL_SESSION_COOKIE = "pixesci_portal_session"

export const PORTAL_MESSAGES = {
  invalidCredentials: "Invalid email or password.",
  sessionExpired: "Portal access expired. Sign in again.",
  unavailable: "The portal is temporarily unavailable.",
  malformedInput: "Enter valid portal account details.",
  setupRequired: "Complete Account Setup before continuing.",
  forbidden: "You are not authorized to perform this portal action.",
} as const

const LOGIN_LOCK_THRESHOLD = 5
const LOGIN_LOCK_MINUTES = 15
type PortalSessionClaims = {
  accountId: number
  organizationId: number
  email: string
}

export type PortalSession = PortalSessionClaims & {
  setupRequired: boolean
  role: string
}

export type AccountSetupInput = {
  newPassword: string
  confirmPassword: string
}

export type PasswordChangeInput = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
}

function nowIso() {
  return new Date().toISOString()
}

function getSessionSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET

  if (secret && secret.length >= 32) {
    return secret
  }

  if (process.env.NODE_ENV === "development") {
    return "development-only-portal-session-secret-32chars"
  }

  throw new Error("PORTAL_SESSION_SECRET must be at least 32 characters.")
}

export function getPortalSessionTtlSeconds() {
  const value = Number.parseInt(process.env.PORTAL_SESSION_TTL_SECONDS ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : 20 * 60
}

export function getPortalSessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  }
}

export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  })
}

export function logPortalRouteError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : ""
  const normalizedMessage = message.toLowerCase()
  const errorCode =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : undefined
  const code = message.includes("PORTAL_SESSION_SECRET")
    ? "missing_session_secret"
    : normalizedMessage.includes("no such table")
      ? "missing_portal_schema"
      : normalizedMessage.includes("sqlite") ||
          normalizedMessage.includes("libsql") ||
          normalizedMessage.includes("readonly") ||
          errorCode?.startsWith("SQLITE")
        ? "portal_database_error"
        : "unexpected_portal_error"

  console.error(`[portal] ${context} failed`, { code, errorCode })
}

export function hashPortalPassword(password: string) {
  const salt = randomBytes(16).toString("base64")
  const hash = scryptSync(password, salt, 64).toString("base64")
  return `scrypt$${salt}$${hash}`
}

export function verifyPortalPassword(password: string, encodedHash: string) {
  const [algorithm, salt, hash] = encodedHash.split("$")

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false
  }

  const expected = Buffer.from(hash, "base64")
  const actual = scryptSync(password, salt, expected.length)

  if (expected.length !== actual.length) {
    return false
  }

  return timingSafeEqual(expected, actual)
}

async function signPortalSession(claims: PortalSessionClaims) {
  const secret = new TextEncoder().encode(getSessionSecret())

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${getPortalSessionTtlSeconds()}s`)
    .sign(secret)
}

async function readPortalSessionToken(token: string | undefined) {
  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(getSessionSecret())
    const { payload } = await jwtVerify(token, secret)
    const accountId = payload.accountId
    const organizationId = payload.organizationId
    const email = payload.email

    if (
      typeof accountId !== "number" ||
      typeof organizationId !== "number" ||
      typeof email !== "string"
    ) {
      return null
    }

    return { accountId, organizationId, email }
  } catch {
    return null
  }
}

function setupRequired(account: {
  mustChangePassword: boolean
  setupCompletedAt: string | null
}) {
  return account.mustChangePassword || !account.setupCompletedAt
}

async function findPortalAccountWithOrganization(email: string) {
  const normalizedEmail = normalizeEmail(email)
  const rows = await db
    .select({
      account: portalAccounts,
      organizationId: portalAccountOrganizations.organizationId,
      organizationRole: portalAccountOrganizations.role,
      organizationStatus: organizations.status,
    })
    .from(portalAccounts)
    .innerJoin(
      portalAccountOrganizations,
      eq(portalAccountOrganizations.accountId, portalAccounts.id)
    )
    .innerJoin(
      organizations,
      eq(organizations.id, portalAccountOrganizations.organizationId)
    )
    .where(eq(portalAccounts.email, normalizedEmail))
    .limit(1)

  return rows[0] ?? null
}

async function lockFailedLogin(accountId: number, failedLoginCount: number) {
  const nextCount = failedLoginCount + 1
  const lockedUntil =
    nextCount >= LOGIN_LOCK_THRESHOLD
      ? new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000).toISOString()
      : null

  await db
    .update(portalAccounts)
    .set({
      failedLoginCount: nextCount,
      lockedUntil,
      updatedAt: nowIso(),
    })
    .where(eq(portalAccounts.id, accountId))
}

async function clearFailedLogin(accountId: number) {
  await db
    .update(portalAccounts)
    .set({
      failedLoginCount: 0,
      lockedUntil: null,
      updatedAt: nowIso(),
    })
    .where(eq(portalAccounts.id, accountId))
}

export async function writePortalAuditEvent(input: {
  organizationId: number | null
  actorAccountId: number | null
  actorSeatId?: number | null
  eventType: string
  targetType: string
  targetId: string
  metadata?: Record<string, unknown>
}) {
  await db.insert(auditEvents).values({
    organizationId: input.organizationId,
    actorAccountId: input.actorAccountId,
    actorSeatId: input.actorSeatId ?? null,
    eventType: input.eventType,
    targetType: input.targetType,
    targetId: input.targetId,
    metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: nowIso(),
  })
}

export async function loginPortalAccount(email: string, password: string) {
  const row = await findPortalAccountWithOrganization(email)

  if (!row?.account.active || row.organizationStatus !== "active") {
    return { ok: false as const, message: PORTAL_MESSAGES.invalidCredentials }
  }

  const lockedUntilMs = row.account.lockedUntil
    ? Date.parse(row.account.lockedUntil)
    : Number.NaN
  const locked = Number.isFinite(lockedUntilMs) && lockedUntilMs > Date.now()

  if (locked || !verifyPortalPassword(password, row.account.passwordHash)) {
    await lockFailedLogin(row.account.id, row.account.failedLoginCount)
    return { ok: false as const, message: PORTAL_MESSAGES.invalidCredentials }
  }

  await clearFailedLogin(row.account.id)
  await writePortalAuditEvent({
    organizationId: row.organizationId,
    actorAccountId: row.account.id,
    eventType: "portal_login_succeeded",
    targetType: "portal_account",
    targetId: String(row.account.id),
    metadata: { email: row.account.email },
  })

  const token = await signPortalSession({
    accountId: row.account.id,
    organizationId: row.organizationId,
    email: row.account.email,
  })

  return {
    ok: true as const,
    email: row.account.email,
    setupRequired: setupRequired(row.account),
    token,
  }
}

export async function getPortalAuthState(token: string | undefined) {
  const session = await requirePortalSession(token)

  if (!session.ok) {
    return { authenticated: false as const }
  }

  return {
    authenticated: true as const,
    userEmail: session.user.email,
    setupRequired: session.user.setupRequired,
  }
}

export async function requirePortalSession(token: string | undefined) {
  const claims = await readPortalSessionToken(token)

  if (!claims) {
    return {
      ok: false as const,
      message: PORTAL_MESSAGES.sessionExpired,
      status: 401,
    }
  }

  const rows = await db
    .select({
      account: portalAccounts,
      organizationId: portalAccountOrganizations.organizationId,
      organizationRole: portalAccountOrganizations.role,
      organizationStatus: organizations.status,
    })
    .from(portalAccounts)
    .innerJoin(
      portalAccountOrganizations,
      eq(portalAccountOrganizations.accountId, portalAccounts.id)
    )
    .innerJoin(
      organizations,
      eq(organizations.id, portalAccountOrganizations.organizationId)
    )
    .where(
      and(
        eq(portalAccounts.id, claims.accountId),
        eq(portalAccountOrganizations.organizationId, claims.organizationId)
      )
    )
    .limit(1)
  const row = rows[0]

  if (!row?.account.active || row.organizationStatus !== "active") {
    return {
      ok: false as const,
      message: PORTAL_MESSAGES.sessionExpired,
      status: 401,
    }
  }

  return {
    ok: true as const,
    user: {
      accountId: row.account.id,
      organizationId: row.organizationId,
      email: row.account.email,
      role: row.organizationRole,
      setupRequired: setupRequired(row.account),
    },
  }
}

export async function requireCompletedPortalSession(token: string | undefined) {
  const session = await requirePortalSession(token)

  if (!session.ok) {
    return session
  }

  if (session.user.setupRequired) {
    return {
      ok: false as const,
      message: PORTAL_MESSAGES.setupRequired,
      status: 403,
    }
  }

  return session
}

export async function getPortalOrganization(organizationId: number) {
  const rows = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1)

  return rows[0] ?? null
}

export async function completePortalAccountSetup(
  session: PortalSession,
  input: AccountSetupInput
) {
  const timestamp = nowIso()

  await db
    .update(portalAccounts)
    .set({
      passwordHash: hashPortalPassword(input.newPassword),
      mustChangePassword: false,
      setupCompletedAt: timestamp,
      failedLoginCount: 0,
      lockedUntil: null,
      updatedAt: timestamp,
    })
    .where(eq(portalAccounts.id, session.accountId))

  await writePortalAuditEvent({
    organizationId: session.organizationId,
    actorAccountId: session.accountId,
    eventType: "account_setup_completed",
    targetType: "portal_account",
    targetId: String(session.accountId),
    metadata: { setupMode: "password_only" },
  })

  return { setupComplete: true as const }
}

export async function changePortalPassword(
  session: PortalSession,
  input: PasswordChangeInput
) {
  const rows = await db
    .select()
    .from(portalAccounts)
    .where(eq(portalAccounts.id, session.accountId))
    .limit(1)
  const account = rows[0]

  if (!account?.active || !verifyPortalPassword(input.currentPassword, account.passwordHash)) {
    return { ok: false as const, message: "Current password is incorrect." }
  }

  await db
    .update(portalAccounts)
    .set({
      passwordHash: hashPortalPassword(input.newPassword),
      updatedAt: nowIso(),
    })
    .where(eq(portalAccounts.id, session.accountId))

  await writePortalAuditEvent({
    organizationId: session.organizationId,
    actorAccountId: session.accountId,
    eventType: "portal_password_changed",
    targetType: "portal_account",
    targetId: String(session.accountId),
  })

  return { ok: true as const, changed: true as const }
}

export function parseLoginBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, message: PORTAL_MESSAGES.malformedInput }
  }

  const email = "email" in body ? String(body.email ?? "") : ""
  const password = "password" in body ? String(body.password ?? "") : ""

  if (!email.includes("@") || password.length < 8) {
    return { ok: false as const, message: PORTAL_MESSAGES.malformedInput }
  }

  return { ok: true as const, email, password }
}

export function parseAccountSetupBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, message: PORTAL_MESSAGES.malformedInput }
  }

  const newPassword = "newPassword" in body ? String(body.newPassword ?? "") : ""
  const confirmPassword =
    "confirmPassword" in body ? String(body.confirmPassword ?? "") : ""

  if (newPassword.length < 10 || newPassword !== confirmPassword) {
    return { ok: false as const, message: PORTAL_MESSAGES.malformedInput }
  }

  return {
    ok: true as const,
    data: {
      newPassword,
      confirmPassword,
    },
  }
}

export function parsePasswordChangeBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, message: PORTAL_MESSAGES.malformedInput }
  }

  const currentPassword =
    "currentPassword" in body ? String(body.currentPassword ?? "") : ""
  const newPassword = "newPassword" in body ? String(body.newPassword ?? "") : ""
  const confirmPassword =
    "confirmPassword" in body ? String(body.confirmPassword ?? "") : ""

  if (
    currentPassword.length < 8 ||
    newPassword.length < 10 ||
    newPassword !== confirmPassword
  ) {
    return { ok: false as const, message: PORTAL_MESSAGES.malformedInput }
  }

  return {
    ok: true as const,
    data: { currentPassword, newPassword, confirmPassword },
  }
}
