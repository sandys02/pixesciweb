# Portal Backend Agent Guide

These instructions apply to files under `src/backend/portal/`.

Before coding:

- Read `AGENTS.md` at the repository root.
- Read `docs/backend-completion-plan.md`.
- Read `docs/portal-backend-plan.md`.
- Read `docs/portal-backend-technical-debt.md`.
- Read `src/backend/portal/README.md`.
- Before touching route handlers, read the relevant installed Next 16 docs in
  `node_modules/next/dist/docs/`.

Implementation rules:

- Keep portal auth local for the baseline implementation.
- Keep production portal state durable. On Vercel, portal routes must require
  `PORTAL_DATABASE_URL`; do not reintroduce a `/tmp` SQLite fallback for portal
  accounts, licenses, seats, or audit events.
- Do not introduce Keycloak unless a new product decision explicitly changes the
  backend plan.
- Do not add Redis, cloud auth, telemetry, file uploads, AD/LDAP, SSO,
  payment/billing features, or marketing-cookie features in this directory.
- Keep the existing download gate intact unless a later phase explicitly
  replaces it.
- Treat the organization portal account as a license administrator account, not
  a human PixeSci app seat.
- Scope every portal query and mutation by organization.
- Use structured validation for all request bodies and route params.
- Enforce authorization and seat capacity server-side; never rely on frontend
  checks as a security boundary.
- Hash passwords, temporary credentials, invitation tokens, recovery tokens, and
  other secrets before storage.
- Never log passwords, temporary credentials, invite tokens, session secrets,
  signed URLs, private signing keys, or plaintext license secrets.
- Preserve the air-gapped direction: signed offline license bundles verified
  locally by the PixeSci app, with no live portal dependency for disconnected
  operation.
