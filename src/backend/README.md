# Download auth backend

Server-only helpers for the gated PixeSci installer download.

## Layout

```text
src/backend/download-auth/
├── schema.ts   # Drizzle table: download_users
├── database-url.ts  # hardcoded SQLite path
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
no `/api/download/url` route — the client downloads directly from
`/api/download/file` after login.

## Setup

```bash
npm run db:push
npm run db:seed -- operator@example.com your-password
npm run dev
```

Users are stored in SQLite at `private/download.db` (path set in
`database-url.ts`). Add users with the seed script or direct SQL. No admin
dashboard is required.

## Environment

See `.env.example`. Required:

- `DOWNLOAD_SESSION_SECRET` (32+ characters)
- `DOWNLOAD_LINK_LOCK_URL` + `DOWNLOAD_LINK_LOCK_PASSWORD` — server decrypts a [Link Lock](https://github.com/jstrieb/link-lock) URL after app login and redirects to the online installer

Database URL is hardcoded in `src/backend/download-auth/database-url.ts`, not
loaded from environment variables.
