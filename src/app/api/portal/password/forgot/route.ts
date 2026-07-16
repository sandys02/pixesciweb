import {
  PORTAL_MESSAGES,
  jsonResponse,
  logPortalRouteError,
  normalizeEmail,
} from "@/backend/portal/auth"
import { requestPortalPasswordResetEmail } from "@/backend/portal/password-reset"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const body = await request.json()
    const email = normalizeEmail(
      body && typeof body === "object" && "email" in body
        ? String(body.email ?? "")
        : ""
    )

    await requestPortalPasswordResetEmail({
      email,
      origin: new URL(request.url).origin,
    })

    return jsonResponse({
      message:
        "If that email is registered, PixeSci will send password reset instructions.",
    })
  } catch (error) {
    logPortalRouteError("forgot-password", error)
    return jsonResponse({
      message:
        "If that email is registered, PixeSci will send password reset instructions.",
    })
  }
}
