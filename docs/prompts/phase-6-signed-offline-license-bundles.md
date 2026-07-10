# Phase 6 Prompt: Signed Offline License Bundles

You are working in `/home/japheth-oruko/projects/pixesciweb`.

Goal: implement Phase 6 from `docs/backend-completion-plan.md`: signed offline
license bundles for air-gapped license enforcement. Phase 1-4 are already
implemented. Phase 5 app handoff and Phase 7 `pixesciv2` work must wait until
this bundle contract is stable.

## Before Editing

1. Read `AGENTS.md`.
2. Read `src/backend/portal/AGENTS.md`.
3. Read `src/backend/portal/README.md`.
4. Read `docs/backend-completion-plan.md`.
5. Read `docs/portal-backend-plan.md`.
6. Read `docs/portal-backend-technical-debt.md`.
7. Read `docs/prompts/phase-0-portal-backend-guardrails.md` through
   `docs/prompts/phase-4-license-seat-apis.md`.
8. Read installed Next 16 route-handler docs in `node_modules/next/dist/docs/`.
9. Inspect `src/backend/portal/schema.ts`, `auth.ts`, `licenses.ts`, `db.ts`,
   and current `/api/portal/**` route handlers.
10. Check `git status` and preserve unrelated user changes.

## Do Not Implement

- Phase 5 invite acceptance.
- App-side work in `/home/japheth-oruko/projects/pixesciv2`.
- Website-owned invite acceptance routes.
- Keycloak, Redis, cloud auth, telemetry, file uploads, AD/LDAP, SSO, payment,
  billing, or device tracking.
- Customer-facing marketing copy about internal signing architecture.
- A new schema unless strictly required. The existing `license_bundles` and
  `licenses.signed_bundle_version` fields should be enough.

## Implement

1. Add `src/backend/portal/bundles.ts`.
   - Generate canonical JSON payloads for active org-scoped licenses.
   - Sign canonical payload bytes with Ed25519 using Node crypto.
   - Verify generated bundles server-side for tests/manual checks.
   - Store generated bundle records in `license_bundles`.
   - Increment and persist `licenses.signed_bundle_version`.
   - Keep private signing keys server-side only.

2. Bundle payload shape must be stable and explicit:
   - `bundleVersion`
   - `licenseId`
   - `organizationId`
   - `organizationName`
   - `startsAt`
   - `endsAt`
   - `seatLimit`
   - `features`
   - `issuedAt`
   - `keyId`
   - optional `seats` manifest with active/invited seat email, role, status,
     and seat ID only.
   - Do not include portal account email, invite tokens, token hashes, password
     hashes, scientific files, telemetry, endpoint inventory, device IDs, or
     internal topology.

3. Use environment variables:
   - `PORTAL_LICENSE_SIGNING_PRIVATE_KEY_PEM` for development/test signing.
   - `PORTAL_LICENSE_PUBLIC_KEY_PEM` for verification.
   - `PORTAL_LICENSE_PUBLIC_KEY_ID` for `keyId`.
   - In development only, allow a deterministic fallback key pair clearly marked
     as development-only.
   - In production, fail closed if signing key, public key, or key ID is
     missing.

4. Add route handlers:
   - `POST /api/portal/licenses/[license_id]/bundle`
   - `GET /api/portal/licenses/[license_id]/bundle/latest`
   - Both require `requireCompletedPortalSession`.
   - Both must scope license and bundle access to `session.user.organizationId`.
   - Return `401` for missing/invalid session, `403` for setup-required session,
     and `404` for non-org or inactive license IDs.

5. Response/download shape:
   - `POST` generates a new bundle, stores it, audits it, and returns JSON with
     metadata plus an armored text bundle.
   - `GET latest` returns the latest non-revoked bundle for that org-scoped
     license.
   - Armored format should be plain text with clear begin/end markers and
     base64url-encoded JSON wrapper.
   - Wrapper must include `payload`, `signature`, and `keyId`.
   - Do not expose private keys or secrets.

6. Add portal audit events:
   - `offline_license_bundle_generated`
   - `offline_license_bundle_exported`
   - `unauthorized_portal_action_blocked` for invalid/non-org bundle attempts.

7. Add frontend API helpers in `src/lib/portal-access.ts`:
   - `generatePortalLicenseBundle(licenseId)`
   - `getLatestPortalLicenseBundle(licenseId)`

8. Wire the portal Licenses UI minimally:
   - Add an action for active licenses to generate/export the signed bundle.
   - Show latest bundle version/key ID/issued time when available.
   - Provide a copy/download-friendly text area or download button for the
     armored bundle.
   - Keep UI restrained and consistent with the current portal layout.
   - Do not add app import instructions beyond concise "offline bundle
     generated" language.

9. Save this prompt as
   `docs/prompts/phase-6-signed-offline-license-bundles.md`.

## Acceptance Criteria

- Active org-scoped licenses can generate signed offline bundles.
- Inactive licenses cannot generate new bundles.
- Non-org license IDs return `404`.
- Latest bundle retrieval is org-scoped.
- Bundle payload is canonical and deterministic before signing.
- Tampering with payload or signature fails verification.
- Bundle generation increments `signed_bundle_version`.
- Bundle generation/export creates audit events.
- Private signing material is never returned, logged, or stored in bundle
  payloads.
- No Phase 5 acceptance route or `pixesciv2` code is added.

## Verification

1. Run `npm run db:push:portal`.
2. Run `npm run typecheck`.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Manually verify with a portal session cookie:
   - unauthenticated bundle generation returns `401`.
   - active org license bundle generation succeeds.
   - inactive license bundle generation fails.
   - latest bundle retrieval succeeds after generation.
   - non-org or invalid license ID returns `404`.
   - tampered bundle verification fails.
   - audit events exist for generation/export.
6. Manually verify the portal UI can generate and expose the latest armored
   bundle text without showing secrets.

## Final Response

- Summarize changed files by subsystem.
- State verification commands and results.
- State manual endpoint/UI checks and results.
- Explicitly call out that Phase 5 invite acceptance/app handoff and Phase 7
  `pixesciv2` alignment remain deferred.
