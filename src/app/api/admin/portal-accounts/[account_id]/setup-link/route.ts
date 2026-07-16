import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import {
  createPortalAccountSetupLink,
  parseNumericId,
} from "@/backend/admin/organizations"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ account_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = await requireAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
      ["owner", "admin", "support"]
    )
    if (!session.ok) return jsonResponse({ message: session.message }, session.status)

    const { account_id: accountIdParam } = await params
    const portalAccountId = parseNumericId(accountIdParam)
    if (!portalAccountId) {
      return jsonResponse({ message: "Portal account not found." }, 404)
    }

    const result = await createPortalAccountSetupLink({
      actor: session.user,
      portalAccountId,
      origin: new URL(request.url).origin,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse(result)
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
