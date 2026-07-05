import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "@/backend/download-auth/schema"

const databaseUrl =
  process.env.DATABASE_URL ?? "file:./private/download.db"

const client = createClient({ url: databaseUrl })

export const db = drizzle(client, { schema })
