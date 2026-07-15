import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import {
  parseLicensePatchBody,
  parsePublicLicenseId,
  updateAdminLicense,
} from "@/backend/admin/organizations"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ license_id: string }> }
) {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: ADMIN_MESSAGES.malformedInput }, 400)
    }

    const cookieStore = await cookies()
    const session = await requireAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
      ["owner", "admin"]
    )
    if (!session.ok) return jsonResponse({ message: session.message }, session.status)

    const { license_id: licenseIdParam } = await params
    const licenseId = parsePublicLicenseId(licenseIdParam)
    if (!licenseId) return jsonResponse({ message: "License not found." }, 404)

    const parsed = parseLicensePatchBody(await request.json())
    if (!parsed.ok) return jsonResponse({ message: parsed.message }, parsed.status)

    const result = await updateAdminLicense({
      actor: session.user,
      licenseId,
      patch: parsed.data,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse({ detail: result.detail })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
