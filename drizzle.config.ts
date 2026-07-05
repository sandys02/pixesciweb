import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/backend/download-auth/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./private/download.db",
  },
})
