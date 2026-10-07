import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { agentFromRequest, clean } from "@/lib/chat/server";

export async function POST(request: Request) {
  const who = await agentFromRequest(request);
  const supabase = getServiceClient();
  if (!who || !supabase) return NextResponse.json({ ok: false }, { status: 401 });

  let body: { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const endpoint = clean(body.endpoint, 1000);
  const p256dh = clean(body.keys?.p256dh, 200);
  const auth = clean(body.keys?.auth, 100);
  if (!endpoint.startsWith("https://") || !p256dh || !auth) {
    return NextResponse.json({ ok: false, error: "Invalid subscription." }, { status: 400 });
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      agent_id: who.user.id,
      endpoint,
      p256dh,
      auth,
      user_agent: clean(request.headers.get("user-agent"), 300),
    },
    { onConflict: "endpoint" }
  );
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const who = await agentFromRequest(request);
  const supabase = getServiceClient();
  if (!who || !supabase) return NextResponse.json({ ok: false }, { status: 401 });
  let body: { endpoint?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* no body */
  }
  const endpoint = clean(body.endpoint, 1000);
  if (endpoint) {
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint).eq("agent_id", who.user.id);
  }
  return NextResponse.json({ ok: true });
}
