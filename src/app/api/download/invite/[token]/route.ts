import {
  DOWNLOAD_MESSAGES,
  jsonResponse,
} from "@/backend/download-auth/auth"
import {
  createDownloadRedirectResponse,
  resolveAuthorizedDownloadUrl,
} from "@/backend/download-auth/file"
import { authorizeInviteDownload } from "@/backend/portal/invite-downloads"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const authorization = await authorizeInviteDownload(token)

    if (!authorization.ok) {
      return jsonResponse(
        { message: authorization.message },
        authorization.status
      )
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
