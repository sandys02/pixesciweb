import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import {
  createAdminOrganization,
  listAdminOrganizations,
  parseCreateOrganizationBody,
} from "@/backend/admin/organizations"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await requireAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    )
    if (!session.ok) return jsonResponse({ message: session.message }, session.status)

    return jsonResponse({ organizations: await listAdminOrganizations() })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}

export async function POST(request: Request) {
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

    const parsed = parseCreateOrganizationBody(await request.json())
    if (!parsed.ok) {
      return jsonResponse({ message: "Enter valid organization details." }, 400)
    }

    const result = await createAdminOrganization({
      actor: session.user,
      data: parsed.data,
      origin: new URL(request.url).origin,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse(result, 201)
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
