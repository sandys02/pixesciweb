# PixeSci Portal User Guide

This guide explains how the PixeSci organization portal works from the point of
view of a new customer administrator. It assumes no prior knowledge of the
portal, the license model, or the air-gapped activation flow.

## What The Portal Is For

The portal is the website area where an organization manages its PixeSci
license and human app seats.

Use the portal to:

- complete first-time organization setup;
- change the portal account password;
- review active and inactive licenses;
- create human PixeSci app seats;
- resend, revoke, or remove seats;
- export signed seat activation files for air-gapped installs;
- generate signed offline license bundles for the PixeSci app.

The portal is not the PixeSci app itself. The portal does not run scientific
workflows, store experiment files, or contain local run records. Those remain in
the customer-controlled PixeSci app environment.

## The Two Login Levels

PixeSci currently has two separate login concepts.

### Website Download Gate

The download gate protects installer access. It is only for downloading PixeSci
from the public website.

It uses:

- `/api/download/login`
- `/api/download/session`
- `pixesci_download_session`

Download-gate users are not portal license administrators and do not manage app
seats.

### Organization Portal Login

The organization portal login is for the customer account that manages
organization details, licenses, seats, and offline files.

It uses:

- `/api/portal/login`
- `/api/portal/session`
- `pixesci_portal_session`

Portal accounts are created by PixeSci during customer onboarding. A customer is
given an email address and a temporary password. On first login, the customer
must complete Account Setup and choose a new password.

## Account Types

There are three important identities to understand.

### Portal Account

The portal account is the organization administrator account. It manages the
license and seats.

The portal account:

- can sign in to the website portal;
- can update organization profile details;
- can invite app users;
- can export activation files and license bundles;
- does not consume a PixeSci app seat.

### Human App Seat

A seat is a human user who will sign in to the local PixeSci app.

A seat:

- belongs to one organization license;
- has an email address;
- has a role such as `admin` or `member`;
- can be `invited`, `active`, or `revoked`;
- counts against the license seat limit while invited or active.

### Local App User

The local app user exists inside the PixeSci app environment. For air-gapped
installs, the app creates or prepares this local user after importing a signed
seat activation file.

The app local auth system remains authoritative for local login.

## First-Time Customer Onboarding

When PixeSci onboards a new customer, PixeSci creates:

- one organization record;
- one portal account;
- one active license;
- zero human app seats by default.

The customer receives:

- portal email;
- temporary portal password.

Example local test account:

```text
Email: pixesci@gmail.com
Temporary password: password123
```

First login flow:

1. Open the website.
2. Choose `Sign In`.
3. Enter the portal email and temporary password.
4. The portal opens Account Setup.
5. Confirm or update organization details.
6. Set a new portal password.
7. Submit setup.
8. The license dashboard opens.

After setup, the temporary password is no longer the portal password.

## Organization Settings

The Settings page stores basic organization information needed for licensing,
support, and customer administration.

Editable fields include:

- organization type;
- state;
- organization name;
- domain;
- research field.

The organization email is locked until a verified email-change workflow exists.

The Settings page also lets the portal account change its password. Password
changes require the current password.

## Licenses

The Licenses page shows the organization license records.

Each license has:

- license ID;
- label;
- status;
- start date;
- end date;
- seat limit;
- current allocated seats.

License statuses:

- `active`: seats can be managed and offline bundles can be generated;
- `inactive`: historical license; normal portal views expose only minimal seat
  history.

Only active licenses can be used for new invitations, activation exports, and
offline bundle generation.

## Seats

Seats represent human PixeSci app users.

Seat statuses:

- `invited`: a pending user invite exists;
- `active`: the user has been accepted or activated;
- `revoked`: the invite or seat has been revoked.

Pending invites count against the seat limit. This prevents over-allocating a
license by creating many pending invitations.

## Inviting A Human App User

To invite a user:

1. Open the Licenses page.
2. Expand an active license.
3. Enter the user's email address.
4. Select a role:
   - `Admin`: local app administrator user;
   - `Member`: regular local app user.
5. Click `Invite`.

The portal creates an invited seat and returns a one-time invite link.

## One-Time Invite Links

When a seat is invited, the backend generates a secret invite token. The portal
stores only a hash of that token. The plaintext token is shown only once in the
portal response.

Important rules:

- the plaintext one-time link is not stored by the portal;
- if the link is lost, resend the invite;
- invite tokens expire;
- expired invites must be resent before they can be used for activation export;
- revoked invites cannot be used.

The current backend stores the invite token hash and expiry. The website-owned
invite acceptance endpoint is not implemented yet because the air-gapped path is
the baseline.

## Resending An Invite

Use `Invite again` or `Resend` when:

- the one-time link was lost;
- the invite expired;
- a revoked seat should be invited again and capacity is available.

Resending creates a new token, new token hash, and new expiry. The old token is
replaced.

## Revoking An Invite

Revoking an invited seat cancels the pending invite.

After revocation:

- the invite token hash is cleared;
- the invite expiry is cleared;
- the seat no longer counts as an allocated invited seat;
- the user cannot activate from that invite.

## Removing A Seat

Removing a seat is for active seats, not pending invites.

The backend prevents removal of protected admin seats where removing the seat
would leave the license without its required admin protection.

Removed seats become revoked records for audit/history.

## Air-Gapped Seat Activation

For air-gapped customers, the PixeSci app cannot call the website to accept an
invite. Instead, the portal exports a signed seat activation file.

Use this when:

- the app environment is disconnected from the internet;
- public app registration is not allowed;
- the customer needs local user creation without a live website call.

To export a seat activation:

1. Create or find an invited seat under an active license.
2. Open the seat options menu.
3. Click `Export activation`.
4. Copy or download the activation text file.
5. Transfer the file to the local PixeSci app environment.
6. Import it in the app when Phase 7 app-side import is implemented.

Exporting an activation file does not mark the portal seat active. In an
air-gapped environment, the portal cannot prove the local app imported the file.
A future manual return-file workflow can reconcile portal status if needed.

## Seat Activation File Contents

Seat activation files are armored text files:

```text
-----BEGIN PIXESCI SEAT ACTIVATION-----
signed activation content
-----END PIXESCI SEAT ACTIVATION-----
```

The signed payload contains safe licensing and seat fields:

- activation version;
- license ID;
- organization ID;
- organization name;
- seat ID;
- seat email;
- seat role;
- seat status;
- license start and end dates;
- seat limit;
- issued-at time;
- expires-at time;
- signing key ID.

It does not contain:

- plaintext invite token;
- invite token hash;
- portal password;
- password hash;
- session token;
- private signing key;
- scientific files or results;
- app device identifiers.

The local PixeSci app must verify the signature before creating or preparing the
local user.

## Offline License Bundles

Offline license bundles let the PixeSci app verify license state without
calling the website.

Use the offline license bundle when:

- the app runs in an air-gapped environment;
- the app must enforce license term and seat limit locally;
- the customer cannot depend on live portal availability.

To generate a bundle:

1. Open the Licenses page.
2. Expand an active license.
3. Find `Offline license bundle`.
4. Click `Generate`.
5. Copy or download the generated bundle.
6. Transfer the file to the local PixeSci app environment.
7. Import it in the app when Phase 7 app-side import is implemented.

The portal records bundle generation and export in the audit log.

## Offline License Bundle Contents

License bundles are signed armored text files:

```text
-----BEGIN PIXESCI LICENSE BUNDLE-----
signed license bundle content
-----END PIXESCI LICENSE BUNDLE-----
```

The signed payload contains:

- bundle version;
- license ID;
- organization ID;
- organization name;
- license start date;
- license end date;
- seat limit;
- feature flags;
- issued-at time;
- signing key ID;
- optional seat manifest.

The optional seat manifest includes invited or active seat email, role, status,
and seat ID only.

The bundle does not contain:

- passwords;
- invite tokens;
- private keys;
- session tokens;
- scientific work data.

## Signature Verification

Both activation files and license bundles are signed with Ed25519.

The portal keeps the private signing key server-side. The app verifies files
with a trusted public key.

If any signed file is changed after export, verification fails. This protects
license terms, seat identity, organization identity, and expiry details from
tampering.

Development uses a fallback signing key. Production must set:

- `PORTAL_LICENSE_SIGNING_PRIVATE_KEY_PEM`
- `PORTAL_LICENSE_PUBLIC_KEY_PEM`
- `PORTAL_LICENSE_PUBLIC_KEY_ID`

## Typical Customer Flow

This is the intended end-to-end customer workflow.

1. PixeSci creates a portal account and active license for the customer.
2. Customer receives portal email and temporary password.
3. Customer signs in to the portal.
4. Customer completes Account Setup and sets a new password.
5. Customer opens the active license.
6. Customer invites the first human app admin seat.
7. Customer exports a signed seat activation file for that seat.
8. Customer generates a signed offline license bundle.
9. Customer transfers both files to the controlled PixeSci app environment.
10. Local app verifies the files and creates/prepares local app users.
11. Local app enforces license term, feature flags, and seat limits locally.

## Local Testing Flow

For local development, a seeded account can be created with:

```bash
npm run db:seed:portal -- \
  --account-email pixesci@gmail.com \
  --password password123 \
  --organization-name "PixeSci Test Client" \
  --organization-type enterprise \
  --state California \
  --domain pixesci-test.local \
  --research-field "Scientific workflow validation" \
  --license-id LIC-PSCI-TEST-0001 \
  --starts-at 2026-07-10 \
  --ends-at 2027-07-10 \
  --seat-limit 5 \
  --label "Test controlled deployment"
```

Then:

1. Start the website:

   ```bash
   npm run dev
   ```

2. Open the local site.

3. Sign in with:

   ```text
   Email: pixesci@gmail.com
   Password: password123
   ```

4. Complete Account Setup and choose a new password.

5. Test license, seat, activation, and bundle flows.

After Account Setup, use the new password instead of `password123`.

## Troubleshooting

### Invalid Email Or Password

Possible causes:

- the email exists in the download-gate database, not the portal database;
- the visible form is calling `/api/download/login` instead of
  `/api/portal/login`;
- the temporary password was already changed during Account Setup;
- the account is locked after repeated failed attempts;
- the portal account was not seeded.

Download-gate users live in `private/download.db`. Portal accounts live in
`private/portal.db`.

### Portal Redirects Back To Home

The browser does not have a valid `pixesci_portal_session` cookie. Sign in
through the portal login flow again.

### Account Setup Keeps Appearing

The portal account still has `must_change_password=true` or no setup completion
timestamp. Complete setup successfully and use a password of at least ten
characters.

### Cannot Invite A Seat

Possible causes:

- the license is inactive;
- the seat limit is already reached;
- the email already has an active or invited seat on that license;
- the portal session expired.

### Cannot Export Seat Activation

Activation export only works for invited seats under active licenses.

It fails when:

- the seat is active;
- the seat is revoked;
- the invite expired;
- the license is inactive;
- the seat belongs to another organization;
- the seat is missing email, role, or expiry data.

Resend the invite to refresh expiry, then export activation again.

### Offline Bundle Verification Fails

Possible causes:

- the bundle text was modified;
- the app does not trust the key ID;
- the wrong public key is configured;
- the file was truncated during copy/paste;
- the app is expecting a different bundle version.

Regenerate and download the bundle again, then transfer the full text file.

## What Is Not Implemented Yet

The portal backend through Phase 6 is implemented. These parts are still future
work:

- app-side import in `/home/japheth-oruko/projects/pixesciv2`;
- website-owned invite acceptance endpoint;
- manual activation return files;
- production signing-key rotation scripts;
- full route test suite;
- operational backup/restore documentation.

The current baseline is intentionally small: local portal auth, organization
profile, license/seat management, signed seat activation exports, and signed
offline license bundles.
