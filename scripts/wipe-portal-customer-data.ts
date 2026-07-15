import { createClient } from "@libsql/client"

import { getRuntimeEnvironment } from "../src/backend/admin/environment"
import {
  PORTAL_DATABASE_AUTH_TOKEN,
  PORTAL_DATABASE_URL,
} from "../src/backend/portal/database-url"

function usage() {
  return [
    "Usage:",
    "  npm run db:wipe:portal-customers -- --confirm DELETE_PORTAL_CUSTOMER_DATA",
    "",
    "Optional:",
    "  --allow-production",
    "  --confirm-production pixesci-portal-production",
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

    if (key === "--allow-production") {
      values.set("allow-production", true)
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

function databaseLabel(url: string) {
  if (url.startsWith("file:")) return "file"

  try {
    return new URL(url).hostname
  } catch {
    return "configured"
  }
}

const args = parseArgs(process.argv.slice(2))
const runtime = getRuntimeEnvironment()

if (stringArg(args, "confirm") !== "DELETE_PORTAL_CUSTOMER_DATA") {
  console.error(usage())
  process.exit(1)
}

if (
  runtime === "production" &&
  (args.get("allow-production") !== true ||
    stringArg(args, "confirm-production") !== "pixesci-portal-production")
) {
  console.error(
    "Refusing to wipe production portal customer data without --allow-production --confirm-production pixesci-portal-production."
  )
  process.exit(1)
}

const client = createClient({
  url: PORTAL_DATABASE_URL,
  authToken: PORTAL_DATABASE_AUTH_TOKEN,
})

const deleteStatements = [
  ["license_bundles", "DELETE FROM license_bundles"],
  ["portal_account_reset_tokens", "DELETE FROM portal_account_reset_tokens"],
  ["seats", "DELETE FROM seats"],
  ["licenses", "DELETE FROM licenses"],
  ["portal_account_organizations", "DELETE FROM portal_account_organizations"],
  ["portal_accounts", "DELETE FROM portal_accounts"],
  ["organizations", "DELETE FROM organizations"],
  [
    "audit_events",
    "DELETE FROM audit_events WHERE actor_type != 'admin_account' OR actor_type IS NULL",
  ],
] as const

const resetSequences = [
  "license_bundles",
  "portal_account_reset_tokens",
  "seats",
  "licenses",
  "portal_account_organizations",
  "portal_accounts",
  "organizations",
]

console.log(`Runtime: ${runtime}`)
console.log(`Database: ${databaseLabel(PORTAL_DATABASE_URL)}`)

async function tableExists(tableName: string) {
  const result = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    args: [tableName],
  })

  return result.rows.length > 0
}

async function columnExists(tableName: string, columnName: string) {
  if (!(await tableExists(tableName))) return false

  const result = await client.execute(`PRAGMA table_info(${tableName})`)
  return result.rows.some((row) => row.name === columnName)
}

for (const [tableName, sql] of deleteStatements) {
  if (!(await tableExists(tableName))) {
    console.log(`${tableName}: skipped missing table`)
    continue
  }

  if (tableName === "audit_events" && !(await columnExists("audit_events", "actor_type"))) {
    console.log("audit_events: skipped because actor_type column is missing")
    continue
  }

  const result = await client.execute(sql)
  console.log(`${tableName}: deleted ${result.rowsAffected}`)
}

if (await tableExists("sqlite_sequence")) {
  for (const tableName of resetSequences) {
    await client.execute({
      sql: "DELETE FROM sqlite_sequence WHERE name = ?",
      args: [tableName],
    })
  }
}

const countTables = [
  "organizations",
  "portal_accounts",
  "licenses",
  "seats",
  "license_bundles",
  "admin_accounts",
]
const remaining: Record<string, number | "missing"> = {}

for (const tableName of countTables) {
  if (!(await tableExists(tableName))) {
    remaining[tableName] = "missing"
    continue
  }

  const result = await client.execute(`SELECT COUNT(*) AS count FROM ${tableName}`)
  remaining[tableName] = Number(result.rows[0]?.count ?? 0)
}

console.log(`Remaining: ${JSON.stringify(remaining)}`)
