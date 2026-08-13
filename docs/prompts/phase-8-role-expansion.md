# Phase 8 Prompt: Seat Role Expansion (admin/member → 14 system roles)

Status: implemented (this phase). Keep this file as a record of the contract
change for the pixesciv2-side Phase 2 implementer described below.

You are working across two repositories:

- website portal: `/home/japheth/projects/pixesciweb`
- local PixeSci app: `/home/japheth/projects/pixesciv2`

## Why

The Client Portal's seat role field used to be a flat `"admin" | "member"`
choice. pixesciv2's real authorization system
(`backend/services/scoped_authorization_service.py`, `ROLE_TEMPLATES`) has 14
distinct, independently-selectable system role templates. The admin/member
binary threw that away — whatever a customer picked at invite time bore no
relation to the actual scoped permissions the person got in the app. This
phase makes the Client Portal's seat creation UI, DB schema, and the signed
activation/license-bundle contracts capable of carrying the full 14-role set.

## What changed (pixesciweb side, this phase)

- **Schema** (`src/backend/portal/schema.ts`): additive `seats.roles_json`
  text column (JSON array of role keys), alongside the untouched legacy
  `seats.role` column.
- **Shared role catalog** (`src/backend/portal/role-templates.ts`, new): the
  14 role keys/names/descriptions (mirrors pixesciv2's `ROLE_TEMPLATES`), plus
  `isSystemRoleKey`, `deriveLegacyRole`, `isLegacySeatRole`,
  `parseStoredRoles`, `rolesEqual`. Single source of truth imported by
  `licenses.ts`, `activations.ts`, and `bundles.ts` so they can't drift.
- **Invite validation/storage** (`src/backend/portal/licenses.ts`): seat
  invites now take `{ email, roles: string[] }` (at least one valid system
  role key, deduped) instead of `{ email, role }`. `seats.role` is still
  written, derived as `"admin"` if the selected roles intersect the four
  admin-tier roles (`tenant_security_administrator`, `platform_operator`,
  `site_administrator`, `laboratory_manager`), else `"member"`.
- **Client Portal UI** (`src/features/portal/components/seats-panel.tsx`):
  the single role dropdown is now a checkbox group listing all 14 roles,
  split into "Administration" (the 4 admin-tier roles) and "Operational" (the
  other 10). At least one role is required to submit an invite.
- **Signed activation payload** (`src/backend/portal/activations.ts`,
  `POST /api/portal/seats/{seat_id}/activation` and
  `POST /api/portal/seat-activations/accept`): `SeatActivationPayload` gained
  `seatRoles: string[]` alongside the legacy `seatRole: "admin"|"member"`,
  both inside the Ed25519-signed payload. Re-verification on accept validates
  every element of `seatRoles` against the system role catalog and compares
  it against the seat's stored `roles_json` (order-independent), in addition
  to the existing legacy `seatRole` checks. The accept response's `seat`
  object now includes `roles: string[]` alongside `role`.
- **Signed license bundle payload** (`src/backend/portal/bundles.ts`, the
  air-gapped fallback path): `LicenseBundlePayload.seats[]` entries gained
  `roles: string[]` alongside the legacy `role`, populated the same way and
  signed together with the rest of the payload.
- **Types** (`src/features/portal/types/portal.ts`,
  `src/features/portal/types/shell.ts`, `src/lib/portal-access.ts`):
  `PortalSeat.roles?: string[]`, `PortalLicenseBundlePayload.seats[].roles`,
  `PortalSeatActivationPayload.seatRoles`, `InviteForm.roles: string[]`.

The legacy `role`/`seatRole` fields are **still emitted everywhere they were
before**, derived from the same rule. Nothing was removed. This is the
backward-compatibility bridge for pixesciv2 installs that haven't received
Phase 2 yet.

## What's next (pixesciv2 side, Phase 2 — not done by this phase)

Read this before touching pixesciv2:

- `backend/api/v1/endpoints/access/auth.py:733-770`
  (`_require_portal_acceptance_shape`) currently hard-validates
  `seat.get("role") in {"admin", "member"}` on the accept response. It should
  additionally read `seat.get("roles")` (falling back to deriving from legacy
  `role` if `roles` is absent, for older portal deployments) and map each key
  to the corresponding local scoped role grant via
  `backend/services/scoped_authorization_service.py`'s `ROLE_TEMPLATES`.
- `backend/api/v1/endpoints/access/auth.py:1321-1467`
  (`accept_connected_seat_activation`) currently only derives
  `is_admin_seat = seat_payload["role"] == "admin"` for
  `recovery_admin`. It should assign the full role set from
  `seat_payload.get("roles")`, not just a binary admin flag.
- The air-gapped import path (wherever pixesciv2 verifies
  `ArmoredSeatActivation`/`ArmoredLicenseBundle` payloads locally) should read
  `seatRoles`/`roles` the same way.
- A duplicate/leftover `SuperAdminGuard` exists in
  `frontend-v2/src/features/auth/components/layout/auth-guard.tsx` — dead,
  unused, checks a permission key that doesn't exist in the catalog. Tracked
  here as a cleanup item for whoever picks up Phase 2, not part of this
  phase's scope.

See `docs/seat-activation-import-contract.md` for the full current field-level
contract (this is the file to keep in sync going forward, not this historical
prompt).
