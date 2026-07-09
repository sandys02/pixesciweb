// @/app/portal/page.tsx

import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  DOWNLOAD_SESSION_COOKIE,
  requireDownloadSession,
} from "@/backend/download-auth/auth"
import { PortalShell } from "@/features/portal/portal-shell"

export const metadata: Metadata = {
  title: "Portal",
  description: "Complete PixeSci organization onboarding and manage licenses.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function PortalPage() {
  const cookieStore = await cookies()
  const session = await requireDownloadSession(
    cookieStore.get(DOWNLOAD_SESSION_COOKIE)?.value
  )

  if (!session.ok) {
    redirect("/")
  }

  return <PortalShell sessionEmail={session.user.email} />
}
