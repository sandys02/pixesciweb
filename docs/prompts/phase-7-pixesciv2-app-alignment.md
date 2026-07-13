# Phase 7 Prompt: PixeSci App Alignment

Status: historical cross-repository implementation prompt. Phase 7 app
alignment work has been implemented separately in `pixesciv2`; keep this file
as a record of the original task constraints.

You are working in `/home/japheth-oruko/projects/pixesciv2`.

Goal: complete Phase 7 from
`/home/japheth-oruko/projects/pixesciweb/docs/backend-completion-plan.md`: make
the PixeSci app consume the website portal contract cleanly, work offline after
license bundle and seat activation import, and support invited human app users
without reintroducing public organization registration.

The prompt is stored in
`/home/japheth-oruko/projects/pixesciweb/docs/prompts`, but execution happens in
this current project: `/home/japheth-oruko/projects/pixesciv2`.

## Before Editing

1. In this repo, read:
   - `frontend-v2/package.json`
   - `requirements.txt`
   - `docs/implementation-plan/auth/ORGANIZATION_AFFILIATION_REGISTRATION_PLAN.md`
   - `docs/implementation-plan/auth/ORGANIZATION_AFFILIATION_REGISTRATION_FRONTEND_TASKS.md`
   - `docs/implementation-plan/auth/ORGANIZATION_AFFILIATION_REGISTRATION_BACKEND_TASKS.md`
   - `docs/implementation-plan/auth/EMAIL_VERIFICATION_FRONTEND_IMPLEMENTATION_PROMPT.md`
   - `docs/implementation-plan/auth/EMAIL_VERIFICATION_BACKEND_IMPLEMENTATION_PROMPT.md`
2. Inspect relevant current app code, especially:
   - `backend/api/v1/endpoints/admin_organizations.py`
   - `backend/api/v1/endpoints/access/auth.py`
   - `backend/models/access/user.py`
   - `backend/models/user.py`
   - `backend/migrations/phase15_user_organization_auth_columns.py`
   - `backend/tests/test_invitation_first_auth_flow.py`
   - `frontend-v2/src/services/api/admin-api.ts`
   - `frontend-v2/src/services/api/auth-api.ts`
   - `frontend-v2/src/features/auth/**`
   - `frontend-v2/src/features/admin/components/layout/Users.tsx`
   - `frontend-v2/src/features/admin/components/layout/License.tsx`
   - `frontend-v2/src/data/auth-sample-*.ts`
   - `frontend-v2/src/data/sample-license.ts`
3. Then read the website project docs in
   `/home/japheth-oruko/projects/pixesciweb/docs`, especially:
   - `/home/japheth-oruko/projects/pixesciweb/package.json`
   - `backend-completion-plan.md`
   - `portal-backend-plan.md`
   - `portal-backend-technical-debt.md`
   - `prompts/phase-0-portal-backend-guardrails.md`
   - `prompts/phase-1-portal-database-schema.md`
   - `prompts/phase-2-portal-auth-service.md`
   - `prompts/phase-3-organization-api.md`
   - `prompts/phase-4-license-seat-apis.md`
   - `prompts/phase-5-air-gapped-invitation-handoff.md` if present
   - `prompts/phase-6-signed-offline-license-bundles.md`
   - `seat-activation-import-contract.md`
4. Read `/home/japheth-oruko/projects/pixesciweb/AGENTS.md`.
5. Check `git status` in `pixesciv2` and preserve unrelated user changes.

## Current Product Constraints

- Organization onboarding is owned by the website portal, not this app.
- Do not reintroduce public organization registration in the app.
- App roles are only `admin` and `member`; normalize legacy elevated roles to
  `admin` semantics where needed.
- The website portal organization account is not a human app user and must not
  consume an app license seat.
- Human app users are local app users and consume license seats.
- The app must work fully disconnected after importing a signed offline license
  bundle and signed seat activation file.
- The app must not require live website availability after activation/import.
- `/health` remains auth-page readiness; do not gate login on feature endpoints.
- Website-owned `/portal/invite/[token]` acceptance is deferred. Do not build
  or depend on that route for this phase.
- The Phase 7 baseline first-time invited-user path is portal
  `Export activation`, transfer the armored file, `New user? Set up your
  account` on the login card, local app import, first-time session,
  forced password-change dialog, then normal local app login. Phase 7b extends
  this with connected acceptance through the website so the same activation
  file cannot be used on more than one PC.

## Implement

1. Add local signed license bundle import and verification.
   - Consume the Phase 6 armored bundle format from `pixesciweb`.
   - Verify Ed25519 signatures using trusted public keys bundled/configured in
     the app.
   - Support `keyId` and multiple trusted public keys.
   - Reject tampered payloads, unknown keys, expired licenses, inactive
     licenses, malformed bundles, and organization mismatches.
   - Persist verified local license state in the backend.
   - Store only the fields needed for offline enforcement: license ID,
     organization ID/name, term, seat limit, features, bundle version, key ID,
     issued time, and optional seat manifest.
   - Do not store portal secrets, invite tokens, token hashes, password hashes,
     scientific work data, telemetry, device inventory, IP addresses, endpoint
     usernames, or deployment topology.

2. Connect app license enforcement to local backend truth.
   - `Admin > License` must show local verified license state, not sample data.
   - Active and pending human users count against seat capacity.
   - Pending invited users count against capacity.
   - Inactive/historical license data remains minimal.
   - Frontend sample license/user/invitation fallbacks should be removed from
     production paths once backend endpoints are reliable.

3. Add signed seat activation import and first-time app user setup.
   - Consume the Phase 5 armored activation format:
     `-----BEGIN PIXESCI SEAT ACTIVATION-----` through
     `-----END PIXESCI SEAT ACTIVATION-----`.
   - Verify Ed25519 signatures through the local backend before trusting any
     decoded fields.
   - Use existing best-fit technologies before adding dependencies: Python
     `cryptography` for backend Ed25519 verification, existing SQLAlchemy/local
     auth models for persistence, and Tauri dialog/fs plugins plus a browser
     file-input fallback for frontend file selection.
   - Reject malformed files, unsupported activation versions, unknown keys,
     invalid signatures, expired activations, wrong organization/license,
     non-invited seat status, duplicate local users, and exhausted local seat
     capacity.
   - Return only safe decoded details to the UI: email, role, seat ID, license
     ID, organization name, and activation expiry.
   - Create or prepare the local app user only after verification.
   - Prefer returning an authenticated first-time session with
     `must_change_password=true` so the existing forced password-change dialog
     is the first required in-app step.
   - Do not show a temporary password by default; use a one-time temporary
     password display only as a fallback if automatic first-time session
     creation is not technically possible.
   - For disconnected installs, do not send an import callback to the website;
     disconnected installs cannot rely on website availability. For Phase 7b
     connected activation, the app must call the website acceptance API before
     creating the local user.

4. Update login-page UX for first-time invited users.
   - Keep the existing email/password login form primary for returning users.
   - Under the form, add `New user? Set up your account`, where
     `Set up your account` is a link-style button.
   - Clicking `Set up your account` should swap the whole login card into setup
     mode, not navigate to a public registration page.
   - Setup mode must offer two choices: paste the armored activation message or
     import a `.txt` file.
   - After file import and backend verification, show the decoded seat details
     and provide a clear final setup action.
   - After final setup, direct the user into the app and let the existing forced
     password-change dialog collect the new password.
   - Do not expose public organization registration language.
   - Explain only that activation files come from the user's organization admin.
   - Surface verification failures clearly without leaking key or parsing
     internals.
   - Ensure the layout is polished on desktop and mobile, with no clipped or
     overlapping text.

5. Harden admin user and invitation endpoints.
   - Keep the existing `/api/v1/admin/organizations/{organization_id}/users` and
     invitation-related contracts unless a small compatibility adapter is
     needed.
   - Replace placeholder resend/revoke responses with persisted state
     transitions.
   - Enforce organization scope on every query and mutation.
   - Enforce active verified license capacity before creating or re-inviting a
     user.
   - Prevent duplicate active users and duplicate pending invites by email.
   - Count pending invites against capacity.
   - Prevent removing/deactivating/demoting the last active `admin`.
   - Store only hashed temporary credentials or invitation tokens.
   - Require invited users to change temporary passwords before normal app use.
   - Do not require invited emails to match the organization domain.

6. Complete the invited-user login path.
   - For testing, use the existing or created user:
     - email: `pixesci@gmail.com`
     - password: `xh%QWKK72#^2o6y^OzqeYl`
   - For the current activation-file fixture, use:
     - email: `japhethrobert@gmail.com`
     - seat ID: `seat_uJqKn6PISZbk`
     - role: `admin`
     - license: `LIC-PSCI-TEST-0001`
     - status: `invited`
     - invite expires: `2026-07-17T14:23:42.701Z`
   - Once `japhethrobert@gmail.com` imports the signed activation file and sets
     a local app password, that user should be able to log in to this app.
   - Login must block inactive, revoked, expired-invite, and disabled users.
   - Users with `must_change_password=true` must be forced through the existing
     password-change UI before reaching normal app screens.

7. Align frontend admin pages.
   - `Admin > Users` should use backend data and surface backend errors for
     duplicate email, missing active license, exhausted seat capacity, invalid
     role assignment, resend cooldown, revoked invite, and last-admin
     protection.
   - `Admin > License` should show license state, seat limit, allocated seats,
     pending invites, days remaining, bundle metadata, and verification status
     from local backend truth.
   - Keep UI focused on human app users and license seats, not website portal
     accounts or public organization registration.

8. Add local audit events.
   - Record license bundle import, license verification failure,
     activation/import success, user creation/invite, invite resend, invite
     revoke, user activation, user deactivation, role change, seat-capacity
     failure, and failed authorization.
   - Never log plaintext passwords, temporary credentials, invite tokens, bundle
     secrets, or private keys.

## Do Not Implement

- Public organization registration.
- Website portal account creation inside the app.
- Live website dependency for login or local feature use.
- Keycloak, Redis, cloud auth, SSO, AD/LDAP, billing/payment, telemetry, file
  uploads, device tracking, or scientific data collection.
- A new marketing/contact flow.
- Any changes in `/home/japheth-oruko/projects/pixesciweb` except reading docs
  if needed.

## Acceptance Criteria

- A signed offline license bundle generated by the website portal can be
  imported and verified locally.
- A signed seat activation file exported by the website portal can be imported
  and verified locally from the first-time app login/activation flow.
- Tampered, expired, inactive, malformed, or unknown-key bundles fail closed.
- Tampered, expired, malformed, wrong-key, wrong-license, or unsupported seat
  activation files fail closed.
- App admin license state comes from local verified backend state.
- Seat capacity is enforced from active plus pending human app users.
- Pending invites count against capacity.
- Admin user/invitation actions persist and survive refresh/restart.
- Public app registration remains removed or a contact handoff only.
- `pixesci@gmail.com` can complete the required temporary-password flow and log
  in after invitation/acceptance state is valid.
- After `japhethrobert@gmail.com` imports the activation file, enters the app in
  a first-time session, and changes the password through the existing dialog,
  that user can log in to the app.
- No app feature requires the website to be reachable after bundle import.
- `/health` remains usable for auth-page readiness.

## Verification

1. Run backend tests covering:
   - license bundle import success
   - tampered bundle failure
   - expired/inactive bundle failure
   - unknown key failure
   - seat capacity enforcement
   - pending invite capacity accounting
   - duplicate email rejection
   - resend/revoke persisted state
   - last-active-admin protection
   - inactive/revoked/expired user login blocking
   - `must_change_password` login response
   - seat activation import success
   - malformed/tampered/expired/unknown-key activation failure
   - activation import duplicate-user and capacity failure
2. Run frontend checks:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
3. Run backend checks used by this repo, including the focused auth/admin tests.
4. Manually verify:
   - import a valid signed bundle
   - admin license page reflects local verified license state
   - invite/create user below capacity succeeds
   - invite/create user at capacity fails cleanly
   - revoke/resend actions persist
   - login page exposes `New user? Set up your account` without public
     registration
   - setup mode supports paste and `.txt` import
   - activation import shows decoded details for `japhethrobert@gmail.com`,
     `seat_uJqKn6PISZbk`, and `LIC-PSCI-TEST-0001`
   - `pixesci@gmail.com` login forces password change when required
   - activated user `japhethrobert@gmail.com` is sent into the app, forced to
     change password, and can later log in with the chosen password
   - app remains usable with the website offline after license import

## Final Response

- Summarize backend, frontend, and test changes.
- State verification commands and results.
- State manual login/license/import checks and results.
- Explicitly confirm that public organization registration was not
  reintroduced.
