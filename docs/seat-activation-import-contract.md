# Seat Activation Import Contract

Phase 5 uses an app-owned, air-gapped seat activation handoff. The website
portal exports a signed activation file for a pending seat invite. The local
PixeSci app imports that file, verifies the signature, and creates or prepares
the local app user without calling the website.

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

## App Import Rules

The local app must verify the signature with a trusted portal public key before
using the payload. It must reject malformed files, unknown key IDs, invalid
signatures, expired activations, license mismatches, organization mismatches,
and unsupported activation versions.

After verification, the app local auth model remains authoritative. The app may
create a local user with a must-change-password flow or use its local invite
flow, then record a local audit event. The portal does not receive an automatic
callback in the air-gapped path; a future manual return file can reconcile
portal seat status if needed.
