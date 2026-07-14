# Download Auth Backend

Server-only helpers for the gated PixeSci installer download.

## Layout

```text
src/backend/download-auth/
├── schema.ts   # Drizzle table: download_users
├── database-url.ts  # SQLite path resolution
├── db.ts            # libSQL client
├── auth.ts       # login, JWT session cookie, auth checks
├── link-lock.ts  # decrypt Link Lock URL (server-only)
└── file.ts       # resolve online download URL + redirect response

src/app/api/download/
├── login/route.ts    # POST
├── session/route.ts  # GET, DELETE
└── file/route.ts     # GET (authorized download)
```

The frontend calls these routes through `src/lib/download-access.ts`. There is
no `/api/download/url` route. The client downloads directly from
`/api/download/file`.

`/api/download/file` accepts either:

- a valid legacy `pixesci_download_session`; or
- a valid completed `pixesci_portal_session`.

Requests with neither session are rejected with the download-session expired
message. This keeps legacy download users working while allowing authenticated
portal administrators to download the installer from the portal.

## Setup

```bash
npm run db:push
npm run db:seed -- operator@example.com your-password
npm run dev
```

Users are stored in SQLite at `private/download.db` by default. Set
`DOWNLOAD_DB_PATH` to override the download database path. Absolute paths are
used as provided; relative paths are resolved inside `private/`. Add users with
the seed script or direct SQL. No admin dashboard is required.

## Environment

Required:

- `DOWNLOAD_SESSION_SECRET` (32+ characters)
- `DOWNLOAD_LINK_LOCK_URL` + `DOWNLOAD_LINK_LOCK_PASSWORD` — server decrypts a [Link Lock](https://github.com/jstrieb/link-lock) URL after app login and redirects to the online installer

Local development uses `private/download.db`. Docker Compose sets
`DOWNLOAD_DB_PATH=/data/download.db` so the download database lives in the
persistent Compose volume. Vercel runtime copies the bundled database to
`/tmp/pixesci-download.db` so route handlers can write runtime state if needed.
