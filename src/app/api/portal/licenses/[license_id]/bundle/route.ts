import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  jsonResponse,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import { generatePortalLicenseBundle } from "@/backend/portal/bundles"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ license_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = await requireCompletedPortalSession(
      cookieStore.get(PORTAL_SESSION_COOKIE)?.value
    )

    if (!session.ok) {
      return jsonResponse({ message: session.message }, session.status)
    }

    const { license_id: licenseId } = await params
    const result = await generatePortalLicenseBundle(session.user, licenseId)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    return jsonResponse({ bundle: result.bundle }, 201)
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
