# Phase 1 Prompt: Portal Database Schema

```text
You are working in /home/japheth-oruko/projects/pixesciweb.

Goal: implement Phase 1 from docs/backend-completion-plan.md: add the portal
database schema, portal DB helpers, and a seed/admin CLI that can create one
organization, one portal account, and one active license with no human app seats
by default. This is a schema/storage phase only.

Before editing:
1. Read AGENTS.md.
2. Read src/backend/portal/AGENTS.md.
3. Read src/backend/portal/README.md.
4. Read docs/backend-completion-plan.md.
5. Read docs/portal-backend-plan.md.
6. Read docs/portal-backend-technical-debt.md.
7. Inspect existing download-auth files under src/backend/download-auth/ and
   scripts/seed-download-user.ts for local patterns.
8. Inspect drizzle.config.ts.
9. Check git status and preserve unrelated user changes.

Do not implement:
- /api/portal/* route handlers.
- Portal login/session/account setup/password-change behavior.
- Frontend wiring.
- License/seat mutations.
- Signed bundle generation.
- Keycloak, Redis, cloud auth, telemetry, file uploads, AD/LDAP, SSO,
  payment/billing, or app-side code.
- Any change to the existing /api/download/* gate unless needed only to keep
  Drizzle config compatible.

Implement:
1. Add src/backend/portal/schema.ts with Drizzle SQLite tables:
   - portal_accounts:
     id, email, password_hash, active, role, must_change_password,
     setup_completed_at, failed_login_count, locked_until, created_at,
     updated_at.
   - organizations:
     id, organization_type, country, state, name, email, domain, research_field,
     created_at, updated_at.
   - portal_account_organizations:
     id, account_id, organization_id, role, created_at.
   - licenses:
     id, license_id, organization_id, status, starts_at, ends_at, seat_limit,
     label, signed_bundle_version, created_at, updated_at.
   - seats:
     id, seat_id, organization_id, license_id, email, role, status,
     invite_token_hash, invite_expires_at, invite_accepted_at, created_at,
     updated_at.
   - audit_events:
     id, organization_id, actor_account_id, actor_seat_id, event_type,
     target_type, target_id, metadata_json, created_at.
   - license_bundles:
     id, license_id, organization_id, bundle_version, payload_json, signature,
     public_key_id, generated_by, generated_at, revoked_at.
2. Use text IDs for public/business identifiers where useful, but keep integer
   primary keys acceptable for internal joins. Export useful select/insert types
   from schema.ts.
3. Add indexes/uniques that prevent obvious bad states:
   - unique portal account email;
   - unique organization domain if practical;
   - unique license_id;
   - unique seat_id;
   - unique invite_token_hash when present if Drizzle/libSQL supports it cleanly;
   - indexes for organization-scoped license/seat/audit queries.
4. Add src/backend/portal/database-url.ts.
   - Use private/portal.db by default.
   - Export PORTAL_DATABASE_PATH and PORTAL_DATABASE_URL.
   - Keep it separate from private/download.db.
   - Use a Vercel/tmp copy pattern only if matching the existing download-auth
     approach is straightforward; otherwise keep local file behavior simple and
     document the limitation.
5. Add src/backend/portal/db.ts.
   - Create a libSQL client from PORTAL_DATABASE_URL.
   - Export a Drizzle db bound to the portal schema.
6. Update Drizzle config so npm run db:push can create portal tables.
   - Prefer a multi-config export if drizzle-kit supports it in this installed
     version.
   - If multi-config is awkward, add a second config file such as
     drizzle.portal.config.ts and add a package script for portal DB push.
   - Preserve existing download DB push behavior.
7. Add a seed/admin CLI script, for example scripts/seed-portal-account.ts.
   - Usage should accept enough arguments to create:
     organization profile, portal account email, temporary password, active
     license ID, starts_at, ends_at, seat_limit, and label.
   - Hash the temporary password before storage using the same scrypt hash format
     already used by scripts/seed-download-user.ts unless a Phase 1 dependency
     already provides a stronger helper.
   - Normalize emails/domains.
   - Create:
     one organization;
     one active portal account with must_change_password=true and
     setup_completed_at=null;
     one portal_account_organizations row with admin/owner role;
     one active license;
     one audit event for portal account creation and one for license creation if
     audit table exists.
   - Do not create human app seats by default.
   - Fail clearly if email, domain, organization, or license already exists.
8. Add package.json scripts:
   - Keep existing db:push and db:seed working for download auth.
   - Add clear portal scripts, for example db:push:portal and db:seed:portal.
   - If you choose multi-config and can make db:push cover both databases safely,
     still keep an explicit portal push script.
9. Update src/backend/portal/README.md with:
   - actual Phase 1 files added;
   - DB path;
   - push/seed commands;
   - note that Phase 2 will add auth route behavior;
   - note that the organization portal account does not consume a human app
     seat.
10. Do not edit /home/japheth-oruko/projects/pixesciv2.

Acceptance criteria:
- Portal schema and db helpers exist under src/backend/portal/.
- Portal database is separate from the download gate database.
- Existing download-auth scripts and routes are not broken.
- A portal seed command can create one organization, one portal account, one
  active license, and no seats by default.
- Portal account password is hashed, not plaintext.
- npm run db:push:portal or equivalent creates the portal tables.
- Phase 2 can build auth/session/setup on top of the new schema without
  inventing tables.

Verification:
1. Run npm run lint.
2. Run npm run typecheck.
3. Run npm run build.
4. Run the portal DB push command.
5. Run the portal seed command with a test organization/account/license.
6. If the seed writes private/portal.db, inspect the DB enough to confirm tables
   and seeded rows exist.
7. Run git diff and confirm changes are limited to Phase 1
   schema/db/config/scripts/docs/package metadata.
8. Final response should summarize changed files, commands run, and whether
   portal DB push/seed succeeded.

Important constraints:
- Do not use browser storage as backend truth.
- Do not treat the portal account as a seat.
- Do not add route handlers or frontend behavior in Phase 1.
- Do not log plaintext temporary passwords except, if absolutely necessary for a
  local seed command, print it only when the user provided it and never print
  hashes or secrets from storage.
```
