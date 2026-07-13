import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import path from "node:path"

const DEFAULT_PORTAL_DB_PATH = path.join(process.cwd(), "private", "portal.db")
const VERCEL_BUILD_PORTAL_DB_PATH = path.join(
  "/tmp",
  "pixesci-portal-build-placeholder.db"
)
const VERCEL_PORTAL_DB_PATH = path.join("/tmp", "pixesci-portal.db")
const EPHEMERAL_VERCEL_PORTAL_DB_FLAG = "ALLOW_EPHEMERAL_PORTAL_DB_ON_VERCEL"
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

    if (process.env[EPHEMERAL_VERCEL_PORTAL_DB_FLAG] !== "1") {
      throw new Error(
        [
          "PORTAL_DATABASE_URL is required on Vercel for durable portal state.",
          "The previous /tmp SQLite fallback loses created seats when serverless instances recycle.",
          `Set ${EPHEMERAL_VERCEL_PORTAL_DB_FLAG}=1 only for disposable preview/testing deployments.`,
        ].join(" ")
      )
    }

    if (!existsSync(VERCEL_PORTAL_DB_PATH)) {
      if (!existsSync(DEFAULT_PORTAL_DB_PATH)) {
        throw new Error(
          `Portal database missing at ${DEFAULT_PORTAL_DB_PATH}. Include private/portal.db in the serverless bundle.`
        )
      }

      copyFileSync(DEFAULT_PORTAL_DB_PATH, VERCEL_PORTAL_DB_PATH)
    }

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
