import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const downloadUsers = sqliteTable("download_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
})

export type DownloadUser = typeof downloadUsers.$inferSelect
