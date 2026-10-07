import { NextResponse } from "next/server";
import { agentFromRequest, pushToAgents } from "@/lib/chat/server";

export async function POST(request: Request) {
  const who = await agentFromRequest(request);
  if (!who) return NextResponse.json({ ok: false }, { status: 401 });
  const result = await pushToAgents(
    { title: "Test notification", body: "Push notifications are working on this device.", url: "/admin/inbox", tag: "test" },
    [who.user.id]
  );
  return NextResponse.json({ ok: true, ...result });
}
