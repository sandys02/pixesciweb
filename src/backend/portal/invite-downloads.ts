import { createHash } from "node:crypto"

import { eq } from "drizzle-orm"

import { db } from "@/backend/portal/db"
import { licenses, seats } from "@/backend/portal/schema"

type InviteDownloadAuthorization =
  | { ok: true }
  | { ok: false; status: number; message: string }

const INVALID_INVITE_DOWNLOAD_MESSAGE =
  "This invite download link is invalid or expired."

function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("base64url")
}

export async function authorizeInviteDownload(
  token: string
): Promise<InviteDownloadAuthorization> {
  if (!/^[A-Za-z0-9_-]{32,256}$/.test(token)) {
    return { ok: false, status: 404, message: INVALID_INVITE_DOWNLOAD_MESSAGE }
  }

  const rows = await db
    .select({ seat: seats, license: licenses })
    .from(seats)
    .innerJoin(licenses, eq(licenses.id, seats.licenseId))
    .where(eq(seats.inviteTokenHash, hashInviteToken(token)))
    .limit(1)

  const row = rows[0]
  const inviteExpiresAt = row?.seat.inviteExpiresAt
  const inviteExpiryTime = inviteExpiresAt
    ? new Date(inviteExpiresAt).getTime()
    : Number.NaN

  if (
    !row ||
    row.seat.status !== "invited" ||
    row.license.status !== "active" ||
    !Number.isFinite(inviteExpiryTime) ||
    inviteExpiryTime <= Date.now()
  ) {
    return { ok: false, status: 404, message: INVALID_INVITE_DOWNLOAD_MESSAGE }
  }

  return { ok: true }
}
