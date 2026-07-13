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
import {
  PORTAL_SESSION_COOKIE,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const downloadSession = await requireDownloadSession(
      cookieStore.get(DOWNLOAD_SESSION_COOKIE)?.value
    )

    if (!downloadSession.ok) {
      const portalSession = await requireCompletedPortalSession(
        cookieStore.get(PORTAL_SESSION_COOKIE)?.value
      )

      if (!portalSession.ok) {
        return jsonResponse(
          { message: downloadSession.message },
          downloadSession.status
        )
      }
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
