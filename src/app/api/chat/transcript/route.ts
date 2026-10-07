import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { clean, clientIp, escapeHtml, rateLimit, sendEmail, userFromRequest } from "@/lib/chat/server";
import { site } from "@/lib/site";

/** A visitor asks for the transcript of their own conversation by email. */
export async function POST(request: Request) {
  const supabase = getServiceClient();
  const user = await userFromRequest(request);
  if (!supabase || !user) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!rateLimit(`transcript:${user.id}:${clientIp(request)}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const conversationId = clean(body.conversation_id, 40);

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, visitor_id")
    .eq("id", conversationId)
    .maybeSingle();
  if (!conversation || conversation.visitor_id !== user.id) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  const { data: visitor } = await supabase.from("visitors").select("email, name").eq("id", user.id).maybeSingle();
  if (!visitor?.email) {
    return NextResponse.json({ ok: false, error: "Add your email first." }, { status: 400 });
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("sender_type, type, body, created_at")
    .eq("conversation_id", conversationId)
    .eq("is_internal", false)
    .is("deleted_at", null)
    .order("seq", { ascending: true })
    .limit(500);

  const lines = (messages ?? []).map((m) => {
    const who = m.sender_type === "visitor" ? "You" : m.sender_type === "agent" ? site.shortName : "Note";
    const when = new Date(m.created_at).toLocaleString("en-AU", { timeZone: "Australia/Sydney" });
    const text = m.type === "image" ? "[Photo]" : m.body;
    return `<p><strong>${escapeHtml(who)}</strong> <span style="color:#666">${escapeHtml(when)}</span><br/>${escapeHtml(text).replace(/\n/g, "<br/>")}</p>`;
  });

  const ok = await sendEmail({
    to: visitor.email,
    subject: `Your chat with ${site.name}`,
    html: `<h2>Your chat with ${escapeHtml(site.name)}</h2>${lines.join("")}<hr/><p>Questions? Call ${escapeHtml(site.phoneDisplay)}.</p>`,
  });
  return NextResponse.json({ ok }, { status: ok ? 200 : 502 });
}
