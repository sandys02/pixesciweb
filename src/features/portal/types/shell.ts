import type { SeatRole } from "./portal"

export type PortalShellProps = {
  initialOrganization: import("./portal").PortalOrganization
  sessionEmail: string
  setupRequired: boolean
}

export type PortalView = "licenses" | "settings"

export type InviteForm = {
  email: string
  role: SeatRole
}

export type PasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
