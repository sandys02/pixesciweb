import {
  createPublicKey,
  sign,
  verify,
} from "node:crypto"

const DEV_PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIHnCoAp6yltMj8ymzexp3nXgks8ra8v4cXV0tKhrEklK
-----END PRIVATE KEY-----`

const DEV_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAmF/IBFc2VngoEQKjcfel8p7KRZeWNmBJnYyfJdwglIM=
-----END PUBLIC KEY-----`

const DEV_KEY_ID = "development-only-ed25519-key"

export type PortalSigningKeys = {
  privateKey: string
  publicKey: string
  keyId: string
}

export type PortalSignedWrapper<TPayload> = {
  payload: TPayload
  signature: string
  keyId: string
}

export function getPortalSigningKeys(): PortalSigningKeys {
  const privateKey = process.env.PORTAL_LICENSE_SIGNING_PRIVATE_KEY_PEM
  const publicKey = process.env.PORTAL_LICENSE_PUBLIC_KEY_PEM
  const keyId = process.env.PORTAL_LICENSE_PUBLIC_KEY_ID

  if (privateKey && publicKey && keyId) {
    return { privateKey, publicKey, keyId }
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "PORTAL_LICENSE_SIGNING_PRIVATE_KEY_PEM, PORTAL_LICENSE_PUBLIC_KEY_PEM, and PORTAL_LICENSE_PUBLIC_KEY_ID are required in production."
    )
  }

  return {
    privateKey: DEV_PRIVATE_KEY_PEM,
    publicKey: DEV_PUBLIC_KEY_PEM,
    keyId: DEV_KEY_ID,
  }
}

export function signPortalPayload<TPayload>(
  payload: TPayload,
  keys = getPortalSigningKeys()
): PortalSignedWrapper<TPayload> {
  return {
    payload,
    signature: sign(
      null,
      Buffer.from(canonicalJson(payload)),
      keys.privateKey
    ).toString("base64url"),
    keyId: keys.keyId,
  }
}

export function verifyPortalSignedWrapper<TPayload>(
  wrapper: PortalSignedWrapper<TPayload>,
  publicKeyPem = getPortalSigningKeys().publicKey
) {
  return verify(
    null,
    Buffer.from(canonicalJson(wrapper.payload)),
    createPublicKey(publicKeyPem),
    Buffer.from(wrapper.signature, "base64url")
  )
}

export function armorPortalSignedWrapper(
  wrapper: PortalSignedWrapper<unknown>,
  armorBegin: string,
  armorEnd: string
) {
  const encoded = Buffer.from(canonicalJson(wrapper)).toString("base64url")
  const lines = encoded.match(/.{1,76}/g) ?? [encoded]

  return [armorBegin, ...lines, armorEnd].join("\n")
}

export function parseArmoredPortalWrapper<TWrapper>(
  armoredValue: string,
  armorBegin: string,
  armorEnd: string,
  isWrapper: (value: unknown) => value is TWrapper
) {
  const trimmed = armoredValue.trim()

  if (!trimmed.startsWith(armorBegin) || !trimmed.endsWith(armorEnd)) {
    return null
  }

  const encoded = trimmed
    .replace(armorBegin, "")
    .replace(armorEnd, "")
    .replace(/\s+/g, "")

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))

    if (!isWrapper(parsed)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`
  }

  const object = value as Record<string, unknown>
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(object[key])}`)
    .join(",")}}`
}
