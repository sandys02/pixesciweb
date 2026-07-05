export type DownloadAuthState = {
  authenticated: boolean
  userEmail?: string
}

export type DownloadLoginCredentials = {
  email: string
  password: string
}

export type PixeSciDownload = {
  url: string
  fileName: string
}

let mockSession: DownloadAuthState = {
  authenticated: false,
}

const mockDownload: PixeSciDownload = {
  url: "/pixesci-download-backend-pending.txt",
  fileName: "pixesci-download-backend-pending.txt",
}

function waitForMockLatency() {
  return new Promise((resolve) => window.setTimeout(resolve, 450))
}

export async function getDownloadAuthState(): Promise<DownloadAuthState> {
  await waitForMockLatency()

  return mockSession
}

export async function loginForDownload(
  credentials: DownloadLoginCredentials
): Promise<DownloadAuthState> {
  await waitForMockLatency()

  if (!credentials.email.includes("@") || credentials.password.length < 8) {
    throw new Error("Enter a valid email and a password with at least 8 characters.")
  }

  mockSession = {
    authenticated: true,
    userEmail: credentials.email,
  }

  return mockSession
}

export async function clearDownloadAuthState(): Promise<DownloadAuthState> {
  mockSession = {
    authenticated: false,
  }

  return mockSession
}

export async function getPixeSciDownloadUrl(): Promise<PixeSciDownload> {
  await waitForMockLatency()

  if (!mockSession.authenticated) {
    throw new Error("Sign in before starting the download.")
  }

  return mockDownload
}

export async function startPixeSciDownload(): Promise<void> {
  const download = await getPixeSciDownloadUrl()
  const link = document.createElement("a")
  link.href = download.url
  link.download = download.fileName
  link.rel = "noopener"
  document.body.append(link)
  link.click()
  link.remove()
}
