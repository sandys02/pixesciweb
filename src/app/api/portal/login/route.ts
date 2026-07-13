import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  getPortalSessionCookieOptions,
  getPortalSessionTtlSeconds,
  jsonResponse,
  logPortalRouteError,
  loginPortalAccount,
  parseLoginBody,
} from "@/backend/portal/auth"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""

    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const parsed = parseLoginBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: parsed.message }, 400)
    }

    const result = await loginPortalAccount(parsed.email, parsed.password)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, 401)
    }

    const cookieStore = await cookies()
    cookieStore.set({
      name: PORTAL_SESSION_COOKIE,
      value: result.token,
      ...getPortalSessionCookieOptions(getPortalSessionTtlSeconds()),
    })

    return jsonResponse({
      authenticated: true,
      userEmail: result.email,
      setupRequired: result.setupRequired,
    })
  } catch (error) {
    logPortalRouteError("login", error)
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
