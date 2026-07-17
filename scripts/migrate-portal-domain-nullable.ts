import { createClient } from "@libsql/client"

import { getRuntimeEnvironment } from "../src/backend/admin/environment"
import {
  PORTAL_DATABASE_AUTH_TOKEN,
  PORTAL_DATABASE_URL,
} from "../src/backend/portal/database-url"

function usage() {
  return [
    "Usage:",
    "  npm run db:migrate:portal-domain-nullable",
    "",
    "Production:",
    "  npm run db:migrate:portal-domain-nullable -- --allow-production --confirm-production pixesci-portal-production",
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

const args = parseArgs(process.argv.slice(2))
const runtime = getRuntimeEnvironment()

if (
  runtime === "production" &&
  (args.get("allow-production") !== true ||
    stringArg(args, "confirm-production") !== "pixesci-portal-production")
) {
  console.error(
    "Refusing to migrate production portal data without --allow-production --confirm-production pixesci-portal-production."
  )
  process.exit(1)
}

const client = createClient({
  url: PORTAL_DATABASE_URL,
  authToken: PORTAL_DATABASE_AUTH_TOKEN,
})

const tableInfo = await client.execute("PRAGMA table_info(organizations)")
const domainColumn = tableInfo.rows.find((row) => row.name === "domain")

if (!domainColumn) {
  console.error("organizations.domain column was not found.")
  process.exit(1)
}

if (domainColumn.notnull === 0) {
  console.log("organizations.domain is already nullable.")
  process.exit(0)
}

const statements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE organizations_new (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    organization_type text NOT NULL,
    country text DEFAULT 'United States' NOT NULL,
    state text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    domain text,
    research_field text NOT NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL,
    status text DEFAULT 'active' NOT NULL,
    deactivated_at text,
    archived_at text
  )`,
  `INSERT INTO organizations_new (
    id, organization_type, country, state, name, email, domain, research_field,
    created_at, updated_at, status, deactivated_at, archived_at
  ) SELECT
    id, organization_type, country, state, name, email, domain, research_field,
    created_at, updated_at, status, deactivated_at, archived_at
  FROM organizations`,
  "DROP TABLE organizations",
  "ALTER TABLE organizations_new RENAME TO organizations",
  "CREATE UNIQUE INDEX organizations_domain_unique ON organizations (domain)",
  "CREATE INDEX organizations_email_idx ON organizations (email)",
  "CREATE INDEX organizations_status_idx ON organizations (status)",
  "PRAGMA foreign_keys=ON",
]

try {
  for (const statement of statements) {
    await client.execute(statement)
  }
} catch (error) {
  console.error(error)
  process.exit(1)
}

console.log("organizations.domain is now nullable.")
