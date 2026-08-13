import { cookies } from "next/headers"

import { PORTAL_MESSAGES, PORTAL_SESSION_COOKIE, jsonResponse } from "@/backend/portal/auth"
import { invitePortalSeat, parseSeatInviteBody } from "@/backend/portal/licenses"
import { resolvePortalActor } from "@/backend/portal/machine-auth"
import { sendSeatInviteSetupEmail } from "@/backend/portal/seat-invite-email"

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
    const actorResult = await resolvePortalActor({
      sessionToken: cookieStore.get(PORTAL_SESSION_COOKIE)?.value,
      authorizationHeader: request.headers.get("authorization"),
    })

    if (!actorResult.ok) {
      return jsonResponse({ message: actorResult.message }, actorResult.status)
    }

    const parsed = parseSeatInviteBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const { license_id: licenseId } = await params
    const result = await invitePortalSeat(actorResult.actor, licenseId, parsed.data)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    const emailStatus = await sendSeatInviteSetupEmail({
      actor: actorResult.actor,
      inviteLink: result.inviteLink,
      requestOrigin:
        request.headers.get("origin") ?? new URL(request.url).origin,
      seat: result.seat,
    }).catch(() => ({
      status: "failed" as const,
      message: "Email delivery failed.",
    }))

    return jsonResponse(
      { seat: result.seat, inviteLink: result.inviteLink, emailStatus },
      201
    )
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
