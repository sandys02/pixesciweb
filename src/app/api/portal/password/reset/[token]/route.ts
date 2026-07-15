import {
  PORTAL_MESSAGES,
  jsonResponse,
} from "@/backend/portal/auth"
import {
  completePortalPasswordReset,
  parsePortalPasswordResetBody,
} from "@/backend/portal/password-reset"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const parsed = parsePortalPasswordResetBody(await request.json())
    if (!parsed.ok) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const { token } = await params
    const result = await completePortalPasswordReset({
      token,
      ...parsed.data,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse({ changed: true })
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}
