# Seat Activation Import Contract

Status: current contract. The website portal supports connected acceptance
through `/api/portal/seat-activations/accept`; local-only import remains the
air-gapped fallback.

Phase 5 introduced an app-owned, air-gapped seat activation handoff. The
website portal exports a signed activation file for a pending seat invite. The
local PixeSci app can import that file, verify the signature, and create or
prepare the local app user.

Phase 7b adds the preferred connected activation path for environments where
the app can reach the website during first-time setup. In that path, the app
submits the armored activation text to the website, the website verifies it,
marks the portal seat active, and returns accepted seat details plus a fresh
signed license bundle. This makes the activation globally single-use.

The local-only import path remains the air-gapped fallback. It cannot guarantee
global single-use because the portal cannot know whether the same activation
file was copied to another PC.

## File Format

Seat activation files are armored text:

```text
-----BEGIN PIXESCI SEAT ACTIVATION-----
base64url-encoded canonical signed wrapper
-----END PIXESCI SEAT ACTIVATION-----
```

The decoded wrapper contains:

- `payload`: the activation payload.
- `signature`: Ed25519 signature over canonical JSON bytes of `payload`.
- `keyId`: signing key identifier.

## Payload Fields

- `activationVersion`
- `licenseId`
- `edition`: `pixesci`, `academia`, or `enterprise`
- `organizationId`
- `organizationName`
- `seatId`
- `seatEmail`
- `seatRole`
- `seatStatus`
- `licenseStartsAt`
- `licenseEndsAt`
- `seatLimit`
- `issuedAt`
- `expiresAt`
- `keyId`

The payload must not contain invite tokens, token hashes, passwords, password
hashes, session secrets, private keys, device identifiers, scientific data, or
local app state.

## Connected Acceptance Rules

For connected first-time setup, the local app should submit the full armored
activation text to:

```text
POST /api/portal/seat-activations/accept
```

The website must verify the signature, expiry, payload fields, and matching
database seat/license/organization state before accepting the activation. A
successful response marks the seat `active`, sets `inviteAcceptedAt`, clears
invite token fields, records an audit event, and returns a fresh signed license
bundle generated after the seat becomes active.

The local app must create the local user only after website acceptance succeeds.
Reusing the same activation file on another PC must fail because the portal seat
is no longer `invited`.

## Air-Gapped Import Rules

The local app must verify the signature with a trusted portal public key before
using the payload. It must reject malformed files, unknown key IDs, invalid
signatures, expired activations, license mismatches, organization mismatches,
and unsupported activation versions.

After verification, the app local auth model remains authoritative. The app may
create a local user with a must-change-password flow or use its local invite
flow, then record a local audit event. The portal does not receive an automatic
callback in the air-gapped path; a future manual return file can reconcile
portal seat status if needed.

The first-time app UX should stay on the login experience. Under the normal
email/password form, show `New user? Set up your account` and make
`Set up your account` a link-style button. Selecting it should swap the same
card into setup mode with two options: paste the armored activation text or
import a `.txt` activation file.

After backend verification, the app should display the decoded email, role,
seat ID, license ID, organization name, and expiry. The preferred UX then
creates the local account and starts a first-time authenticated session with
`must_change_password=true`; the existing forced password-change dialog becomes
the first required in-app step. Do not show a temporary password by default. A
one-time temporary password display is only a fallback if the app cannot create
a first-time session immediately after activation verification.

Future login uses the local app email and chosen password. The portal seat can
remain `invited` after export because the portal cannot prove an offline import
happened.

## Current Development Fixture

The current local portal database has this invited app seat:

- email: `japhethrobert@gmail.com`
- seat id: `seat_uJqKn6PISZbk`
- role: `admin`
- license: `LIC-PSCI-TEST-0001`
- status: `invited`
- invite expires: `2026-07-17T14:23:42.701Z`

To test manually, the portal admin should expand license `LIC-PSCI-TEST-0001`,
choose `Export activation` for `japhethrobert@gmail.com`, and save the armored
text as a file such as `seat_uJqKn6PISZbk-activation.pixesci-seat.txt`.
