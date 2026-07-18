import {
  PORTAL_MESSAGES,
  jsonResponse,
} from "@/backend/portal/auth"
import {
  completePortalPasswordReset,
  isPortalPasswordResetTokenAvailable,
  parsePortalPasswordResetBody,
} from "@/backend/portal/password-reset"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    return jsonResponse({
      available: await isPortalPasswordResetTokenAvailable(token),
    })
  } catch {
    return jsonResponse({ available: false })
  }
}

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
