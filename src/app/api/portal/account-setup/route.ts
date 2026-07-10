import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  completePortalAccountSetup,
  jsonResponse,
  parseAccountSetupBody,
  requirePortalSession,
} from "@/backend/portal/auth"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""

    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const cookieStore = await cookies()
    const session = await requirePortalSession(
      cookieStore.get(PORTAL_SESSION_COOKIE)?.value
    )

    if (!session.ok) {
      return jsonResponse({ message: session.message }, session.status)
    }

    const parsed = parseAccountSetupBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: parsed.message }, 400)
    }

    const result = await completePortalAccountSetup(session.user, parsed.data)

    return jsonResponse(result)
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
