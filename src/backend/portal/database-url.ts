import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import path from "node:path"

const DEFAULT_PORTAL_DB_PATH = path.join(process.cwd(), "private", "portal.db")
const VERCEL_BUILD_PORTAL_DB_PATH = path.join(
  "/tmp",
  "pixesci-portal-build-placeholder.db"
)
const VERCEL_PORTAL_DB_PATH = path.join("/tmp", "pixesci-portal.db")
const NEXT_PRODUCTION_BUILD_PHASE = "phase-production-build"

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
    if (process.env.NEXT_PHASE === NEXT_PRODUCTION_BUILD_PHASE) {
      return resolveFileDatabaseUrl(VERCEL_BUILD_PORTAL_DB_PATH)
    }

    if (!existsSync(VERCEL_PORTAL_DB_PATH)) {
      if (!existsSync(DEFAULT_PORTAL_DB_PATH)) {
        throw new Error(
          `Portal database missing at ${DEFAULT_PORTAL_DB_PATH}. Include private/portal.db in the serverless bundle.`
        )
      }

      copyFileSync(DEFAULT_PORTAL_DB_PATH, VERCEL_PORTAL_DB_PATH)
    }

    console.warn(
      [
        "Using bundled portal SQLite database copy on Vercel.",
        "Set PORTAL_DATABASE_URL for durable shared portal state.",
      ].join(" ")
    )

    return resolveFileDatabaseUrl(VERCEL_PORTAL_DB_PATH)
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
