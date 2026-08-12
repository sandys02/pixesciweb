// Mirrors pixesciv2's ROLE_TEMPLATES (backend/services/scoped_authorization_service.py:105-213).
// Keep in sync with that file if pixesciv2's role catalog changes.

export type RoleTemplate = {
  key: string
  name: string
  description: string
}

export const ROLE_TEMPLATES: readonly RoleTemplate[] = [
  {
    key: "tenant_security_administrator",
    name: "Tenant Security Administrator",
    description:
      "Tenant identity, roles, grants, security policy, sessions, and audit. Full access — every permission in the catalog.",
  },
  {
    key: "platform_operator",
    name: "Platform Operator",
    description:
      "Operate users, sessions, workflows, equipment, and Lab Tools without regulated approval.",
  },
  {
    key: "site_administrator",
    name: "Site Administrator",
    description:
      "Administer users, memberships, sessions, and configuration within a site.",
  },
  {
    key: "laboratory_manager",
    name: "Laboratory Manager",
    description:
      "Manage laboratory samples, results, equipment, and operational review.",
  },
  {
    key: "analyst_technician",
    name: "Analyst / Technician",
    description: "Execute assigned laboratory work and enter results.",
  },
  {
    key: "scientist_workflow_author",
    name: "Scientist / Workflow Author",
    description:
      "Author and run scientific workflows without regulated approval authority.",
  },
  {
    key: "lims_reviewer",
    name: "LIMS Reviewer",
    description: "Review laboratory results and generate evidence.",
  },
  {
    key: "quality_investigator",
    name: "Quality Investigator",
    description: "Investigate quality events and manage CAPA work.",
  },
  {
    key: "quality_approver",
    name: "Quality Approver",
    description: "Review and approve regulated quality records.",
  },
  {
    key: "document_author",
    name: "Document Author",
    description: "Author controlled documents.",
  },
  {
    key: "training_coordinator",
    name: "Training Coordinator",
    description: "Manage training assignments and completions.",
  },
  {
    key: "auditor",
    name: "Auditor",
    description:
      "Read records and export audit evidence without mutation authority.",
  },
  {
    key: "lab_tools_administrator",
    name: "Lab Tools Administrator",
    description:
      "Configure profiles, instances, capabilities, ingestion, and credentials.",
  },
  {
    key: "connector_operator",
    name: "Connector Operator",
    description: "Test and operate approved connectors and jobs.",
  },
] as const

export const SYSTEM_ROLE_KEYS: ReadonlySet<string> = new Set(
  ROLE_TEMPLATES.map((role) => role.key)
)

// tenant_security_administrator is the sole "super admin" role. The other
// three admin-tier roles are kept in an easy-to-edit array for later work
// (e.g. a per-org small-staff toggle). Purely structural -- no existing
// permission check or the "last admin seat" protection changes because of
// this split; ADMIN_TIER_ROLE_KEYS below still derives the same 4-key set.
export const SUPER_ADMIN_ROLE_KEY = "tenant_security_administrator"
export const OTHER_ADMIN_ROLE_KEYS: readonly string[] = [
  "platform_operator",
  "site_administrator",
  "laboratory_manager",
]

// The four admin-tier roles a pre-Phase-2 pixesciv2 install should treat as
// the legacy "admin" seat role. See docs/admin/phase-1-pixesciweb-role-expansion.md.
export const ADMIN_TIER_ROLE_KEYS: ReadonlySet<string> = new Set([
  SUPER_ADMIN_ROLE_KEY,
  ...OTHER_ADMIN_ROLE_KEYS,
])

// Default roles applied when a seat invite doesn't explicitly select any.
// The org's very first seat becomes the super admin; every seat after that
// defaults to analyst_technician. Still overridable by the inviter.
export const DEFAULT_FIRST_SEAT_ROLE_KEY = SUPER_ADMIN_ROLE_KEY
export const DEFAULT_SEAT_ROLE_KEY = "analyst_technician"

// TODO: temporary constraint -- a seat may hold only one role for now. This
// will become a per-organization toggle (e.g. enabled for small-staff orgs)
// once that feature is built; until then it's a single flat boolean.
export const SINGLE_ROLE_PER_SEAT = true

export function isSystemRoleKey(value: string): boolean {
  return SYSTEM_ROLE_KEYS.has(value)
}

export function parseRoleKeys(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }

  const deduped = Array.from(new Set(value.map((entry) => String(entry))))

  if (!deduped.every((role) => isSystemRoleKey(role))) {
    return null
  }

  return deduped
}

export function parseStoredRoles(
  rolesJson: string | null | undefined
): string[] | undefined {
  if (!rolesJson) return undefined

  try {
    const parsed: unknown = JSON.parse(rolesJson)
    return Array.isArray(parsed) ? parsed.map((entry) => String(entry)) : undefined
  } catch {
    return undefined
  }
}

export function rolesEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false
  const setA = new Set(a)
  return b.every((role) => setA.has(role))
}
