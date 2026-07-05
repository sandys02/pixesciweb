# PixeSci Download Auth Backend Handoff

This document describes the backend work needed to replace the current mock
gated download flow with real authentication and an authorized PixeSci
application download.

The frontend is already structured around a small integration module:

- `src/lib/download-access.ts`
- `src/components/site/download-pixesci-button.tsx`

The backend team should be able to replace the mock functions in
`download-access.ts` without changing the dialog UI.

## Current Frontend Flow

The public site shows a visible `Download PixeSci` button. When clicked:

1. The frontend checks whether the current browser has download access.
2. If unauthenticated, it opens a login form in a native dialog.
3. After successful login, the dialog shows the final `Download PixeSci`
   button.
4. When the user clicks the final button, the frontend starts the download.
5. On successful download start, the dialog closes.
6. Closing the dialog by any method clears the current download session.

Close methods that clear the session:

- close button
- `Esc`
- clicking outside the dialog content
- successful download start

The current implementation uses a mock in-memory session only. It does not use
cookies, local storage, a database, or a real backend endpoint yet.

## Product Constraints

- No PixeSci admin dashboard is needed.
- Download users may be maintained manually in backend code for now.
- Do not expose private product architecture in public responses or filenames.
- Do not claim compliance certification from this download flow.
- Do not put the real installer under `public/`; anything in `public/` is
  directly reachable without backend authorization.
- Keep the frontend dialog as a gated user experience, but treat the backend
  endpoint as the real security boundary.

## Recommended Endpoint Contract

The frontend can be wired to any final contract, but this shape keeps the client
simple and maps directly to the existing abstraction.

### `GET /api/download/session`

Checks whether the current browser has an active download session.

Success response:

```json
{
  "authenticated": true,
  "userEmail": "operator@example.com"
}
```

Unauthenticated response:

```json
{
  "authenticated": false
}
```

Recommended status codes:

- `200` for both authenticated and unauthenticated checks.
- Avoid `401` here unless the frontend should treat the check as an error.

### `POST /api/download/login`

Validates the submitted email and password and creates a short-lived download
session.

Request:

```json
{
  "email": "operator@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "authenticated": true,
  "userEmail": "operator@example.com"
}
```

Failure response:

```json
{
  "message": "Invalid email or password."
}
```

Recommended status codes:

- `200` on success.
- `400` for malformed input.
- `401` for invalid credentials.
- `429` for rate-limited attempts.

### `DELETE /api/download/session`

Clears the current download session. The frontend should call this whenever the
dialog closes.

Success response:

```json
{
  "authenticated": false
}
```

Recommended status codes:

- `200` or `204` on success.
- This should be idempotent. Calling it without a session should still succeed.

### `POST /api/download/url`

Issues an authorized, short-lived download URL or initiates the download
response. This endpoint must verify the active session server-side before
returning anything useful.

Option A, signed URL response:

```json
{
  "url": "https://storage.example.com/pixesci-installer?...",
  "fileName": "PixeSci-installer.exe",
  "expiresAt": "2026-07-05T12:15:00.000Z"
}
```

Option B, same-origin route response:

```json
{
  "url": "/api/download/file",
  "fileName": "PixeSci-installer.exe"
}
```

Recommended status codes:

- `200` on success.
- `401` if the session is missing or expired.
- `403` if the user is authenticated but not allowed to download.
- `410` if a requested build is no longer available.
- `429` if the user is rate limited.

## Protecting The Download Endpoint

The final file endpoint or signed URL issuer is the critical security boundary.
Do not rely on the client-side dialog state to protect the installer.

Minimum requirements:

1. Validate the session on the server before issuing a file or signed URL.
2. Keep sessions short-lived.
3. Invalidate or clear the session when `DELETE /api/download/session` is called.
4. Rate-limit login attempts by IP and email.
5. Return generic login errors so attackers cannot enumerate users.
6. Do not serve the real installer from `public/`.
7. Use `Cache-Control: no-store` on auth and download authorization responses.
8. Use `Content-Disposition: attachment` for direct file responses.
9. Use `X-Content-Type-Options: nosniff`.
10. Log security-relevant events without logging passwords.

Recommended direct file response headers:

```http
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="PixeSci-installer.exe"
Cache-Control: no-store
X-Content-Type-Options: nosniff
```

If using signed URLs:

- Keep signed URL lifetimes short, for example 1-10 minutes.
- Bind the URL to a specific file/build.
- Prefer single-use URLs if the storage provider supports it.
- Do not expose storage credentials to the frontend.
- Do not return internal bucket names, private paths, or infrastructure details
  if they are not needed by the browser.

## Session Strategy

Preferred approach:

- Use an opaque, random session identifier in an `HttpOnly`, `Secure`,
  `SameSite=Lax` cookie.
- Store only the minimum server-side session data needed to authorize the
  download.
- Set a short expiration, such as 10-30 minutes.
- Clear the cookie on `DELETE /api/download/session`.

Why this is preferred:

- The frontend does not need to handle secrets.
- The session is not exposed to JavaScript.
- It works cleanly with same-origin Next.js route handlers.

Alternative approach:

- Return a short-lived in-memory token to the frontend and require it on
  `POST /api/download/url`.

Only use this if cookie sessions are not possible. Do not store the token in
local storage.

## Manual User Records

The backend team stated that download users will be maintained manually in code.
That is acceptable for the first version if handled carefully.

Recommendations:

- Store allowed users in one server-only module.
- Do not import that module into Client Components.
- Prefer hashed passwords over plaintext.
- Use a strong password hashing function if available in the deployment
  environment.
- If plaintext must be used temporarily, keep the file server-only and do not
  commit real production credentials to a public repository.
- Review manual user changes during code review.

Example shape, not implementation:

```ts
type DownloadUser = {
  email: string
  passwordHash: string
  active: boolean
  allowedBuilds?: string[]
}
```

## Frontend Integration Points

Replace these functions in `src/lib/download-access.ts` with real API calls:

- `getDownloadAuthState()`
- `loginForDownload(credentials)`
- `clearDownloadAuthState()`
- `getPixeSciDownloadUrl()`
- `startPixeSciDownload()`

The frontend expects:

- `getDownloadAuthState()` resolves to `{ authenticated: boolean, userEmail?:
  string }`.
- `loginForDownload()` resolves to the same shape on success and throws on
  failure.
- `clearDownloadAuthState()` resolves even if there was no active session.
- `getPixeSciDownloadUrl()` throws if the user is not authorized.
- `startPixeSciDownload()` starts the browser download and throws on failure.

Error messages thrown by these functions are shown in the dialog. Keep messages
short and user-safe.

## Route Handler Placement

Next.js App Router route handlers live under `src/app`.

Recommended future structure:

```text
src/app/api/download/session/route.ts
src/app/api/download/login/route.ts
src/app/api/download/url/route.ts
src/app/api/download/file/route.ts
src/backend/download-auth/
```

Use `src/backend/` for server-only helpers such as user validation, session
management, build lookup, signed URL generation, and audit helpers. The route
handlers under `src/app/api/...` should be thin adapters around those helpers.

Do not add backend logic yet unless the backend implementation work has started.

## Proxy / Middleware Decision

Next.js 16 calls middleware `Proxy` and uses `proxy.ts`.

Do not add `proxy.ts` for the current dialog-only flow. There is no protected
page or server-side download endpoint to guard yet, and Proxy would not protect a
client-side dialog state.

When a real backend route exists, authorization must still happen inside the
route handler that issues the file or signed URL. Proxy may be useful later for:

- redirecting users away from a protected download page
- doing optimistic session checks before a request reaches a page
- applying route-level request handling

Proxy must not be the only authorization check for the installer.

## CSRF Considerations

If the backend uses cookies for session state, state-changing endpoints should
consider CSRF protection.

Relevant endpoints:

- `POST /api/download/login`
- `DELETE /api/download/session`
- `POST /api/download/url`

Practical options:

- Use `SameSite=Lax` or `SameSite=Strict` cookies.
- Require `Content-Type: application/json`.
- Check `Origin` and reject cross-origin requests.
- Add a CSRF token if cross-site contexts are ever required.

The site currently has a strict `form-action 'self'` CSP and does not need
cross-origin form posts for this flow.

## Rate Limiting And Abuse Controls

Add rate limits before exposing real credentials or installers.

Recommended controls:

- Limit failed login attempts by IP and by normalized email.
- Add a short lockout or backoff after repeated failures.
- Limit signed URL issuance per session.
- Limit direct file downloads per user/session.
- Log repeated failures for review.

Avoid adding CAPTCHA unless abuse requires it; it would add friction to a
high-intent download flow.

## Audit And Records

If audit records are required, capture server-side events such as:

- login success
- login failure
- session cleared
- download URL issued
- file download started
- download denied

Suggested fields:

- timestamp
- normalized email
- event type
- request IP or forwarded IP if available and trusted
- user agent
- build identifier
- outcome
- reason code for failures

Do not log passwords, session secrets, signed URLs, or full credential material.

## Build And File Metadata

The backend should own installer metadata once real downloads are available.

Suggested metadata:

```ts
type DownloadBuild = {
  id: string
  platform: "windows" | "macos" | "linux"
  version: string
  fileName: string
  sizeBytes: number
  checksumSha256: string
  releasedAt: string
  active: boolean
}
```

Consider returning safe metadata to the frontend later if the dialog needs to
show platform, version, size, or checksum. Do not expose internal storage paths.

## Frontend Copy Expectations

Keep responses and visible errors plain:

- "Invalid email or password."
- "Download access expired. Sign in again."
- "The download is temporarily unavailable."

Avoid:

- stack traces
- database errors
- storage provider errors
- internal service names
- detailed user existence messages

## Environment Variables

Likely future environment variables:

```text
DOWNLOAD_SESSION_SECRET=
DOWNLOAD_SIGNING_SECRET=
DOWNLOAD_URL_TTL_SECONDS=
DOWNLOAD_RATE_LIMIT_WINDOW_SECONDS=
DOWNLOAD_RATE_LIMIT_MAX_ATTEMPTS=
```

If using external storage, add provider-specific secrets as server-only
environment variables. Never expose them through `NEXT_PUBLIC_` variables.

## Acceptance Checklist

Before replacing the mock:

- Login succeeds for an approved manual user.
- Login fails with a generic error for invalid credentials.
- Closing the dialog clears the server-side session.
- Reopening the dialog after close requires login again.
- Clicking the final download button starts the file download.
- After successful download start, the dialog closes and the session clears.
- The real installer is not reachable without server authorization.
- The real installer is not stored under `public/`.
- Auth and authorization responses use `Cache-Control: no-store`.
- Failed login attempts are rate limited.
- Passwords and secrets are not logged.
- No admin dashboard is added.
