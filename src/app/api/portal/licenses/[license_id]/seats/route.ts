import { cookies } from "next/headers"

import { PORTAL_MESSAGES, PORTAL_SESSION_COOKIE, jsonResponse } from "@/backend/portal/auth"
import { listPortalLicenseSeats } from "@/backend/portal/licenses"
import { resolvePortalActor } from "@/backend/portal/machine-auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ license_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const actorResult = await resolvePortalActor({
      sessionToken: cookieStore.get(PORTAL_SESSION_COOKIE)?.value,
      authorizationHeader: request.headers.get("authorization"),
    })

    if (!actorResult.ok) {
      return jsonResponse({ message: actorResult.message }, actorResult.status)
    }

    const { license_id: licenseId } = await params
    const result = await listPortalLicenseSeats(actorResult.actor, licenseId)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    return jsonResponse({
      license: result.license,
      seats: result.seats,
    })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
