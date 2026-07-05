import { cookies } from "next/headers"

import {
  DOWNLOAD_MESSAGES,
  DOWNLOAD_SESSION_COOKIE,
  getSessionCookieOptions,
  getSessionTtlSeconds,
  jsonResponse,
  loginDownloadUser,
  parseLoginBody,
} from "@/backend/download-auth/auth"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""

    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: DOWNLOAD_MESSAGES.malformedInput }, 400)
    }

    const parsed = parseLoginBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: parsed.message }, 400)
    }

    const result = await loginDownloadUser(parsed.email, parsed.password)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, 401)
    }

    const cookieStore = await cookies()
    cookieStore.set({
      name: DOWNLOAD_SESSION_COOKIE,
      value: result.token,
      ...getSessionCookieOptions(getSessionTtlSeconds()),
    })

    return jsonResponse({
      authenticated: true,
      userEmail: result.email,
    })
  } catch {
    return jsonResponse({ message: DOWNLOAD_MESSAGES.unavailable }, 500)
  }
}
