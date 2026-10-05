import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

const REQUIRED_FIELDS = ["name", "phone", "email", "suburb", "postalCode"] as const;

const VEHICLE_TYPES = [
  "Cars",
  "Utes",
  "Motorbikes",
  "Pickup Trucks",
  "Vans",
  "Light Trucks",
] as const;

const CONDITIONS = [
  "Runs and drives",
  "Doesn't run",
  "Accident damaged",
  "Scrap / written off",
  "Missing parts",
] as const;

type QuotePayload = Partial<Record<(typeof REQUIRED_FIELDS)[number], string>> & {
  vehicleType?: string;
  condition?: string;
  make?: string;
  model?: string;
  carModel?: string;
  carYear?: string;
  rego?: string;
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

function clean(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: QuotePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot field is invisible to real visitors; bots fill it in.
  if (clean(body.honeypot)) {
    return NextResponse.json({ ok: true });
  }

  const fields = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 30),
    email: clean(body.email, 200),
    suburb: clean(body.suburb, 120),
    postalCode: clean(body.postalCode, 4),
    vehicleType: clean(body.vehicleType, 40),
    condition: clean(body.condition, 60),
    make: clean(body.make, 80),
    model: clean(body.model, 80),
    carModel: clean(body.carModel, 160),
    carYear: clean(body.carYear, 4),
    rego: clean(body.rego, 12),
    note: clean(body.note, 2000),
  };

  for (const field of REQUIRED_FIELDS) {
    if (!fields[field]) {
      return NextResponse.json(
        { ok: false, error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const vehicleLabel = [fields.make, fields.model].filter(Boolean).join(" ") || fields.carModel;
  if (!vehicleLabel) {
    return NextResponse.json({ ok: false, error: "Missing vehicle details." }, { status: 400 });
  }

  if (fields.vehicleType && !(VEHICLE_TYPES as readonly string[]).includes(fields.vehicleType)) {
    return NextResponse.json({ ok: false, error: "Unknown vehicle type." }, { status: 400 });
  }
  if (fields.condition && !(CONDITIONS as readonly string[]).includes(fields.condition)) {
    return NextResponse.json({ ok: false, error: "Unknown condition." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured — quote request was not emailed.");
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

  const row = (label: string, value: string) =>
    value ? `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>` : "";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: fields.email,
      subject: `New cash offer request — ${fields.name} — ${vehicleLabel}${fields.carYear ? ` (${fields.carYear})` : ""}`,
      html: `
        <h2>New cash offer request</h2>
        ${row("Vehicle type", fields.vehicleType)}
        ${row("Condition", fields.condition)}
        ${row("Vehicle", vehicleLabel)}
        ${row("Year", fields.carYear)}
        ${row("Rego", fields.rego)}
        <hr/>
        ${row("Name", fields.name)}
        ${row("Phone", fields.phone)}
        ${row("Email", fields.email)}
        ${row("Suburb", fields.suburb)}
        ${row("Postcode", fields.postalCode)}
        <p><strong>Extra details:</strong><br/>${escapeHtml(fields.note || "—").replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Quote request failed:", err);
    return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 500 });
  }
}
