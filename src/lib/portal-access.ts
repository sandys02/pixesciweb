import type {
  PortalAccountSetupForm,
  PortalLicense,
  PortalOrganization,
  PortalSeat,
  SeatRole,
} from "@/features/portal/types"

export type PortalAuthState = {
  authenticated: boolean
  userEmail?: string
  setupRequired?: boolean
}

export type PortalLoginCredentials = {
  email: string
  password: string
}

export type PortalPasswordChange = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

async function requestPortalApi<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "Portal access is temporarily unavailable."

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export async function getPortalAuthState(): Promise<PortalAuthState> {
  return requestPortalApi<PortalAuthState>("/api/portal/session")
}

export async function loginForPortal(
  credentials: PortalLoginCredentials
): Promise<PortalAuthState> {
  return requestPortalApi<PortalAuthState>("/api/portal/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function clearPortalAuthState(): Promise<PortalAuthState> {
  return requestPortalApi<PortalAuthState>("/api/portal/logout", {
    method: "POST",
  })
}

export async function completePortalSetup(
  form: PortalAccountSetupForm
): Promise<{ setupComplete: true }> {
  return requestPortalApi<{ setupComplete: true }>("/api/portal/account-setup", {
    method: "POST",
    body: JSON.stringify(form),
  })
}

export async function changePortalPassword(
  form: PortalPasswordChange
): Promise<{ changed: true }> {
  return requestPortalApi<{ changed: true }>("/api/portal/password/change", {
    method: "POST",
    body: JSON.stringify(form),
  })
}

export async function getPortalOrganization(): Promise<{
  organization: PortalOrganization
}> {
  return requestPortalApi<{ organization: PortalOrganization }>(
    "/api/portal/organization"
  )
}

export async function updatePortalOrganization(
  organization: PortalOrganization
): Promise<{ organization: PortalOrganization }> {
  return requestPortalApi<{ organization: PortalOrganization }>(
    "/api/portal/organization",
    {
      method: "PATCH",
      body: JSON.stringify(organization),
    }
  )
}

export async function getPortalLicenses(): Promise<{
  licenses: PortalLicense[]
}> {
  return requestPortalApi<{ licenses: PortalLicense[] }>("/api/portal/licenses")
}

export async function getPortalLicenseSeats(
  licenseId: string
): Promise<{ license: PortalLicense; seats: PortalSeat[] }> {
  return requestPortalApi<{ license: PortalLicense; seats: PortalSeat[] }>(
    `/api/portal/licenses/${encodeURIComponent(licenseId)}/seats`
  )
}

export async function invitePortalSeat(
  licenseId: string,
  input: { email: string; role: SeatRole }
): Promise<{ seat: PortalSeat; inviteLink?: string }> {
  return requestPortalApi<{ seat: PortalSeat; inviteLink?: string }>(
    `/api/portal/licenses/${encodeURIComponent(licenseId)}/seats/invite`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  )
}

export async function resendPortalSeatInvite(
  seatId: string
): Promise<{ seat: PortalSeat; inviteLink?: string }> {
  return requestPortalApi<{ seat: PortalSeat; inviteLink?: string }>(
    `/api/portal/seats/${encodeURIComponent(seatId)}/resend`,
    {
      method: "POST",
    }
  )
}

export async function revokePortalSeatInvite(
  seatId: string
): Promise<{ seat: PortalSeat }> {
  return requestPortalApi<{ seat: PortalSeat }>(
    `/api/portal/seats/${encodeURIComponent(seatId)}/revoke-invite`,
    {
      method: "POST",
    }
  )
}

export async function removePortalSeat(
  seatId: string
): Promise<{ seat: PortalSeat }> {
  return requestPortalApi<{ seat: PortalSeat }>(
    `/api/portal/seats/${encodeURIComponent(seatId)}/remove`,
    {
      method: "POST",
    }
  )
}
