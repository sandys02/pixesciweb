import { randomBytes, scryptSync } from "node:crypto"

import { createClient } from "@libsql/client"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/libsql"

import { downloadUsers } from "../src/backend/download-auth/schema"
import { DOWNLOAD_DATABASE_URL } from "../src/backend/download-auth/database-url"

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64")
  const hash = scryptSync(password, salt, 64).toString("base64")
  return `scrypt$${salt}$${hash}`
}

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error("Usage: npm run db:seed -- <email> <password>")
  process.exit(1)
}

const client = createClient({ url: DOWNLOAD_DATABASE_URL })
const db = drizzle(client)

const normalizedEmail = email.trim().toLowerCase()
const existing = await db
  .select({ id: downloadUsers.id })
  .from(downloadUsers)
  .where(eq(downloadUsers.email, normalizedEmail))
  .limit(1)

if (existing.length > 0) {
  console.error(`User already exists: ${normalizedEmail}`)
  process.exit(1)
}

await db.insert(downloadUsers).values({
  email: normalizedEmail,
  passwordHash: hashPassword(password),
  active: true,
  createdAt: new Date().toISOString(),
})

console.log(`Created download user: ${normalizedEmail}`)
