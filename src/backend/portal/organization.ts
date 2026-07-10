import { eq } from "drizzle-orm"

import { db } from "@/backend/portal/db"
import { normalizeDomain, writePortalAuditEvent } from "@/backend/portal/auth"
import { organizations } from "@/backend/portal/schema"
import type { OrganizationType, PortalOrganization } from "@/features/portal/types"

const ORGANIZATION_TYPES = new Set(["academia", "enterprise", "pixesci"])

export type OrganizationProfileInput = {
  organizationType: OrganizationType
  country: "United States"
  state: string
  name: string
  email: string
  domain: string
  researchField: string
}

export function serializePortalOrganization(
  organization: typeof organizations.$inferSelect
): PortalOrganization {
  return {
    country: "United States",
    state: organization.state,
    organizationType: isOrganizationType(organization.organizationType)
      ? organization.organizationType
      : "enterprise",
    name: organization.name,
    email: organization.email,
    domain: organization.domain,
    researchField: organization.researchField,
  }
}

function isOrganizationType(value: string): value is OrganizationType {
  return ORGANIZATION_TYPES.has(value)
}

export async function getOrganizationProfile(organizationId: number) {
  const rows = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1)
  const organization = rows[0]

  return organization ? serializePortalOrganization(organization) : null
}

export async function updateOrganizationProfile(input: {
  organizationId: number
  actorAccountId: number
  profile: OrganizationProfileInput
}) {
  const existingRows = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, input.organizationId))
    .limit(1)
  const existing = existingRows[0]

  if (!existing) {
    return null
  }

  const timestamp = new Date().toISOString()
  const normalizedDomain = normalizeDomain(input.profile.domain)

  await db
    .update(organizations)
    .set({
      organizationType: input.profile.organizationType,
      country: "United States",
      state: input.profile.state.trim(),
      name: input.profile.name.trim(),
      domain: normalizedDomain,
      researchField: input.profile.researchField.trim(),
      updatedAt: timestamp,
    })
    .where(eq(organizations.id, input.organizationId))

  const [updated] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, input.organizationId))
    .limit(1)

  await writePortalAuditEvent({
    organizationId: input.organizationId,
    actorAccountId: input.actorAccountId,
    eventType: "organization_profile_changed",
    targetType: "organization",
    targetId: String(input.organizationId),
    metadata: {
      changedFields: changedFields(existing, {
        organizationType: input.profile.organizationType,
        state: input.profile.state.trim(),
        name: input.profile.name.trim(),
        domain: normalizedDomain,
        researchField: input.profile.researchField.trim(),
      }),
    },
  })

  return serializePortalOrganization(updated)
}

function changedFields(
  previous: typeof organizations.$inferSelect,
  next: {
    organizationType: string
    state: string
    name: string
    domain: string
    researchField: string
  }
) {
  return Object.entries(next)
    .filter(([key, value]) => {
      if (key === "organizationType") {
        return previous.organizationType !== value
      }
      if (key === "researchField") {
        return previous.researchField !== value
      }

      return previous[key as "state" | "name" | "domain"] !== value
    })
    .map(([key]) => key)
}

export function parseOrganizationProfileBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const }
  }

  const organizationType = "organizationType" in body
    ? String(body.organizationType ?? "")
    : ""
  const country = "country" in body ? String(body.country ?? "") : ""
  const state = "state" in body ? String(body.state ?? "") : ""
  const name = "name" in body ? String(body.name ?? "") : ""
  const email = "email" in body ? String(body.email ?? "") : ""
  const domain = "domain" in body ? String(body.domain ?? "") : ""
  const researchField =
    "researchField" in body ? String(body.researchField ?? "") : ""
  const normalizedDomain = normalizeDomain(domain)

  if (!isOrganizationType(organizationType)) {
    return { ok: false as const }
  }

  if (country !== "United States" || !state.trim() || !name.trim()) {
    return { ok: false as const }
  }

  if (!/^\S+@\S+\.\S+$/.test(email.trim().toLowerCase())) {
    return { ok: false as const }
  }

  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(normalizedDomain)) {
    return { ok: false as const }
  }

  if (!researchField.trim()) {
    return { ok: false as const }
  }

  return {
    ok: true as const,
    data: {
      organizationType,
      country: "United States" as const,
      state,
      name,
      email,
      domain: normalizedDomain,
      researchField,
    },
  }
}
