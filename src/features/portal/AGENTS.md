# Portal Feature Guide

This feature contains the browser-side customer organization portal.

Rules:
- Keep portal behavior organization-scoped and separate from staff admin auth.
- Do not expose reset tokens, license secrets, or private signing details in UI code.
- Keep interactive code in client components and pure formatting in utilities.
- Prefer code files under 300 lines and split surfaces by portal view.
- Run `npm run typecheck` after moving imports in this feature.
