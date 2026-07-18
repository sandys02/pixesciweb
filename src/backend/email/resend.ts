import { Resend } from "resend"

type EmailDeliveryResult =
  | { status: "sent"; id: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; message: string }

type PortalSetupEmailInput = {
  expiresAt?: string
  organizationName: string
  setupLink: string
  to: string
}

type PasswordResetEmailInput = {
  expiresAt?: string
  resetLink: string
  surface: "portal" | "staff admin"
  to: string
}

type EmailTemplateInput = {
  body: string[]
  ctaHref: string
  ctaLabel: string
  eyebrow: string
  footerNote: string
  preheader: string
  subject: string
  title: string
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return null

  return new Resend(apiKey)
}

function parseEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/)
  return (match?.[1] ?? value).trim()
}

function getNoReplyEmailAddress(from: string) {
  const address = parseEmailAddress(from)
  const domain = address.includes("@") ? address.split("@").at(1) : null

  return domain ? `no-reply@${domain}` : ""
}

function getFromEmail() {
  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim() || ""
  const noReplyAddress = getNoReplyEmailAddress(configuredFrom)

  return noReplyAddress ? `PixeSci <${noReplyAddress}>` : configuredFrom
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatExpiry(expiresAt?: string) {
  if (!expiresAt) return "This link expires soon."

  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return "This link expires soon."

  return `This link expires on ${date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  })} UTC.`
}

function textFromHtml(value: string) {
  return value
    .replace(/<a\s+href="([^"]+)">.*?<\/a>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
}

function renderEmailText(input: EmailTemplateInput) {
  return [
    "PixeSci",
    input.title,
    "",
    ...input.body.map(textFromHtml),
    "",
    `${input.ctaLabel}: ${input.ctaHref}`,
    "",
    input.footerNote,
    "This inbox is not monitored. Do not reply to this email.",
  ].join("\n")
}

function renderEmailHtml(input: EmailTemplateInput) {
  const body = input.body
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;color:#2f3747;font-size:15px;line-height:1.7;">${paragraph}</p>`
    )
    .join("")

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(input.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#eef3f8;color:#172033;font-family:Inter,Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">
      ${escapeHtml(input.preheader)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#eef3f8;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;border-collapse:separate;border-spacing:0;">
            <tr>
              <td style="padding:28px 28px 32px;border-radius:18px 18px 0 0;background:#0357ff;background-image:linear-gradient(135deg,#0357ff 0%,#0577ff 52%,#0b9edb 100%);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="display:inline-block;width:54px;height:54px;border-radius:16px;background:#ffffff;color:#0357ff;font-size:26px;font-weight:800;font-style:italic;line-height:54px;text-align:center;letter-spacing:0;">Px</div>
                    </td>
                    <td align="right" style="vertical-align:middle;color:#dcecff;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">
                      ${escapeHtml(input.eyebrow)}
                    </td>
                  </tr>
                </table>
                <h1 style="margin:28px 0 0;color:#ffffff;font-size:32px;line-height:1.15;font-weight:750;letter-spacing:0;">
                  ${escapeHtml(input.title)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 28px 12px;background:#ffffff;border-right:1px solid #d9e1ea;border-left:1px solid #d9e1ea;">
                ${body}
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0 22px;">
                  <tr>
                    <td style="border-radius:8px;background:#0357ff;">
                      <a href="${input.ctaHref}" style="display:inline-block;padding:13px 18px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">
                        ${escapeHtml(input.ctaLabel)}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 20px;color:#59677a;font-size:13px;line-height:1.65;">
                  If the button does not work, copy and paste this link into your browser:<br>
                  <a href="${input.ctaHref}" style="color:#0357ff;text-decoration:underline;word-break:break-all;">${input.ctaHref}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;border-radius:0 0 18px 18px;background:#101827;border:1px solid #101827;">
                <p style="margin:0 0 10px;color:#e8edf6;font-size:14px;line-height:1.6;font-weight:700;">PixeSci</p>
                <p style="margin:0 0 12px;color:#b9c4d4;font-size:13px;line-height:1.6;">
                  ${escapeHtml(input.footerNote)}
                </p>
                <p style="margin:0;color:#8f9cad;font-size:12px;line-height:1.6;">
                  This inbox is not monitored. Do not reply to this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

async function sendEmail(input: {
  html: string
  subject: string
  text: string
  to: string
}): Promise<EmailDeliveryResult> {
  const resend = getResendClient()
  const from = getFromEmail()
  const replyTo = getNoReplyEmailAddress(from)

  if (!resend || !from) {
    return { status: "skipped", reason: "resend_not_configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo,
    })

    if (error) {
      return { status: "failed", message: error.message }
    }

    return { status: "sent", id: data?.id ?? null }
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "Email delivery failed.",
    }
  }
}

export async function sendPortalSetupEmail(input: PortalSetupEmailInput) {
  const organizationName = escapeHtml(input.organizationName)
  const setupLink = escapeHtml(input.setupLink)
  const email = escapeHtml(input.to)
  const expiry = escapeHtml(formatExpiry(input.expiresAt))
  const subject = "Set up your PixeSci organization portal"
  const template = {
    subject,
    title: "Set up your organization portal",
    eyebrow: "Portal setup",
    preheader:
      "PixeSci has created your organization portal. Create your password to continue.",
    ctaHref: setupLink,
    ctaLabel: "Create portal password",
    footerNote:
      "PixeSci sent this account setup message for access to the organization portal. The portal is used to manage customer-controlled PixeSci licenses, downloads, seats, and setup records.",
    body: [
      `PixeSci has created the organization portal for <strong>${organizationName}</strong>.`,
      `Registered email: <strong>${email}</strong>`,
      "Open the secure setup link below and create your portal password.",
      `${expiry} The link is single-use.`,
      "If you were not expecting this email, contact PixeSci before opening the link.",
    ],
  }

  return sendEmail({
    to: input.to,
    subject,
    html: renderEmailHtml(template),
    text: renderEmailText(template),
  })
}

export async function sendPasswordResetEmail(input: PasswordResetEmailInput) {
  const resetLink = escapeHtml(input.resetLink)
  const surface = escapeHtml(input.surface)
  const expiry = escapeHtml(formatExpiry(input.expiresAt))
  const subject =
    input.surface === "portal"
      ? "Reset your PixeSci portal password"
      : "Reset your PixeSci staff admin password"
  const template = {
    subject,
    title:
      input.surface === "portal"
        ? "Reset your portal password"
        : "Reset your staff admin password",
    eyebrow: "Password reset",
    preheader: `Open the secure link to reset your PixeSci ${surface} password.`,
    ctaHref: resetLink,
    ctaLabel: "Reset password",
    footerNote:
      input.surface === "portal"
        ? "PixeSci sent this password reset message for access to the organization portal. The portal is used to manage customer-controlled PixeSci licenses, downloads, seats, and setup records."
        : "PixeSci sent this password reset message for access to the internal staff admin dashboard. Staff use this dashboard to manage organization portal access and license records.",
    body: [
      `We received a request to reset your PixeSci ${surface} password.`,
      "Open the secure reset link below and choose a new password.",
      `${expiry} The link is single-use.`,
      "If you did not request this reset, you can ignore this email.",
    ],
  }

  return sendEmail({
    to: input.to,
    subject,
    html: renderEmailHtml(template),
    text: renderEmailText(template),
  })
}

export type { EmailDeliveryResult }
