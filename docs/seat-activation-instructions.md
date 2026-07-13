# PixeSci Seat Activation Instructions

This guide has two parts:

- Part 1 is for the portal admin who manages licenses and invites.
- Part 2 is for the invited user who needs to set up PixeSci on their local PC.

Connected activation is the preferred path when the local PixeSci app can reach
the website portal during first-time setup. Air-gapped activation remains
available for disconnected deployments, but offline-only import cannot guarantee
global single-use because the portal cannot know which PC imported the file.

## Part 1: Portal Admin Instructions

Use these steps when you need to invite a user and give them an activation file
for local PixeSci setup.

### 1. Sign In To The Portal

1. Open the PixeSci website portal.
2. Sign in with your portal admin email and password.
3. If this is your first portal sign-in, complete account setup and set your
   portal password.
4. Open the portal dashboard.

The portal admin account is for license and seat management. It is not the same
as a local PixeSci app user account.

### 2. Confirm The License Is Active

1. Open the Licenses area.
2. Find the license that should receive the new user seat.
3. Confirm the license status is `active`.
4. Confirm the license term is current.
5. Confirm the license has available seat capacity.

Only active licenses can be used for new seat invitations and activation
exports.

### 3. Invite The User

1. Expand the active license.
2. Choose the invite user action.
3. Enter the invited user's email address.
4. Choose the user's seat role:
   - `admin`: can administer the local PixeSci organization in the app.
   - `member`: can use the local PixeSci app without admin privileges.
5. Submit the invite.

The portal creates an invited seat. Pending invited seats count against the
license seat limit.

### 4. Export The Seat Activation File

1. Find the invited seat under the license.
2. Confirm the seat status is `invited`.
3. Open the seat options menu.
4. Choose `Export activation`.
5. Save or copy the full armored activation text.

The activation text starts and ends like this:

```text
-----BEGIN PIXESCI SEAT ACTIVATION-----
...
-----END PIXESCI SEAT ACTIVATION-----
```

Do not edit the activation text. Do not paste only part of it. The user must
receive the full text, including the begin and end lines.

### 5. Send The Activation File To The Invited User

Send the activation file or text to the invited user through your approved
customer handoff process.

Recommended details to include:

- the invited email address;
- the organization name;
- the seat role;
- that they should use `New user? Set up your account` in the local app;
- whether they should use connected activation or the air-gapped fallback.

Do not send portal admin passwords, invite token hashes, signing keys, or
license secrets.

### 6. Preferred Option: Connected Activation

Use connected activation when the user's PixeSci app can reach the website
portal during first-time setup.

What happens:

1. The user pastes or imports the activation file in the local app.
2. The local app submits the activation text to the website portal.
3. The portal verifies the signed activation.
4. The portal confirms the seat is still `invited` and the license is active.
5. The portal marks the seat `active`.
6. The portal sets `inviteAcceptedAt`.
7. The portal clears the invite token fields.
8. The portal records an audit event.
9. The portal returns a fresh signed license bundle to the app.
10. The app creates the local user.

This makes the activation globally single-use. If the same activation file is
copied to another PC, the second attempt fails because the portal seat is no
longer `invited`.

### 7. Fallback Option: Air-Gapped Activation

Use the air-gapped fallback only when the local app cannot reach the website
portal.

What happens:

1. The user imports the activation file locally.
2. The app verifies the signature and activation contents locally.
3. The app may create the local user.
4. Normal app use continues locally.

Important limitation: air-gapped import cannot guarantee global single-use. The
portal cannot know whether the same activation file was copied to another PC.
The portal seat may remain `invited` until a future manual reconciliation
workflow updates it.

### 8. After The User Activates

For connected activation:

1. Refresh the portal seat list.
2. Confirm the seat status is `active`.
3. Confirm the invite accepted time is present.
4. Confirm the invited user no longer appears as pending.

For air-gapped activation:

1. Keep a local record that the activation file was handed off.
2. Follow your organization's offline reconciliation process.
3. Do not assume the portal can enforce one-PC use for offline-only activation.

### 9. If Something Goes Wrong

If the user says the activation is invalid:

1. Confirm they copied the entire activation text.
2. Confirm the begin and end lines are present.
3. Confirm the seat is still `invited`.
4. Confirm the invite has not expired.
5. Confirm the license is still `active`.
6. If needed, resend the invite or create a fresh activation export.

If the user says the portal is unreachable:

1. Confirm their PC can reach the website portal.
2. Confirm the app portal base URL is configured correctly.
3. Retry connected activation when the portal is reachable.
4. Use air-gapped fallback only if the deployment is intentionally disconnected.

If the activation was already used:

1. Check whether the portal seat is already `active`.
2. If it is active, the activation file has already been consumed.
3. Do not try to reuse the same activation file on another PC.
4. Create or resend a valid invite only if your license and internal process
   allow it.

## Part 2: Invited User Instructions

Use these steps when your organization admin has sent you a PixeSci seat
activation file.

### 1. Get Ready

You need:

- the local PixeSci app installed on your PC;
- the activation text or `.txt` file from your organization admin;
- permission to use the invited email address;
- website access if your organization is using connected activation.

The activation file is not your password. It is proof that your organization
invited your email address to use a license seat.

### 2. Open The Local PixeSci App

1. Start the PixeSci app on your PC.
2. Wait for the login screen.
3. Keep the normal returning-user email/password form for future logins.
4. For first-time setup, choose `New user? Set up your account`.

Do not use public organization registration. Your organization has already
created the invitation through the portal.

### 3. Choose How To Enter The Activation

You have two options.

Option A: Paste activation text

1. Open the activation file or message from your admin.
2. Copy the full activation text.
3. Include the first line:
   `-----BEGIN PIXESCI SEAT ACTIVATION-----`
4. Include the last line:
   `-----END PIXESCI SEAT ACTIVATION-----`
5. Paste it into the setup box.

Option B: Import a `.txt` activation file

1. Choose the import file option.
2. Select the `.txt` file your admin gave you.
3. Wait for the app to load the activation text into the setup box.

Do not edit the activation text after pasting or importing it.

### 4. Preferred Option: Connected Activation

Use this option when your PC can reach the website portal.

1. After pasting or importing the activation, click the setup or verify button.
2. Wait while the app contacts the website portal.
3. The portal checks that the activation is signed, current, and unused.
4. If accepted, the app shows details such as:
   - your invited email;
   - your role;
   - your seat ID;
   - your license ID;
   - your organization name;
   - activation status.
5. The app creates your local PixeSci user.
6. The app starts your first-time session.
7. You will be asked to set your first local password.

Connected activation consumes the activation file. You should not use the same
file on another PC.

### 5. Set Your First Local Password

After connected activation succeeds:

1. The app opens the first-password setup step.
2. Enter a new local password.
3. Confirm the password if the app asks for confirmation.
4. Submit the form.
5. Continue into the app.

You should not receive or see a temporary password for this flow. Your future
login uses your email address and the password you create locally.

### 6. Future Login

After setup is complete:

1. Open the PixeSci app.
2. Use the normal returning-user login form.
3. Enter the invited email address.
4. Enter the local password you created.
5. Sign in.

Normal app use is local after activation. The app does not need to contact the
website portal for every login or normal workflow run.

### 7. Air-Gapped Fallback

Use air-gapped fallback only if your organization tells you the app cannot
contact the website portal.

1. Open `New user? Set up your account`.
2. Paste or import the activation file.
3. Choose the documented air-gapped or offline import option if it is available.
4. The app verifies the activation locally.
5. The app creates or prepares your local user.
6. Set your local password when prompted.

Important limitation: offline-only activation cannot prove that the same file
was not copied to another PC. Connected activation is required for portal-level
single-use enforcement.

### 8. Error Messages And What To Do

If the app says the portal is unreachable:

1. Check your internet or network connection.
2. Confirm your organization expects connected activation.
3. Retry when the website portal is reachable.
4. Do not switch to air-gapped fallback unless your admin explicitly tells you
   to use it.

If the app says the activation is invalid:

1. Make sure you pasted the full activation text.
2. Make sure the begin and end lines are included.
3. Try importing the `.txt` file instead of copy/paste.
4. Ask your organization admin for a fresh activation file.

If the app says the activation was already used:

1. The portal may have already accepted that seat.
2. The same activation file cannot be used again on another PC.
3. Contact your organization admin.

If the app says a local user already exists:

1. Return to the normal login form.
2. Try signing in with your email and existing local password.
3. If you forgot the password, follow your organization's local password reset
   process.

### 9. What Not To Share

Do not share:

- your activation file after you use it;
- your local password;
- screenshots containing license details unless your admin asks for them;
- portal admin credentials;
- private keys or signing material.

If you think your activation file was sent to the wrong person or copied to
another PC, contact your organization admin.
