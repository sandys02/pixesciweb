import { existsSync } from "node:fs"
import path from "node:path"

import { createClient, type Client } from "@libsql/client"

const TABLES = [
  "organizations",
  "portal_accounts",
  "portal_account_organizations",
  "licenses",
  "seats",
  "audit_events",
  "license_bundles",
] as const

type TableName = (typeof TABLES)[number]

function parseArgs(argv: string[]) {
  const values = new Map<string, string | boolean>()

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index]

    if (!key?.startsWith("--")) {
      throw new Error(`Unexpected argument: ${key}`)
    }

    if (key === "--dry-run") {
      values.set("dry-run", true)
      continue
    }

    const value = argv[index + 1]

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${key}`)
    }

    values.set(key.slice(2), value)
    index += 1
  }

  return values
}

function getStringArg(
  values: Map<string, string | boolean>,
  key: string,
  fallback: string
) {
  const value = values.get(key)

  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  return fallback
}

async function getColumns(client: Client, table: TableName) {
  const result = await client.execute(`pragma table_info(${table})`)

  return result.rows.map((row) => String(row.name))
}

async function countRows(client: Client, table: TableName) {
  const result = await client.execute(`select count(*) as count from ${table}`)

  return Number(result.rows[0]?.count ?? 0)
}

async function copyTable(
  source: Client,
  destination: Client,
  table: TableName
) {
  const columns = await getColumns(source, table)

  if (columns.length === 0) {
    throw new Error(`Source table is missing or has no columns: ${table}`)
  }

  const destinationColumns = await getColumns(destination, table)

  if (destinationColumns.length === 0) {
    throw new Error(
      `Destination table is missing: ${table}. Run npm run db:push:portal first.`
    )
  }

  const missingColumns = columns.filter(
    (column) => !destinationColumns.includes(column)
  )

  if (missingColumns.length > 0) {
    throw new Error(
      `Destination table ${table} is missing columns: ${missingColumns.join(", ")}`
    )
  }

  const sourceRows = await source.execute(`select * from ${table}`)

  if (sourceRows.rows.length === 0) {
    return 0
  }

  const columnList = columns.map((column) => `"${column}"`).join(", ")
  const placeholders = columns.map(() => "?").join(", ")
  const sql = `insert or ignore into ${table} (${columnList}) values (${placeholders})`

  for (const row of sourceRows.rows) {
    await destination.execute({
      sql,
      args: columns.map((column) => row[column] ?? null),
    })
  }

  return sourceRows.rows.length
}

const args = parseArgs(process.argv.slice(2))
const sourcePath = path.resolve(
  getStringArg(args, "source", path.join("private", "portal.db"))
)
const destinationUrl = process.env.PORTAL_DATABASE_URL?.trim()
const destinationAuthToken =
  process.env.PORTAL_DATABASE_AUTH_TOKEN?.trim() || undefined
const dryRun = args.get("dry-run") === true

if (!existsSync(sourcePath)) {
  throw new Error(`Source portal database not found: ${sourcePath}`)
}

if (!destinationUrl) {
  throw new Error(
    "PORTAL_DATABASE_URL is required for the destination database."
  )
}

if (destinationUrl.startsWith("file:")) {
  throw new Error(
    "Refusing to migrate to a file: PORTAL_DATABASE_URL. Use a durable libSQL/Turso URL."
  )
}

const source = createClient({ url: `file:${sourcePath}` })
const destination = createClient({
  url: destinationUrl,
  authToken: destinationAuthToken,
})

try {
  const sourceCounts = Object.fromEntries(
    await Promise.all(
      TABLES.map(async (table) => [table, await countRows(source, table)])
    )
  )

  console.log("Source portal rows:")
  console.table(sourceCounts)

  if (dryRun) {
    console.log("Dry run complete. No rows were written.")
    process.exit(0)
  }

  for (const table of TABLES) {
    const copied = await copyTable(source, destination, table)
    console.log(`Copied ${copied} row(s) from ${table}.`)
  }

  const destinationCounts = Object.fromEntries(
    await Promise.all(
      TABLES.map(async (table) => [table, await countRows(destination, table)])
    )
  )

  console.log("Destination portal rows after migration:")
  console.table(destinationCounts)
} finally {
  source.close()
  destination.close()
}
