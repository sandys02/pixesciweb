# Portal Backend Technical Debt

This document tracks remaining implementation and operational debt in the
website auth, download, portal, license, and seat flows. It should be read
alongside `docs/portal-backend-plan.md` and `src/backend/portal/README.md`.

## Current State

The website has two same-origin auth layers:

- Download gate: `/api/download/*`, `private/download.db`, and
  `pixesci_download_session` support legacy installer-download access.
- Organization portal: `/api/portal/*`, `private/portal.db`, and
  `pixesci_portal_session` support customer organization setup, licenses,
  seats, offline files, and connected activation.

The portal is server-backed. Account setup, organization profile changes,
password changes, license lists, seat actions, activation exports, connected
activation acceptance, audit events, and signed license bundles are handled by
route handlers and portal backend helpers.

The installer route, `GET /api/download/file`, accepts either a valid legacy
download session or a completed portal session. Requests with neither session
are rejected.

## Implemented Backend Areas

Download gate:

- `POST /api/download/login`
- `GET /api/download/session`
- `DELETE /api/download/session`
- `GET /api/download/file`

Portal auth and setup:

- `POST /api/portal/login`
- `POST /api/portal/logout`
- `GET /api/portal/session`
- `POST /api/portal/account-setup`
- `POST /api/portal/password/change`

Organization, licenses, seats, bundles, and activation:

- `GET /api/portal/organization`
- `PATCH /api/portal/organization`
- `GET /api/portal/licenses`
- `GET /api/portal/licenses/{license_id}/seats`
- `POST /api/portal/licenses/{license_id}/seats/invite`
- `POST /api/portal/seats/{seat_id}/resend`
- `POST /api/portal/seats/{seat_id}/revoke-invite`
- `POST /api/portal/seats/{seat_id}/remove`
- `GET /api/portal/seats/{seat_id}/activation`
- `POST /api/portal/licenses/{license_id}/bundle`
- `GET /api/portal/licenses/{license_id}/bundle/latest`
- `POST /api/portal/seat-activations/accept`

## Current Storage And Secrets

- Download users are seeded with `npm run db:seed -- email password`.
- Portal organizations, accounts, and licenses are seeded with
  `npm run db:seed:portal -- ...`.
- Download users live in `private/download.db`.
- Portal records live in `private/portal.db` by default.
- On Vercel, bundled SQLite files are copied to `/tmp` for runtime writes.
  `/tmp` is not durable shared storage.
- Production requires download, portal session, Link Lock, and portal signing
  environment variables documented in `README.md` and backend READMEs.

## Remaining Risks

- Bundled SQLite plus `/tmp` runtime copies are not a durable production
  database strategy. Move portal and download auth state to persistent storage
  before treating the portal as long-term production source of truth.
- There is no full route-handler test suite for auth, organization scoping,
  seat capacity, bundle signing, activation acceptance, and failure cases.
- Operational backup/restore docs for portal DBs and signing keys are not
  complete.
- Signing-key rotation scripts are not implemented.
- Browser-based `/portal/invite/[token]` acceptance remains deferred.
- Manual return-file reconciliation for fully air-gapped activation remains
  deferred.
- Privacy copy should stay aligned with the fact that the website now has gated
  portal/download accounts, even though there is still no public registration,
  contact-form backend, file upload, or marketing-cookie feature.

## Download Gate Debt

The download gate remains useful for legacy installer access, but it is not the
portal identity service.

Open questions:

- Should standalone download users continue indefinitely or migrate into portal
  accounts?
- Should download user administration get an operational script beyond the
  current seed helper?
- Should `/api/download/file` eventually rely only on completed portal sessions?

Keep the current download route secure:

- keep sessions short-lived;
- keep `HttpOnly`, `Secure` in production, and `SameSite=Lax`;
- keep auth responses `Cache-Control: no-store`;
- do not expose installer files under `public/`;
- avoid logging passwords, plaintext tokens, signed URLs, or session secrets.

## Debt Closure Criteria

- Durable database or managed libSQL storage is selected and documented.
- Route-handler tests cover security-critical success and failure paths.
- Signing-key generation, rotation, backup, and restore are documented and
  scripted.
- Production privacy/deployment docs accurately describe portal data flows.
- Operational recovery paths exist for portal account reset, license renewal,
  and bundle regeneration.
