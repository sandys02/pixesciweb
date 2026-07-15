import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  jsonResponse,
} from "@/backend/admin/auth"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.set({
      name: ADMIN_SESSION_COOKIE,
      value: "",
      ...getAdminSessionCookieOptions(0),
      maxAge: 0,
    })

    return jsonResponse({ authenticated: false })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
