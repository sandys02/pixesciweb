import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import {
  getAdminOrganization,
  parseNumericId,
  parseOrganizationProfileBody,
  updateAdminOrganization,
} from "@/backend/admin/organizations"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ organization_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = await requireAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    )
    if (!session.ok) return jsonResponse({ message: session.message }, session.status)

    const { organization_id: organizationIdParam } = await params
    const organizationId = parseNumericId(organizationIdParam)
    if (!organizationId) return jsonResponse({ message: "Organization not found." }, 404)

    const detail = await getAdminOrganization(organizationId)
    if (!detail) return jsonResponse({ message: "Organization not found." }, 404)

    return jsonResponse({ detail })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ organization_id: string }> }
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

    const { organization_id: organizationIdParam } = await params
    const organizationId = parseNumericId(organizationIdParam)
    if (!organizationId) return jsonResponse({ message: "Organization not found." }, 404)

    const parsed = parseOrganizationProfileBody(await request.json())
    if (!parsed.ok) return jsonResponse({ message: parsed.message }, parsed.status)

    const result = await updateAdminOrganization({
      actor: session.user,
      organizationId,
      profile: parsed.data,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse({ detail: result.detail })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
