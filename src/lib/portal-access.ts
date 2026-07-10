import type { PortalAccountSetupForm } from "@/features/portal/types"

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
