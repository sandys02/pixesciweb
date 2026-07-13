# Phase 2 Prompt: Portal Auth Service

Status: historical implementation prompt. Phase 2 has been completed; keep this
file as a record of the original task constraints.

```text
You are working in /home/japheth-oruko/projects/pixesciweb.

Goal: implement Phase 2 from docs/backend-completion-plan.md: the organization
portal auth service. Phase 1 has already added the portal schema, portal DB
helpers, dedicated Drizzle config, and portal seed script. Build auth/session,
account setup, and password-change behavior on top of those files.

Before editing:
1. Read AGENTS.md.
2. Read src/backend/portal/AGENTS.md.
3. Read src/backend/portal/README.md.
4. Read docs/backend-completion-plan.md.
5. Read docs/portal-backend-plan.md.
6. Read docs/portal-backend-technical-debt.md.
7. Read the installed Next 16 docs relevant to route handlers/auth in
   node_modules/next/dist/docs/.
8. Inspect the Phase 1 files:
   - src/backend/portal/schema.ts
   - src/backend/portal/db.ts
   - src/backend/portal/database-url.ts
   - drizzle.portal.config.ts
   - scripts/seed-portal-account.ts
9. Inspect existing download-auth patterns under src/backend/download-auth/ and
   src/app/api/download/, but do not merge portal auth into download auth.
10. Check git status. Preserve unrelated user changes.

Do not implement:
- Phase 3 organization Settings APIs beyond what Account Setup must persist.
- Phase 4 license/seat APIs or dashboard data replacement.
- Signed license bundle generation.
- Invitation acceptance.
- App-side work in /home/japheth-oruko/projects/pixesciv2.
- Keycloak, Redis, cloud auth, telemetry, file uploads, AD/LDAP, SSO, payment, or
  billing features.

Implement:
1. Add portal auth backend helpers under src/backend/portal/.
   Include:
   - password hashing and verification with a versioned hash format compatible
     with the Phase 1 seed script's scrypt hashes;
   - session signing/verification using jose and PORTAL_SESSION_SECRET;
   - portal session cookie constants and cookie options;
   - portal account lookup by normalized email;
   - organization/account membership lookup;
   - setup-state checks;
   - account setup completion;
   - password change;
   - generic JSON/no-store response helpers;
   - audit-event helper calls using the Phase 1 audit_events table.
2. Add route handlers:
   - POST /api/portal/login
   - POST /api/portal/logout
   - GET /api/portal/session
   - POST /api/portal/account-setup
   - POST /api/portal/password/change
3. Use a separate portal session cookie, for example pixesci_portal_session.
   Do not reuse pixesci_download_session for portal auth.
4. Keep the existing download gate intact.
   - Do not remove /api/download/*.
   - Do not break /api/download/file.
   - Do not change installer access behavior unless necessary for /portal
     routing.
5. Update src/app/portal/page.tsx so /portal is protected by the new portal
   session.
   - If no valid portal session exists, redirect to the existing public entry
     point used by the current gate.
   - Pass portal session/account data needed by PortalShell.
   - Keep robots noindex/nofollow metadata.
6. Wire Account Setup in the portal frontend to POST /api/portal/account-setup.
   - Remove browser-storage setup completion as the security boundary.
   - Server state must decide whether setup is required.
   - Keep frontend validation for UX only, but backend validation must be
     authoritative.
7. Wire portal password change to POST /api/portal/password/change.
   - Require current password.
   - On success, clear password form state and show a non-sensitive success
     message.
8. Implement request validation.
   - Validate JSON content type where appropriate.
   - Validate email format, password minimum length, required organization setup
     fields, and allowed organization type.
   - Normalize email and domain server-side.
9. Enforce security rules.
   - HttpOnly session cookie.
   - Secure in production.
   - SameSite=Lax.
   - Path=/.
   - Short session TTL, default similar to existing download auth unless
     docs/env say otherwise.
   - Cache-Control: no-store on auth responses.
   - Generic invalid-credential and unavailable messages.
   - Never log passwords, plaintext temporary credentials, tokens, session
     secrets, signed URLs, private signing keys, or license secrets.
10. Implement SQLite-backed rate limiting/backoff using the Phase 1
    failed_login_count and locked_until fields for login.
    - Increment failed_login_count on failed login.
    - Set locked_until after repeated failures.
    - Reset failed_login_count and locked_until on successful login.
    - Keep resend/invite rate limits deferred because those endpoints are not in
      Phase 2.
11. Add .env.example only if this repo already has a committed env example. If
    no env example exists, document required env in src/backend/portal/README.md.
    Required env:
    - PORTAL_SESSION_SECRET
    - optional PORTAL_SESSION_TTL_SECONDS
12. Do not implement license or seat APIs in this phase.
    - It is acceptable for the authenticated dashboard to keep using existing
      dummy license data until Phase 4.
    - It is not acceptable for Account Setup or password change to remain
      browser-storage-only.

Expected API behavior:
- POST /api/portal/login
  Request: { email: string, password: string }
  Success: sets portal session cookie and returns
  { authenticated: true, userEmail, setupRequired }
  Failure: returns generic invalid credentials with 401.
- POST /api/portal/logout
  Clears portal session cookie and returns { authenticated: false }.
- GET /api/portal/session
  Returns { authenticated: false } or
  { authenticated: true, userEmail, setupRequired }.
- POST /api/portal/account-setup
  Requires authenticated portal session.
  Request includes organizationType, country, state, name, email, domain,
  researchField, newPassword, confirmPassword.
  Success persists organization profile, updates password, clears
  must_change_password/setup-required state, audits setup completion, and returns
  { setupComplete: true }.
- POST /api/portal/password/change
  Requires authenticated portal session and completed setup.
  Request: { currentPassword, newPassword, confirmPassword }
  Success updates password hash, audits password change, and returns
  { changed: true }.

Acceptance criteria:
- Portal auth uses the Phase 1 portal account/session model, not download users.
- /portal is protected server-side by the portal session.
- Account Setup completion is persisted server-side in the Phase 1 portal tables.
- Password changes update the portal account password hash.
- The organization portal account is not treated as an app seat.
- Download auth still works as before.
- Browser storage is no longer the authority for setup completion.
- Auth responses avoid user enumeration and use no-store caching.
- No new Keycloak, Redis, cloud auth, SSO, AD/LDAP, telemetry, file upload,
  payment, or app-side code is added.

Testing and verification:
1. Run npm run lint.
2. Run npm run typecheck.
3. Run npm run build.
4. Run npm run db:push:portal.
5. Seed a portal account if needed with npm run db:seed:portal.
6. Add focused tests if this repo has an established route-handler test setup.
   If no test setup exists, manually exercise the endpoints with curl or a small
   local script and report the commands/results:
   - login success;
   - bad password returns generic failure;
   - session returns authenticated state;
   - logout clears session;
   - account setup requires auth;
   - account setup clears setup-required state;
   - password change requires current password;
   - setup-incomplete accounts cannot access completed-setup-only actions.
7. Manually inspect git diff to confirm changes are limited to Phase 2 portal
   auth helpers, route handlers, minimal portal frontend integration, and
   required env/docs updates.

Final response:
- Summarize changed files by subsystem.
- State that Phase 1 prerequisites were present.
- State verification commands run and their results.
- Call out intentionally deferred items, especially Phase 3 organization
  Settings APIs and Phase 4 license/seat APIs.
```

## Notes

- Phase 1 is complete in this repo, so this prompt no longer tells the
  implementer to stop if schema files are missing.
- Login backoff should use `failed_login_count` and `locked_until`, which Phase 1
  added to `portal_accounts`.
