import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell, type AgentProfile } from "@/components/admin/AdminShell";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { getAdminServerClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export default async function AdminAppLayout({ children }: { children: ReactNode }) {
  if (!supabaseConfigured) redirect("/admin/login");

  const supabase = await getAdminServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");

  // Authorisation lives here (the proxy only redirects): the signed-in user must be an active agent.
  const { data: isAgent } = await supabase.rpc("is_agent");
  const { data: agent } = isAgent
    ? await supabase.from("agents").select("*").eq("user_id", data.user.id).maybeSingle()
    : { data: null };

  if (!agent || !agent.active) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="max-w-sm rounded-3xl bg-white p-7 text-center shadow-xl">
          <h1 className="font-display text-xl font-bold text-ink">No access</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your account ({data.user.email}) is not part of the team inbox. Ask the owner to invite you.
          </p>
          <SignOutButton className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-ink" />
        </div>
      </main>
    );
  }

  return <AdminShell agent={agent as AgentProfile}>{children}</AdminShell>;
}
