import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { normaliseAuPhone } from "@/lib/chat/phone";
import {
  clean,
  clientIp,
  parseUserAgent,
  rateLimit,
  userFromRequest,
  vercelLocation,
} from "@/lib/chat/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CLICK_KEYS = ["gclid", "fbclid", "msclkid", "ttclid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function pick<T extends readonly string[]>(source: unknown, keys: T): Record<string, string> {
  const out: Record<string, string> = {};
  if (source && typeof source === "object") {
    for (const key of keys) {
      const value = clean((source as Record<string, unknown>)[key], 200);
      if (value) out[key] = value;
    }
  }
  return out;
}

/**
 * Starts a conversation: visitor row + conversation + first message, with page context.
 * The caller must hold a Supabase (anonymous) session; we verify the JWT here.
 */
export async function POST(request: Request) {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Chat is not configured." }, { status: 503 });
  }
  if (!rateLimit(`conv:${clientIp(request)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again soon." }, { status: 429 });
  }

  const user = await userFromRequest(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const text = clean(body.message, 4000);
  const messageId = clean(body.id, 40);
  if (!text) {
    return NextResponse.json({ ok: false, error: "Please type a message." }, { status: 400 });
  }
  if (messageId && !UUID.test(messageId)) {
    return NextResponse.json({ ok: false, error: "Invalid message id." }, { status: 400 });
  }

  const { data: existingVisitor } = await supabase
    .from("visitors")
    .select("id, blocked_at")
    .eq("id", user.id)
    .maybeSingle();
  if (existingVisitor?.blocked_at) {
    return NextResponse.json({ ok: false, error: "Chat unavailable." }, { status: 403 });
  }

  const ctx = (body.context ?? {}) as Record<string, unknown>;
  const ua = parseUserAgent(request.headers.get("user-agent") ?? "");
  const loc = vercelLocation(request);
  const phone = typeof body.phone === "string" ? normaliseAuPhone(body.phone) : null;
  const email = clean(body.email, 254);
  const name = clean(body.name, 120);
  const vehicleMake = clean(body.vehicle_make, 80);
  const vehicleModel = clean(body.vehicle_model, 80);
  const vehicleYear = clean(body.vehicle_year, 4);
  const suburb = clean(body.suburb, 120);
  const postcode = clean(body.postcode, 10);
  const now = new Date().toISOString();

  if (!existingVisitor) {
    const { error } = await supabase.from("visitors").insert({
      id: user.id,
      name: name || null,
      email: /^\S+@\S+\.\S+$/.test(email) ? email : null,
      phone,
      landing_page: clean(ctx.landing_page, 500) || null,
      current_page: clean(ctx.current_page, 500) || null,
      referrer: clean(ctx.referrer, 500) || null,
      utm: pick(ctx.utm, UTM_KEYS),
      click_ids: pick(ctx.click_ids, CLICK_KEYS),
      ...loc,
      ...ua,
    });
    if (error) {
      console.error("visitor insert failed", error);
      return NextResponse.json({ ok: false, error: "Could not start the chat." }, { status: 500 });
    }
  } else {
    await supabase
      .from("visitors")
      .update({
        last_seen_at: now,
        current_page: clean(ctx.current_page, 500) || undefined,
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(/^\S+@\S+\.\S+$/.test(email) ? { email } : {}),
      })
      .eq("id", user.id);
  }

  // Reuse the visitor's open conversation; start a fresh one after a closed chat.
  const { data: open } = await supabase
    .from("conversations")
    .select("id")
    .eq("visitor_id", user.id)
    .in("status", ["open", "pending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let conversationId = open?.id as string | undefined;
  if (!conversationId) {
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({
        visitor_id: user.id,
        source_page: clean(ctx.current_page, 500) || clean(ctx.landing_page, 500) || null,
        vehicle_make: vehicleMake || null,
        vehicle_model: vehicleModel || null,
        vehicle_year: vehicleYear || null,
        suburb: suburb || null,
        postcode: postcode || null,
      })
      .select("id")
      .single();
    if (error || !created) {
      console.error("conversation insert failed", error);
      return NextResponse.json({ ok: false, error: "Could not start the chat." }, { status: 500 });
    }
    conversationId = created.id as string;
  }

  const { error: messageError } = await supabase.from("messages").upsert(
    {
      ...(messageId ? { id: messageId } : {}),
      conversation_id: conversationId,
      sender_type: "visitor",
      type: "text",
      body: text,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
  if (messageError) {
    console.error("first message insert failed", messageError);
    return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, conversation_id: conversationId });
}
