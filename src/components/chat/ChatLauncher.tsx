"use client";

// Deliberately tiny and free of any Supabase import: it renders the launcher button and loads
// the real chat (and the Supabase client) in a separate chunk only when needed.

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });
const preloadPanel = () => void import("./ChatPanel");

const LS_UNREAD = "aww-chat-unread";
const LS_OPEN = "aww-chat-has-conversation";
const SS_CTX = "aww-chat-ctx";
const SS_CFG = "aww-chat-launcher-cfg";
const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

type LauncherCfg = { enabled: boolean; label?: string; hidden?: string[] };

function captureContext() {
  try {
    if (sessionStorage.getItem(SS_CTX)) return;
    const params = new URLSearchParams(location.search);
    const pick = (keys: string[]) => Object.fromEntries(keys.filter((k) => params.get(k)).map((k) => [k, params.get(k) as string]));
    sessionStorage.setItem(
      SS_CTX,
      JSON.stringify({
        landing_page: location.pathname + location.search,
        referrer: document.referrer,
        utm: pick(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]),
        click_ids: pick(["gclid", "fbclid", "msclkid", "ttclid"]),
      })
    );
  } catch {
    /* storage can be blocked */
  }
}

function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    /* autoplay rules */
  }
}

export function ChatLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unread, setUnread] = useState(0);
  const [cfg, setCfg] = useState<LauncherCfg>({ enabled: true });
  const interacted = useRef(false);
  const baseTitle = useRef("");

  useEffect(() => {
    if (!configured) return;
    captureContext();
    // Read after mount (not during render) so server and client markup match.
    const restore = setTimeout(() => {
      try {
        setUnread(Number(localStorage.getItem(LS_UNREAD) ?? "0") || 0);
      } catch {
        /* ignore */
      }
    }, 0);
    const markInteracted = () => {
      interacted.current = true;
    };
    window.addEventListener("pointerdown", markInteracted, { once: true });
    window.addEventListener("keydown", markInteracted, { once: true });
    return () => {
      clearTimeout(restore);
      window.removeEventListener("pointerdown", markInteracted);
      window.removeEventListener("keydown", markInteracted);
    };
  }, []);

  // After a few idle seconds: read launcher settings, and wake the background connection
  // only for visitors who already have a conversation (so replies arrive while they browse).
  useEffect(() => {
    if (!configured) return;
    const run = () => {
      try {
        const cached = sessionStorage.getItem(SS_CFG);
        if (cached) {
          setCfg(JSON.parse(cached) as LauncherCfg);
        } else {
          void fetch("/api/chat/config")
            .then((r) => r.json())
            .then((c: { enabled: boolean; settings?: { launcher_label: string; hidden_paths: string[] } }) => {
              const next: LauncherCfg = { enabled: c.enabled, label: c.settings?.launcher_label, hidden: c.settings?.hidden_paths };
              setCfg(next);
              try {
                sessionStorage.setItem(SS_CFG, JSON.stringify(next));
              } catch {
                /* ignore */
              }
            })
            .catch(() => undefined);
        }
        if (localStorage.getItem(LS_OPEN) === "1") setMounted(true);
      } catch {
        /* ignore */
      }
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    const timer = setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(run) : run()), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Unread: tab title and a short sound while the panel is closed.
  useEffect(() => {
    if (!baseTitle.current) baseTitle.current = document.title;
    if (unread > 0 && !open) document.title = `(${unread}) New message`;
    else if (baseTitle.current) document.title = baseTitle.current;
  }, [unread, open, pathname]);

  useEffect(() => {
    const onIncoming = () => {
      if (interacted.current) beep();
    };
    window.addEventListener("aww-chat-incoming", onIncoming);
    return () => window.removeEventListener("aww-chat-incoming", onIncoming);
  }, []);

  const handleUnread = useCallback((n: number) => setUnread(n), []);
  const close = useCallback(() => setOpen(false), []);

  // Keep the visitor's current page fresh for agents (throttled to once per 10s, only once connected).
  const lastPing = useRef(0);
  useEffect(() => {
    if (!mounted) return;
    const now = Date.now();
    if (now - lastPing.current < 10_000) return;
    lastPing.current = now;
    void import("@/lib/supabase/widget").then(async ({ getWidgetClient }) => {
      const client = getWidgetClient();
      const { data } = await client.auth.getSession();
      if (data.session) await client.rpc("update_my_visitor", { p_name: "", p_email: "", p_phone: "", p_current_page: pathname });
    });
  }, [pathname, mounted]);

  if (!configured || !cfg.enabled) return null;
  if (cfg.hidden?.some((p) => p && (pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`)))) return null;

  const label = cfg.label ?? "Chat with us";

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => {
            setMounted(true);
            setOpen(true);
          }}
          onPointerEnter={preloadPanel}
          onFocus={preloadPanel}
          onTouchStart={preloadPanel}
          aria-label={unread ? `${label}. ${unread} unread message${unread > 1 ? "s" : ""}` : label}
          className="chat-launcher fixed right-4 bottom-[calc(68px+env(safe-area-inset-bottom))] z-[45] flex h-14 items-center gap-2 rounded-full bg-navy pr-5 pl-4 text-sm font-bold text-white shadow-[0_12px_32px_rgba(0,35,80,0.35)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:right-6 lg:bottom-6"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand text-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      )}
      {mounted && <ChatPanel open={open} onClose={close} onUnread={handleUnread} />}
    </>
  );
}
