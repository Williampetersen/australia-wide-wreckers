import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

const REQUIRED_FIELDS = [
  "name",
  "phone",
  "email",
  "suburb",
  "postalCode",
  "carModel",
  "carYear",
] as const;

type QuotePayload = Record<(typeof REQUIRED_FIELDS)[number], string> & {
  note?: string;
  honeypot?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: Partial<QuotePayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot field is invisible to real visitors — only bots fill it in.
  if (body.honeypot) {
    return NextResponse.json({ ok: true });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || !String(body[field]).trim()) {
      return NextResponse.json(
        { ok: false, error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const { name, phone, email, suburb, postalCode, carModel, carYear, note } =
    body as QuotePayload;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "RESEND_API_KEY is not configured — quote request was not emailed."
    );
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured yet." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Australia Wide Wreckers <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New quote request — ${name} — ${carModel} (${carYear})`,
      html: `
        <h2>New quote request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Suburb:</strong> ${escapeHtml(suburb)}</p>
        <p><strong>Postal code:</strong> ${escapeHtml(postalCode)}</p>
        <p><strong>Car:</strong> ${escapeHtml(carModel)} (${escapeHtml(carYear)})</p>
        <p><strong>Extra details:</strong><br/>${escapeHtml(note || "—").replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send email." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Quote request failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}
