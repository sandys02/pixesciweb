import { cookies } from "next/headers"

import { PORTAL_MESSAGES, PORTAL_SESSION_COOKIE, jsonResponse } from "@/backend/portal/auth"
import { listPortalLicenses } from "@/backend/portal/licenses"
import { resolvePortalActor } from "@/backend/portal/machine-auth"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const actorResult = await resolvePortalActor({
      sessionToken: cookieStore.get(PORTAL_SESSION_COOKIE)?.value,
      authorizationHeader: request.headers.get("authorization"),
    })

    if (!actorResult.ok) {
      return jsonResponse({ message: actorResult.message }, actorResult.status)
    }

    const licenses = await listPortalLicenses(actorResult.actor)
    return jsonResponse({ licenses })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
