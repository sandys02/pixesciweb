export type DownloadAuthState = {
  authenticated: boolean
  userEmail?: string
}

export type DownloadLoginCredentials = {
  email: string
  password: string
}

const DOWNLOAD_FILE_URL = "/api/download/file"

async function requestDownloadApi<T>(
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
        : "Download access is temporarily unavailable."

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export async function getDownloadAuthState(): Promise<DownloadAuthState> {
  return requestDownloadApi<DownloadAuthState>("/api/download/session")
}

export async function loginForDownload(
  credentials: DownloadLoginCredentials
): Promise<DownloadAuthState> {
  return requestDownloadApi<DownloadAuthState>("/api/download/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function clearDownloadAuthState(): Promise<DownloadAuthState> {
  return requestDownloadApi<DownloadAuthState>("/api/download/session", {
    method: "DELETE",
  })
}

export async function startPixeSciDownload(): Promise<void> {
  const link = document.createElement("a")
  link.href = DOWNLOAD_FILE_URL
  link.rel = "noopener"
  document.body.append(link)
  link.click()
  link.remove()
}
