import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { agentFromRequest, clean } from "@/lib/chat/server";

/** Admin-only: deletes a conversation, its messages and its uploaded photos (privacy requests). */
export async function POST(request: Request) {
  const who = await agentFromRequest(request, true);
  const supabase = getServiceClient();
  if (!who || !supabase) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const id = clean(body.conversation_id, 40);
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  const { data: files } = await supabase.storage.from("chat-uploads").list(id, { limit: 1000 });
  if (files?.length) {
    await supabase.storage.from("chat-uploads").remove(files.map((f) => `${id}/${f.name}`));
  }
  const { error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: "Could not delete." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
