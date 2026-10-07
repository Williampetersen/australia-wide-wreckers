"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Inbox, ListChecks, Settings } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getAdminBrowserClient } from "@/lib/supabase/browser";
import { AdminContext, INBOX_EVENT, type PresenceEntry } from "./AdminContext";
import { SignOutButton } from "./SignOutButton";

export type AgentProfile = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  role: "owner" | "admin" | "agent";
  status: "online" | "away" | "offline";
  notify_push: boolean;
  notify_email: boolean;
  notify_sound: boolean;
  active: boolean;
};

const NAV = [
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/leads", label: "Leads", icon: ListChecks },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 740;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch {
    /* autoplay rules */
  }
}

export function AdminShell({ agent, children }: { agent: AgentProfile; children: ReactNode }) {
  const supabase = getAdminBrowserClient();
  const pathname = usePathname();
  const [status, setStatusState] = useState(agent.status);
  const [presence, setPresence] = useState<PresenceEntry[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const viewingRef = useRef<{ viewing: string | null; typing: boolean }>({ viewing: null, typing: false });
  const currentConvRef = useRef<string | null>(null);

  const isAdmin = agent.role === "owner" || agent.role === "admin";

  const setStatus = useCallback(
    (next: "online" | "away" | "offline") => {
      setStatusState(next);
      void supabase.rpc("touch_agent_heartbeat", { p_status: next });
    },
    [supabase]
  );

  // Heartbeat every 30s while the admin is open.
  useEffect(() => {
    const beat = () => void supabase.rpc("touch_agent_heartbeat", { p_status: null });
    const id = setInterval(beat, 30_000);
    return () => clearInterval(id);
  }, [supabase]);

  const track = useCallback(() => {
    void channelRef.current?.track({
      agent_id: agent.user_id,
      name: agent.display_name,
      viewing: viewingRef.current.viewing,
      typing: viewingRef.current.typing,
    });
  }, [agent.display_name, agent.user_id]);

  const setViewing = useCallback(
    (conversationId: string | null, typing = false) => {
      viewingRef.current = { viewing: conversationId, typing };
      currentConvRef.current = conversationId;
      track();
    },
    [track]
  );

  // Presence on the private `agents` channel + inbox notifications.
  useEffect(() => {
    let cancelled = false;
    let presenceChannel: RealtimeChannel | null = null;
    let inboxChannel: RealtimeChannel | null = null;

    void (async () => {
      await supabase.realtime.setAuth();
      if (cancelled) return;

      presenceChannel = supabase.channel("agents", { config: { private: true, presence: { key: agent.user_id } } });
      presenceChannel
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannel?.presenceState() ?? {};
          setPresence(Object.values(state).flatMap((entries) => entries as unknown as PresenceEntry[]));
        })
        .subscribe((s) => {
          if (s === "SUBSCRIBED") track();
        });
      channelRef.current = presenceChannel;

      inboxChannel = supabase.channel("inbox", { config: { private: true } });
      inboxChannel
        .on("broadcast", { event: "conversation" }, ({ payload }) => {
          window.dispatchEvent(new CustomEvent(INBOX_EVENT, { detail: { event: "conversation", payload } }));
        })
        .on("broadcast", { event: "message" }, ({ payload }) => {
          window.dispatchEvent(new CustomEvent(INBOX_EVENT, { detail: { event: "message", payload } }));
          const m = payload as { sender_type: string; is_internal: boolean; conversation_id: string; body: string; type: string };
          if (m.sender_type !== "visitor" || m.is_internal) return;
          const watching = currentConvRef.current === m.conversation_id && document.visibilityState === "visible";
          if (watching) return;
          setTotalUnread((n) => n + 1);
          if (agent.notify_sound) beep();
          if (agent.notify_push && "Notification" in window && Notification.permission === "granted" && document.visibilityState !== "visible") {
            new Notification("New chat message", { body: m.type === "image" ? "📷 Photo" : m.body.slice(0, 120), tag: `conv-${m.conversation_id}` });
          }
        })
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (presenceChannel) void supabase.removeChannel(presenceChannel);
      if (inboxChannel) void supabase.removeChannel(inboxChannel);
      channelRef.current = null;
    };
  }, [agent.notify_push, agent.notify_sound, agent.user_id, supabase, track]);

  // Unread count in the tab title; reset when the user returns to the tab.
  useEffect(() => {
    const base = "AWW Inbox";
    document.title = totalUnread > 0 ? `(${totalUnread}) ${base}` : base;
  }, [totalUnread]);
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") setTotalUnread(0);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const value = useMemo(
    () => ({ supabase, me: agent, isAdmin, status, setStatus, presence, setViewing, totalUnread }),
    [supabase, agent, isAdmin, status, setStatus, presence, setViewing, totalUnread]
  );

  return (
    <AdminContext.Provider value={value}>
      <div className="flex h-dvh flex-col lg:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 flex-col bg-ink text-white lg:flex">
          <div className="px-5 py-5">
            <p className="font-display text-lg font-bold">AWW Inbox</p>
            <p className="text-xs text-white/60">Australia Wide Wreckers</p>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? "bg-brand text-ink" : "text-white/80 hover:bg-white/10"}`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                  {href === "/admin/inbox" && totalUnread > 0 && (
                    <span className="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">{totalUnread}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-3 border-t border-white/10 p-4">
            <StatusSwitch status={status} onChange={setStatus} dark />
            <div className="flex items-center justify-between text-sm">
              <span className="truncate font-semibold">{agent.display_name}</span>
              <SignOutButton className="text-xs text-white/70 underline hover:text-white" />
            </div>
          </div>
        </aside>

        {/* Top bar (mobile) */}
        <header className="flex items-center justify-between gap-2 bg-ink px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-white lg:hidden">
          <p className="font-display font-bold">AWW Inbox</p>
          <StatusSwitch status={status} onChange={setStatus} dark compact />
        </header>

        <main className="min-h-0 flex-1 overflow-hidden bg-zinc-100">{children}</main>

        {/* Bottom tab bar (mobile) */}
        <nav className="grid grid-cols-4 border-t border-ink/10 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Admin sections">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${active ? "text-navy" : "text-zinc-500"}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
                {href === "/admin/inbox" && totalUnread > 0 && (
                  <span className="absolute top-1 left-1/2 ml-2 rounded-full bg-red-600 px-1.5 text-[10px] text-white">{totalUnread}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </AdminContext.Provider>
  );
}

function StatusSwitch({
  status, onChange, dark, compact,
}: {
  status: "online" | "away" | "offline";
  onChange: (s: "online" | "away" | "offline") => void;
  dark?: boolean;
  compact?: boolean;
}) {
  const colours = { online: "bg-emerald-400", away: "bg-amber-400", offline: "bg-zinc-400" } as const;
  return (
    <label className={`flex items-center gap-2 text-sm ${dark ? "text-white" : "text-ink"}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${colours[status]}`} aria-hidden />
      {!compact && <span className="sr-only">Availability</span>}
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as "online" | "away" | "offline")}
        aria-label="Availability"
        className={`rounded-lg border px-2 py-1.5 text-sm font-semibold ${dark ? "border-white/20 bg-white/10 text-white" : "border-ink/15 bg-white text-ink"}`}
      >
        <option value="online" className="text-ink">Online</option>
        <option value="away" className="text-ink">Away</option>
        <option value="offline" className="text-ink">Offline</option>
      </select>
    </label>
  );
}
