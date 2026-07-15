# Implementation Prompt: PixeSci Internal Admin Dashboard

Build the internal PixeSci staff dashboard at `/admin` and APIs under
`/api/admin/*`.

This dashboard is for PixeSci staff only. Do not reuse customer portal accounts
or the customer portal session cookie. Use `pixesci_admin_session`,
`ADMIN_SESSION_SECRET`, and a separate `admin_accounts` table.

Implement:

- staff admin login/logout/session;
- organization onboarding with country, state, name, email, domain, edition,
  research field, portal account email, license ID or generated license ID,
  license label, license term, and seat limit;
- organization detail views with portal accounts, licenses, seats, and audit;
- one-time portal setup/password reset links stored only as token hashes;
- license edit/renew/status/seat-limit actions;
- safe organization deactivation/archive;
- audit events that distinguish admin actors from customer portal actors;
- customer portal first-login setup changed to password-only with review-only
  organization details;
- local/preview/production database isolation safeguards.

Before coding, read:

- `AGENTS.md`
- `src/backend/portal/AGENTS.md`
- `src/backend/portal/README.md`
- `docs/admin-dashboard.md`
- `docs/portal-backend-plan.md`
- `docs/portal-backend-technical-debt.md`
- `docs/portal-user-guide.md`
- `src/backend/portal/schema.ts`
- `src/backend/portal/auth.ts`
- `src/backend/portal/licenses.ts`
- existing `src/app/api/portal/**/route.ts`
- installed Next 16 docs for route handlers, cookies, auth, mutations,
  environment variables, and data security.

Do not:

- add public registration;
- hard delete production organizations or licenses;
- reintroduce `/tmp` SQLite for production portal/admin state;
- log or print secrets, passwords, setup/reset tokens, full reset links,
  private signing keys, Resend keys, Turso tokens, or Vercel tokens;
- let preview deployments write to production Turso/libSQL data.

Verification:

```bash
npm run lint
npm run typecheck
npm run build
```
