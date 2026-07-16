export type AdminRole = "owner" | "admin" | "support"
export type RuntimeEnvironment = "local" | "development" | "preview" | "production"

export type AuthState =
  | { authenticated: false }
  | { authenticated: true; adminEmail: string; role: AdminRole }

export type EnvironmentState = {
  runtime: RuntimeEnvironment
  previewUsingProduction: boolean
  databaseLabel: string
}

export type OrganizationListItem = {
  id: number
  name: string
  domain: string
  email: string
  country: string
  state: string
  edition: "enterprise" | "academia" | "pixesci"
  researchField: string
  status: "active" | "deactivated" | "archived"
  activeLicenseId?: string
  activeLicenseStatus?: "active" | "inactive"
  activeLicenseStartsAt?: string
  activeLicenseEndsAt?: string
  seatLimit?: number
  allocatedSeats?: number
  updatedAt: string
}

export type OrganizationDetail = {
  organization: OrganizationListItem
  profile: {
    country: "United States"
    state: string
    name: string
    email: string
    domain: string
    organizationType: "enterprise" | "academia" | "pixesci"
    researchField: string
    status: "active" | "deactivated" | "archived"
  }
  portalAccounts: Array<{
    id: number
    email: string
    active: boolean
    role: string
    mustChangePassword: boolean
    setupCompletedAt: string | null
    updatedAt: string
  }>
  licenses: Array<{
    id: number
    licenseId: string
    label: string
    status: "active" | "inactive"
    startsAt: string
    endsAt: string
    seatLimit: number
    signedBundleVersion: number | null
  }>
  seats: Array<{
    id: number
    seatId: string
    licenseId: string
    email: string | null
    role: string | null
    status: string
    inviteExpiresAt: string | null
    inviteAcceptedAt: string | null
    updatedAt: string
  }>
  auditEvents: Array<AuditEvent>
}

export type AuditEvent = {
  id: number
  organizationId?: number | null
  actorType: string
  actorAdminAccountId?: number | null
  actorAccountId?: number | null
  eventType: string
  targetType: string
  targetId: string
  metadataJson: string | null
  createdAt: string
}

export type CreateOrganizationForm = {
  country: "United States"
  state: string
  name: string
  email: string
  domain: string
  organizationType: "enterprise" | "academia" | "pixesci"
  researchField: string
  licenseId: string
  generateLicenseId: boolean
  label: string
  startsAt: string
  seatLimit: number
  createSetupLink: boolean
}
