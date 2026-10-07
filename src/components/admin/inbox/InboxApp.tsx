"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useAdmin, useInboxEvent } from "../AdminContext";
import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";
import { DetailsPane } from "./DetailsPane";
import type { Canned, Conversation, TeamMember } from "./types";

/**
 * Three panes on desktop (list, conversation, visitor details); one at a time on a phone:
 * list, then conversation, then a details drawer. The route (/admin/inbox/[id]) decides which.
 */
export function InboxApp() {
  const { supabase } = useAdmin();
  const params = useParams<{ id?: string[] | string }>();
  const router = useRouter();
  const selectedId = Array.isArray(params.id) ? params.id[0] : (params.id ?? null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [canned, setCanned] = useState<Canned[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const orderRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      supabase.from("agents").select("user_id, display_name, avatar_url, role, status, active").order("display_name"),
      supabase.from("canned_responses").select("id, shortcut, title, body").order("shortcut"),
    ]).then(([a, c]) => {
      if (cancelled) return;
      setTeam((a.data ?? []) as TeamMember[]);
      setCanned((c.data ?? []) as Canned[]);
    });
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // Load the selected conversation (with its visitor).
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      const { data } = await supabase.from("conversations").select("*, visitor:visitors(*)").eq("id", selectedId).maybeSingle();
      if (!cancelled) setConversation(data as unknown as Conversation | null);
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [selectedId, supabase]);

  // Keep the open conversation fresh when it changes elsewhere (assignment, status, visitor page).
  useInboxEvent("conversation", (payload) => {
    if (payload.id !== selectedId) return;
    setConversation((c) => (c ? { ...c, ...(payload as Partial<Conversation>) } : c));
  });

  const patch = useCallback((p: Partial<Conversation>) => setConversation((c) => (c ? { ...c, ...p } : c)), []);

  // Remember the visible list order so Alt+Up/Down can step through it.
  useEffect(() => {
    const read = () => {
      orderRef.current = Array.from(document.querySelectorAll<HTMLElement>("[data-conv]")).map((el) => el.dataset.conv as string);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const order = orderRef.current;
      const i = selectedId ? order.indexOf(selectedId) : -1;
      const next = order[Math.min(order.length - 1, Math.max(0, i + dir))];
      if (next) router.push(`/admin/inbox/${next}`);
    },
    [router, selectedId]
  );

  // Ctrl/Cmd+K focuses the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)_21rem]">
      <div className={`${selectedId ? "hidden lg:block" : "block"} min-h-0`}>
        <ConversationList selectedId={selectedId} team={team} onSearchRef={(el) => { searchRef.current = el; }} />
      </div>

      <div className={`${selectedId ? "block" : "hidden lg:block"} min-h-0`}>
        {selectedId ? (
          <ConversationView
            key={selectedId}
            conversationId={selectedId}
            team={team}
            canned={canned}
            conversation={conversation}
            onConversationChange={patch}
            onShowDetails={() => setShowDetails(true)}
            onNavigate={navigate}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500">
            <MessageCircle className="h-10 w-10" aria-hidden />
            <p className="text-sm font-semibold">Select a conversation</p>
            <p className="text-xs">Ctrl+K search · Alt+↑/↓ next chat · Ctrl+Shift+C close</p>
          </div>
        )}
      </div>

      {conversation && selectedId && (
        <>
          <div className="hidden min-h-0 border-l border-ink/10 xl:block">
            <DetailsPane conversation={conversation} onChange={patch} />
          </div>
          {showDetails && (
            <div className="fixed inset-0 z-40 bg-white xl:hidden">
              <DetailsPane conversation={conversation} onChange={patch} onClose={() => setShowDetails(false)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
