import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import path from "node:path"

const DEFAULT_PORTAL_DB_PATH = path.join(process.cwd(), "private", "portal.db")
const VERCEL_PORTAL_DB_PATH = path.join("/tmp", "pixesci-portal.db")

function resolvePortalDatabasePath() {
  const configuredPath = process.env.PORTAL_DB_PATH?.trim()

  if (!configuredPath && process.env.VERCEL === "1") {
    if (!existsSync(VERCEL_PORTAL_DB_PATH)) {
      if (!existsSync(DEFAULT_PORTAL_DB_PATH)) {
        throw new Error(
          `Portal database missing at ${DEFAULT_PORTAL_DB_PATH}. Include private/portal.db in the serverless bundle.`
        )
      }

      copyFileSync(DEFAULT_PORTAL_DB_PATH, VERCEL_PORTAL_DB_PATH)
    }

    return VERCEL_PORTAL_DB_PATH
  }

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
