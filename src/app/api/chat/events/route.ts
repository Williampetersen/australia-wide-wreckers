import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { escapeHtml, pushToAgents, sendEmail, teamEmails, verifyWebhook } from "@/lib/chat/server";
import { site } from "@/lib/site";

/**
 * Called by Postgres (pg_net) for: new_conversation, visitor_message, offer_accepted.
 * Sends Web Push to agents and, when nobody is live, emails the team straight away.
 */
export async function POST(request: Request) {
  if (!verifyWebhook(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  let body: { event?: string; conversation_id?: string; message_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { event, conversation_id: conversationId, message_id: messageId } = body;
  if (!event || !conversationId) return NextResponse.json({ ok: false }, { status: 400 });

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, assigned_agent_id, visitor_id, last_message_preview")
    .eq("id", conversationId)
    .maybeSingle();
  if (!conv) return NextResponse.json({ ok: true });

  const { data: visitor } = await supabase
    .from("visitors")
    .select("name, phone, email, city")
    .eq("id", conv.visitor_id)
    .maybeSingle();
  const { data: message } = messageId
    ? await supabase.from("messages").select("body, type").eq("id", messageId).maybeSingle()
    : { data: null };

  const who = visitor?.name || visitor?.phone || "A visitor";
  const preview = message?.type === "image" ? "📷 Photo" : (message?.body ?? conv.last_message_preview ?? "").slice(0, 140);
  const url = `/admin/inbox/${conv.id}`;
  const targets = conv.assigned_agent_id ? [conv.assigned_agent_id as string] : undefined;

  if (event === "new_conversation") {
    await pushToAgents({ title: `New chat: ${who}`, body: preview, url, tag: `conv-${conv.id}` });
    const { data: availability } = await supabase.rpc("chat_availability");
    if (!availability?.live) {
      const to = await teamEmails();
      await sendEmail({
        to,
        replyTo: visitor?.email ?? undefined,
        subject: `Offline chat message: ${who}`,
        html: `<h2>New message while we were offline</h2>
          <p><strong>Name:</strong> ${escapeHtml(visitor?.name ?? "—")}</p>
          <p><strong>Phone:</strong> ${escapeHtml(visitor?.phone ?? "—")}</p>
          <p><strong>Email:</strong> ${escapeHtml(visitor?.email ?? "—")}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(message?.body ?? "").replace(/\n/g, "<br/>")}</p>
          <p><a href="${site.url}${url}">Open in the inbox</a></p>`,
      });
    }
  } else if (event === "visitor_message") {
    await pushToAgents({ title: `${who}`, body: preview, url, tag: `conv-${conv.id}` }, targets);
  } else if (event === "offer_accepted") {
    await pushToAgents(
      { title: `Offer accepted: ${who}`, body: "They accepted your cash offer. Call them now.", url, tag: `offer-${conv.id}`, urgent: true }
    );
  }

  return NextResponse.json({ ok: true });
}
