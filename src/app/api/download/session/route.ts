import { cookies } from "next/headers"

import {
  DOWNLOAD_MESSAGES,
  DOWNLOAD_SESSION_COOKIE,
  getDownloadAuthState,
  getSessionCookieOptions,
  jsonResponse,
} from "@/backend/download-auth/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const state = await getDownloadAuthState(
      cookieStore.get(DOWNLOAD_SESSION_COOKIE)?.value
    )

    return jsonResponse(state)
  } catch {
    return jsonResponse({ message: DOWNLOAD_MESSAGES.unavailable }, 500)
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()

    cookieStore.set({
      name: DOWNLOAD_SESSION_COOKIE,
      value: "",
      ...getSessionCookieOptions(0),
      maxAge: 0,
    })

    return jsonResponse({ authenticated: false })
  } catch {
    return jsonResponse({ message: DOWNLOAD_MESSAGES.unavailable }, 500)
  }
}
