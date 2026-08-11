import { createHash, randomBytes } from "node:crypto"

import { and, eq, isNull } from "drizzle-orm"

import {
  PORTAL_MESSAGES,
  hashPortalPassword,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import { db } from "@/backend/portal/db"
import {
  organizations,
  portalAccounts,
  portalMachineCredentials,
} from "@/backend/portal/schema"

export type PortalActor = {
  accountId: number
  organizationId: number
  actorType?: string
}

function nowIso() {
  return new Date().toISOString()
}

function hashMachineKey(rawKey: string) {
  return createHash("sha256").update(rawKey).digest("base64url")
}

function extractBearerToken(authorizationHeader: string | null | undefined) {
  if (!authorizationHeader) return undefined
  const [scheme, token] = authorizationHeader.split(" ")
  return scheme?.toLowerCase() === "bearer" && token ? token.trim() : undefined
}

/**
 * Mints a per-organization machine credential the first time an org connects
 * (first successful `acceptConnectedSeatActivation`). Idempotent: if the org
 * already has a non-revoked credential, returns null instead of minting a
 * second one. The service account backing the credential is `active: false`
 * so it can never authenticate through the normal human login path — only
 * through `requirePortalMachineCredential`, which checks the credential table
 * directly.
 */
export async function mintPortalMachineCredential(
  organizationId: number
): Promise<string | null> {
  const existing = await db
    .select({ id: portalMachineCredentials.id })
    .from(portalMachineCredentials)
    .where(
      and(
        eq(portalMachineCredentials.organizationId, organizationId),
        isNull(portalMachineCredentials.revokedAt)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    return null
  }

  const [organization] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1)

  if (!organization) {
    return null
  }

  const timestamp = nowIso()
  const [serviceAccount] = await db
    .insert(portalAccounts)
    .values({
      email: `portal-service+org-${organizationId}@pixesci.internal`,
      passwordHash: hashPortalPassword(randomBytes(32).toString("base64url")),
      active: false,
      role: "service",
      mustChangePassword: false,
      setupCompletedAt: timestamp,
      failedLoginCount: 0,
      lockedUntil: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning({ id: portalAccounts.id })

  const rawKey = `pxsvc_${randomBytes(32).toString("base64url")}`

  await db.insert(portalMachineCredentials).values({
    organizationId,
    serviceAccountId: serviceAccount.id,
    keyHash: hashMachineKey(rawKey),
    createdAt: timestamp,
    revokedAt: null,
  })

  return rawKey
}

export async function requirePortalMachineCredential(rawKey: string) {
  const keyHash = hashMachineKey(rawKey)

  const [row] = await db
    .select({
      credential: portalMachineCredentials,
      organizationStatus: organizations.status,
    })
    .from(portalMachineCredentials)
    .innerJoin(
      organizations,
      eq(organizations.id, portalMachineCredentials.organizationId)
    )
    .where(
      and(
        eq(portalMachineCredentials.keyHash, keyHash),
        isNull(portalMachineCredentials.revokedAt)
      )
    )
    .limit(1)

  if (!row || row.organizationStatus !== "active") {
    return {
      ok: false as const,
      message: PORTAL_MESSAGES.forbidden,
      status: 401,
    }
  }

  return {
    ok: true as const,
    actor: {
      accountId: row.credential.serviceAccountId,
      organizationId: row.credential.organizationId,
      actorType: "machine",
    } satisfies PortalActor,
  }
}

/**
 * Resolves the calling actor for an endpoint that accepts either a human
 * portal-account session cookie or a per-org machine bearer credential.
 * Session auth is tried first; if no session token is present (or it's
 * invalid) the Authorization header is checked for a machine credential.
 */
export async function resolvePortalActor(input: {
  sessionToken: string | undefined
  authorizationHeader: string | null | undefined
}): Promise<
  | { ok: true; actor: PortalActor }
  | { ok: false; message: string; status: number }
> {
  if (input.sessionToken) {
    const session = await requireCompletedPortalSession(input.sessionToken)

    if (session.ok) {
      return {
        ok: true,
        actor: {
          accountId: session.user.accountId,
          organizationId: session.user.organizationId,
        },
      }
    }
  }

  const machineKey = extractBearerToken(input.authorizationHeader)

  if (machineKey) {
    return requirePortalMachineCredential(machineKey)
  }

  return {
    ok: false,
    message: PORTAL_MESSAGES.sessionExpired,
    status: 401,
  }
}
