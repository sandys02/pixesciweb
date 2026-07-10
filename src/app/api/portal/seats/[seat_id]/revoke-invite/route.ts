import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  jsonResponse,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import { revokePortalSeatInvite } from "@/backend/portal/licenses"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ seat_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = await requireCompletedPortalSession(
      cookieStore.get(PORTAL_SESSION_COOKIE)?.value
    )

    if (!session.ok) {
      return jsonResponse({ message: session.message }, session.status)
    }

    const { seat_id: seatId } = await params
    const result = await revokePortalSeatInvite(session.user, seatId)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    return jsonResponse({ seat: result.seat })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
