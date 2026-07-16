# Admin Backend Guide

This backend domain contains PixeSci staff admin authentication, environment
guards, organization onboarding, license management, and admin audit behavior.

Rules:
- Keep admin auth separate from portal auth.
- Enforce authorization and environment write guards on the server.
- Do not print or return secrets except one-time setup/reset links by explicit API response.
- Keep database mutations audited.
- Prefer code files under 300 lines and split business logic into services.
