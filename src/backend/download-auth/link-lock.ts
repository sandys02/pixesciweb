import { webcrypto } from "node:crypto"

const LINK_LOCK_API_VERSION = "0.0.1"

const STATIC_SALT = Uint8Array.from([
  236, 231, 167, 249, 207, 95, 201, 235, 164, 98, 246, 26, 176, 174, 72, 249,
])

const STATIC_IV = Uint8Array.from([
  255, 237, 148, 105, 6, 255, 123, 202, 115, 130, 16, 116,
])

type LinkLockPayload = {
  v: string
  e: string
  s?: string
  i?: string
}

function decodeBase64(value: string) {
  return Uint8Array.from(Buffer.from(value, "base64"))
}

function parseLinkLockPayload(linkLockUrl: string) {
  const hash = new URL(linkLockUrl).hash.slice(1)

  if (!hash) {
    throw new Error("Link Lock URL is missing its encrypted fragment.")
  }

  const payload = JSON.parse(
    Buffer.from(hash, "base64").toString("utf8")
  ) as LinkLockPayload

  if (payload.v !== LINK_LOCK_API_VERSION || !payload.e) {
    throw new Error("Unsupported or corrupted Link Lock URL.")
  }

  return payload
}

async function deriveLinkLockKey(password: string, salt: Uint8Array) {
  const rawKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  return webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    rawKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  )
}

function assertAllowedDownloadUrl(url: string) {
  const parsed = new URL(url)

  if (
    parsed.protocol !== "http:" &&
    parsed.protocol !== "https:" &&
    parsed.protocol !== "magnet:"
  ) {
    throw new Error("Decrypted download URL uses a disallowed protocol.")
  }

  return parsed.toString()
}

export async function decryptLinkLockUrl(linkLockUrl: string, password: string) {
  const payload = parseLinkLockPayload(linkLockUrl)
  const encrypted = decodeBase64(payload.e)
  const salt = payload.s ? decodeBase64(payload.s) : STATIC_SALT
  const iv = payload.i ? decodeBase64(payload.i) : STATIC_IV
  const key = await deriveLinkLockKey(password, salt)

  const decrypted = await webcrypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  )

  return assertAllowedDownloadUrl(new TextDecoder().decode(decrypted))
}

export function getLinkLockDownloadConfig() {
  const linkLockUrl = process.env.DOWNLOAD_LINK_LOCK_URL?.trim()
  const password = process.env.DOWNLOAD_LINK_LOCK_PASSWORD

  if (!linkLockUrl || !password) {
    return null
  }

  return { linkLockUrl, password }
}
