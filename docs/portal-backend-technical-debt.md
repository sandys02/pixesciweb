# Portal Backend Technical Debt

This document tracks current implementation debt in the website auth and portal
flows. It should be read alongside `docs/portal-backend-plan.md`.

## Summary

The website has a working sign-in gate, but the organization portal is not yet
backed by real portal APIs.

Current state:

- Download/portal sign-in uses same-origin Next.js route handlers.
- Download users live in SQLite at `private/download.db`.
- The session is a short-lived JWT stored in `pixesci_download_session`.
- `/portal` is protected server-side by that session.
- Account Setup, Settings, licenses, and seats are frontend-only after sign-in.
- Portal state is stored in browser storage.
- Portal license and seat records are dummy data from `src/data/portal.ts`.

## Implemented Download Gate

Implemented files:

```text
src/app/api/download/login/route.ts
src/app/api/download/session/route.ts
src/app/api/download/file/route.ts
src/backend/download-auth/
src/lib/download-access.ts
src/components/site/download-pixesci-button.tsx
src/app/portal/page.tsx
```

Implemented route contract:

- `POST /api/download/login` validates email/password, sets
  `pixesci_download_session`, and returns `{ authenticated, userEmail }`.
- `GET /api/download/session` returns current authenticated state.
- `DELETE /api/download/session` clears the session cookie.
- `GET /api/download/file` requires the session server-side, decrypts the
  configured Link Lock URL, and redirects to the installer.

Current storage and secrets:

- users are seeded with `npm run db:seed -- email password`
- `DOWNLOAD_SESSION_SECRET` signs the JWT session cookie
- `DOWNLOAD_LINK_LOCK_URL` and `DOWNLOAD_LINK_LOCK_PASSWORD` protect the online
  installer URL
- auth responses use `Cache-Control: no-store`

The real installer must not be stored under `public/`. The route handler, not
the client dialog, is the security boundary.

## Portal Dummy Data Debt

The following portal behavior is currently frontend-only:

- first-login setup completion
- organization profile persistence
- settings updates
- portal password change
- license list
- expanded license seat rows
- invite, revoke invite, invite again, and remove seat state transitions
- seat-cap enforcement

Temporary files and state:

- `src/data/portal.ts` contains static organization/license/seat records.
- `src/features/portal/helpers.ts` writes setup state under
  `pixesci.portal.setup.v2.*` in browser storage.
- `src/features/portal/portal-shell.tsx` mutates in-memory React state for
  Settings and seat actions.

These are not security boundaries. Backend implementation must replace them
before production use.

## Main Risks

- Browser storage can be edited by users.
- Dummy license and seat data does not represent backend truth.
- Seat-limit checks are client-side only.
- Password changes in portal Settings are staged in UI only.
- Account Setup currently marks setup complete in browser storage only.
- Portal organization profile changes do not persist server-side.
- Seat invite links are example strings, not hashed single-use tokens.
- Audit events are not persisted.
- The download user table is not a full organization portal identity model.

## Migration Work

Replace dummy/frontend-only behavior with backend-backed flows:

1. Add real portal session and organization account records.
2. Store `must_change_password` and setup-complete state server-side.
3. Persist Account Setup organization profile fields server-side.
4. Implement portal password change against the chosen identity store.
5. Replace `src/data/portal.ts` reads with `GET /api/portal/licenses` and
   related organization APIs.
6. Replace in-memory seat mutations with backend seat endpoints.
7. Enforce organization scope, license scope, role permissions, and seat limits
   server-side.
8. Generate invitation tokens server-side and store only token hashes.
9. Add invitation expiry, resend cooldown, revocation, and acceptance.
10. Persist audit events.
11. Decide whether download auth remains a separate lightweight gate or merges
    into the final portal identity model.

## Download Gate Debt

The download gate is implemented and useful, but it is not the final portal
identity service.

Open questions:

- Should download users also become portal accounts or remain separate?
- Should `POST /api/download/login` become `POST /api/portal/login`?
- Should the portal continue using the download session cookie name?
- Should the SQLite user store be replaced by Keycloak or a richer local auth
  database?
- How should manual download users map to organizations, licenses, and seats?

Keep the current download route secure until it is replaced:

- keep sessions short-lived
- keep `HttpOnly`, `Secure` in production, and `SameSite=Lax`
- keep auth responses `Cache-Control: no-store`
- do not expose installer files under `public/`
- rate-limit login and file access before broader use
- avoid logging passwords, plaintext tokens, signed URLs, or session secrets

## Acceptance Criteria For Debt Closure

- Portal Account Setup state is server-side, not browser-storage-only.
- Organization profile is loaded from and saved to backend APIs.
- Settings password changes update the chosen identity provider/store.
- License and seat rows come from backend APIs.
- Seat actions are server-authorized and audited.
- Seat limits count active and pending invited seats server-side.
- Inactive-license API responses expose only historical seat id/status for the
  normal portal view.
- Invitation links are single-use, expiring, hashed server-side, and audited.
- The final auth model explicitly chooses Keycloak or local auth.
- Air-gapped license enforcement is backed by signed/offline license bundles.
