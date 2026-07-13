# Phase 7b Restart Context

This file captures the relevant context from the Phase 7b work so a future
session can resume without reconstructing the chat.

Status: historical restart/context note. Phase 7b connected activation has been
implemented; use this file for provenance and troubleshooting context, not as
the primary current architecture document.

## Repositories

- Website portal: `/home/japheth-oruko/projects/pixesciweb`
- Local PixeSci app: `/home/japheth-oruko/projects/pixesciv2`

## Branches

Website repo branch was not explicitly rechecked at the end of the chat.

App repo branch:

```text
updated-auth
```

At the time of the check, app repo status showed:

```text
## updated-auth...origin/updated-auth
```

Latest app commit:

```text
7a64d061 update auth
```

That commit was also decorated with local branch `backend`, but `HEAD` was on
`updated-auth`.

## Phase 7b Goal

Add connected single-use seat activation:

1. Portal admin exports an armored seat activation file for an invited seat.
2. Invited user pastes or imports it in the local PixeSci app setup flow.
3. App backend submits the armored activation text to the website portal API.
4. Website verifies the signed activation and database state.
5. Website atomically marks the seat `active`.
6. Website clears invite token fields and records audit events.
7. Website returns accepted seat details and a fresh signed license bundle.
8. App creates the local user only after website acceptance succeeds.
9. Reusing the same activation file fails because the portal seat is no longer
   `invited`.

Air-gapped local-only import remains documented as a fallback, but it cannot
guarantee global single-use because the portal cannot know which PC imported
the file.

## Website Changes Implemented

Files changed or added in `/home/japheth-oruko/projects/pixesciweb`:

- `src/app/api/portal/seat-activations/accept/route.ts`
- `src/backend/portal/activations.ts`
- `src/backend/portal/auth.ts`
- `src/backend/portal/bundles.ts`
- `src/backend/portal/README.md`
- `docs/backend-completion-plan.md`
- `docs/portal-backend-plan.md`
- `docs/portal-user-guide.md`
- `docs/seat-activation-import-contract.md`
- `docs/seat-activation-instructions.md`
- `docs/prompts/phase-7-pixesciv2-app-alignment.md`
- `docs/prompts/phase-7b-connected-seat-activation.md`

Main behavior added:

- New unauthenticated app-facing portal endpoint:

```text
POST /api/portal/seat-activations/accept
```

- Request body:

```json
{
  "armoredActivation": "-----BEGIN PIXESCI SEAT ACTIVATION-----..."
}
```

- Requires JSON content type.
- Does not require `pixesci_portal_session`.
- Returns `Cache-Control: no-store`.
- Verifies:
  - armored activation parse;
  - Ed25519 signature;
  - `keyId`;
  - activation version;
  - expiry;
  - `seatStatus = "invited"`;
  - email, role, license ID, organization ID, license term fields;
  - database seat still invited;
  - license still active;
  - invite not expired;
  - payload/database match.
- On success:
  - sets seat status to `active`;
  - sets `inviteAcceptedAt`;
  - clears `inviteTokenHash`;
  - clears `inviteExpiresAt`;
  - writes `seat_activation_accepted`;
  - generates a fresh signed license bundle;
  - writes `offline_license_bundle_generated` with connected activation
    metadata;
  - returns accepted seat, license details, and `licenseBundle`.

## App Changes Implemented

Files changed in `/home/japheth-oruko/projects/pixesciv2`:

- `backend/api/v1/endpoints/access/auth.py`
- `backend/config/settings.py`
- `backend/tests/test_invitation_first_auth_flow.py`
- `frontend-v2/src/app/(auth)/login/page.tsx`
- `frontend-v2/src/features/auth/components/layout/force-password-change-dialog.tsx`
- `frontend-v2/src/features/auth/services/api/auth-api.ts`
- `frontend-v2/src/features/auth/types/index.ts`
- `frontend-v2/src/services/api/auth-api.ts`
- auth implementation-plan docs under `docs/implementation-plan/auth/`

Main behavior added:

- New local app backend endpoint:

```text
POST /api/v1/auth/seat-activations/accept
```

- Request body:

```json
{
  "armored_activation": "-----BEGIN PIXESCI SEAT ACTIVATION-----..."
}
```

- App setting added:

```py
portal_activation_base_url: str = "http://localhost:3000"
```

- The endpoint:
  - accepts armored text, not a file path;
  - posts it to the portal API as `armoredActivation`;
  - rejects portal unreachable with a 503;
  - rejects portal error responses without creating a local user;
  - validates the portal response shape;
  - rejects duplicate local users for the accepted email;
  - creates the local user after portal acceptance;
  - creates admin app role for accepted admin seat;
  - sets `status = "active"`;
  - sets `is_active = true`;
  - sets `is_verified = true`;
  - sets `must_change_password = true`;
  - starts an authenticated first-time session;
  - returns accepted activation metadata and the signed license bundle in the
    auth response.

- New local app first-password endpoint:

```text
POST /api/v1/auth/set-first-password
```

- Used when an activation-created user has `must_change_password=true`.
- Does not require a temporary/current password.

- Login card setup flow now:
  - keeps returning-user email/password login as the primary view;
  - has `New user? Set up your account`;
  - supports pasted activation text;
  - supports `.txt` import;
  - calls the connected activation endpoint;
  - enters first-time session after successful activation.

## Verification Already Run

Website repo:

```text
npm run lint      passed
npm run typecheck passed
npm run build     passed
```

App frontend:

```text
npm run typecheck passed
npm run build     passed
```

Targeted ESLint on changed frontend files passed.

Full app frontend lint failed because of pre-existing unrelated lint issues in
generated Tauri target files and other unrelated app files. No changed frontend
file from Phase 7b failed targeted lint.

App backend:

- `pytest` was not installed in the venv, so focused pytest could not run.
- Python compile checks passed for changed backend files after escalation due
  pycache/write restrictions.

## Live Temporary User Test

A real temporary connected activation flow was tested after implementation.

Temporary fixture used:

```text
email: phase7b-phase7b-20260713-002@example.test
seat: seat_12_HWgOpxeSD
license: LIC-P7B-phase7b-20260713-002
organization domain: phase7b-phase7b-20260713-002.example.test
```

Verified:

- portal fixture created;
- activation exported;
- app backend submitted activation to portal;
- portal accepted activation;
- portal marked seat active;
- portal set `inviteAcceptedAt`;
- portal cleared invite token fields;
- portal generated signed license bundle;
- app created local user only after portal acceptance;
- first password setup worked;
- reusing the same activation was rejected;
- future login worked with the user-created local password.

One test-only issue occurred: when activation, password setup, duplicate
activation, and login were attempted rapidly from the same `testclient` IP, the
app rate limiter blocked the final login. A separate login-only check against
the same temporary database, with rate limiting disabled for that check, passed.

Cleanup completed:

- temporary portal organization/license/seat/bundle/audit rows deleted;
- verified temp portal organization count was `0`;
- temporary app SQLite DB under `/tmp` deleted;
- no test user was left in the real app DB.

## Current Real Fixture User Issue

User tried to activate/login with:

```text
seat ID: seat_uJqKn6PISZbk
email: japhethrobert@gmail.com
license: LIC-PSCI-TEST-0001
organization ID: 2
organization name: PixeSci Test Client
```

The supplied activation decoded successfully.

Decoded activation payload:

```json
{
  "activationVersion": 1,
  "expiresAt": "2026-07-20T07:16:58.052Z",
  "issuedAt": "2026-07-13T07:18:27.341Z",
  "keyId": "development-only-ed25519-key",
  "licenseEndsAt": "2027-07-10",
  "licenseId": "LIC-PSCI-TEST-0001",
  "licenseStartsAt": "2026-07-10",
  "organizationId": 2,
  "organizationName": "PixeSci Test Client",
  "seatEmail": "japhethrobert@gmail.com",
  "seatId": "seat_uJqKn6PISZbk",
  "seatLimit": 5,
  "seatRole": "admin",
  "seatStatus": "invited"
}
```

Portal DB state for that seat at investigation time:

```text
seat status: invited
email: japhethrobert@gmail.com
role: admin
organization ID: 2
license: LIC-PSCI-TEST-0001
license status: active
invite expires: 2026-07-20T07:16:58.052Z
invite accepted at: null
```

Conclusion: activation content and portal DB state looked valid.

Strong likely root cause:

- App backend default portal URL is `http://localhost:3000`.
- In the observed environment:

```text
http://127.0.0.1:3000/api/portal/seat-activations/accept -> 404 Not Found
http://127.0.0.1:3001/api/portal/seat-activations/accept -> 405 Method Not Allowed on GET
```

`405` on GET means the route exists on port `3001` and expects POST. `404` on
port `3000` means the app was likely calling the wrong server if not configured
otherwise.

No `seat_activation_accepted` or `seat_activation_acceptance_rejected` audit
event existed for `seat_uJqKn6PISZbk`, which supports that the real attempt did
not reach the correct portal acceptance endpoint.

Recommended next runtime fix:

```bash
PORTAL_ACTIVATION_BASE_URL=http://localhost:3001
```

Start or restart the app backend with that environment variable, then retry the
same activation.

## Important No-Edit Investigation Result

During the final investigation request, no code was edited. Findings were from:

- decoding the activation;
- querying the local development portal database at `private/portal.db`;
- checking listening ports;
- checking route availability with `curl`;
- checking app config defaults.

Current production portal state is stored in the durable
`PORTAL_DATABASE_URL` database, not in `private/portal.db`.

## Dirty Worktree Notes

Before Phase 7b implementation, both repos already had unrelated dirty files.
Do not revert them without explicit user approval.

Website repo had pre-existing dirty/untracked files including:

- `private/portal.db`
- several portal docs
- phase 7 prompt docs

App repo had pre-existing dirty files including:

- `UBUNTU26_SETUP.md`
- several auth implementation-plan docs
- `frontend-v2/src/features/auth/docs/auth-feature-overview.md`

After Phase 7b, these repos intentionally have additional modified files listed
above.

## Newly Added User-Facing Instructions Doc

Created:

```text
docs/seat-activation-instructions.md
```

It has two parts:

1. Portal admin instructions.
2. Invited user instructions.

It covers:

- inviting users;
- exporting activation files;
- connected activation;
- air-gapped fallback;
- first password setup;
- future login;
- troubleshooting;
- what not to share.
