"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAdmin } from "./AdminContext";
import type { BusinessHours, DayHours } from "@/lib/chat/hours";
import type { Canned, TeamMember } from "./inbox/types";

type Settings = {
  accent_colour: string;
  launcher_label: string;
  welcome_title: string;
  welcome_text: string;
  quick_chips: string[];
  hidden_paths: string[];
  business_hours: BusinessHours;
  timezone: string;
  live_only_in_business_hours: boolean;
  offline_message: string;
  missed_chat_minutes: number;
  visitor_email_after_minutes: number;
  auto_assign: boolean;
  retention_months: number;
  turnstile_enabled: boolean;
  notify_emails: string[];
};

const WEEK = [["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"], ["thu", "Thursday"], ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"]] as const;
const box = "mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink focus:border-blue focus:outline-none";
const btn = "rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-50";

type Tab = "widget" | "hours" | "notifications" | "canned" | "team" | "profile";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function SettingsApp() {
  const { isAdmin } = useAdmin();
  const [tab, setTab] = useState<Tab>(isAdmin ? "widget" : "profile");
  const tabs: { id: Tab; label: string; admin?: boolean }[] = [
    { id: "widget", label: "Widget", admin: true },
    { id: "hours", label: "Business hours", admin: true },
    { id: "notifications", label: "Offline & alerts", admin: true },
    { id: "canned", label: "Canned responses", admin: true },
    { id: "team", label: "Team", admin: true },
    { id: "profile", label: "My profile" },
  ];
  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6">
      <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
      <div className="mt-4 flex flex-wrap gap-1.5" role="tablist">
        {tabs.filter((t) => !t.admin || isAdmin).map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t.id ? "bg-ink text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"}`}>{t.label}</button>
        ))}
      </div>
      <div className="mt-5 max-w-3xl rounded-2xl border border-ink/10 bg-white p-5">
        {tab === "widget" && isAdmin && <SettingsForm section="widget" />}
        {tab === "hours" && isAdmin && <SettingsForm section="hours" />}
        {tab === "notifications" && isAdmin && <SettingsForm section="notifications" />}
        {tab === "canned" && isAdmin && <CannedEditor />}
        {tab === "team" && isAdmin && <TeamEditor />}
        {tab === "profile" && <ProfileEditor />}
      </div>
    </div>
  );
}

function SettingsForm({ section }: { section: "widget" | "hours" | "notifications" }) {
  const { supabase } = useAdmin();
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const { data } = await supabase.from("chat_settings").select("*").eq("id", 1).maybeSingle();
      if (!cancelled && data) setS(data as Settings);
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [supabase]);

  const update = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSaved(false);
    setS((cur) => (cur ? { ...cur, [k]: v } : cur));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!s) return;
    const { error: err } = await supabase.from("chat_settings").update({ ...s }).eq("id", 1);
    setError(err ? "Could not save. Check the values and try again." : null);
    setSaved(!err);
  };

  if (!s) return <p className="text-sm text-zinc-500">Loading…</p>;

  const setDay = (key: keyof BusinessHours, day: DayHours) => update("business_hours", { ...s.business_hours, [key]: day });

  return (
    <form onSubmit={save} className="space-y-4">
      {section === "widget" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Launcher label<input className={box} value={s.launcher_label} maxLength={30} onChange={(e) => update("launcher_label", e.target.value)} /></label>
            <label className="block text-sm font-semibold">Accent colour<input className={`${box} h-11`} type="color" value={s.accent_colour} onChange={(e) => update("accent_colour", e.target.value)} /></label>
          </div>
          <label className="block text-sm font-semibold">Welcome title<input className={box} value={s.welcome_title} maxLength={80} onChange={(e) => update("welcome_title", e.target.value)} /></label>
          <label className="block text-sm font-semibold">Welcome message<textarea className={box} rows={3} value={s.welcome_text} maxLength={400} onChange={(e) => update("welcome_text", e.target.value)} /></label>
          <label className="block text-sm font-semibold">Quick-start chips (one per line, max 5)
            <textarea className={box} rows={5} value={s.quick_chips.join("\n")} onChange={(e) => update("quick_chips", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 5))} />
          </label>
          <label className="block text-sm font-semibold">Hide the chat on these paths (one per line, e.g. /get-quote)
            <textarea className={box} rows={3} value={s.hidden_paths.join("\n")} onChange={(e) => update("hidden_paths", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
          </label>
          <div className="rounded-2xl bg-zinc-50 p-4" aria-label="Preview">
            <p className="text-xs font-bold uppercase text-zinc-500">Preview</p>
            <div className="mt-2 max-w-xs rounded-2xl bg-white p-3 text-sm shadow">
              <p className="font-bold">{s.welcome_title}</p>
              <p className="mt-1 text-zinc-600">{s.welcome_text}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{s.quick_chips.map((c) => <span key={c} className="rounded-full border border-blue/30 px-3 py-1 text-xs font-semibold text-navy">{c}</span>)}</div>
            </div>
            <span className="mt-3 inline-flex h-11 items-center rounded-full bg-navy pr-4 pl-3 text-sm font-bold text-white"><span className="mr-2 h-6 w-6 rounded-full" style={{ background: s.accent_colour }} />{s.launcher_label}</span>
          </div>
        </>
      )}

      {section === "hours" && (
        <>
          <label className="block text-sm font-semibold">Timezone<input className={box} value={s.timezone} onChange={(e) => update("timezone", e.target.value)} /></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={s.live_only_in_business_hours} onChange={(e) => update("live_only_in_business_hours", e.target.checked)} />Only show “online” during business hours</label>
          <div className="space-y-2">
            {WEEK.map(([key, label]) => {
              const day = s.business_hours[key];
              return (
                <div key={key} className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-sm font-semibold">{label}</span>
                  <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={Boolean(day)} onChange={(e) => setDay(key, e.target.checked ? { open: "09:00", close: "17:00" } : null)} />Open</label>
                  {day && (
                    <>
                      <input type="time" aria-label={`${label} opens`} className="rounded-lg border border-ink/10 px-2 py-1.5 text-sm" value={day.open} onChange={(e) => setDay(key, { ...day, open: e.target.value })} />
                      <span>to</span>
                      <input type="time" aria-label={`${label} closes`} className="rounded-lg border border-ink/10 px-2 py-1.5 text-sm" value={day.close} onChange={(e) => setDay(key, { ...day, close: e.target.value })} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {section === "notifications" && (
        <>
          <label className="block text-sm font-semibold">Offline message<textarea className={box} rows={3} value={s.offline_message} onChange={(e) => update("offline_message", e.target.value)} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Missed-chat alert after (minutes)<input className={box} type="number" min={1} max={120} value={s.missed_chat_minutes} onChange={(e) => update("missed_chat_minutes", Number(e.target.value))} /></label>
            <label className="block text-sm font-semibold">Email the visitor if unread after (minutes)<input className={box} type="number" min={1} max={240} value={s.visitor_email_after_minutes} onChange={(e) => update("visitor_email_after_minutes", Number(e.target.value))} /></label>
          </div>
          <label className="block text-sm font-semibold">Team email recipients (one per line; blank uses CONTACT_TO_EMAIL)
            <textarea className={box} rows={3} value={s.notify_emails.join("\n")} onChange={(e) => update("notify_emails", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={s.auto_assign} onChange={(e) => update("auto_assign", e.target.checked)} />Auto-assign new chats to online agents (round-robin)</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={s.turnstile_enabled} onChange={(e) => update("turnstile_enabled", e.target.checked)} />Require Cloudflare Turnstile before a visitor can start a chat</label>
          <label className="block text-sm font-semibold">Keep closed chats for (months)<input className={box} type="number" min={1} max={120} value={s.retention_months} onChange={(e) => update("retention_months", Number(e.target.value))} /></label>
        </>
      )}

      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" className={btn}>Save changes</button>
        {saved && <span className="text-sm font-semibold text-emerald-700" role="status">Saved</span>}
      </div>
    </form>
  );
}

function CannedEditor() {
  const { supabase, me } = useAdmin();
  const [items, setItems] = useState<Canned[]>([]);
  const [draft, setDraft] = useState({ shortcut: "", title: "", body: "" });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("canned_responses").select("id, shortcut, title, body").order("shortcut");
    setItems((data ?? []) as Canned[]);
  }, [supabase]);
  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    const { error: err } = await supabase.from("canned_responses").insert({ ...draft, shortcut: draft.shortcut.toLowerCase().replace(/[^a-z0-9_-]/g, ""), created_by: me.user_id });
    setError(err ? "Shortcut must be unique and use letters, numbers, - or _." : null);
    if (!err) {
      setDraft({ shortcut: "", title: "", body: "" });
      void load();
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-600">Type <b>/shortcut</b> in a reply to insert one. Variables: {"{{visitor_name}}"}, {"{{agent_name}}"}, {"{{business_phone}}"}.</p>
      <ul className="divide-y divide-ink/5">
        {items.map((c) => (
          <li key={c.id} className="flex items-start gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">/{c.shortcut} <span className="font-normal text-zinc-600">{c.title}</span></p>
              <p className="mt-0.5 text-sm text-zinc-600">{c.body}</p>
            </div>
            <button type="button" className="text-sm font-semibold text-red-600" onClick={async () => { await supabase.from("canned_responses").delete().eq("id", c.id); void load(); }}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="space-y-2 rounded-2xl bg-zinc-50 p-4">
        <p className="text-sm font-bold">Add a response</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={box} placeholder="shortcut (e.g. paperwork)" required value={draft.shortcut} onChange={(e) => setDraft({ ...draft, shortcut: e.target.value })} />
          <input className={box} placeholder="Title" required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </div>
        <textarea className={box} rows={3} placeholder="Message" required maxLength={4000} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button type="submit" className={btn}>Add</button>
      </form>
    </div>
  );
}

function TeamEditor() {
  const { supabase, me } = useAdmin();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [invite, setInvite] = useState({ name: "", email: "", role: "agent" });
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("agents").select("user_id, display_name, avatar_url, role, status, active").order("created_at");
    setTeam((data ?? []) as TeamMember[]);
  }, [supabase]);
  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch("/api/admin/team/invite", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(invite) });
    const json = (await res.json()) as { ok: boolean; error?: string };
    setMessage(json.ok ? `Invite sent to ${invite.email}.` : (json.error ?? "Invite failed."));
    if (json.ok) {
      setInvite({ name: "", email: "", role: "agent" });
      void load();
    }
  };

  return (
    <div className="space-y-5">
      <ul className="divide-y divide-ink/5">
        {team.map((t) => (
          <li key={t.user_id} className="flex flex-wrap items-center gap-3 py-3">
            <span className="min-w-0 flex-1 font-semibold">{t.display_name}{t.user_id === me.user_id && " (you)"}{!t.active && <span className="ml-2 text-xs text-red-600">deactivated</span>}</span>
            <select aria-label={`Role for ${t.display_name}`} disabled={t.user_id === me.user_id || t.role === "owner"} value={t.role} className="rounded-lg border border-ink/10 px-2 py-1.5 text-sm" onChange={async (e) => { await supabase.from("agents").update({ role: e.target.value }).eq("user_id", t.user_id); void load(); }}>
              <option value="owner">Owner</option><option value="admin">Admin</option><option value="agent">Agent</option>
            </select>
            {t.user_id !== me.user_id && t.role !== "owner" && (
              <button type="button" className="text-sm font-semibold text-navy underline" onClick={async () => { await supabase.from("agents").update({ active: !t.active, status: "offline" }).eq("user_id", t.user_id); void load(); }}>{t.active ? "Deactivate" : "Reactivate"}</button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={send} className="space-y-2 rounded-2xl bg-zinc-50 p-4">
        <p className="text-sm font-bold">Invite a team member</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <input className={box} placeholder="Name" required value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} />
          <input className={box} type="email" placeholder="Email" required value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
          <select className={box} value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}><option value="agent">Agent</option><option value="admin">Admin</option></select>
        </div>
        {message && <p className="text-sm font-medium text-navy" role="status">{message}</p>}
        <button type="submit" className={btn}>Send invite</button>
      </form>
    </div>
  );
}

function ProfileEditor() {
  const { supabase, me } = useAdmin();
  const [name, setName] = useState(me.display_name);
  const [avatar, setAvatar] = useState(me.avatar_url ?? "");
  const [prefs, setPrefs] = useState({ notify_push: me.notify_push, notify_email: me.notify_email, notify_sound: me.notify_sound });
  const [info, setInfo] = useState<string | null>(null);
  const [pushState, setPushState] = useState<"unknown" | "unsupported" | "denied" | "enabled" | "off">("unknown");

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return setPushState("unsupported");
      if (Notification.permission === "denied") return setPushState("denied");
      const reg = await navigator.serviceWorker.getRegistration("/admin");
      const sub = await reg?.pushManager.getSubscription();
      setPushState(sub ? "enabled" : "off");
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("agents").update({ display_name: name.trim() || me.display_name, avatar_url: avatar.trim() || null, ...prefs }).eq("user_id", me.user_id);
    setInfo(error ? "Could not save." : "Saved.");
  };

  const enablePush = async () => {
    try {
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) return setInfo("Push is not configured (missing NEXT_PUBLIC_VAPID_PUBLIC_KEY).");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return setPushState("denied");
      const reg = await navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin" });
      await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) }));
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch("/api/admin/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(sub.toJSON()) });
      if (!res.ok) throw new Error("subscribe failed");
      setPushState("enabled");
      setInfo("Notifications enabled on this device.");
    } catch {
      setInfo("Could not enable notifications on this device.");
    }
  };

  const testPush = async () => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch("/api/admin/push/test", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    const json = (await res.json()) as { sent?: number };
    setInfo(json.sent ? "Test sent. Check this device." : "Nothing was sent. Enable notifications first.");
  };

  return (
    <form onSubmit={saveProfile} className="space-y-4">
      <label className="block text-sm font-semibold">Display name<input className={box} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} /></label>
      <label className="block text-sm font-semibold">Avatar image URL (optional)<input className={box} value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://" /></label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-bold">Notify me by</legend>
        {([["notify_sound", "Sound in the inbox"], ["notify_push", "Push notifications"], ["notify_email", "Email"]] as const).map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} />{label}</label>
        ))}
      </fieldset>
      <div className="rounded-2xl bg-zinc-50 p-4 text-sm">
        <p className="font-bold">This device</p>
        <p className="mt-1 text-zinc-600">
          {pushState === "unsupported" && "This browser does not support push. On iPhone, add the app to your Home Screen first (iOS 16.4 or later)."}
          {pushState === "denied" && "Notifications are blocked in this browser. Allow them in the site settings."}
          {pushState === "enabled" && "Notifications are on for this device."}
          {(pushState === "off" || pushState === "unknown") && "Turn on notifications to hear about new chats even when the inbox is closed."}
        </p>
        <div className="mt-2 flex gap-2">
          {pushState !== "enabled" && pushState !== "unsupported" && <button type="button" onClick={() => void enablePush()} className={btn}>Enable notifications</button>}
          {pushState === "enabled" && <button type="button" onClick={() => void testPush()} className="rounded-full border border-navy/30 px-4 py-2 text-sm font-bold text-navy">Send test notification</button>}
        </div>
      </div>
      {info && <p className="text-sm font-medium text-navy" role="status">{info}</p>}
      <button type="submit" className={btn}>Save profile</button>
    </form>
  );
}
