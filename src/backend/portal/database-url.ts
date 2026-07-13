import { mkdirSync } from "node:fs"
import path from "node:path"

const DEFAULT_PORTAL_DB_PATH = path.join(process.cwd(), "private", "portal.db")
type PortalDatabaseConfig = {
  path: string | null
  url: string
}

function resolveFileDatabaseUrl(databasePath: string) {
  mkdirSync(path.dirname(databasePath), { recursive: true })

  return {
    path: databasePath,
    url: `file:${databasePath}`,
  }
}

function resolvePortalDatabaseConfig(): PortalDatabaseConfig {
  const configuredUrl = process.env.PORTAL_DATABASE_URL?.trim()

  if (configuredUrl) {
    return {
      path: configuredUrl.startsWith("file:")
        ? configuredUrl.replace(/^file:/, "")
        : null,
      url: configuredUrl,
    }
  }

  const configuredPath = process.env.PORTAL_DB_PATH?.trim()

  if (!configuredPath && process.env.VERCEL === "1") {
    throw new Error(
      "PORTAL_DATABASE_URL is required on Vercel so portal state is durable."
    )
  }

  const databasePath = configuredPath
    ? path.isAbsolute(configuredPath)
      ? configuredPath
      : path.join(process.cwd(), "private", configuredPath)
    : DEFAULT_PORTAL_DB_PATH

  return resolveFileDatabaseUrl(databasePath)
}

const portalDatabaseConfig = resolvePortalDatabaseConfig()

export const PORTAL_DATABASE_AUTH_TOKEN =
  process.env.PORTAL_DATABASE_AUTH_TOKEN?.trim() || undefined
export const PORTAL_DATABASE_PATH = portalDatabaseConfig.path
export const PORTAL_DATABASE_URL = portalDatabaseConfig.url
