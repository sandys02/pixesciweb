# Portal Backend Requirements

This portal is currently frontend-only. Backend work must preserve the new auth
direction:

- PixeSci creates the organization portal account during customer onboarding.
- The organization portal account is not a human PixeSci app user and must not
  be treated as an app admin account.
- There is no public organization registration inside the app.
- The first portal login uses a temporary or one-time credential.
- The first signed-in screen forces Account Setup before the license dashboard.
- Account Setup captures the organization fields that used to live in the app
  registration form: edition, country, state, organization name, organization
  email, domain, research field, and a new portal password.
- After setup, Settings can update those non-sensitive organization fields
  except the organization email, which is tied to the portal account.
- The organization creates the first human app admin from the License dashboard
  by inviting or adding an admin seat.

## Required Endpoints

- Account setup endpoint: verify the current session, require temporary
  credential or `must_change_password=true`, change the password, store the
  organization profile, and mark setup complete.
- Organization profile endpoint: read and update edition, country, state,
  organization name, organization email, domain, and research field.
- Portal password endpoint: change the portal password after verifying the
  current password.
- License list endpoint: return current and past license IDs scoped to the
  signed-in organization.
- Seat endpoints: create/list/update/remove seats scoped to both license and
  organization.
- Seat invite endpoint: issue a single-use temporary credential or invitation
  token, store only hashes, expire credentials, rate-limit resend, and audit
  invite/revoke/remove.

## Identity Decision

Decide whether to use an auth provider such as Keycloak.

If Keycloak is used, document and test offline/air-gapped deployment
requirements, local realm export/import, SMTP constraints, password reset and
invite flows, admin bootstrap, no cloud dependency, audit export, and
license-seat linkage.

If Keycloak is not used, the backend must implement equivalent local identity
features: hashed temporary credentials, forced password change, lockout,
sessions, refresh tokens, RBAC, audit logs, and admin recovery.

## Enforcement And Data Handling

- Backend must enforce seat limits server-side. Frontend checks are UX only.
- Backend must not count the organization portal account against app license
  seats.
- Only human users should have PixeSci app accounts. Those accounts are created
  through license seats and invitations, not by using the organization portal
  account.
- Backend may store the organization profile fields listed above. They are
  needed for license issuance, renewal, support, and seat enforcement.
- Backend must not collect scientific work data, files, results, local run
  records, device inventory, or endpoint telemetry through this portal unless a
  separate product and compliance decision approves it.
- Prefer license activation files or signed license bundles for air-gapped
  deployments where live portal checks are unavailable.

## Audit Events

- account setup completed
- password changed on first login
- portal password changed
- organization settings changed
- license viewed
- seat invited
- invite resent
- seat revoked
- seat removed
- role changed
- failed authorization
