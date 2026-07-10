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
  label: string
  status: LicenseStatus
  startsAt: string
  endsAt: string
  seatLimit: number
  seats: PortalSeat[]
}

export type PortalAccount = {
  organization: PortalOrganization
  licenses: PortalLicense[]
}
