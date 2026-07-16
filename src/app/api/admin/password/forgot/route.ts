import {
  ADMIN_MESSAGES,
  jsonResponse,
  requestAdminPasswordResetEmail,
} from "@/backend/admin/auth"
import { normalizeEmail } from "@/backend/portal/auth"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: ADMIN_MESSAGES.malformedInput }, 400)
    }

    const body = await request.json()
    const email = normalizeEmail(
      body && typeof body === "object" && "email" in body
        ? String(body.email ?? "")
        : ""
    )

    await requestAdminPasswordResetEmail({
      email,
      origin: new URL(request.url).origin,
    })

    return jsonResponse({
      message:
        "If that staff account is registered, PixeSci will send password reset instructions.",
    })
  } catch {
    return jsonResponse({
      message:
        "If that staff account is registered, PixeSci will send password reset instructions.",
    })
  }
}
