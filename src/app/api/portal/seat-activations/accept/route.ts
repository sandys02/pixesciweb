import {
  PORTAL_MESSAGES,
  jsonResponse,
} from "@/backend/portal/auth"
import { acceptConnectedSeatActivation } from "@/backend/portal/activations"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""

    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const parsed = parseConnectedActivationBody(await request.json())

    if (!parsed.ok) {
      return jsonResponse({ message: PORTAL_MESSAGES.malformedInput }, 400)
    }

    const result = await acceptConnectedSeatActivation(parsed.armoredActivation)

    if (!result.ok) {
      return jsonResponse({ message: result.message }, result.status)
    }

    return jsonResponse(result.activation)
  } catch {
    return jsonResponse({ message: PORTAL_MESSAGES.unavailable }, 500)
  }
}

function parseConnectedActivationBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const }
  }

  const armoredActivation =
    "armoredActivation" in body ? String(body.armoredActivation ?? "") : ""

  if (!armoredActivation.trim()) {
    return { ok: false as const }
  }

  return { ok: true as const, armoredActivation }
}
