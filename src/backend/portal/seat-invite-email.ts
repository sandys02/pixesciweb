import { getEmailLinkOrigin } from "@/backend/email/link-origin"
import {
  sendSeatInviteEmail,
  type EmailDeliveryResult,
} from "@/backend/email/resend"
import { generatePortalSeatActivation } from "@/backend/portal/activations"
import type { PortalSeat } from "@/features/portal/types"

type PortalActor = {
  accountId: number
  organizationId: number
}

type SendSeatInviteSetupEmailInput = {
  actor: PortalActor
  inviteLink?: string
  requestOrigin: string
  seat: PortalSeat
}

function extractInviteToken(inviteLink?: string) {
  if (!inviteLink) return ""

  return inviteLink.split("/").filter(Boolean).at(-1) ?? ""
}

export async function sendSeatInviteSetupEmail({
  actor,
  inviteLink,
  requestOrigin,
  seat,
}: SendSeatInviteSetupEmailInput): Promise<EmailDeliveryResult> {
  const email = seat.email
  const token = extractInviteToken(inviteLink)

  if (!email || !token) {
    return { status: "skipped", reason: "missing_invite_email_or_token" }
  }

  const activationResult = await generatePortalSeatActivation(actor, seat.id)

  if (!activationResult.ok) {
    return { status: "skipped", reason: "activation_unavailable" }
  }

  const origin = getEmailLinkOrigin(requestOrigin)
  const downloadLink = `${origin}/api/download/invite/${encodeURIComponent(token)}`
  const activation = activationResult.activation

  return sendSeatInviteEmail({
    activationCode: activation.armoredActivation,
    downloadLink,
    expiresAt: activation.expiresAt,
    licenseId: activation.licenseId,
    organizationName: activation.payload.organizationName,
    seatRole: activation.payload.seatRole,
    to: email,
  })
}
