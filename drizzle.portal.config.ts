import { defineConfig } from "drizzle-kit"

import { PORTAL_DATABASE_URL } from "./src/backend/portal/database-url"

export default defineConfig({
  schema: "./src/backend/portal/schema.ts",
  out: "./drizzle/portal",
  dialect: "turso",
  dbCredentials: {
    url: PORTAL_DATABASE_URL,
  },
})
