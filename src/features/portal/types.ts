export type OrganizationType = "academia" | "enterprise" | "pixesci"

export type LicenseStatus = "active" | "inactive"

export type SeatRole = "admin" | "member"

export type SeatStatus = "active" | "invited" | "revoked"

export type PortalOrganization = {
  country: "United States"
  state: string
  organizationType: OrganizationType
  name: string
  email: string
  domain: string
  researchField: string
}

export type PortalAccountSetupForm = PortalOrganization & {
  newPassword: string
  confirmPassword: string
}

export type PortalSeat = {
  id: string
  status: SeatStatus
  email?: string
  role?: SeatRole
  inviteLink?: string
  temporaryCredentialState?: "issued" | "resent" | "accepted" | "revoked"
}

export type PortalLicense = {
  id: string
  edition: OrganizationType
  label: string
  status: LicenseStatus
  startsAt: string
  endsAt: string
  seatLimit: number
  seats: PortalSeat[]
}

export type PortalLicenseBundlePayload = {
  bundleVersion: number
  licenseId: string
  edition: OrganizationType
  organizationId: number
  organizationName: string
  startsAt: string
  endsAt: string
  seatLimit: number
  features: string[]
  issuedAt: string
  keyId: string
  seats?: Array<{
    seatId: string
    email: string
    role: SeatRole
    status: Extract<SeatStatus, "active" | "invited">
  }>
}

export type PortalLicenseBundle = {
  id: number
  licenseId: string
  bundleVersion: number
  keyId: string
  generatedAt: string
  armoredBundle: string
  payload: PortalLicenseBundlePayload
}

export type PortalSeatActivationPayload = {
  activationVersion: number
  licenseId: string
  edition: OrganizationType
  organizationId: number
  organizationName: string
  seatId: string
  seatEmail: string
  seatRole: SeatRole
  seatStatus: Extract<SeatStatus, "invited">
  licenseStartsAt: string
  licenseEndsAt: string
  seatLimit: number
  issuedAt: string
  expiresAt: string
  keyId: string
}

export type PortalSeatActivation = {
  seatId: string
  licenseId: string
  keyId: string
  generatedAt: string
  expiresAt: string
  armoredActivation: string
  payload: PortalSeatActivationPayload
}

export type PortalAccount = {
  organization: PortalOrganization
  licenses: PortalLicense[]
}
