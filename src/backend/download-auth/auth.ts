import { scryptSync, timingSafeEqual } from "node:crypto"

import { eq } from "drizzle-orm"
import { SignJWT, jwtVerify } from "jose"

import { db } from "@/backend/download-auth/db"
import { downloadUsers } from "@/backend/download-auth/schema"

export const DOWNLOAD_SESSION_COOKIE = "pixesci_download_session"

export const DOWNLOAD_MESSAGES = {
  invalidCredentials: "Invalid email or password.",
  sessionExpired: "Download access expired. Sign in again.",
  unavailable: "The download is temporarily unavailable.",
  malformedInput: "Enter a valid email and password.",
} as const

type SessionClaims = {
  userId: number
  email: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getSessionSecret() {
  const secret = process.env.DOWNLOAD_SESSION_SECRET

  if (secret && secret.length >= 32) {
    return secret
  }

  if (process.env.NODE_ENV === "development") {
    return "development-only-download-session-secret-32chars"
  }

  throw new Error("DOWNLOAD_SESSION_SECRET must be at least 32 characters.")
}

function getSessionTtlSeconds() {
  const value = Number.parseInt(process.env.DOWNLOAD_SESSION_TTL_SECONDS ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : 20 * 60
}

function verifyPasswordHash(password: string, encodedHash: string) {
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

export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  })
}

export function getSessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  }
}

async function signSessionToken(claims: SessionClaims) {
  const secret = new TextEncoder().encode(getSessionSecret())

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${getSessionTtlSeconds()}s`)
    .sign(secret)
}

export async function readSessionToken(token: string | undefined) {
  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(getSessionSecret())
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId
    const email = payload.email

    if (typeof userId !== "number" || typeof email !== "string") {
      return null
    }

    return { userId, email }
  } catch {
    return null
  }
}

async function findActiveUser(email: string) {
  const normalizedEmail = normalizeEmail(email)
  const rows = await db
    .select()
    .from(downloadUsers)
    .where(eq(downloadUsers.email, normalizedEmail))
    .limit(1)

  return rows[0] ?? null
}

export async function loginDownloadUser(email: string, password: string) {
  const user = await findActiveUser(email)

  if (!user?.active || !verifyPasswordHash(password, user.passwordHash)) {
    return { ok: false as const, message: DOWNLOAD_MESSAGES.invalidCredentials }
  }

  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
  })

  return {
    ok: true as const,
    email: user.email,
    token,
  }
}

export async function getDownloadAuthState(token: string | undefined) {
  const session = await readSessionToken(token)

  if (!session) {
    return { authenticated: false as const }
  }

  const rows = await db
    .select()
    .from(downloadUsers)
    .where(eq(downloadUsers.id, session.userId))
    .limit(1)
  const user = rows[0]

  if (!user?.active) {
    return { authenticated: false as const }
  }

  return {
    authenticated: true as const,
    userEmail: user.email,
  }
}

export async function requireDownloadSession(token: string | undefined) {
  const session = await readSessionToken(token)

  if (!session) {
    return { ok: false as const, message: DOWNLOAD_MESSAGES.sessionExpired, status: 401 }
  }

  const rows = await db
    .select()
    .from(downloadUsers)
    .where(eq(downloadUsers.id, session.userId))
    .limit(1)
  const user = rows[0]

  if (!user?.active) {
    return { ok: false as const, message: DOWNLOAD_MESSAGES.sessionExpired, status: 401 }
  }

  return { ok: true as const, user }
}

export function parseLoginBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, message: DOWNLOAD_MESSAGES.malformedInput }
  }

  const email = "email" in body ? String(body.email ?? "") : ""
  const password = "password" in body ? String(body.password ?? "") : ""

  if (!email.includes("@") || password.length < 8) {
    return { ok: false as const, message: DOWNLOAD_MESSAGES.malformedInput }
  }

  return { ok: true as const, email, password }
}

export { getSessionTtlSeconds }
