# Resend Contact Form

The request demo form at `/contact` sends submissions through the Next.js route
handler at `/api/contact`. Resend delivers each request to the configured
recipient, with the submitter's work email set as the reply-to address.

## Initial Resend setup

1. Create an account at [resend.com](https://resend.com).
2. In the Resend dashboard, create an API key with sending access.
3. Install `resend` and `@react-email/render` in the Next.js project.
4. Add `pixesci.com` under **Domains**.
5. Add the DNS records supplied by Resend at the domain's DNS provider.
6. Wait until Resend reports the domain as verified.
7. Store the API key and contact settings in the deployment environment.

Use these variables locally in the repository-root `.env` file:

```dotenv
RESEND_API_KEY=re_your_api_key
RESEND_CONTACT_FROM="Pixesci Website <hello@pixesci.com>"
RESEND_CONTACT_TO=hello@pixesci.com
```

Do not prefix these variables with `NEXT_PUBLIC_`. They are server secrets and
must never be included in browser JavaScript. `.env*` is ignored by Git and
must not be committed.

Add the same values to the production hosting environment, then redeploy so the
route handler can read them.

## Local testing

Resend's `onboarding@resend.dev` sender is intended for account-owner testing.
Before the Pixesci domain is verified, use:

```dotenv
RESEND_CONTACT_FROM="Pixesci Website <onboarding@resend.dev>"
RESEND_CONTACT_TO=the-resend-account-email@example.com
```

Start the app with `npm run dev`, submit `/contact`, and confirm:

- `POST /api/contact` returns HTTP 200.
- The message appears in Resend Logs.
- The recipient receives the message.
- Replying targets the email supplied in the form.

Restore the production sender and `hello@pixesci.com` recipient after testing.

## Operational behavior

- The API validates required fields, email syntax, select values, and lengths.
- A honeypot absorbs basic automated submissions.
- Resend errors return a non-200 response and the form displays a retry message.
- The API key and recipient configuration are read only on the server.

## Technical debt

The current implementation is intentionally email-only. Before sustained
public traffic, address the following:

1. Add durable rate limiting by IP and/or request fingerprint. The honeypot is
   not sufficient protection against targeted abuse.
2. Add bot protection such as Turnstile if submission abuse becomes material.
3. Store leads in an approved CRM or database so email delivery is not the only
   record of a request.
4. Add structured monitoring and alerts for repeated Resend failures.
5. Define retention, access, and deletion policies for contact-form data.
6. Add automated route tests with the Resend client mocked, covering validation,
   successful delivery, provider failure, and missing environment variables.
7. Evaluate idempotency or duplicate detection if retries are introduced.
8. Document API-key rotation and assign ownership for Resend billing, domain
   verification, DNS records, and delivery monitoring.

## Current deployment dependency

As of June 14, 2026, the connected Resend account has no verified domains.
`pixesci.com` must be verified before
`Pixesci Website <hello@pixesci.com>` can deliver to `hello@pixesci.com`.
