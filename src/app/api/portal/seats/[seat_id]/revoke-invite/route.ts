import { cookies } from "next/headers"

import { PORTAL_MESSAGES, PORTAL_SESSION_COOKIE, jsonResponse } from "@/backend/portal/auth"
import { revokePortalSeatInvite } from "@/backend/portal/licenses"
import { resolvePortalActor } from "@/backend/portal/machine-auth"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ seat_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const actorResult = await resolvePortalActor({
      sessionToken: cookieStore.get(PORTAL_SESSION_COOKIE)?.value,
      authorizationHeader: _request.headers.get("authorization"),
    })

    if (!actorResult.ok) {
      return jsonResponse({ message: actorResult.message }, actorResult.status)
    }

    const { seat_id: seatId } = await params
    const result = await revokePortalSeatInvite(actorResult.actor, seatId)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    return jsonResponse({ seat: result.seat })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
