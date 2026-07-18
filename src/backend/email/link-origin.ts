import { siteUrl } from "@/content/site"

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/$/, "")
}

export function getEmailLinkOrigin(requestOrigin: string) {
  const configuredOrigin =
    process.env.PIXESCI_EMAIL_LINK_ORIGIN?.trim() || siteUrl

  return normalizeOrigin(configuredOrigin || requestOrigin)
}
