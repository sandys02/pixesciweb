# Phase 3 Prompt: Organization API

```text
You are working in /home/japheth-oruko/projects/pixesciweb.

Goal: implement Phase 3 from docs/backend-completion-plan.md: make the portal
Organization Settings page real by adding server-backed organization read/update
APIs and wiring Settings save/load to those APIs. Phase 1 and Phase 2 are
already implemented. Do not implement Phase 4 license/seat APIs.

Before editing:
1. Read AGENTS.md.
2. Read src/backend/portal/AGENTS.md.
3. Read src/backend/portal/README.md.
4. Read docs/backend-completion-plan.md.
5. Read docs/portal-backend-plan.md.
6. Read docs/portal-backend-technical-debt.md.
7. Read the installed Next 16 docs relevant to route handlers/auth in
   node_modules/next/dist/docs/.
8. Inspect current Phase 1/2 files:
   - src/backend/portal/schema.ts
   - src/backend/portal/db.ts
   - src/backend/portal/auth.ts
   - src/lib/portal-access.ts
   - src/app/portal/page.tsx
   - src/features/portal/portal-shell.tsx
9. Check git status and preserve unrelated user changes.

Do not implement:
- Phase 4 license/seat APIs or dashboard data replacement.
- Invite acceptance.
- Signed license bundle generation.
- App-side work in /home/japheth-oruko/projects/pixesciv2.
- Keycloak, Redis, cloud auth, telemetry, file uploads, AD/LDAP, SSO, payment,
  or billing features.
- Organization email change workflow. Email must remain locked.

Implement:
1. Add organization backend helpers under src/backend/portal/.
   - Reuse existing portal session helpers from src/backend/portal/auth.ts.
   - Add functions to fetch the signed-in organization by session organizationId.
   - Add functions to update only allowed organization fields:
     organizationType, state, name, domain, researchField.
   - Keep country fixed as "United States".
   - Keep organization email unchanged even if a client sends a different email.
   - Normalize domain server-side with the existing normalizeDomain helper.
   - Validate organizationType is academia, enterprise, or pixesci.
   - Audit successful organization profile changes with event_type
     "organization_profile_changed".
2. Add route handlers:
   - GET /api/portal/organization
   - PATCH /api/portal/organization
3. Authorization rules:
   - Both endpoints require a valid completed portal session using
     requireCompletedPortalSession.
   - Setup-incomplete accounts must receive 403 with the existing setup-required
     message.
   - All queries and updates must be scoped by session.user.organizationId.
   - Do not accept organization IDs from the client.
4. Expected API behavior:
   - GET /api/portal/organization returns:
     {
       organization: {
         country: "United States",
         state,
         organizationType,
         name,
         email,
         domain,
         researchField
       }
     }
   - PATCH /api/portal/organization accepts:
     {
       state,
       organizationType,
       name,
       email,
       domain,
       researchField
     }
     but ignores email for mutation and returns the persisted organization with
     the original locked email.
   - Invalid payloads return 400 with the existing generic malformed-input
     message.
   - Missing/invalid session returns 401.
   - Setup-incomplete session returns 403.
   - Responses use Cache-Control: no-store.
5. Update src/lib/portal-access.ts.
   - Add getPortalOrganization().
   - Add updatePortalOrganization().
   - Reuse the existing requestPortalApi helper.
   - Export typed payload/response helpers using existing PortalOrganization /
     PortalAccountSetupForm types where practical.
6. Wire src/features/portal/portal-shell.tsx Settings page.
   - On Settings save, call PATCH /api/portal/organization instead of only
     mutating local React state.
   - On success, update local account.organization with the server-returned
     organization.
   - Message should say "Organization settings saved." not "saved in this
     browser."
   - Keep organization email input locked and show the existing locked-email
     helper text.
   - Add a pending state to prevent double submits while saving.
   - Show a non-sensitive error message if the API fails.
7. Keep /portal initial server render behavior from Phase 2.
   - The page may continue passing initial organization data from the server.
   - Settings does not need a separate initial GET on first render if /portal
     already supplies organization data.
   - The new GET endpoint still must exist for API completeness and future
     refreshes.
8. Update docs/prompts by adding docs/prompts/phase-3-organization-api.md with
   this prompt.
9. If docs/backend-completion-plan.md has an accidental malformed Phase 2
   heading, fix only that heading while editing docs. Do not rewrite unrelated
   plan content.

Acceptance criteria:
- GET /api/portal/organization returns the signed-in organization.
- PATCH /api/portal/organization persists allowed profile fields.
- PATCH cannot change organization email.
- Setup-incomplete accounts cannot use organization APIs.
- Settings save is server-backed and no longer says it saved only in the
  browser.
- All organization reads/writes are scoped to the signed-in organization.
- An audit event is written for successful profile changes.
- No license/seat APIs or dashboard replacement are added.

Testing and verification:
1. Run npm run db:push:portal.
2. Run npm run typecheck.
3. Run npm run lint.
4. Run npm run build.
5. Manually exercise endpoints with curl or a small local script using a portal
   session cookie:
   - unauthenticated GET /api/portal/organization returns unauthenticated/401
     behavior;
   - authenticated GET returns organization;
   - PATCH updates state/name/domain/researchField/organizationType;
   - PATCH with a different email does not change stored organization email;
   - audit_events contains organization_profile_changed after successful PATCH.
6. Manually verify Settings page save uses the backend and displays the
   server-backed success message.
7. Inspect git diff and confirm changes are limited to Phase 3 organization
   helpers/routes, portal-access client helpers, Settings wiring, prompt/docs
   updates, and any narrow heading cleanup.

Final response:
- Summarize changed files by subsystem.
- State verification commands run and results.
- State manual endpoint checks and results.
- Explicitly call out deferred Phase 4 license/seat APIs.
```
