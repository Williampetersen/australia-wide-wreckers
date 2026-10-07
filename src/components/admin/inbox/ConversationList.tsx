"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useAdmin, useInboxEvent } from "../AdminContext";
import { FILTERS, LEAD_STATUSES, timeAgo, visitorLabel, type Conversation, type InboxFilter, type TeamMember } from "./types";

const PAGE = 30;
const SELECT = "*, visitor:visitors(*)";

function applyFilter<T extends { eq: (c: string, v: unknown) => T; is: (c: string, v: null) => T; neq: (c: string, v: unknown) => T; in: (c: string, v: unknown[]) => T }>(
  q: T, filter: InboxFilter, me: string
): T {
  switch (filter) {
    case "unassigned": return q.is("assigned_agent_id", null).neq("status", "closed");
    case "mine": return q.eq("assigned_agent_id", me).neq("status", "closed");
    case "open": return q.eq("status", "open");
    case "pending": return q.eq("status", "pending");
    case "offers": return q.in("lead_status", ["offer_sent", "offer_accepted"]).neq("status", "closed");
    case "closed": return q.eq("status", "closed");
  }
}

export function ConversationList({
  selectedId, team, onSearchRef,
}: {
  selectedId: string | null;
  team: TeamMember[];
  onSearchRef: (el: HTMLInputElement | null) => void;
}) {
  const { supabase, me } = useAdmin();
  const [filter, setFilter] = useState<InboxFilter>("open");
  const [items, setItems] = useState<Conversation[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [searchIds, setSearchIds] = useState<string[] | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const filterRef = useRef(filter);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  // Waiting timers refresh every 30s.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const loadCounts = useCallback(async () => {
    const entries = await Promise.all(
      FILTERS.map(async (f) => {
        const { count } = await applyFilter(supabase.from("conversations").select("id", { count: "exact", head: true }) as never, f.id, me.user_id) as unknown as { count: number | null };
        return [f.id, count ?? 0] as const;
      })
    );
    setCounts(Object.fromEntries(entries));
  }, [me.user_id, supabase]);

  const scheduleCounts = useCallback(() => {
    if (countTimer.current) clearTimeout(countTimer.current);
    countTimer.current = setTimeout(() => void loadCounts(), 600);
  }, [loadCounts]);

  const load = useCallback(
    async (reset: boolean, cursor?: string) => {
      setLoading(true);
      let q = supabase.from("conversations").select(SELECT).order("last_message_at", { ascending: false }).limit(PAGE);
      q = applyFilter(q as never, filterRef.current, me.user_id) as unknown as typeof q;
      if (cursor) q = q.lt("last_message_at", cursor);
      const { data } = await q;
      const rows = (data ?? []) as unknown as Conversation[];
      setItems((prev) => (reset ? rows : [...prev, ...rows]));
      setHasMore(rows.length === PAGE);
      setLoading(false);
    },
    [me.user_id, supabase]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void load(true);
      void loadCounts();
    }, 0);
    return () => clearTimeout(t);
  }, [filter, load, loadCounts]);

  // Live updates: the shell owns the private `inbox` subscription and forwards events here.
  useInboxEvent("conversation", async (payload) => {
    const slim = payload as Partial<Conversation> & { id: string };
    scheduleCounts();
    setItems((prev) => (prev.some((c) => c.id === slim.id) ? prev.map((c) => (c.id === slim.id ? { ...c, ...slim } : c)) : prev));
    // A conversation we do not have yet (or one whose status changed): refetch just that row.
    const { data } = await supabase.from("conversations").select(SELECT).eq("id", slim.id).maybeSingle();
    if (!data) return;
    const row = data as unknown as Conversation;
    const matches = await matchesFilter(row, filterRef.current, me.user_id);
    setItems((prev) => {
      const without = prev.filter((c) => c.id !== row.id);
      return matches ? [row, ...without].sort((a, b) => b.last_message_at.localeCompare(a.last_message_at)) : without;
    });
  });

  const runSearch = (value: string) => {
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 2) {
      setSearchIds(null);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      const { data } = await supabase.rpc("admin_search", { p_query: value.trim() });
      setSearchIds(((data ?? []) as { conversation_id: string }[]).map((r) => r.conversation_id));
    }, 300);
  };

  const [searchRows, setSearchRows] = useState<Conversation[]>([]);
  useEffect(() => {
    if (!searchIds) return;
    let cancelled = false;
    void (async () => {
      if (!searchIds.length) return setSearchRows([]);
      const { data } = await supabase.from("conversations").select(SELECT).in("id", searchIds).order("last_message_at", { ascending: false });
      if (!cancelled) setSearchRows((data ?? []) as unknown as Conversation[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [searchIds, supabase]);

  const shown = searchIds ? searchRows : items;
  const teamById = Object.fromEntries(team.map((t) => [t.user_id, t]));

  return (
    <div className="flex h-full min-h-0 flex-col border-r border-ink/10 bg-white">
      <div className="space-y-2 border-b border-ink/10 p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
          <input
            ref={onSearchRef}
            value={query}
            onChange={(e) => runSearch(e.target.value)}
            placeholder="Search name, phone, rego, message…  (Ctrl+K)"
            aria-label="Search conversations"
            className="w-full rounded-xl border border-ink/10 bg-zinc-50 py-2 pr-3 pl-9 text-sm focus:border-blue focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Inbox filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => {
                setFilter(f.id);
                setQuery("");
                setSearchIds(null);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === f.id ? "bg-ink text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
            >
              {f.label}
              {counts[f.id] ? <span className={`ml-1.5 ${filter === f.id ? "text-brand" : "text-blue"}`}>{counts[f.id]}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <ul className="min-h-0 flex-1 divide-y divide-ink/5 overflow-y-auto">
        {shown.map((c) => {
          const waitingMin = c.last_message_sender === "visitor" && c.status === "open" ? Math.floor((now - new Date(c.last_message_at).getTime()) / 60_000) : null;
          const lead = LEAD_STATUSES.find((l) => l.id === c.lead_status);
          const agent = c.assigned_agent_id ? teamById[c.assigned_agent_id] : null;
          return (
            <li key={c.id}>
              <Link
                href={`/admin/inbox/${c.id}`}
                data-conv={c.id}
                className={`flex gap-3 px-3 py-3 ${selectedId === c.id ? "bg-brand/15" : c.unread_for_agents > 0 ? "bg-amber-50" : "hover:bg-zinc-50"}`}
              >
                <span className="mt-1.5 flex h-2.5 w-2.5 shrink-0">
                  {c.unread_for_agents > 0 && <span className="h-2.5 w-2.5 rounded-full bg-red-600" aria-label="Unread" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`truncate text-sm ${c.unread_for_agents ? "font-bold" : "font-semibold"} text-ink`}>{visitorLabel(c)}</p>
                    <span className="shrink-0 text-xs text-zinc-500">{timeAgo(c.last_message_at, now)}</span>
                  </div>
                  <p className="truncate text-sm text-zinc-600">{c.last_message_sender === "agent" ? "You: " : ""}{c.last_message_preview ?? "No messages yet"}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {lead && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${lead.tone}`}>{lead.label}</span>}
                    {waitingMin !== null && waitingMin >= 1 && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${waitingMin >= 5 ? "bg-red-600 text-white" : waitingMin >= 2 ? "bg-amber-400 text-ink" : "bg-zinc-200 text-zinc-700"}`}>
                        Waiting {waitingMin}m
                      </span>
                    )}
                    {agent && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white" title={agent.display_name}>
                        {agent.display_name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
        {!loading && shown.length === 0 && <li className="p-6 text-center text-sm text-zinc-500">{searchIds ? "No matches." : "Nothing here. New chats appear instantly."}</li>}
        {hasMore && !searchIds && (
          <li className="p-3 text-center">
            <button type="button" className="text-sm font-semibold text-navy underline" onClick={() => void load(false, items[items.length - 1]?.last_message_at)}>
              Load more
            </button>
          </li>
        )}
        {loading && <li className="p-4 text-center text-sm text-zinc-500">Loading…</li>}
      </ul>
    </div>
  );
}

async function matchesFilter(row: Conversation, filter: InboxFilter, me: string): Promise<boolean> {
  switch (filter) {
    case "unassigned": return !row.assigned_agent_id && row.status !== "closed";
    case "mine": return row.assigned_agent_id === me && row.status !== "closed";
    case "open": return row.status === "open";
    case "pending": return row.status === "pending";
    case "offers": return ["offer_sent", "offer_accepted"].includes(row.lead_status) && row.status !== "closed";
    case "closed": return row.status === "closed";
  }
}
