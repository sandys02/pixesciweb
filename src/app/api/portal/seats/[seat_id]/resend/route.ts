import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  jsonResponse,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import { resendPortalSeatInvite } from "@/backend/portal/licenses"
import { sendSeatInviteSetupEmail } from "@/backend/portal/seat-invite-email"

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
    const result = await resendPortalSeatInvite(session.user, seatId)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    const emailStatus = await sendSeatInviteSetupEmail({
      actor: session.user,
      inviteLink: result.inviteLink,
      requestOrigin:
        _request.headers.get("origin") ?? new URL(_request.url).origin,
      seat: result.seat,
    }).catch(() => ({
      status: "failed" as const,
      message: "Email delivery failed.",
    }))

    return jsonResponse({
      seat: result.seat,
      inviteLink: result.inviteLink,
      emailStatus,
    })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
