import { getEmailLinkOrigin } from "@/backend/email/link-origin"
import {
  sendSeatInviteEmail,
  type EmailDeliveryResult,
} from "@/backend/email/resend"
import { generatePortalSeatActivation } from "@/backend/portal/activations"
import { ROLE_TEMPLATES } from "@/backend/portal/role-templates"
import type { PortalSeat } from "@/features/portal/types"

const ROLE_NAME_BY_KEY: Record<string, string> = Object.fromEntries(
  ROLE_TEMPLATES.map((role) => [role.key, role.name])
)

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
    seatRoleNames: activation.payload.seatRoles.map(
      (role) => ROLE_NAME_BY_KEY[role] ?? role
    ),
    to: email,
  })
}
