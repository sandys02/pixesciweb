import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  getAdminSessionTtlSeconds,
  jsonResponse,
  loginAdminAccount,
  parseAdminLoginBody,
} from "@/backend/admin/auth"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: ADMIN_MESSAGES.malformedInput }, 400)
    }

    const parsed = parseAdminLoginBody(await request.json())
    if (!parsed.ok) return jsonResponse({ message: parsed.message }, 400)

    const result = await loginAdminAccount(parsed.email, parsed.password)
    if (!result.ok) return jsonResponse({ message: result.message }, 401)

    const cookieStore = await cookies()
    cookieStore.set({
      name: ADMIN_SESSION_COOKIE,
      value: result.token,
      ...getAdminSessionCookieOptions(getAdminSessionTtlSeconds()),
    })

    return jsonResponse({
      authenticated: true,
      adminEmail: result.email,
      role: result.role,
    })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
