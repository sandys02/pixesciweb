import {
  decryptLinkLockUrl,
  getLinkLockDownloadConfig,
} from "@/backend/download-auth/link-lock"

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
}

export async function resolveAuthorizedDownloadUrl() {
  const linkLock = getLinkLockDownloadConfig()

  if (!linkLock) {
    return null
  }

  return decryptLinkLockUrl(linkLock.linkLockUrl, linkLock.password)
}

export function createDownloadRedirectResponse(url: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      ...NO_STORE_HEADERS,
    },
  })
}
