import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import { PORTAL_DATABASE_URL } from "@/backend/portal/database-url"
import * as schema from "@/backend/portal/schema"

const client = createClient({ url: PORTAL_DATABASE_URL })

export const db = drizzle(client, { schema })
