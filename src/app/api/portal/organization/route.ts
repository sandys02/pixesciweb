import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  jsonResponse,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import {
  getOrganizationProfile,
  parseOrganizationProfileBody,
  updateOrganizationProfile,
} from "@/backend/portal/organization"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await requireCompletedPortalSession(
      cookieStore.get(PORTAL_SESSION_COOKIE)?.value
    )

    if (!session.ok) {
      return jsonResponse({ message: session.message }, session.status)
    }

    const organization = await getOrganizationProfile(session.user.organizationId)

    if (!organization) {
      return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 404)
    }

    return jsonResponse({ organization })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}

export async function PATCH(request: Request) {
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

    const parsed = parseOrganizationProfileBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const organization = await updateOrganizationProfile({
      organizationId: session.user.organizationId,
      actorAccountId: session.user.accountId,
      profile: parsed.data,
    })

    if (!organization) {
      return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 404)
    }

    return jsonResponse({ organization })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
