import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import path from "node:path"

const DEFAULT_DOWNLOAD_FILE = path.join(
  "private",
  "downloads",
  "pixesci-download-backend-pending.txt"
)

export function getDownloadFileConfig() {
  return {
    path: process.env.DOWNLOAD_FILE_PATH ?? path.join(process.cwd(), DEFAULT_DOWNLOAD_FILE),
    fileName: process.env.DOWNLOAD_FILE_NAME ?? "PixeSci-installer.exe",
  }
}

export async function readAuthorizedDownloadFile() {
  const config = getDownloadFileConfig()

  if (!existsSync(config.path)) {
    return null
  }

  const data = await readFile(config.path)
  return { data, fileName: config.fileName }
}

export function createDownloadFileResponse(data: Buffer, fileName: string) {
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
