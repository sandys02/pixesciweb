# Backend Integration

This folder is reserved for backend-side download and authentication integration.
No backend logic is implemented yet.

Expected future responsibilities may include:

- validating approved PixeSci download users
- issuing authorized or signed download URLs
- clearing download sessions
- storing audit or download records if required

The backend team will maintain download user email and password records manually
in code for now. A PixeSci admin dashboard is not needed.

## Proxy / Middleware

Next.js 16 uses `proxy.ts` for the feature previously called middleware. This
project does not add Proxy for the current download dialog because there is no
protected route or server-side download endpoint in this repository yet.

The current dialog state is client-side, so Proxy would not meaningfully protect
the final download button. When a backend download route exists, authorization
must be enforced server-side by that route before issuing the file or signed URL.
Proxy may be considered later as a routing convenience, but not as the source of
authorization.
