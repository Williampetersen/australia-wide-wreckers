import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { agentFromRequest, clean } from "@/lib/chat/server";
import { site } from "@/lib/site";

const ROLES = ["admin", "agent"] as const;

/** Admins invite new team members by email. Owners are created with scripts/create-chat-owner.mjs. */
export async function POST(request: Request) {
  const who = await agentFromRequest(request, true);
  const supabase = getServiceClient();
  if (!who || !supabase) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const email = clean(body.email, 254).toLowerCase();
  const name = clean(body.name, 80);
  const role = clean(body.role, 10);
  if (!/^\S+@\S+\.\S+$/.test(email) || !name || !(ROLES as readonly string[]).includes(role)) {
    return NextResponse.json({ ok: false, error: "Enter a name, a valid email and a role." }, { status: 400 });
  }

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || site.url}/admin/reset-password`,
  });
  if (error || !data.user) {
    return NextResponse.json({ ok: false, error: error?.message ?? "Invite failed." }, { status: 400 });
  }
  const { error: agentError } = await supabase
    .from("agents")
    .upsert({ user_id: data.user.id, display_name: name, role, active: true });
  if (agentError) return NextResponse.json({ ok: false, error: "Could not create the team member." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
