import { LoginForm } from "@/components/admin/LoginForm";
import { supabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue">Australia Wide Wreckers</p>
        <h1 className="font-display mt-2 text-2xl font-bold text-ink">Team inbox</h1>
        {supabaseConfigured ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-sm text-zinc-600">
            Live chat is not configured yet. Add the Supabase environment variables (see the README) and reload.
          </p>
        )}
      </div>
    </main>
  );
}
