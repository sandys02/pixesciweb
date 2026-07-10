# Backend Completion Plan

Date: 2026-07-10

This plan turns the completed portal frontend into a real organization, license,
and seat backend while keeping the public download gate intact. It also defines
the shared contract with the PixeSci app at
`/home/japheth-oruko/projects/pixesciv2`.

## Decision Summary

Use a small local auth and licensing backend inside the existing Next.js app.
Do not add Keycloak for the first production backend.

Rationale:

- The portal needs one organization admin account, forced first password
  change, organization profile storage, license visibility, and seat lifecycle.
  This is a small bounded identity model.
- The PixeSci app already documents a local-only auth direction for air-gapped
  installs in `pixesciv2/docs/architecture/local-auth-design.md`.
- Keycloak can run locally and supports realm import/export, containers, admin
  recovery, and temporary credentials, but it adds a JVM service, database,
  realm lifecycle, operational docs, backup/restore, upgrade work, and customer
  admin burden that are not required for the current portal.
- Air-gapped license enforcement should not depend on live portal calls.
  Runtime enforcement belongs in signed offline license bundles that the app can
  verify locally with a bundled public key.

References checked:

- Next 16 route handlers and auth guidance in
  `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
  and `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.
- OWASP Authentication, Password Storage, and Session Management cheat sheets.
- Keycloak server docs for containers, realm import/export, database config, and
  bootstrap admin recovery.
- Keygen offline-license docs for signed offline license-file patterns.
- Node.js crypto docs for signing and verification support.

## Non-Goals

- Do not replace the website visitor/demo booking experience.
- Do not touch the current public website gate unless a phase explicitly moves
  `/portal` off `pixesci_download_session`.
- Do not add cloud-only auth, SaaS license checks, telemetry, file upload,
  scientific work data, endpoint inventory, local run records, or deployment
  topology collection.
- Do not add app-side public organization registration. App `Register` should
  remain removed or become `Contact PixeSci`.
- Do not implement AD/LDAP, SAML, SSO, device management, payment billing, or
  multi-region infrastructure in the baseline.

## Target Architecture

There are two separate authentication levels:

1. Website gate: the existing download/portal sign-in gate. It protects access
   to the installer and currently protects `/portal`. This gate is not the seat
   system and should stay simple until it is intentionally replaced.
2. Portal license auth: organization portal accounts and human app seats. The
   organization portal account manages licenses and seats but does not consume a
   PixeSci app seat. Human app users consume seats only after invite acceptance
   or local app activation.

Backend responsibilities:

- Website portal stores organization account, setup state, license records,
  seat invites, and signed offline license bundles.
- PixeSci app imports or receives signed license bundles, verifies them locally,
  and manages local users through the app's local auth model.
- Shared data contract between website and app is the signed license bundle plus
  a small activation/seat manifest, not a live cloud dependency.

## Suggested Packages

Install only if the implementation phase needs them:

- `zod`: request/response validation for route handlers and reusable contracts.
- `@node-rs/argon2` or `argon2`: password hashing if staying with Node route
  handlers. Prefer Argon2id. If native install friction becomes a problem, keep
  Node `scrypt` temporarily but wrap it behind a versioned password-hash helper.
- `nanoid`: opaque IDs and non-secret display IDs. Use `crypto.randomBytes` for
  secrets/tokens.

No package needed for JWTs or signatures yet because `jose` is already present
and Node crypto can sign/verify Ed25519.

## Phase 0: Repo Guardrails And Contracts

Goal: make future Codex runs effective and prevent scope drift.

Work:

- Add `docs/backend-completion-plan.md` as the execution source of truth.
- Add `src/backend/portal/README.md` with the portal backend purpose, auth
  boundaries, future layout, endpoint groups, data boundaries, security rules,
  audit expectations, and signed offline license direction.
- Add a focused `src/backend/portal/AGENTS.md` before coding backend internals.
  It should instruct agents to keep portal auth local, avoid Keycloak unless a
  new product decision changes this plan, hash secrets, scope all queries by
  organization, and never log tokens/passwords/license secrets.
- Add a matching `pixesciv2` implementation note later, not from this repo
  unless that work is explicitly requested, stating that app login is local and
  license verification is offline-bundle based.
- Read Next 16 route-handler docs before every API implementation pass.

Acceptance:

- A future agent can implement one phase without reading unrelated marketing
  content.
- Public/private boundaries and the two-auth-level model are written down.
- The portal backend directory has local documentation that prevents scope drift
  before Phase 1 schema work starts.

## Phase 1: Portal Database Schema

Goal: replace browser storage and dummy data with server truth.

Work:

- Keep SQLite/libSQL and Drizzle for now. It is already in the repo and is
  enough for the portal's current size.
- Add `src/backend/portal/schema.ts`, `db.ts`, and migration scripts.
- Tables:
  - `portal_accounts`: email, password_hash, active, role, must_change_password,
    setup_completed_at, failed_login_count, locked_until, timestamps.
  - `organizations`: type, country, state, name, email, domain, research_field,
    timestamps.
  - `portal_account_organizations`: account_id, organization_id, role.
  - `licenses`: license_id, organization_id, status, starts_at, ends_at,
    seat_limit, label, signed_bundle_version, timestamps.
  - `seats`: seat_id, organization_id, license_id, email, role, status,
    invite_token_hash, invite_expires_at, invite_accepted_at, timestamps.
  - `audit_events`: organization_id, actor_account_id, actor_seat_id,
    event_type, target_type, target_id, metadata_json, created_at.
  - `license_bundles`: license_id, organization_id, bundle_version,
    payload_json, signature, public_key_id, generated_by, generated_at,
    revoked_at.
- Seed/admin CLI:
  - create organization portal account with temporary password or one-time setup
    token;
  - create license record;
  - optionally create the first admin app seat invite.

Acceptance:

- `npm run db:push` creates portal tables.
- A seed command can create one organization, one portal account, one active
  license, and no human app seats by default.
- No portal state depends on browser storage.

## Phase 2: Portal Auth Service

Goal: implement the organization portal account lifecycle.

Work:

- Add route handlers:
  - `POST /api/portal/login`
  - `POST /api/portal/logout`
  - `GET /api/portal/session`
  - `POST /api/portal/account-setup`
  - `POST /api/portal/password/change`
- Use `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`, short
  session TTL, `Cache-Control: no-store`.
- Store password hashes with a versioned format.
- Store only token hashes for setup/invite tokens.
- Force Account Setup while `must_change_password=true` or setup is incomplete.
- Require current password for password changes.
- Add rate limiting/backoff for login, setup, resend, invite, and password
  change. Start with SQLite-backed counters, not Redis.
- Return generic auth errors to avoid user enumeration.

Acceptance:

- `/portal` uses portal session state, not local storage setup state.
- Account Setup persists organization profile and clears
  `must_change_password`.
- License and seat APIs are blocked until setup is complete.
- Existing download file access still works.

## Phase 3: Organization API

Goal: make portal Settings real.

Work:

- Add route handlers:
  - `GET /api/portal/organization`
  - `PATCH /api/portal/organization`
- Allow updates to state, organization type, name, domain, and research field.
- Keep organization email locked until a verified email-change workflow exists.
- Validate input with shared schemas.
- Audit profile changes.

Acceptance:

- Settings loads and saves through the backend.
- Organization email cannot be silently changed.
- All returned data is scoped to the signed-in organization.

## Phase 4: License And Seat APIs

Goal: make the license dashboard authoritative.

Work:

- Add route handlers:
  - `GET /api/portal/licenses`
  - `GET /api/portal/licenses/{license_id}/seats`
  - `POST /api/portal/licenses/{license_id}/seats/invite`
  - `POST /api/portal/seats/{seat_id}/resend`
  - `POST /api/portal/seats/{seat_id}/revoke-invite`
  - `POST /api/portal/seats/{seat_id}/remove`
- Backend rules:
  - pending invites count against seat capacity;
  - portal account never consumes a seat;
  - active owner/first-admin seat has no default row action;
  - non-owner active seat can be removed;
  - invited seat can be revoked or resent;
  - revoked seat can be invited again only when capacity is available;
  - inactive license seat rows return only historical seat id and status in the
    normal portal view.
- Add audit events for all seat and license actions.

Acceptance:

- The frontend no longer imports `src/data/portal.ts` for live state.
- Seat limits are enforced server-side.
- Inactive licenses expose minimal historical seat data.

## Phase 5: Invitation Acceptance And App Handoff

Goal: connect portal seat invitations to app user creation without adding public
app registration.

Work:

- Choose one acceptance path:
  - website-owned: `POST /api/portal/invitations/{token}/accept` verifies email
    ownership and marks seat active; or
  - app-owned: portal generates a signed invite/activation file that the app
    imports locally.
- For air-gapped installs, prefer app-owned acceptance:
  - portal exports an invite bundle for each seat;
  - app imports bundle, verifies signature, creates local user with
    must-change-password or local invite flow;
  - app stores local audit event and reports nothing back unless a manual
    activation return file is later added.
- If website-owned acceptance is used for connected customers, keep it optional
  and do not make it required for offline operation.

Acceptance:

- A human seat can be invited and activated without public app registration.
- Disconnected customers can activate seats without the app calling the website.
- The app local auth model remains authoritative for local login.

## Phase 6: Signed Offline License Bundles

Goal: make air-gapped license enforcement independent of live portal checks.

Work:

- Add license bundle generator:
  - canonical JSON payload;
  - fields: bundle_version, license_id, organization_id, organization_name,
    starts_at, ends_at, seat_limit, features, issued_at, key_id;
  - optional seat manifest with invited/active emails if the customer needs
    preallocated seats;
  - Ed25519 signature over canonical payload bytes;
  - PEM or armored text file for customer transfer.
- Keep private signing key server-side only.
- Bundle public verification key into the PixeSci app.
- Support key rotation with `key_id` and multiple trusted public keys in app.
- Add bundle export/download route for portal admins.
- Add revoke/regenerate workflow in portal records. For fully disconnected
  installs, revocation only takes effect when the customer imports a newer
  bundle.

Acceptance:

- App can verify license status, term, seat limit, and features offline.
- Tampering with the bundle fails verification.
- Portal records every bundle generation and export.

## Phase 7: PixeSci App Alignment

Goal: make `pixesciv2` consume the portal contract cleanly.

Work in `pixesciv2` when requested:

- Keep local auth and first-run admin setup as documented.
- Remove or keep removed public organization registration.
- Add license import/verification service.
- Add admin License page integration with local verified license state.
- Enforce local seat/device limits using the verified bundle and local users.
- Add local audit events for import, activation, user creation, seat changes,
  device changes, and failed license verification.
- Keep `/health` as auth-page readiness; do not gate login on feature endpoints.

Acceptance:

- App works in a fully disconnected environment after bundle import.
- App admin pages show users, seats, and license state from local backend truth.
- No app feature requires website availability after activation/import.

## Phase 8: Operational Hardening

Goal: close production risks without overbuilding.

Work:

- Add focused tests for every route handler:
  - auth success/failure/rate-limit;
  - setup required;
  - organization scoping;
  - seat capacity;
  - inactive license minimal response;
  - invite token single-use/expiry;
  - bundle signature verification.
- Add scripts:
  - create portal account;
  - reset portal account;
  - create/renew license;
  - generate license bundle;
  - rotate signing key.
- Document backup/restore for portal SQLite database and signing keys.
- Add `.env.example` entries:
  - `PORTAL_SESSION_SECRET`
  - `PORTAL_DB_PATH`
  - `PORTAL_LICENSE_SIGNING_KEY_PATH`
  - `PORTAL_LICENSE_PUBLIC_KEY_ID`
- Review privacy page if the portal goes beyond the current gated download and
  starts storing organization account data in production.

Acceptance:

- `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- Backend route tests cover the security-critical flows.
- Recovery and signing-key handling are documented.

## Recommended Codex Execution Order

Run one phase per Codex task, with a narrow prompt and acceptance criteria.

1. Phase 0 documentation and backend agent instructions.
2. Phase 1 schema plus seed command.
3. Phase 2 portal auth and session replacement.
4. Phase 3 organization settings API and frontend connection.
5. Phase 4 license/seat APIs and frontend connection.
6. Phase 6 signed bundle generation and verification tests.
7. Phase 5/7 app handoff after the bundle contract is stable.
8. Phase 8 hardening and operational docs.

This order avoids overengineering because the app does not need a live portal
integration before the offline bundle contract exists.
