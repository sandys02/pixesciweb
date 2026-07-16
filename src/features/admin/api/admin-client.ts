export async function requestAdminApi<T = unknown>(
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
        : "Admin request failed."
    throw new Error(message)
  }

  return response.json() as Promise<T>
}
