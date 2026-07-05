import { defineConfig } from "drizzle-kit"

import { DOWNLOAD_DATABASE_URL } from "./src/backend/download-auth/database-url"

export default defineConfig({
  schema: "./src/backend/download-auth/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: DOWNLOAD_DATABASE_URL,
  },
})
