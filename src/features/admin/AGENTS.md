# Admin Feature Guide

This feature contains the browser-side PixeSci staff admin dashboard.

Rules:
- Keep staff admin auth separate from customer portal auth.
- Do not store secrets, tokens, passwords, or setup links in constants or logs.
- Treat client-side checks as UX only; server routes must enforce authorization.
- Prefer code files under 300 lines and split components by dashboard surface.
- Run `npm run typecheck` after moving imports in this feature.
