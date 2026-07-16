# PixeSci Internal Admin Dashboard

The internal admin dashboard at `/admin` is for authorized PixeSci staff. It is
separate from the customer organization portal at `/portal`.

## What It Manages

- customer organizations;
- organization portal accounts;
- licenses, renewal records, license status, and seat limits;
- organization seats for review;
- one-time portal password setup and reset links;
- admin and portal audit events.

PixeSci staff accounts are stored in `admin_accounts`. Customer portal accounts
remain in `portal_accounts`. Do not reuse customer portal accounts for PixeSci
staff access.

## Auth Boundaries

- Staff admin: `/admin`, `/api/admin/*`, `pixesci_admin_session`,
  `ADMIN_SESSION_SECRET`.
- Customer portal: `/portal`, `/api/portal/*`, `pixesci_portal_session`,
  `PORTAL_SESSION_SECRET`.

An admin session does not authorize customer portal APIs as a customer. A portal
session does not authorize admin APIs.

## Bootstrap

After the portal schema has been pushed to the intended database, create the
first staff admin account:

```bash
npm run db:seed:admin -- \
  --email staff@pixesci.com \
  --password temporary-password \
  --role owner
```

The script refuses production unless explicitly confirmed:

```bash
npm run db:seed:admin -- \
  --email staff@pixesci.com \
  --password temporary-password \
  --role owner \
  --allow-production \
  --confirm-production pixesci-admin-production
```

For the shared PixeSci staff account, read the password from stdin or an
environment variable instead of passing it as a command-line argument:

```bash
read -s ADMIN_SEED_PASSWORD
export ADMIN_SEED_PASSWORD
npm run db:seed:admin -- \
  --email pixesci@gmail.com \
  --role owner \
  --reset-existing
unset ADMIN_SEED_PASSWORD
```

## Portal Customer Data Reset

PixeSci staff admin accounts and customer portal accounts are separate. PixeSci
as a customer organization must be created through `/admin` like any other
organization; do not seed it directly into the customer portal.

To remove all customer portal data while preserving staff admin accounts:

```bash
npm run db:wipe:portal-customers -- \
  --confirm DELETE_PORTAL_CUSTOMER_DATA
```

The reset removes organizations, portal accounts, organization mappings,
licenses, seats, license bundles, and portal reset tokens. It preserves
`admin_accounts` and `admin_account_reset_tokens`. In production, the command
also requires:

```bash
--allow-production --confirm-production pixesci-portal-production
```

## Database Isolation

Development, preview, and production must use separate portal/admin databases.

Recommended naming:

- development: `pixesci-portal-development`
- preview: `pixesci-portal-preview`
- production: `pixesci-portal-production`

Set `PORTAL_DATABASE_ENV` to `development`, `preview`, or `production` when
possible. Preview admin writes are blocked if the deployment appears to target
production data.

Docker Compose loads `.env.docker` and then `.env.local`. Keep Turso DB URLs and
tokens in `.env.local` or Vercel environment variables, not in tracked source.
With `.env.local` present, Docker uses the same shared Turso development DB as
local Next.js. The Compose `web` service bind-mounts the current workspace and
runs `next dev`, so admin dashboard changes can be tested in Docker with live
reload.

Required production env:

- `PORTAL_DATABASE_URL`
- `PORTAL_DATABASE_AUTH_TOKEN` when the database requires it
- `PORTAL_SESSION_SECRET`
- `ADMIN_SESSION_SECRET`
- `PORTAL_LICENSE_SIGNING_PRIVATE_KEY_PEM`
- `PORTAL_LICENSE_PUBLIC_KEY_PEM`
- `PORTAL_LICENSE_PUBLIC_KEY_ID`

Optional safety env:

- `PORTAL_DATABASE_ENV`
- `PORTAL_PRODUCTION_DATABASE_URL_HOST`
- `ADMIN_SESSION_TTL_SECONDS`

## Customer First Login

PixeSci staff now captures organization setup during onboarding. The customer
portal first-login flow shows organization details for review and asks only for:

- new portal password;
- confirm portal password.

Customers can continue editing allowed non-sensitive organization settings after
setup. Organization email remains locked.

## Organization Onboarding Defaults

Organization onboarding uses one email field: `Organization email`. That email
is stored on the organization profile and is also used for the initial customer
portal administrator account.

New organizations default to a 7-seat active license. PixeSci staff can increase
the seat limit later from the admin dashboard when a customer requests more
seats.

The create form stores country and state. Country is currently fixed to
`United States` and disabled in the UI. State uses the US state list while US is
the only supported country.

Initial licenses are annual. Staff selects the start date, and the dashboard
derives the end date as one year after the start date.

`Create one-time setup link` creates a single-use password setup link for the
customer's first portal login. The dashboard displays the plaintext link once so
PixeSci staff can send it manually. The database stores only a token hash.

`License label` is a staff-facing display name for the license, such as
`Annual organization license` or `Academia pilot`. It is not the license ID.

## Password Reset Links

Admin-created setup and reset links are single-use and expire. The dashboard
shows the plaintext link only once. The database stores only token hashes.

Email delivery uses Resend when `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are
configured. Never hardcode keys. Setup and reset links remain single-use; the
database stores only token hashes.
