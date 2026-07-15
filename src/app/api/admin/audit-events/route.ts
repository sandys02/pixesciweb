import { cookies } from "next/headers"

import {
  ADMIN_MESSAGES,
  ADMIN_SESSION_COOKIE,
  jsonResponse,
  requireAdminSession,
} from "@/backend/admin/auth"
import { listAdminAuditEvents } from "@/backend/admin/organizations"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await requireAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    )
    if (!session.ok) return jsonResponse({ message: session.message }, session.status)

    return jsonResponse({ auditEvents: await listAdminAuditEvents() })
  } catch {
    return jsonResponse({ message: ADMIN_MESSAGES.unavailable }, 500)
  }
}
