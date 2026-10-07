import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { escapeHtml, pushToAgents, sendEmail, teamEmails, verifyWebhook } from "@/lib/chat/server";
import { site } from "@/lib/site";

type Ctx = { params: Promise<{ job: string }> };

const MINUTE = 60_000;

/** Called every minute / nightly by pg_cron through pg_net. */
export async function POST(request: Request, ctx: Ctx) {
  if (!verifyWebhook(request)) return NextResponse.json({ ok: false }, { status: 401 });
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });
  const { job } = await ctx.params;

  const { data: settings } = await supabase.from("chat_settings").select("*").eq("id", 1).maybeSingle();
  if (!settings) return NextResponse.json({ ok: true });

  if (job === "missed") {
    const cutoff = new Date(Date.now() - settings.missed_chat_minutes * MINUTE).toISOString();
    const { data: rows } = await supabase
      .from("conversations")
      .select("id, visitor_id, last_message_preview, last_message_at")
      .in("status", ["open", "pending"])
      .eq("last_message_sender", "visitor")
      .is("missed_notified_at", null)
      .lt("last_message_at", cutoff)
      .limit(25);
    for (const row of rows ?? []) {
      const { data: visitor } = await supabase.from("visitors").select("name, phone, email").eq("id", row.visitor_id).maybeSingle();
      const who = visitor?.name || visitor?.phone || "A visitor";
      await sendEmail({
        to: await teamEmails(),
        replyTo: visitor?.email ?? undefined,
        subject: `Missed chat: ${who} is waiting`,
        html: `<h2>Nobody has replied yet</h2>
          <p><strong>${escapeHtml(who)}</strong> wrote ${settings.missed_chat_minutes}+ minutes ago:</p>
          <blockquote>${escapeHtml(row.last_message_preview ?? "")}</blockquote>
          <p>Phone: ${escapeHtml(visitor?.phone ?? "—")}</p>
          <p><a href="${site.url}/admin/inbox/${row.id}">Open in the inbox</a></p>`,
      });
      await pushToAgents({
        title: `Waiting: ${who}`,
        body: row.last_message_preview ?? "No reply yet",
        url: `/admin/inbox/${row.id}`,
        tag: `missed-${row.id}`,
        urgent: true,
      });
      await supabase.from("conversations").update({ missed_notified_at: new Date().toISOString() }).eq("id", row.id);
    }
    return NextResponse.json({ ok: true, notified: rows?.length ?? 0 });
  }

  if (job === "visitor-email") {
    const cutoff = new Date(Date.now() - settings.visitor_email_after_minutes * MINUTE).toISOString();
    const hourAgo = new Date(Date.now() - 60 * MINUTE).toISOString();
    const { data: rows } = await supabase
      .from("conversations")
      .select("id, visitor_id, visitor_emailed_at")
      .eq("last_message_sender", "agent")
      .gt("unread_for_visitor", 0)
      .lt("last_message_at", cutoff)
      .or(`visitor_emailed_at.is.null,visitor_emailed_at.lt.${hourAgo}`)
      .limit(25);
    let sent = 0;
    for (const row of rows ?? []) {
      const { data: visitor } = await supabase.from("visitors").select("name, email").eq("id", row.visitor_id).maybeSingle();
      if (!visitor?.email) continue;
      const { data: unread } = await supabase
        .from("messages")
        .select("body, type")
        .eq("conversation_id", row.id)
        .eq("sender_type", "agent")
        .eq("is_internal", false)
        .is("deleted_at", null)
        .order("seq", { ascending: false })
        .limit(3);
      const text = (unread ?? [])
        .reverse()
        .map((m) => (m.type === "image" ? "[Photo]" : m.body))
        .filter(Boolean)
        .join("\n\n");
      const ok = await sendEmail({
        to: visitor.email,
        subject: `${site.name} replied to your message`,
        html: `<p>Hi ${escapeHtml(visitor.name ?? "there")},</p>
          <p>${escapeHtml(text).replace(/\n/g, "<br/>")}</p>
          <p>You can reply to this email, or call us on <a href="${site.phoneHref}">${escapeHtml(site.phoneDisplay)}</a>.</p>`,
      });
      if (ok) {
        sent += 1;
        await supabase.from("conversations").update({ visitor_emailed_at: new Date().toISOString() }).eq("id", row.id);
      }
    }
    return NextResponse.json({ ok: true, sent });
  }

  if (job === "cleanup") {
    const months = settings.retention_months as number;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    const { data: old } = await supabase
      .from("conversations")
      .select("id")
      .eq("status", "closed")
      .lt("closed_at", cutoff.toISOString())
      .limit(200);
    for (const row of old ?? []) {
      await removeConversationFiles(row.id as string);
      await supabase.from("conversations").delete().eq("id", row.id);
    }

    // Agents who forgot to sign out should not keep the widget "live".
    const stale = new Date(Date.now() - 12 * 60 * MINUTE).toISOString();
    await supabase.from("agents").update({ status: "offline" }).neq("status", "offline").lt("last_seen_at", stale);

    // Anonymous auth users older than 30 days with no conversation.
    const monthAgo = Date.now() - 30 * 24 * 60 * MINUTE;
    let removedUsers = 0;
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    for (const u of list?.users ?? []) {
      if (!u.is_anonymous || new Date(u.created_at).getTime() > monthAgo) continue;
      const { count } = await supabase.from("conversations").select("id", { count: "exact", head: true }).eq("visitor_id", u.id);
      if (!count) {
        await supabase.auth.admin.deleteUser(u.id);
        removedUsers += 1;
      }
    }
    return NextResponse.json({ ok: true, deletedConversations: old?.length ?? 0, removedUsers });
  }

  return NextResponse.json({ ok: false, error: "Unknown job." }, { status: 404 });
}

async function removeConversationFiles(conversationId: string) {
  const supabase = getServiceClient();
  if (!supabase) return;
  const { data: files } = await supabase.storage.from("chat-uploads").list(conversationId, { limit: 1000 });
  if (files?.length) {
    await supabase.storage.from("chat-uploads").remove(files.map((f) => `${conversationId}/${f.name}`));
  }
}
