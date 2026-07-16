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

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return null

  return new Resend(apiKey)
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL?.trim() || ""
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

async function sendEmail(input: {
  html: string
  subject: string
  to: string
}): Promise<EmailDeliveryResult> {
  const resend = getResendClient()
  const from = getFromEmail()

  if (!resend || !from) {
    return { status: "skipped", reason: "resend_not_configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
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

  return sendEmail({
    to: input.to,
    subject: "Set up your PixeSci organization portal",
    html: [
      `<p>PixeSci has created the organization portal for <strong>${organizationName}</strong>.</p>`,
      `<p>Registered email: <strong>${email}</strong></p>`,
      `<p>Open the secure setup link below and create your portal password:</p>`,
      `<p><a href="${setupLink}">${setupLink}</a></p>`,
      `<p>${escapeHtml(formatExpiry(input.expiresAt))} The link is single-use.</p>`,
      `<p>If you were not expecting this email, contact PixeSci before opening the link.</p>`,
    ].join("\n"),
  })
}

export async function sendPasswordResetEmail(input: PasswordResetEmailInput) {
  const resetLink = escapeHtml(input.resetLink)
  const surface = escapeHtml(input.surface)

  return sendEmail({
    to: input.to,
    subject:
      input.surface === "portal"
        ? "Reset your PixeSci portal password"
        : "Reset your PixeSci staff admin password",
    html: [
      `<p>We received a request to reset your PixeSci ${surface} password.</p>`,
      `<p>Open the secure reset link below and choose a new password:</p>`,
      `<p><a href="${resetLink}">${resetLink}</a></p>`,
      `<p>${escapeHtml(formatExpiry(input.expiresAt))} The link is single-use.</p>`,
      `<p>If you did not request this reset, you can ignore this email.</p>`,
    ].join("\n"),
  })
}

export type { EmailDeliveryResult }
