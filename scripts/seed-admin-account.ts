import { randomBytes, scryptSync } from "node:crypto"

import { createClient } from "@libsql/client"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/libsql"

import { getRuntimeEnvironment } from "../src/backend/admin/environment"
import {
  PORTAL_DATABASE_AUTH_TOKEN,
  PORTAL_DATABASE_URL,
} from "../src/backend/portal/database-url"
import { adminAccounts, auditEvents } from "../src/backend/portal/schema"

function usage() {
  return [
    "Usage:",
    "  npm run db:seed:admin -- --email staff@pixesci.com --password temporary-password",
    "  ADMIN_SEED_PASSWORD=temporary-password npm run db:seed:admin -- --email staff@pixesci.com",
    "",
    "Optional:",
    "  --role owner",
    "  --reset-existing",
    "  --allow-production",
    "  --confirm-production pixesci-admin-production",
  ].join("\n")
}

function parseArgs(argv: string[]) {
  const values = new Map<string, string | boolean>()

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index]

    if (!key?.startsWith("--")) {
      console.error(usage())
      process.exit(1)
    }

    if (key === "--allow-production" || key === "--reset-existing") {
      values.set(key.slice(2), true)
      continue
    }

    const value = argv[index + 1]
    if (!value || value.startsWith("--")) {
      console.error(usage())
      process.exit(1)
    }

    values.set(key.slice(2), value)
    index += 1
  }

  return values
}

function stringArg(values: Map<string, string | boolean>, key: string) {
  const value = values.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64")
  const hash = scryptSync(password, salt, 64).toString("base64")
  return `scrypt$${salt}$${hash}`
}

const args = parseArgs(process.argv.slice(2))
const email = stringArg(args, "email").toLowerCase()
const password = stringArg(args, "password") || process.env.ADMIN_SEED_PASSWORD?.trim() || ""
const role = stringArg(args, "role") || "owner"
const runtime = getRuntimeEnvironment()
const resetExisting = args.get("reset-existing") === true

if (!/^\S+@\S+\.\S+$/.test(email)) {
  console.error("--email must be a valid email address.")
  process.exit(1)
}

if (password.length < 10) {
  console.error("--password must be at least 10 characters.")
  process.exit(1)
}

if (role !== "owner" && role !== "admin" && role !== "support") {
  console.error("--role must be owner, admin, or support.")
  process.exit(1)
}

if (
  runtime === "production" &&
  (args.get("allow-production") !== true ||
    stringArg(args, "confirm-production") !== "pixesci-admin-production")
) {
  console.error(
    "Refusing to seed a production admin without --allow-production --confirm-production pixesci-admin-production."
  )
  process.exit(1)
}

const client = createClient({
  url: PORTAL_DATABASE_URL,
  authToken: PORTAL_DATABASE_AUTH_TOKEN,
})
const db = drizzle(client)
const now = new Date().toISOString()

const existing = await db
  .select({ id: adminAccounts.id })
  .from(adminAccounts)
  .where(eq(adminAccounts.email, email))
  .limit(1)

if (existing.length > 0) {
  if (!resetExisting) {
    console.error(`Admin account already exists: ${email}`)
    console.error("Pass --reset-existing to update its password and unlock it.")
    process.exit(1)
  }

  await db
    .update(adminAccounts)
    .set({
      passwordHash: hashPassword(password),
      active: true,
      role,
      mustChangePassword: false,
      failedLoginCount: 0,
      lockedUntil: null,
      updatedAt: now,
    })
    .where(eq(adminAccounts.id, existing[0].id))

  await db.insert(auditEvents).values({
    organizationId: null,
    actorAccountId: null,
    actorSeatId: null,
    actorAdminAccountId: existing[0].id,
    actorType: "admin_account",
    eventType: "admin_account_reset_by_seed",
    targetType: "admin_account",
    targetId: String(existing[0].id),
    metadataJson: JSON.stringify({ email, role, runtime }),
    createdAt: now,
  })

  console.log(`Updated admin account: ${email}`)
  console.log(`Role: ${role}`)
  console.log(`Runtime: ${runtime}`)
  process.exit(0)
}

const [account] = await db
  .insert(adminAccounts)
  .values({
    email,
    passwordHash: hashPassword(password),
    active: true,
    role,
    mustChangePassword: false,
    failedLoginCount: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  })
  .returning({ id: adminAccounts.id })

await db.insert(auditEvents).values({
  organizationId: null,
  actorAccountId: null,
  actorSeatId: null,
  actorAdminAccountId: account.id,
  actorType: "admin_account",
  eventType: "admin_account_seeded",
  targetType: "admin_account",
  targetId: String(account.id),
  metadataJson: JSON.stringify({ email, role, runtime }),
  createdAt: now,
})

console.log(`Created admin account: ${email}`)
console.log(`Role: ${role}`)
console.log(`Runtime: ${runtime}`)
