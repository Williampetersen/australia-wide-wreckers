"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminBrowserClient } from "@/lib/supabase/browser";

const input =
  "mt-1 w-full rounded-xl border border-[#d9e3ee] bg-white px-4 py-3 text-base text-ink focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15";
const button =
  "mt-5 w-full rounded-full bg-brand px-6 py-3 text-base font-bold text-ink disabled:opacity-60";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAdminBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setError("Email or password is incorrect.");
      setBusy(false);
      return;
    }
    router.replace("/admin/inbox");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="mt-5">
      <label className="block text-sm font-semibold text-ink">
        Email
        <input className={input} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="mt-4 block text-sm font-semibold text-ink">
        Password
        <input className={input} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className={button}>{busy ? "Signing in…" : "Sign in"}</button>
      <p className="mt-4 text-center text-sm">
        <Link href="/admin/forgot-password" className="font-semibold text-navy underline">Forgot password?</Link>
      </p>
    </form>
  );
}

export function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await getAdminBrowserClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/admin/reset-password`,
    });
    setBusy(false);
    setSent(true);
  };

  if (sent) {
    return <p className="mt-4 text-sm text-zinc-600">If that email belongs to a team member, a reset link is on its way.</p>;
  }
  return (
    <form onSubmit={submit} className="mt-5">
      <label className="block text-sm font-semibold text-ink">
        Email
        <input className={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit" disabled={busy} className={button}>Send reset link</button>
      <p className="mt-4 text-center text-sm"><Link href="/admin/login" className="font-semibold text-navy underline">Back to sign in</Link></p>
    </form>
  );
}

export function SetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // The invite / recovery link signs the user in; wait for that session.
  useEffect(() => {
    const supabase = getAdminBrowserClient();
    void supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setReady(Boolean(session)));
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 10) {
      setError("Use at least 10 characters.");
      return;
    }
    setBusy(true);
    const { error: err } = await getAdminBrowserClient().auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    router.replace("/admin/inbox");
    router.refresh();
  };

  if (!ready) return <p className="mt-4 text-sm text-zinc-600">Checking your link… If this takes more than a few seconds, request a new link.</p>;
  return (
    <form onSubmit={submit} className="mt-5">
      <label className="block text-sm font-semibold text-ink">
        New password
        <input className={input} type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className={button}>Save password</button>
    </form>
  );
}
