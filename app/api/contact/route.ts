import { NextResponse } from "next/server"

const MAX_ATTACHMENTS = 5
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024

class MissingEnvVarError extends Error {
  constructor(public readonly key: string) {
    super(`Missing required env var: ${key}`)
    this.name = "MissingEnvVarError"
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function getRequiredEnvVar(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new MissingEnvVarError(key)
  }
  return value
}

function jsonError(status: number, code: string, error: string) {
  return NextResponse.json({ code, error }, { status })
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const service = String(formData.get("service") || "").trim()
    const message = String(formData.get("message") || "").trim()
    const roomSize = String(formData.get("roomSize") || "").trim()
    const privacyAccepted = formData.get("privacyAccepted")

    if (!name || !email || !service || !privacyAccepted) {
      return jsonError(400, "MISSING_FIELDS", "Missing required fields")
    }

    const attachmentEntries = formData.getAll("attachments").filter((item): item is File => item instanceof File)
    const attachments = attachmentEntries.filter((file) => file.size > 0)

    if (attachments.length > MAX_ATTACHMENTS) {
      return jsonError(400, "TOO_MANY_ATTACHMENTS", "Too many attachments")
    }

    const oversizedFile = attachments.find((file) => file.size > MAX_FILE_SIZE_BYTES)
    if (oversizedFile) {
      return jsonError(400, "FILE_TOO_LARGE", "File too large")
    }

    const resendApiKey = getRequiredEnvVar("RESEND_API_KEY")
    const toEmail = getRequiredEnvVar("FORM_TO_EMAIL")
    const fromEmail = getRequiredEnvVar("FORM_FROM_EMAIL")

    const resendAttachments = await Promise.all(
      attachments.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        return {
          filename: file.name,
          content: Buffer.from(arrayBuffer).toString("base64"),
        }
      })
    )

    const textBody = [
      "Nuova richiesta dal form SoundPro",
      "",
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefono: ${phone || "-"}`,
      `Servizio: ${service}`,
      `Misura stanza: ${roomSize || "-"}`,
      "",
      "Messaggio:",
      message || "-",
      "",
      `Allegati: ${attachments.length}`,
    ].join("\n")

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone || "-")
    const safeService = escapeHtml(service)
    const safeRoomSize = escapeHtml(roomSize || "-")
    const safeMessage = escapeHtml(message || "-").replace(/\n/g, "<br/>")

    const htmlBody = `
      <h2>Nuova richiesta dal form SoundPro</h2>
      <p><strong>Nome:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Telefono:</strong> ${safePhone}</p>
      <p><strong>Servizio:</strong> ${safeService}</p>
      <p><strong>Misura stanza:</strong> ${safeRoomSize}</p>
      <p><strong>Messaggio:</strong><br/>${safeMessage}</p>
      <p><strong>Allegati:</strong> ${attachments.length}</p>
    `

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Nuovo lead da ${name}`,
        text: textBody,
        html: htmlBody,
        attachments: resendAttachments,
      }),
    })

    if (!resendResponse.ok) {
      const errorPayload = await resendResponse.text()
      console.error("Resend API error:", resendResponse.status, errorPayload)
      return jsonError(502, "EMAIL_PROVIDER_ERROR", "Email send failed")
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    if (error instanceof MissingEnvVarError) {
      console.error("Contact API config error:", error.message)
      return jsonError(500, "SERVER_NOT_CONFIGURED", "Contact form server is not configured")
    }

    console.error("Contact API error:", error)
    return jsonError(500, "INTERNAL_SERVER_ERROR", "Internal server error")
  }
}
