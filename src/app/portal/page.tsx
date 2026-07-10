// @/app/portal/page.tsx

import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  PORTAL_SESSION_COOKIE,
  getPortalOrganization,
  requirePortalSession,
} from "@/backend/portal/auth"
import { PortalShell } from "@/features/portal/portal-shell"
import type { OrganizationType, PortalOrganization } from "@/features/portal/types"

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
  const session = await requirePortalSession(
    cookieStore.get(PORTAL_SESSION_COOKIE)?.value
  )

  if (!session.ok) {
    redirect("/")
  }

  const organization = await getPortalOrganization(session.user.organizationId)

  if (!organization) {
    redirect("/")
  }

  const organizationType = ["academia", "enterprise", "pixesci"].includes(
    organization.organizationType
  )
    ? (organization.organizationType as OrganizationType)
    : "enterprise"

  const portalOrganization: PortalOrganization = {
    country: "United States",
    state: organization.state,
    organizationType,
    name: organization.name,
    email: organization.email,
    domain: organization.domain,
    researchField: organization.researchField,
  }

  return (
    <PortalShell
      initialOrganization={portalOrganization}
      sessionEmail={session.user.email}
      setupRequired={session.user.setupRequired}
    />
  )
}
