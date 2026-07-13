# Phase 4 Prompt: License And Seat APIs

Status: historical implementation prompt. Phase 4 has been completed; keep this
file as a record of the original task constraints.

You are working in /home/japheth-oruko/projects/pixesciweb.

Goal: implement Phase 4 from docs/backend-completion-plan.md: make the portal license dashboard and seat actions authoritative. Phase 1-3 are already implemented. Replace live portal license/seat usage of dummy data and browser/in-memory mutations with backend APIs.

Before editing:
1. Read AGENTS.md.
2. Read src/backend/portal/AGENTS.md.
3. Read src/backend/portal/README.md.
4. Read docs/backend-completion-plan.md.
5. Read docs/portal-backend-plan.md.
6. Read docs/portal-backend-technical-debt.md.
7. Read docs/prompts/phase-0-portal-backend-guardrails.md through docs/prompts/phase-3-organization-api.md.
8. Read installed Next 16 route-handler docs in node_modules/next/dist/docs/.
9. Inspect src/backend/portal/schema.ts, auth.ts, organization.ts, db.ts.
10. Inspect src/features/portal/portal-shell.tsx, helpers.ts, types.ts, and src/data/portal.ts.
11. Check git status and preserve unrelated user changes.

Do not implement:
- Invite acceptance.
- Signed/offline license bundle generation.
- App-side work in /home/japheth-oruko/projects/pixesciv2.
- Keycloak, Redis, cloud auth, telemetry, file uploads, AD/LDAP, SSO, payment, or billing.
- Device tracking or installed-device admin.

Implement:
1. Add portal license/seat backend helpers under src/backend/portal/.
   - Fetch organization-scoped licenses.
   - Fetch organization-scoped seats for one license.
   - Invite a seat.
   - Resend invited/revoked seat invite.
   - Revoke an invited seat.
   - Remove an active non-owner seat.
   - Write audit events for license viewed, seat invited, invite resent, invite revoked, seat removed, seat limit exceeded, and unauthorized blocked actions.
2. Add route handlers:
   - GET /api/portal/licenses
   - GET /api/portal/licenses/[license_id]/seats
   - POST /api/portal/licenses/[license_id]/seats/invite
   - POST /api/portal/seats/[seat_id]/resend
   - POST /api/portal/seats/[seat_id]/revoke-invite
   - POST /api/portal/seats/[seat_id]/remove
3. Authorization rules:
   - All endpoints require requireCompletedPortalSession.
   - All license and seat reads/writes must be scoped to session.user.organizationId.
   - Never trust client-provided organization IDs.
   - Return 401 for missing/invalid session, 403 for setup-required session, 404 for non-org license/seat IDs.
4. Response shapes:
   - License rows returned to the frontend should match existing PortalLicense-compatible fields: id, label, status, startsAt, endsAt, seatLimit.
   - Active license seat rows may include id, email, role, status, inviteLink/display invite state, and temporaryCredentialState.
   - Inactive license seat rows must expose only id and status in the normal portal view.
   - Pending invites count against allocated capacity.
5. Seat rules:
   - Portal account never consumes a seat.
   - active owner/first-admin seat has no default row action.
   - active non-owner seat can be removed.
   - invited seat can be revoked and resent.
   - revoked seat can be invited again only when capacity is available.
   - Invite/resend tokens must be generated server-side and stored only as hashes.
   - Do not expose plaintext token hashes. A returned inviteLink may contain the one-time plaintext token only at creation/resend time.
   - Expire invite tokens using a reasonable fixed default such as 7 days.
6. Add validation:
   - Invite requires valid email and role admin/member.
   - Resend/revoke/remove require valid path seat_id.
   - Reject duplicate active/invited seat email within the same active license.
   - Enforce seat_limit using active + invited seats.
7. Update src/lib/portal-access.ts:
   - Add getPortalLicenses.
   - Add getPortalLicenseSeats.
   - Add invitePortalSeat.
   - Add resendPortalSeatInvite.
   - Add revokePortalSeatInvite.
   - Add removePortalSeat.
8. Wire src/features/portal/portal-shell.tsx:
   - Load licenses from GET /api/portal/licenses after authenticated portal render.
   - Load seats from GET /api/portal/licenses/[license_id]/seats when a license is expanded.
   - Remove live dependency on src/data/portal.ts for licenses/seats.
   - Keep existing dummy license data only as a non-authoritative loading fallback if absolutely needed, but do not use it as live state.
   - Replace in-memory invite/revoke/remove mutations with API calls and then refresh the affected license seats.
   - Keep frontend capacity checks for UX, but backend is authoritative.
   - Preserve existing UI behavior and visual layout as much as possible.
9. Update docs/prompts by adding this prompt as docs/prompts/phase-4-license-seat-apis.md.
10. Do not modify /home/japheth-oruko/projects/pixesciv2.

Acceptance criteria:
- Frontend no longer imports src/data/portal.ts for live license/seat state.
- GET /api/portal/licenses returns only licenses scoped to the signed-in organization.
- GET /api/portal/licenses/[license_id]/seats returns minimal inactive-license seat data.
- Invite creates an invited seat only when capacity is available.
- Pending invites count against capacity.
- Revoke/resend/remove are server-authorized and audited.
- Active owner/first-admin seat cannot be removed by the normal remove endpoint.
- Portal account is never counted as a human app seat.
- No Phase 5/6 app handoff or license bundle work is added.

Testing and verification:
1. Run npm run db:push:portal.
2. Ensure the local portal DB has at least one active and one inactive license, with active/invited/revoked seats if needed for testing.
3. Run npm run typecheck.
4. Run npm run lint.
5. Run npm run build.
6. Manually exercise endpoints with a portal session cookie:
   - unauthenticated GET /api/portal/licenses returns 401.
   - authenticated GET /api/portal/licenses returns org-scoped licenses.
   - active license seats include full row data.
   - inactive license seats include only id/status.
   - invite succeeds below capacity.
   - invite fails at capacity.
   - resend invited seat succeeds and audits.
   - revoke invited seat succeeds and audits.
   - remove active non-owner seat succeeds and audits.
   - remove protected first-admin/owner seat fails.
7. Manually verify the portal Licenses UI loads backend licenses/seats and seat actions persist after refresh.
8. Inspect audit_events for Phase 4 actions.

Final response:
- Summarize changed files by subsystem.
- State verification commands and results.
- State manual endpoint/UI checks and results.
- Explicitly call out deferred Phase 5 invite acceptance/app handoff and Phase 6 signed bundles.

## Assumptions

- Phase 1-3 are present and working.
- Existing schema is sufficient; add only narrowly required fields if unavoidable.
- Plaintext invite tokens may be shown only immediately on invite/resend responses.
- Email delivery is out of scope; invite links are generated for display/copy only.
