import { randomBytes, scryptSync } from "node:crypto"

import { createClient } from "@libsql/client"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/libsql"

import {
  PORTAL_DATABASE_AUTH_TOKEN,
  PORTAL_DATABASE_URL,
} from "../src/backend/portal/database-url"
import {
  auditEvents,
  licenses,
  organizations,
  portalAccountOrganizations,
  portalAccounts,
} from "../src/backend/portal/schema"

const ORGANIZATION_TYPES = new Set(["academia", "enterprise", "pixesci"])

function usage() {
  return [
    "Usage:",
    "  npm run db:seed:portal -- \\",
    "    --account-email admin@example.org \\",
    "    --password temporary-password \\",
    "    --organization-name \"Example Lab\" \\",
    "    --organization-type enterprise \\",
    "    --state Massachusetts \\",
    "    --domain example.org \\",
    "    --research-field \"Bioanalytics and regulated QC\" \\",
    "    --license-id LIC-PSCI-2026-0001 \\",
    "    --starts-at 2026-01-01 \\",
    "    --ends-at 2026-12-31 \\",
    "    --seat-limit 12 \\",
    "    --label \"Enterprise controlled deployment\"",
    "",
    "Optional:",
    "  --organization-email admin@example.org",
    "  --country \"United States\"",
  ].join("\n")
}

function parseArgs(argv: string[]) {
  const values = new Map<string, string>()

  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]
    const value = argv[index + 1]

    if (!key?.startsWith("--") || !value || value.startsWith("--")) {
      console.error(usage())
      process.exit(1)
    }

    values.set(key.slice(2), value)
  }

  return values
}

function required(values: Map<string, string>, key: string) {
  const value = values.get(key)?.trim()

  if (!value) {
    console.error(`Missing required argument: --${key}`)
    console.error(usage())
    process.exit(1)
  }

  return value
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64")
  const hash = scryptSync(password, salt, 64).toString("base64")
  return `scrypt$${salt}$${hash}`
}

function parseSeatLimit(value: string) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    console.error("--seat-limit must be a positive integer.")
    process.exit(1)
  }

  return parsed
}

function validateDate(value: string, key: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    console.error(`--${key} must use YYYY-MM-DD format.`)
    process.exit(1)
  }

  return value
}

const args = parseArgs(process.argv.slice(2))
const accountEmail = normalizeEmail(required(args, "account-email"))
const password = required(args, "password")
const organizationName = required(args, "organization-name").trim()
const organizationType = required(args, "organization-type").trim()
const organizationEmail = normalizeEmail(
  args.get("organization-email") ?? accountEmail
)
const country = args.get("country")?.trim() || "United States"
const state = required(args, "state").trim()
const domain = normalizeDomain(required(args, "domain"))
const researchField = required(args, "research-field").trim()
const licenseId = required(args, "license-id").trim()
const startsAt = validateDate(required(args, "starts-at"), "starts-at")
const endsAt = validateDate(required(args, "ends-at"), "ends-at")
const seatLimit = parseSeatLimit(required(args, "seat-limit"))
const label =
  args.get("label")?.trim() || "Enterprise controlled deployment"

if (!ORGANIZATION_TYPES.has(organizationType)) {
  console.error("--organization-type must be academia, enterprise, or pixesci.")
  process.exit(1)
}

if (!/^\S+@\S+\.\S+$/.test(accountEmail)) {
  console.error("--account-email must be a valid email address.")
  process.exit(1)
}

if (!/^\S+@\S+\.\S+$/.test(organizationEmail)) {
  console.error("--organization-email must be a valid email address.")
  process.exit(1)
}

if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
  console.error("--domain must be a valid domain.")
  process.exit(1)
}

if (password.length < 10) {
  console.error("--password must be at least 10 characters.")
  process.exit(1)
}

const client = createClient({
  url: PORTAL_DATABASE_URL,
  authToken: PORTAL_DATABASE_AUTH_TOKEN,
})
const db = drizzle(client)
const now = new Date().toISOString()

const existingAccount = await db
  .select({ id: portalAccounts.id })
  .from(portalAccounts)
  .where(eq(portalAccounts.email, accountEmail))
  .limit(1)

if (existingAccount.length > 0) {
  console.error(`Portal account already exists: ${accountEmail}`)
  process.exit(1)
}

const existingOrganization = await db
  .select({ id: organizations.id })
  .from(organizations)
  .where(eq(organizations.domain, domain))
  .limit(1)

if (existingOrganization.length > 0) {
  console.error(`Organization domain already exists: ${domain}`)
  process.exit(1)
}

const existingLicense = await db
  .select({ id: licenses.id })
  .from(licenses)
  .where(eq(licenses.licenseId, licenseId))
  .limit(1)

if (existingLicense.length > 0) {
  console.error(`License already exists: ${licenseId}`)
  process.exit(1)
}

const [organization] = await db
  .insert(organizations)
  .values({
    organizationType,
    country,
    state,
    name: organizationName,
    email: organizationEmail,
    domain,
    researchField,
    createdAt: now,
    updatedAt: now,
  })
  .returning({ id: organizations.id })

const [account] = await db
  .insert(portalAccounts)
  .values({
    email: accountEmail,
    passwordHash: hashPassword(password),
    active: true,
    role: "admin",
    mustChangePassword: true,
    setupCompletedAt: null,
    failedLoginCount: 0,
    lockedUntil: null,
    createdAt: now,
    updatedAt: now,
  })
  .returning({ id: portalAccounts.id })

await db.insert(portalAccountOrganizations).values({
  accountId: account.id,
  organizationId: organization.id,
  role: "owner",
  createdAt: now,
})

const [license] = await db
  .insert(licenses)
  .values({
    licenseId,
    organizationId: organization.id,
    status: "active",
    startsAt,
    endsAt,
    seatLimit,
    label,
    signedBundleVersion: null,
    createdAt: now,
    updatedAt: now,
  })
  .returning({ id: licenses.id })

await db.insert(auditEvents).values([
  {
    organizationId: organization.id,
    actorAccountId: account.id,
    actorSeatId: null,
    eventType: "portal_account_created",
    targetType: "portal_account",
    targetId: String(account.id),
    metadataJson: JSON.stringify({ email: accountEmail }),
    createdAt: now,
  },
  {
    organizationId: organization.id,
    actorAccountId: account.id,
    actorSeatId: null,
    eventType: "license_created",
    targetType: "license",
    targetId: licenseId,
    metadataJson: JSON.stringify({ licenseRecordId: license.id, seatLimit }),
    createdAt: now,
  },
])

console.log(`Created portal organization: ${organizationName} (${domain})`)
console.log(`Created portal account: ${accountEmail}`)
console.log(`Created active license: ${licenseId}`)
console.log("Created human app seats: 0")
