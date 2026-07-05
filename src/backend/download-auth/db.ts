import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import { DOWNLOAD_DATABASE_URL } from "@/backend/download-auth/database-url"
import * as schema from "@/backend/download-auth/schema"

const client = createClient({ url: DOWNLOAD_DATABASE_URL })

export const db = drizzle(client, { schema })
