import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import {
  createPortalAccountForOrganization,
  parseNumericId,
  parsePortalAccountBody,
} from "@/backend/admin/organizations"

export async function POST(
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

    const parsed = parsePortalAccountBody(await request.json())
    if (!parsed.ok) return jsonResponse({ message: parsed.message }, parsed.status)

    const result = await createPortalAccountForOrganization({
      actor: session.user,
      organizationId,
      email: parsed.data.email,
      createSetupLink: parsed.data.createSetupLink,
      origin: new URL(request.url).origin,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse(result, 201)
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
