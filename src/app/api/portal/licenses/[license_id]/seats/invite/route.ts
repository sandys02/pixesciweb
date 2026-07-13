import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  jsonResponse,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import { invitePortalSeat, parseSeatInviteBody } from "@/backend/portal/licenses"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ license_id: string }> }
) {
  try {
    const contentType = request.headers.get("content-type") ?? ""

    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const cookieStore = await cookies()
    const session = await requireCompletedPortalSession(
      cookieStore.get(PORTAL_SESSION_COOKIE)?.value
    )

    if (!session.ok) {
      return jsonResponse({ message: session.message }, session.status)
    }

    const parsed = parseSeatInviteBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const { license_id: licenseId } = await params
    const result = await invitePortalSeat(session.user, licenseId, parsed.data)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    return jsonResponse(
      { seat: result.seat, inviteLink: result.inviteLink },
      201
    )
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
