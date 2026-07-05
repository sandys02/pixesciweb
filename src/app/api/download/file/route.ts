import { cookies } from "next/headers"

import {
  DOWNLOAD_MESSAGES,
  DOWNLOAD_SESSION_COOKIE,
  jsonResponse,
  requireDownloadSession,
} from "@/backend/download-auth/auth"
import {
  createDownloadRedirectResponse,
  resolveAuthorizedDownloadUrl,
} from "@/backend/download-auth/file"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await requireDownloadSession(
      cookieStore.get(DOWNLOAD_SESSION_COOKIE)?.value
    )

    if (!session.ok) {
      return jsonResponse({ message: session.message }, session.status)
    }

    const downloadUrl = await resolveAuthorizedDownloadUrl()

    if (!downloadUrl) {
      return jsonResponse({ message: DOWNLOAD_MESSAGES.unavailable }, 503)
    }

    return createDownloadRedirectResponse(downloadUrl)
  } catch {
    return jsonResponse({ message: DOWNLOAD_MESSAGES.unavailable }, 500)
  }
}
