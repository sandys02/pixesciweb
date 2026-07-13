import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  jsonResponse,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import { listPortalLicenses } from "@/backend/portal/licenses"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await requireCompletedPortalSession(
      cookieStore.get(PORTAL_SESSION_COOKIE)?.value
    )

    if (!session.ok) {
      return jsonResponse({ message: session.message }, session.status)
    }

    const licenses = await listPortalLicenses(session.user)
    return jsonResponse({ licenses })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
