import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  getAdminAuthState,
  jsonResponse,
} from "@/backend/admin/auth"
import { getDatabaseSafetyState } from "@/backend/admin/environment"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const state = await getAdminAuthState(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    )

    return jsonResponse({ ...state, environment: getDatabaseSafetyState() })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
