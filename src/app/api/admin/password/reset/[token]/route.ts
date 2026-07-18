import {
  ADMIN_MESSAGES,
  completeAdminPasswordReset,
  isAdminPasswordResetTokenAvailable,
  jsonResponse,
  parseAdminPasswordResetBody,
} from "@/backend/admin/auth"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    return jsonResponse({
      available: await isAdminPasswordResetTokenAvailable(token),
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
      return jsonResponse({ message: ADMIN_MESSAGES.malformedInput }, 400)
    }

    const parsed = parseAdminPasswordResetBody(await request.json())
    if (!parsed.ok) {
      return jsonResponse({ message: ADMIN_MESSAGES.malformedInput }, 400)
    }

    const { token } = await params
    const result = await completeAdminPasswordReset({
      token,
      ...parsed.data,
    })
    if (!result.ok) return jsonResponse({ message: result.message }, result.status)

    return jsonResponse({ changed: true })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
