import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  getPortalAuthState,
  jsonResponse,
} from "@/backend/portal/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const state = await getPortalAuthState(
      cookieStore.get(PORTAL_SESSION_COOKIE)?.value
    )

    return jsonResponse(state)
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
