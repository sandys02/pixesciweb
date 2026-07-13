import { cookies } from "next/headers"

import {
  PORTAL_MESSAGES,
  PORTAL_SESSION_COOKIE,
  jsonResponse,
  requireCompletedPortalSession,
} from "@/backend/portal/auth"
import { listPortalLicenseSeats } from "@/backend/portal/licenses"

export async function GET(
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
    const result = await listPortalLicenseSeats(session.user, licenseId)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    return jsonResponse({
      license: result.license,
      seats: result.seats,
    })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
