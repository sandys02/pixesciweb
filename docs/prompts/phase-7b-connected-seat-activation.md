# Phase 7b Prompt: Connected Single-Use Seat Activation

You are working across two repositories:

- website portal: `/home/japheth-oruko/projects/pixesciweb`
- local PixeSci app: `/home/japheth-oruko/projects/pixesciv2`

Goal: add a connected activation path that makes an exported seat activation
file globally single-use. When the app user pastes or imports the armored seat
activation text and clicks the setup/verify action, the app backend must call a
website portal API. The website verifies the activation, marks the invited seat
active, records acceptance in the organization portal, returns accepted seat
details plus a fresh signed license bundle, and the app creates the local user
only after that website acceptance succeeds.

This is the primary path for one-PC/global single-use enforcement. Keep the
existing local-only import path documented as an air-gapped fallback, but state
clearly that offline-only import cannot guarantee global single-use because the
portal cannot know which PC imported the file.

## Before Editing

1. In `/home/japheth-oruko/projects/pixesciweb`, read:
   - `AGENTS.md`
   - `docs/backend-completion-plan.md`
   - `docs/portal-backend-plan.md`
   - `docs/portal-user-guide.md`
   - `docs/seat-activation-import-contract.md`
   - `docs/prompts/phase-5-air-gapped-invitation-handoff.md`
   - `docs/prompts/phase-6-signed-offline-license-bundles.md`
   - `docs/prompts/phase-7-pixesciv2-app-alignment.md`
   - `src/backend/portal/AGENTS.md`
   - `src/backend/portal/README.md`
   - `src/backend/portal/activations.ts`
   - `src/backend/portal/licenses.ts`
   - `src/backend/portal/bundles.ts`
   - `src/backend/portal/schema.ts`
   - `src/backend/portal/signing.ts`
   - existing route handlers under `src/app/api/portal/**/route.ts`
2. Before touching Next route handlers, read the installed Next 16 route-handler
   and auth docs:
   - `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
   - `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
   - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
3. In `/home/japheth-oruko/projects/pixesciv2`, read:
   - `frontend-v2/package.json`
   - `requirements.txt`
   - `docs/implementation-plan/auth/ORGANIZATION_AFFILIATION_REGISTRATION_PLAN.md`
   - `docs/implementation-plan/auth/ORGANIZATION_AFFILIATION_REGISTRATION_BACKEND_TASKS.md`
   - `docs/implementation-plan/auth/ORGANIZATION_AFFILIATION_REGISTRATION_FRONTEND_TASKS.md`
   - `docs/implementation-plan/auth/EMAIL_VERIFICATION_BACKEND_IMPLEMENTATION_PROMPT.md`
   - `docs/implementation-plan/auth/EMAIL_VERIFICATION_FRONTEND_IMPLEMENTATION_PROMPT.md`
   - `backend/api/v1/endpoints/access/auth.py`
   - `backend/api/v1/endpoints/admin_organizations.py`
   - `backend/models/access/user.py`
   - `backend/tests/test_invitation_first_auth_flow.py`
   - `frontend-v2/src/features/auth/**`
   - `frontend-v2/src/services/api/auth-api.ts`
   - `frontend-v2/src/services/api/admin-api.ts`
4. Check `git status` in both repositories and preserve unrelated user changes.

## Product Decision

Connected activation is now the preferred path for customers whose app can
reach the website portal during first-time setup. The armored seat activation
file remains the handoff material, but it is submitted to the website before
local account creation.

The website API is intentionally global and unauthenticated because the signed
activation file is the bearer proof. The API must not rely on a portal-admin
session or an organization-scoped route. It must still verify that the signed
payload matches the database seat, license, and organization before changing
state.

Air-gapped activation remains available only for disconnected deployments. It
verifies the file locally and can create a local user, but it cannot prevent the
same activation file from being copied to another PC.

## Implement In `pixesciweb`

1. Add an app-facing connected activation API:
   - `POST /api/portal/seat-activations/accept`
   - request body:
     ```json
     {
       "armoredActivation": "-----BEGIN PIXESCI SEAT ACTIVATION-----..."
     }
     ```
   - require `Content-Type: application/json`;
   - return `Cache-Control: no-store`;
   - do not require `pixesci_portal_session`.

2. Add a portal backend service, preferably near `src/backend/portal/activations.ts`,
   that:
   - parses the armored activation text with the existing activation parser;
   - verifies the Ed25519 signature and `keyId` with the existing signing
     helpers;
   - validates activation version, expiry, `seatStatus="invited"`, email, role,
     license ID, organization ID, and license term fields;
   - looks up the seat globally by `seatId`, `organizationId`, and public
     `licenseId`;
   - confirms the database seat is still `invited`;
   - confirms the license is still `active`;
   - confirms the database seat email and role match the signed payload;
   - confirms the database invite has not expired;
   - atomically updates the row only when it is still invited.

3. On successful acceptance, update the seat:
   - `status = "active"`
   - `inviteAcceptedAt = now`
   - `inviteTokenHash = null`
   - `inviteExpiresAt = null`
   - `updatedAt = now`

4. Record a `seat_activation_accepted` audit event with:
   - `organizationId`
   - `actorSeatId` when available from the accepted seat row
   - target type `seat`
   - target ID equal to the public seat ID
   - metadata containing safe values only, such as `licenseId`, `keyId`, and
     `acceptedVia: "connected_activation_file"`

5. Return accepted seat details and a fresh signed license bundle generated
   after the seat becomes active. The response shape should be:
   ```json
   {
     "accepted": true,
     "seat": {
       "seatId": "seat_...",
       "email": "user@example.com",
       "role": "admin",
       "status": "active",
       "acceptedAt": "ISO timestamp"
     },
     "license": {
       "licenseId": "LIC-...",
       "organizationId": 1,
       "organizationName": "Example Org",
       "startsAt": "YYYY-MM-DD",
       "endsAt": "YYYY-MM-DD",
       "seatLimit": 5
     },
     "licenseBundle": {
       "armoredBundle": "-----BEGIN PIXESCI LICENSE BUNDLE-----...",
       "keyId": "..."
     }
   }
   ```

6. Reuse the existing Phase 6 bundle signing code. If current bundle generation
   requires a portal actor, add a server-only helper that can generate a bundle
   for a verified accepted seat using the seat/license/organization context and
   records an audit event without pretending a portal account performed the
   action.

7. Failure handling:
   - return generic messages that do not reveal whether an email or seat exists;
   - use `400` for malformed/tampered/expired/wrong-state activations;
   - use `409` when the activation was already consumed or the seat is no
     longer invited;
   - use `500` only for unexpected server failures;
   - write audit events for rejected attempts when the organization/seat can be
     safely identified from a verified payload.

8. Update website docs:
   - `docs/portal-user-guide.md`
   - `docs/seat-activation-import-contract.md`
   - `docs/backend-completion-plan.md`
   - `src/backend/portal/README.md`
   - `docs/prompts/phase-7-pixesciv2-app-alignment.md`
   These docs must distinguish connected acceptance from air-gapped fallback.

## Implement In `pixesciv2`

1. Add or update the local backend activation endpoint, for example:
   - `POST /api/v1/auth/seat-activations/accept`
   - request body:
     ```json
     {
       "armored_activation": "-----BEGIN PIXESCI SEAT ACTIVATION-----..."
     }
     ```

2. The local app backend must:
   - accept armored activation text, not a client-controlled file path;
   - submit the exact armored text to the website API configured by an explicit
     portal base URL setting;
   - reject setup if the website is unreachable, unless the user/admin has
     explicitly chosen the documented air-gapped fallback mode;
   - verify and persist the returned signed license bundle locally;
   - create the local app user only after website acceptance succeeds;
   - reject duplicate local active users for the accepted email;
   - enforce local seat capacity using the returned verified bundle;
   - record local audit events for connected activation success and failure.

3. Local user creation after successful website acceptance:
   - email comes from the accepted seat response;
   - organization ID/name and license ID come from the accepted license/bundle;
   - app role is `admin` for accepted seat role `admin`, otherwise normal user;
   - organization role is `admin` or `member`;
   - `status = "active"`;
   - `is_active = true`;
   - `is_verified = true`;
   - `must_change_password = true`.

4. Do not show or return a temporary password. If the existing forced
   password-change endpoint requires a current password, add a first-password
   setup path for authenticated activation-created users with
   `must_change_password=true`. The user should set their first local password
   after the activation-created session starts.

5. Update the login-card setup flow:
   - keep the returning-user email/password form primary;
   - keep `New user? Set up your account`;
   - setup mode supports paste and `.txt` import;
   - the submit/verify button calls the local backend connected activation
     endpoint;
   - after success, show the accepted email, role, seat ID, license ID,
     organization name, and activation status, then enter the first-time session;
   - clearly distinguish portal unreachable errors from invalid activation
     errors;
   - keep public organization registration absent.

6. Keep app runtime behavior local after activation:
   - future login uses the local app email and user-created password;
   - normal app use does not require website reachability after the license
     bundle and seat are accepted;
   - air-gapped installs can still use the documented local-only import mode,
     with clear copy that it does not enforce global single-use.

## Do Not Implement

- Public organization registration.
- Website portal account creation inside the app.
- `/portal/invite/[token]` browser acceptance UI unless separately requested.
- Device fingerprinting, installed-device inventory, endpoint usernames, IP
  collection, telemetry, or machine binding.
- Keycloak, Redis, SSO, AD/LDAP, billing/payment, or marketing-cookie features.
- Scientific file upload, run-record upload, result upload, or app telemetry to
  the website.
- Any logging of plaintext activation text, invite tokens, passwords, private
  signing keys, or license secrets.

## Acceptance Criteria

- A valid armored activation file for an invited seat can be submitted by the
  app and accepted by the website.
- The website marks that seat `active`, sets `inviteAcceptedAt`, clears invite
  token fields, and updates portal seat views to show the invite as accepted.
- Reusing the same activation file from another PC fails because the portal
  seat is no longer invited.
- The website returns a fresh signed license bundle whose seat manifest includes
  the accepted seat as active.
- The app creates the local user only after website acceptance succeeds.
- The app starts a first-time authenticated session with
  `must_change_password=true`.
- The first password setup flow lets the user create their local password
  without exposing a temporary password.
- Future login works with the local email/password.
- Tampered, malformed, expired, inactive-license, revoked-seat, already-active,
  and wrong-license activations fail closed.
- Portal unreachable does not silently fall back to weaker offline import unless
  air-gapped fallback is explicitly selected/configured.

## Verification

In `pixesciweb`:

- Add focused tests or executable checks for:
  - valid connected acceptance;
  - repeated activation rejection;
  - tampered activation rejection;
  - expired activation rejection;
  - active/revoked/missing seat rejection;
  - inactive license rejection;
  - payload/database mismatch rejection;
  - audit event creation;
  - returned bundle includes the accepted seat as active.
- Run:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

In `pixesciv2`:

- Add focused backend tests for:
  - app endpoint calls website API;
  - website rejection prevents local user creation;
  - accepted activation creates local user/session;
  - returned bundle verification/persistence;
  - first password setup for activation-created users;
  - duplicate local user rejection;
  - portal unreachable error handling.
- Run the focused backend auth/activation tests.
- In `frontend-v2`, run:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Manually verify the login-card setup flow on desktop and mobile.

## Development Fixture

Use the existing local portal fixture when available:

- email: `japhethrobert@gmail.com`
- seat ID: `seat_uJqKn6PISZbk`
- role: `admin`
- license: `LIC-PSCI-TEST-0001`
- status before connected acceptance: `invited`
- invite expires: `2026-07-17T14:23:42.701Z`

If the fixture invite has expired or was already accepted, reseed or resend the
seat invite before generating a new activation file.


once you have completed the implementation, update the files in /home/japheth-oruko/projects/pixesciv2/docs/implementation-plan/auth