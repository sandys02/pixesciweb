import type { Metadata } from "next"
import { cookies } from "next/headers"

import {
  ADMIN_SESSION_COOKIE,
  getAdminAuthState,
} from "@/backend/admin/auth"
import { getDatabaseSafetyState } from "@/backend/admin/environment"
import { AdminShell } from "@/features/admin/admin-shell"

export const metadata: Metadata = {
  title: "Admin",
  description: "Internal PixeSci staff administration.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authState = await getAdminAuthState(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  )

  return (
    <AdminShell
      initialAuthState={authState}
      initialEnvironment={getDatabaseSafetyState()}
    />
  )
}
