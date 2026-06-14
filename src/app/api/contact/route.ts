import { Resend } from "resend"

import {
  DemoRequestEmail,
  type DemoRequest,
} from "@/components/emails/demo-request-email"

const inquiryTypes = new Set([
  "Request a product demo",
  "Map a workflow or software stack",
  "Plan a pilot or evaluation",
  "Discuss pricing or procurement",
  "Review security or deployment",
])

const deploymentPriorities = new Set([
  "Managed workstation",
  "On-prem infrastructure",
  "Airgapped / controlled environment",
  "Hybrid environment",
  "Still evaluating",
])

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.RESEND_CONTACT_TO
  const sender = process.env.RESEND_CONTACT_FROM

  if (!apiKey || !recipient || !sender) {
    console.error("Contact email environment variables are not configured")
    return Response.json(
      { error: "The contact form is temporarily unavailable." },
      { status: 503 }
    )
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  const validation = validateRequest(payload)

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 })
  }

  if (validation.data.website) {
    return Response.json({ success: true })
  }

  const demoRequest = validation.data.request
  const resend = new Resend(apiKey)
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: demoRequest.email,
      subject: `Demo request: ${demoRequest.organization}`,
      react: DemoRequestEmail({ request: demoRequest }),
    })

    if (error) {
      console.error("Resend contact form delivery failed", error)
      return Response.json(
        { error: "We could not send your request. Please try again." },
        { status: 502 }
      )
    }

    return Response.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Contact form delivery failed", error)
    return Response.json(
      { error: "We could not send your request. Please try again." },
      { status: 502 }
    )
  }
}

type ValidatedRequest =
  | {
      ok: true
      data: {
        request: DemoRequest
        website: string
      }
    }
  | {
      ok: false
      error: string
    }

function validateRequest(payload: unknown): ValidatedRequest {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid request body." }
  }

  const request: DemoRequest = {
    name: readString(payload.name),
    email: readString(payload.email).toLowerCase(),
    organization: readString(payload.organization),
    role: readString(payload.role),
    inquiryType: readString(payload.inquiryType),
    deployment: readString(payload.deployment),
    objective: readString(payload.objective),
    message: readString(payload.message),
  }
  const website = readString(payload.website)

  if (
    !request.name ||
    !request.email ||
    !request.organization ||
    !request.role ||
    !request.inquiryType ||
    !request.deployment ||
    !request.objective
  ) {
    return { ok: false, error: "Complete all required fields." }
  }

  if (!emailPattern.test(request.email) || request.email.length > 254) {
    return { ok: false, error: "Enter a valid work email." }
  }

  if (
    !inquiryTypes.has(request.inquiryType) ||
    !deploymentPriorities.has(request.deployment)
  ) {
    return { ok: false, error: "Select a valid form option." }
  }

  if (
    request.name.length > 120 ||
    request.organization.length > 160 ||
    request.role.length > 120 ||
    request.objective.length > 3000 ||
    request.message.length > 5000 ||
    website.length > 200
  ) {
    return { ok: false, error: "One or more fields are too long." }
  }

  return { ok: true, data: { request, website } }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}
