import { copyFileSync, existsSync } from "node:fs"
import path from "node:path"

const BUNDLED_DB_PATH = path.join(process.cwd(), "private", "download.db")

function resolveDownloadDatabasePath() {
  if (process.env.VERCEL === "1") {
    const tmpPath = path.join("/tmp", "pixesci-download.db")

    if (!existsSync(tmpPath)) {
      if (!existsSync(BUNDLED_DB_PATH)) {
        throw new Error(
          `Download database missing at ${BUNDLED_DB_PATH}. Include private/download.db in the serverless bundle.`
        )
      }

      copyFileSync(BUNDLED_DB_PATH, tmpPath)
    }

    return tmpPath
  }

  return BUNDLED_DB_PATH
}

export const DOWNLOAD_DATABASE_PATH = resolveDownloadDatabasePath()
export const DOWNLOAD_DATABASE_URL = `file:${DOWNLOAD_DATABASE_PATH}`
