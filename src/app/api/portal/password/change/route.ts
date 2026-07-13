import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  changePortalPassword,
  jsonResponse,
  parsePasswordChangeBody,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"

export async function POST(request: Request) {
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

    const parsed = parsePasswordChangeBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: parsed.message }, 400)
    }

    const result = await changePortalPassword(session.user, parsed.data)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, 400)
    }

    return jsonResponse({ changed: true })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
