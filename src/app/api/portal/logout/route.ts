import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  getPortalSessionCookieOptions,
  jsonResponse,
} from "@/backend/portal/auth"

export async function POST() {
  try {
    const cookieStore = await cookies()

    cookieStore.set({
      name: PORTAL_SESSION_COOKIE,
      value: "",
      ...getPortalSessionCookieOptions(0),
      maxAge: 0,
    })

    return jsonResponse({ authenticated: false })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
