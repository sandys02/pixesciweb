export type RuntimeEnvironment = "local" | "development" | "preview" | "production"

export function getRuntimeEnvironment(): RuntimeEnvironment {
  const explicit = process.env.PORTAL_DATABASE_ENV?.trim().toLowerCase()

  if (
    explicit === "local" ||
    explicit === "development" ||
    explicit === "preview" ||
    explicit === "production"
  ) {
    return explicit
  }

  if (process.env.VERCEL_ENV === "production") return "production"
  if (process.env.VERCEL_ENV === "preview") return "preview"

  const configuredUrl = process.env.PORTAL_DATABASE_URL?.trim()
  const configuredPath = process.env.PORTAL_DB_PATH?.trim()

  if (configuredPath || configuredUrl?.startsWith("file:")) return "local"
  if (process.env.NODE_ENV === "production") return "production"

  return "local"
}

export function getDatabaseSafetyState() {
  const runtime = getRuntimeEnvironment()
  const databaseUrl = process.env.PORTAL_DATABASE_URL?.trim() ?? ""
  const productionHost = process.env.PORTAL_PRODUCTION_DATABASE_URL_HOST?.trim()
  const previewUsingProduction =
    process.env.VERCEL_ENV === "preview" &&
    (runtime === "production" ||
      Boolean(productionHost && databaseUrl.includes(productionHost)))

  return {
    runtime,
    previewUsingProduction,
    databaseLabel:
      runtime === "local"
        ? "Local"
        : runtime === "development"
          ? "Development"
          : runtime === "preview"
          ? "Preview"
          : "Production",
  }
}

export function assertAdminWriteAllowed() {
  const safety = getDatabaseSafetyState()

  if (safety.previewUsingProduction) {
    return {
      ok: false as const,
      status: 403,
      message:
        "Preview admin writes are blocked because this deployment appears to target production data.",
    }
  }

  return { ok: true as const, runtime: safety.runtime }
}
