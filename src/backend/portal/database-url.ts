import { mkdirSync } from "node:fs"
import path from "node:path"

const DEFAULT_PORTAL_DB_PATH = path.join(process.cwd(), "private", "portal.db")

function resolvePortalDatabasePath() {
  const configuredPath = process.env.PORTAL_DB_PATH?.trim()
  const databasePath = configuredPath
    ? path.isAbsolute(configuredPath)
      ? configuredPath
      : path.join(process.cwd(), "private", configuredPath)
    : DEFAULT_PORTAL_DB_PATH

  mkdirSync(path.dirname(databasePath), { recursive: true })

  return databasePath
}

export const PORTAL_DATABASE_PATH = resolvePortalDatabasePath()
export const PORTAL_DATABASE_URL = `file:${PORTAL_DATABASE_PATH}`
