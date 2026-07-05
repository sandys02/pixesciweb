# Download auth backend

Server-only helpers for the gated PixeSci installer download.

## Layout

```text
src/backend/download-auth/
├── schema.ts   # Drizzle table: download_users
├── db.ts       # libSQL client
├── auth.ts     # login, JWT session cookie, auth checks
└── file.ts     # read installer from private path

src/app/api/download/
├── login/route.ts    # POST
├── session/route.ts  # GET, DELETE
└── file/route.ts     # GET (authorized download)
```

The frontend calls these routes through `src/lib/download-access.ts`. There is
no `/api/download/url` route — the client downloads directly from
`/api/download/file` after login.

## Setup

```bash
npm run db:push
npm run db:seed -- operator@example.com your-password
npm run dev
```

Users are stored in SQLite (local file) or Turso (production). Add users with
the seed script or direct SQL. No admin dashboard is required.

## Environment

See `.env.example`. Required in production:

- `DATABASE_URL`
- `DOWNLOAD_SESSION_SECRET` (32+ characters)

Optional:

- `DOWNLOAD_FILE_PATH`
- `DOWNLOAD_FILE_NAME`
- `DOWNLOAD_SESSION_TTL_SECONDS`
