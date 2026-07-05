import { cookies } from "next/headers"

import {
  DOWNLOAD_MESSAGES,
  DOWNLOAD_SESSION_COOKIE,
  jsonResponse,
  requireDownloadSession,
} from "@/backend/download-auth/auth"
import {
  createDownloadFileResponse,
  readAuthorizedDownloadFile,
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

    const file = await readAuthorizedDownloadFile()

    if (!file) {
      return jsonResponse({ message: DOWNLOAD_MESSAGES.unavailable }, 410)
    }

    return createDownloadFileResponse(file.data, file.fileName)
  } catch {
    return jsonResponse({ message: DOWNLOAD_MESSAGES.unavailable }, 500)
  }
}
