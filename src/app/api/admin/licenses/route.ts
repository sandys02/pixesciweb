import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import {
  createAdminLicense,
  parseLicenseBody,
} from "@/backend/admin/organizations"

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

    const parsed = parseLicenseBody(await request.json())
    if (!parsed.ok) return jsonResponse({ message: parsed.message }, parsed.status)

    const result = await createAdminLicense({
      actor: session.user,
      data: parsed.data,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse(result, 201)
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
