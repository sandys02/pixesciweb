# Phase 5 Prompt: Air-Gapped Seat Activation Handoff

Status: historical implementation prompt. Phase 5 has been completed; keep this
file as a record of the original task constraints.

You are working in `/home/japheth-oruko/projects/pixesciweb`.

Implement Phase 5 from `docs/backend-completion-plan.md` using the air-gapped,
app-owned activation path. Phase 6 signed offline license bundles already
exist, so Phase 5 should add portal-side signed seat activation export files
that can later be imported by the local PixeSci app without public app
registration and without the app calling the website.

## Read First

- Root `AGENTS.md`
- `src/backend/portal/AGENTS.md`
- `docs/backend-completion-plan.md`
- Existing prompts in `docs/prompts`
- `src/backend/portal/bundles.ts`
- `src/backend/portal/licenses.ts`
- Portal schema, portal route handlers, and portal UI helpers
- Installed Next 16 route-handler docs before touching `src/app/api/**/route.ts`

## Implement

- Add signed per-seat activation exports for invited seats under active,
  organization-scoped licenses.
- Reuse the Phase 6 Ed25519 signing model and keep private signing keys
  server-side only.
- Use armored text markers:
  - `-----BEGIN PIXESCI SEAT ACTIVATION-----`
  - `-----END PIXESCI SEAT ACTIVATION-----`
- Include only safe activation fields: activation version, license ID,
  organization ID/name, seat ID, seat email, seat role/status, license term,
  seat limit, issued-at, expires-at, and key ID.
- Exclude invite tokens, token hashes, passwords, password hashes, session data,
  private keys, device identifiers, scientific data, and local app state.
- Add `POST /api/portal/seats/[seat_id]/activation`.
- Require completed portal session and organization scoping.
- Reject expired, revoked, active, removed, inactive-license, incomplete, and
  cross-organization seats.
- Do not mark the portal seat active on export. The app is offline and remains
  authoritative for local login.
- Record a `seat_activation_exported` audit event on successful export.
- Add portal UI action for eligible invited seats with copy/download controls.
- Add a short app-side contract doc. Do not modify
  `/home/japheth-oruko/projects/pixesciv2` in this phase.

## Do Not Implement

- Website-owned invite acceptance routes.
- `/api/portal/invitations/{token}/accept`.
- Public app registration.
- Email delivery or SMTP.
- Keycloak, Redis, cloud auth, SSO, LDAP, device tracking, billing, or telemetry.
- New database schema unless absolutely unavoidable.

## Acceptance

- A portal admin can export a signed activation file for an invited seat under
  an active license.
- Tampering with the activation file fails verification.
- No secret values appear in the response or UI.
- Ineligible seat states cannot export activation.
- Existing license bundle generation and verification still work.
- The portal UI exposes export only for pending invited seats.
- The app import contract is documented, but app implementation remains Phase 7.
- `npm run db:push:portal`, `npm run typecheck`, `npm run lint`, and
  `npm run build` pass.
