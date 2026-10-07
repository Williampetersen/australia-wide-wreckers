"use client";

import { useRouter } from "next/navigation";
import { getAdminBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        const supabase = getAdminBrowserClient();
        await supabase.rpc("touch_agent_heartbeat", { p_status: "offline" });
        await supabase.auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      {children ?? "Sign out"}
    </button>
  );
}
