import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import {
  parseNumericId,
  parseStatusBody,
  setAdminOrganizationStatus,
} from "@/backend/admin/organizations"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ organization_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = await requireAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
      ["owner", "admin"]
    )
    if (!session.ok) return jsonResponse({ message: session.message }, session.status)

    const { organization_id: organizationIdParam } = await params
    const organizationId = parseNumericId(organizationIdParam)
    if (!organizationId) return jsonResponse({ message: "Organization not found." }, 404)

    const body = await request.json().catch(() => ({}))
    const parsed = parseStatusBody(body)
    const result = await setAdminOrganizationStatus({
      actor: session.user,
      organizationId,
      status: "archived",
      confirmation: parsed.confirmation,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse({ detail: result.detail })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
