# Phase 0 Prompt: Portal Backend Guardrails

```text
You are working in /home/japheth-oruko/projects/pixesciweb.

Goal: complete Phase 0 from docs/backend-completion-plan.md by adding
documentation guardrails for the upcoming portal backend implementation. This is
a docs/scaffolding phase only. Do not implement backend routes, schemas,
migrations, auth logic, packages, or frontend integration.

Before editing:
1. Read AGENTS.md.
2. Read docs/backend-completion-plan.md.
3. Read docs/portal-backend-plan.md.
4. Read docs/portal-backend-technical-debt.md.
5. Read src/backend/README.md.
6. Read the relevant Next 16 route-handler/auth docs in
   node_modules/next/dist/docs before writing any backend guidance.
7. Check git status and do not overwrite unrelated user changes.

Implement:
1. Create src/backend/portal/ if it does not exist.
2. Add src/backend/portal/README.md as the backend implementation guide for
   future phases.
   It must define:
   - portal backend purpose;
   - two-auth-level model: existing website/download gate vs portal license auth;
   - local-auth decision and "do not add Keycloak unless product decision
     changes";
   - expected future module layout;
   - required API groups from docs/portal-backend-plan.md;
   - data boundaries: allowed portal data and forbidden scientific/deployment
     data;
   - security rules: hash passwords/tokens, no plaintext secret logging, generic
     auth errors, org-scoped queries, no client-side seat-limit trust;
   - air-gapped license direction: signed offline bundles verified locally by
     the app;
   - verification expectations for future phases.
3. Add src/backend/portal/AGENTS.md with concise implementation rules for agents
   working under src/backend/portal/.
   It must say:
   - read docs/backend-completion-plan.md and this README before coding;
   - read installed Next 16 docs before touching route handlers;
   - keep portal auth local for baseline;
   - do not introduce Keycloak, Redis, cloud auth, telemetry, file uploads,
     AD/LDAP, SSO, or payment/billing features;
   - keep the existing download gate intact unless a later phase explicitly
     replaces it;
   - scope all portal queries by organization;
   - never log passwords, temporary credentials, invite tokens, session secrets,
     signed URLs, private signing keys, or plaintext license secrets;
   - use structured validation and server-side authorization in future phases.
4. If docs/backend-completion-plan.md needs a small Phase 0 refinement to point
   at the new README/AGENTS files, update only that section. Do not rewrite the
   whole plan.
5. Do not modify /home/japheth-oruko/projects/pixesciv2 in this phase.

Acceptance criteria:
- src/backend/portal/README.md exists and is specific enough for Phase 1-4
  implementers.
- src/backend/portal/AGENTS.md exists and prevents scope drift.
- The documentation clearly separates the website/download gate from portal
  license auth and app seats.
- The documentation says the organization portal account does not consume an app
  seat.
- The documentation preserves the air-gapped signed-license-bundle direction.
- No runtime code, package installs, migrations, schemas, API routes, or frontend
  files are changed.

Verification:
- Run git diff and confirm only docs/backend-completion-plan.md,
  src/backend/portal/README.md, and src/backend/portal/AGENTS.md changed, unless
  a pre-existing dirty file was already present.
- Run npm run lint and npm run typecheck if the documentation edits include
  files that TypeScript/ESLint will inspect. Otherwise state that checks were not
  run because the change is Markdown-only.
- Final response should summarize changed files and explicitly mention that no
  backend implementation was added.
```
