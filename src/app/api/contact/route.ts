import { Resend } from "resend"

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Request not allowed." }, { status: 403 })
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Expected JSON." }, { status: 415 })
  }

  let body: Record<string, unknown>
  try {
    const reader = request.body?.getReader()
    if (!reader) throw new Error("Missing body")
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 32_768) {
        await reader.cancel()
        return Response.json(
          { error: "Message is too large." },
          { status: 413 }
        )
      }
      chunks.push(value)
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"))
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("Invalid body")
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  if (body.website) return Response.json({ success: true })
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const phone = typeof body.phone === "string" ? body.phone.trim() : ""
  const organization =
    typeof body.organization === "string" ? body.organization.trim() : ""
  const message = typeof body.message === "string" ? body.message.trim() : ""
  if (
    !name ||
    name.length > 120 ||
    /[\r\n]/.test(name) ||
    email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
    (body.phone !== undefined && typeof body.phone !== "string") ||
    phone.length > 40 ||
    (phone && !/^[+\d\s().\-#xext]+$/i.test(phone)) ||
    !organization ||
    organization.length > 200 ||
    /[\r\n]/.test(organization) ||
    !message ||
    message.length > 5000
  ) {
    return Response.json(
      {
        error:
          "Enter your full name, a valid email, organization (up to 200 characters), and a message (up to 5,000 characters). Check your phone number if provided.",
      },
      { status: 400 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  // Temporary fallback until RESEND_CONTACT_EMAIL is configured in Vercel.
  const to =
    process.env.RESEND_CONTACT_EMAIL?.trim() || "dancan.oruko@pixesci.com"
  if (!apiKey || !from) {
    return Response.json(
      { error: "Contact is temporarily unavailable. Please try again later." },
      { status: 503 }
    )
  }

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: email,
      subject: "New PixeSci website contact",
      text: [
        `Full name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Organization: ${organization}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    })
    if (error || !data?.id) throw new Error("Delivery failed")
    return Response.json({ success: true })
  } catch {
    return Response.json(
      { error: "Your message could not be sent. Please try again." },
      { status: 502 }
    )
  }
}
