"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AgentProfile } from "./AdminShell";

export type PresenceEntry = { agent_id: string; name: string; viewing: string | null; typing: boolean };

export type AdminContextValue = {
  supabase: SupabaseClient;
  me: AgentProfile;
  isAdmin: boolean;
  status: "online" | "away" | "offline";
  setStatus: (s: "online" | "away" | "offline") => void;
  presence: PresenceEntry[];
  setViewing: (conversationId: string | null, typing?: boolean) => void;
  totalUnread: number;
};

export const AdminContext = createContext<AdminContextValue | null>(null);

/** The shell owns the single private `inbox` subscription and re-dispatches its events here. */
export const INBOX_EVENT = "aww-inbox-event";

export function useInboxEvent(event: "message" | "conversation", handler: (payload: Record<string, unknown>) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const listener = (e: Event) => {
      const detail = (e as CustomEvent<{ event: string; payload: Record<string, unknown> }>).detail;
      if (detail.event === event) ref.current(detail.payload);
    };
    window.addEventListener(INBOX_EVENT, listener);
    return () => window.removeEventListener(INBOX_EVENT, listener);
  }, [event]);
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminShell");
  return ctx;
}
