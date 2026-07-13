# Portal Backend

Server-only helpers for the PixeSci organization portal. The portal backend is
responsible for organization setup, portal license authentication, license
visibility, seat administration, audit events, connected seat activation, and
signed offline license bundles.

The baseline portal backend is implemented through connected activation. Use
`docs/portal-backend-plan.md`, `docs/portal-user-guide.md`, and
`docs/portal-backend-technical-debt.md` as the current operational references.

## Auth Boundaries

There are two separate authentication levels:

- Website/download gate: `/api/download/*` routes and
  `pixesci_download_session` protect legacy installer-download access.
- Portal license auth: `/api/portal/*` routes authenticate organization portal
  accounts, enforce setup state, and authorize license and seat administration.

`/portal` is protected by `pixesci_portal_session`. The installer download route
accepts either a valid legacy download session or a completed portal session.

The organization portal account is not a human PixeSci app user and must not
consume an app license seat. Human app seats are separate records owned by an
organization license.

Baseline identity decision: use local portal auth in this Next.js app. Do not
add Keycloak unless a later product decision explicitly changes the plan.
Keycloak remains a possible future customer-controlled option, but it is not
needed for the initial portal backend.

## Layout

Current implementation shape:

```text
src/backend/portal/
├── README.md
├── AGENTS.md
├── schema.ts        # Drizzle tables for portal accounts, orgs, licenses, seats, audit, bundles
├── database-url.ts  # portal database path/config
├── db.ts            # libSQL/Drizzle client
├── auth.ts          # password hashing, sessions, setup state, authorization helpers
├── licenses.ts      # license and seat business rules
├── activations.ts   # activation export and connected acceptance
├── bundles.ts       # signed offline license bundle generation/verification helpers
├── organization.ts  # organization profile read/update helpers
└── signing.ts       # Ed25519 signing, verification, and armored wrappers
```

Route handlers live under `src/app/api/portal/**/route.ts` and call server-only
helpers from this directory. Before changing route handlers, read the installed
Next 16 docs in `node_modules/next/dist/docs/`.

The portal database is separate from the download gate database:

- download gate: `private/download.db`
- portal backend: `private/portal.db` by default

Set `PORTAL_DB_PATH` to override the portal database path. Absolute paths are
used as provided; relative paths are resolved inside `private/`.

Set `PORTAL_DATABASE_URL` to use a durable libSQL/Turso database instead of a
local SQLite file. Set `PORTAL_DATABASE_AUTH_TOKEN` when that database requires
authentication.

On Vercel, production portal state must use `PORTAL_DATABASE_URL`. The old
bundled SQLite copy at `/tmp/pixesci-portal.db` is not durable shared storage
and will lose created seats when serverless instances recycle. Disposable
preview/testing deployments can temporarily opt into that behavior with
`ALLOW_EPHEMERAL_PORTAL_DB_ON_VERCEL=1`.

Portal auth uses these environment variables:

- `PORTAL_SESSION_SECRET`: required in production; use at least 32 characters.
- `PORTAL_SESSION_TTL_SECONDS`: optional session TTL override. Defaults to 20
  minutes.
- `PORTAL_DATABASE_URL`: required on Vercel for durable portal state.
- `PORTAL_DATABASE_AUTH_TOKEN`: required when the configured portal database
  needs an auth token.
- `PORTAL_LICENSE_SIGNING_PRIVATE_KEY_PEM`: required in production for signed
  activation files and license bundles.
- `PORTAL_LICENSE_PUBLIC_KEY_PEM`: required in production for verification.
- `PORTAL_LICENSE_PUBLIC_KEY_ID`: required in production as the signing key ID.

## Setup

Create or update the portal database:

```bash
npm run db:push:portal
```

Create a starting organization, portal account, and active license:

```bash
npm run db:seed:portal -- \
  --account-email admin@example.org \
  --password temporary-password \
  --organization-name "Example Lab" \
  --organization-type enterprise \
  --state Massachusetts \
  --domain example.org \
  --research-field "Bioanalytics and regulated QC" \
  --license-id LIC-PSCI-2026-0001 \
  --starts-at 2026-01-01 \
  --ends-at 2026-12-31 \
  --seat-limit 12 \
  --label "Enterprise controlled deployment"
```

The seed command creates no human app seats by default. The organization portal
account manages licenses and does not consume a PixeSci app seat.

## Required API Groups

Portal auth:

- `POST /api/portal/login`
- `POST /api/portal/logout`
- `GET /api/portal/session`
- `POST /api/portal/account-setup`
- `POST /api/portal/password/change`

Organization profile:

- `GET /api/portal/organization`
- `PATCH /api/portal/organization`

Licenses and seats:

- `GET /api/portal/licenses`
- `GET /api/portal/licenses/{license_id}/seats`
- `POST /api/portal/licenses/{license_id}/seats/invite`
- `POST /api/portal/seats/{seat_id}/resend`
- `POST /api/portal/seats/{seat_id}/revoke-invite`
- `POST /api/portal/seats/{seat_id}/remove`

Connected-flow acceptance:

- `POST /api/portal/seat-activations/accept`

Deferred browser invite acceptance:

- `POST /api/portal/invitations/{token}/accept`

For connected customers, Phase 7b uses the exported armored seat activation
file as the bearer proof: the app submits it to
`/api/portal/seat-activations/accept`, the portal verifies it, marks the seat
active, and returns a fresh signed license bundle. For air-gapped customers,
signed seat activation files and license bundles can still be imported locally
without a live portal call.

## Data Boundaries

Allowed portal data:

- organization profile fields needed for onboarding and support;
- portal account identity, setup, session, and recovery state;
- license IDs, term dates, status, seat limits, and signed bundle metadata;
- human seat email, role, status, invitation lifecycle, and timestamps;
- audit events for portal, license, seat, and bundle administration.

Forbidden baseline data:

- scientific work data, files, results, local run records, SOP content, or
  experiment details;
- endpoint usernames, device inventory, IP addresses, telemetry, or internal
  deployment topology;
- payment/billing data, marketing-cookie data, or contact-form data;
- private implementation architecture for customer-facing visuals or public
  copy.

Only expand this data scope after a separate product and compliance decision.

## Security Rules

- Treat every route handler as a public HTTP endpoint until authentication,
  organization scope, and authorization checks pass.
- Store password hashes and token hashes only. Never store plaintext passwords,
  temporary credentials, invite tokens, session secrets, signed URLs, private
  signing keys, or license secrets.
- Never log passwords, plaintext tokens, signed URLs, session secrets, private
  signing keys, or license secrets.
- Return generic authentication errors to avoid user enumeration.
- Enforce `must_change_password` and setup-complete state server-side.
- Scope every portal query by organization. Never trust IDs from the client
  without checking that they belong to the signed-in organization.
- Enforce seat capacity server-side. Pending invites count against capacity;
  frontend checks are only user experience.
- Keep inactive-license seat responses minimal in normal portal APIs: historical
  seat ID and status only.
- Use structured request validation and explicit server-side authorization for
  all route handlers.
- Use `HttpOnly`, `Secure` in production, `SameSite=Lax`, short-lived sessions,
  and `Cache-Control: no-store` for auth responses.

## Air-Gapped License Direction

Air-gapped license enforcement and seat activation must work without a live
portal call. The portal generates signed offline license bundles and signed seat
activation files that encode license ID, edition, organization ID, term, seat
limit, seat invite details where applicable, key ID, and signature.

The PixeSci app should verify bundles locally with bundled public keys and use
the verified data for local license and seat enforcement. Private signing keys
remain server-side only. Revocation for disconnected installs takes effect when
the customer imports a newer signed bundle.

Seat activation files are exported for pending invited seats only. Exporting an
activation file does not mark the portal seat active by itself. Connected
acceptance marks the portal seat active when the app submits the activation
file to the website. Disconnected imports remain local-only, so the portal
cannot prove import happened unless a later return-file flow is added. See
`docs/seat-activation-import-contract.md` for the app-side import contract.

Current development fixture:

- email: `japhethrobert@gmail.com`
- seat id: `seat_uJqKn6PISZbk`
- role: `admin`
- license: `LIC-PSCI-TEST-0001`
- status: `invited`
- invite expires: `2026-07-17T14:23:42.701Z`

The original plaintext invite link cannot be recovered from the database after
creation because only token hashes are stored. Use the seat `Resend` action if
a fresh one-time link is needed; use `Export activation` for the supported
air-gapped app handoff.

## Verification Expectations

Implementation changes should run:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Security-critical route work should also add focused tests for auth failures,
setup enforcement, organization scoping, seat capacity, inactive-license
minimal responses, single-use/expiring invite tokens, and license bundle
signature verification.
