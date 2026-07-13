# Portal Backend Plan

This document describes the intended backend for PixeSci organization
onboarding, portal setup, license visibility, and seat management.

Current implementation gaps and temporary technical debt are tracked separately
in `docs/portal-backend-technical-debt.md`.

Current implementation status: the website portal has local portal auth,
organization profile APIs, license and seat APIs, activation export, signed
offline license bundles, and connected seat activation acceptance. Remaining
work is mostly operational hardening plus deferred browser invite acceptance.

## Product Decision

Organization onboarding is owned by the website portal, not the PixeSci app.
The app must not provide public organization registration. Any app UI that
previously exposed `Register` should become `Contact PixeSci` and route to the
canonical website contact/demo flow.

PixeSci creates the organization portal account during customer onboarding. The
first portal login uses a temporary credential or one-time password. Account
Setup is mandatory before the user can access the license dashboard or seat
management.

The organization portal account is not a human PixeSci app user and must not
consume a license seat.

## Portal Product Model

1. PixeSci creates an organization portal account during customer onboarding.
2. First portal sign-in uses a temporary credential or one-time password.
3. Account Setup is the first screen until setup is complete.
4. Account Setup stores the limited organization profile:
   - edition / organization type: `academia`, `enterprise`, or `pixesci`
   - country, currently `United States`
   - state
   - organization name
   - organization email
   - organization domain
   - research field
   - new portal password
5. The license dashboard lists current and historical license IDs and status.
6. Active licenses support seat management.
7. Inactive licenses are historical and should expose minimal data.

## Required Portal APIs

Portal auth:

- `POST /api/portal/login`
- `POST /api/portal/logout`
- `GET /api/portal/session`
- `POST /api/portal/account-setup`
- `POST /api/portal/password/change`

Organization profile:

- `GET /api/portal/organization`
- `PATCH /api/portal/organization`

Licenses and seats:

- `GET /api/portal/licenses`
- `GET /api/portal/licenses/{license_id}/seats`
- `POST /api/portal/licenses/{license_id}/seats/invite`
- `POST /api/portal/seats/{seat_id}/resend`
- `POST /api/portal/seats/{seat_id}/revoke-invite`
- `POST /api/portal/seats/{seat_id}/remove`

Connected app-facing activation endpoint:

- `POST /api/portal/seat-activations/accept`

Deferred browser invite acceptance endpoint if the website later owns a web
acceptance flow:

- `POST /api/portal/invitations/{token}/accept`

The current product model does not require a separate "add" endpoint. A seat
becomes active when the invited user accepts the single-use invite or temporary
credential. Add a separate endpoint only if the backend later supports
preallocated inactive seats that need explicit activation by an administrator.

Current direction: connected activation uses
`POST /api/portal/seat-activations/accept`. The local PixeSci app submits the
exported armored seat activation file, the website verifies it, marks the seat
active, and returns a fresh signed license bundle. For air-gapped installs, the
local app can still import the file without calling the website, but that
fallback cannot guarantee global single-use and the portal seat may remain
`invited` until a return-file workflow exists.

## Seat Action Semantics

The portal should display only actions that are meaningful for the current row.
Do not show disabled or irrelevant actions.

Normal active-license row actions:

- `active` owner/first-admin seat: no row action by default
- `active` non-owner seat: `Remove seat`
- `invited` seat: `Revoke invite`
- `revoked` seat: `Invite again`, only when the license has capacity

Pending invites should count against available capacity. Backend enforcement is
mandatory; frontend capacity checks are only user experience.

Inactive-license rows should expose less data than active rows. The normal
portal view should return only historical seat id and status for inactive
licenses unless an explicit privileged audit/export endpoint is added later.

## Data Model

Organization:

- organization id
- edition / organization type
- country
- state
- organization name
- organization email
- organization domain
- research field
- setup status
- timestamps

License:

- license id
- organization id
- status: `active` or `inactive`
- starts_at / ends_at
- seat_limit
- signed/offline license metadata

Seat:

- seat id
- organization id
- license id
- email
- role: `admin` or `member`
- status: `active`, `invited`, or `revoked`
- invitation token hash or temporary credential hash
- invitation expiry
- resend metadata
- timestamps

## Temporary Credentials And Invitations

Backend must:

- store only hashes for temporary credentials and invitation tokens
- expire temporary credentials and invite links
- require Account Setup while `must_change_password=true`
- block license and seat APIs until setup is complete
- use single-use invite links or one-time credentials for seat email ownership
- avoid user enumeration in error responses
- rate-limit login, resend, invite, and password-change attempts
- never log passwords, plaintext tokens, signed URLs, or session secrets

## Identity Provider Decision

Backend must explicitly decide whether to use Keycloak or local auth.

Keycloak is acceptable only if it is operated in a customer-controlled mode:

- local or air-gapped deployment without cloud dependency
- realm export/import and backup/restore documented
- required actions support first password change
- temporary credential and invitation flows map cleanly to portal setup
- SMTP can use a customer relay or disconnected process
- admin bootstrap and recovery do not require an external cloud service
- audit export is available
- Keycloak user IDs map clearly to PixeSci organization, license, and seat IDs

If Keycloak is not used, local auth must implement:

- password hashing
- token hashing
- forced password change
- account lockout/backoff
- sessions and refresh strategy
- RBAC
- invitation lifecycle
- admin recovery
- audit logging

## Air-Gapped And Minimal-Data Requirements

PixeSci targets customer-controlled and air-gapped scientific environments. The
portal/backend may store organization profile, license, and human seat records
because they are needed for licensing, renewal, support, and seat enforcement.

The portal must not collect scientific work data, files, results, local run
records, SOP content, endpoint usernames, device inventory, IP addresses,
telemetry, or internal deployment topology unless a separate product and
compliance decision explicitly expands scope.

For disconnected deployments, prefer signed license bundles or activation files
that encode license id, organization id, seat limit, term, and signature. The
app should validate license state locally without calling PixeSci. Backend
tooling should support generating, rotating, revoking, and auditing those
bundles.

Seat activation files use armored `PIXESCI SEAT ACTIVATION` text and should be
imported by the app from the first-time login/activation flow. In connected
mode, the app submits that armored text to the website acceptance API before
creating a local user. In air-gapped mode, the app should use its existing local
backend and crypto stack to verify the activation before creating or preparing a
local user.

## Audit Events

Capture server-side events for:

- portal account created
- first login attempted
- account setup completed
- first password changed
- portal password changed
- organization profile changed
- license viewed/exported
- offline license bundle generated
- seat invited
- seat invite resent
- seat invite revoked
- seat activated by invite acceptance
- seat activation file exported
- seat removed
- seat role changed
- seat limit exceeded
- unauthorized portal action blocked

## Acceptance Criteria

- Public app registration is removed and not reintroduced.
- App `Register` CTAs become `Contact PixeSci`.
- First portal sign-in forces Account Setup when temporary credential or
  `must_change_password` state exists.
- Organization profile fields from the old app registration flow are captured
  in the portal.
- Settings can update non-sensitive organization profile fields; organization
  email remains locked unless a verified email-change flow is added.
- License and seat APIs are scoped to the signed-in organization.
- The portal account is not counted as a human app seat.
- Backend enforces seat limits and allowed row actions.
- Inactive-license views expose only minimal historical data.
- Air-gapped license enforcement works without live portal checks.
