"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeDollarSign, Camera, CarFront, CheckCheck, Download, FileText, Info, Lock, Send, StickyNote, UserRound } from "lucide-react";
import { useAdmin, useInboxEvent } from "../AdminContext";
import { groupMessages, lastSeq, upsertMessage, type ChatMessage } from "@/lib/chat/messages";
import { linkify } from "@/lib/chat/linkify";
import { fillCanned } from "@/lib/chat/canned";
import { site } from "@/lib/site";
import { prepareImage } from "@/components/chat/image";
import { visitorLabel, type Canned, type Conversation, type TeamMember } from "./types";

const PAGE = 50;

function Text({ text }: { text: string }) {
  return (
    <>
      {linkify(text).map((s, i) =>
        s.type === "text" ? <span key={i}>{s.value}</span> : (
          <a key={i} href={s.href} target={s.type === "url" ? "_blank" : undefined} rel="noopener noreferrer nofollow" className="font-semibold underline">{s.value}</a>
        )
      )}
    </>
  );
}

const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" });
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: "Australia/Sydney" });

export function ConversationView({
  conversationId, team, canned, conversation, onConversationChange, onShowDetails, onNavigate,
}: {
  conversationId: string;
  team: TeamMember[];
  canned: Canned[];
  conversation: Conversation | null;
  onConversationChange: (patch: Partial<Conversation>) => void;
  onShowDetails: () => void;
  onNavigate: (direction: 1 | -1) => void;
}) {
  const { supabase, me, presence, setViewing, isAdmin } = useAdmin();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [visitorReadAt, setVisitorReadAt] = useState<number>(0);
  const [text, setText] = useState("");
  const [note, setNote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingSent = useRef(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const teamById = useMemo(() => Object.fromEntries(team.map((t) => [t.user_id, t])), [team]);
  const others = presence.filter((p) => p.viewing === conversationId && p.agent_id !== me.user_id);

  const markRead = useCallback(async () => {
    await supabase.rpc("mark_read", { p_conversation_id: conversationId });
    onConversationChange({ unread_for_agents: 0 });
  }, [conversationId, onConversationChange, supabase]);

  // Load the latest page of messages.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      setMessages([]);
      const { data } = await supabase.from("messages").select("*").eq("conversation_id", conversationId).order("seq", { ascending: false }).limit(PAGE);
      if (cancelled) return;
      const rows = ((data ?? []) as ChatMessage[]).reverse();
      setMessages(rows);
      setHasMore((data ?? []).length === PAGE);
      setLoading(false);
      stickToBottom.current = true;
      void markRead();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [conversationId, markRead, supabase]);

  // Presence: who is viewing this chat.
  useEffect(() => {
    setViewing(conversationId);
    return () => setViewing(null);
  }, [conversationId, setViewing]);

  // Typing / read / status broadcasts live on the per-conversation private channel.
  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      await supabase.realtime.setAuth();
      if (cancelled) return;
      channel = supabase.channel(`conversation:${conversationId}`, { config: { private: true } });
      channel
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if ((payload as { from?: string }).from !== "visitor") return;
          setVisitorTyping(true);
          if (typingTimer.current) clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => setVisitorTyping(false), 5000);
        })
        .on("broadcast", { event: "read" }, ({ payload }) => {
          const p = payload as { reader: string; at: string };
          if (p.reader === "visitor") setVisitorReadAt(new Date(p.at).getTime());
        })
        .subscribe();
      channelRef.current = channel;
    })();
    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, supabase]);

  // Incoming messages arrive on the shared inbox channel (it also carries internal notes).
  useInboxEvent("message", (payload) => {
    const m = payload as unknown as ChatMessage;
    if (m.conversation_id !== conversationId) return;
    setMessages((list) => upsertMessage(list, m));
    setVisitorTyping(false);
    if (m.sender_type === "visitor" && document.visibilityState === "visible") void markRead();
  });

  // Fill gaps after a reconnect or tab switch.
  useEffect(() => {
    const fill = async () => {
      const since = lastSeq(messagesRef.current);
      const { data } = await supabase.from("messages").select("*").eq("conversation_id", conversationId).gt("seq", since).order("seq", { ascending: true }).limit(200);
      if (data?.length) setMessages((list) => (data as ChatMessage[]).reduce((acc, m) => upsertMessage(acc, m), list));
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void fill();
        void markRead();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", fill);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", fill);
    };
  }, [conversationId, markRead, supabase]);

  // Signed URLs for photos.
  useEffect(() => {
    const missing = messages.flatMap((m) => m.attachments.map((a) => a.path)).filter((p) => !urls[p]);
    if (!missing.length) return;
    let cancelled = false;
    void supabase.storage.from("chat-uploads").createSignedUrls(missing, 3600).then(({ data }) => {
      if (cancelled || !data) return;
      setUrls((u) => ({ ...u, ...Object.fromEntries(data.filter((d) => d.path && d.signedUrl).map((d) => [d.path as string, d.signedUrl as string])) }));
    });
    return () => {
      cancelled = true;
    };
  }, [messages, supabase, urls]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages.length, visitorTyping, loading]);

  const loadOlder = async () => {
    const first = messages[0]?.seq;
    if (!first) return;
    const el = listRef.current;
    const prevHeight = el?.scrollHeight ?? 0;
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", conversationId).lt("seq", first).order("seq", { ascending: false }).limit(PAGE);
    const rows = ((data ?? []) as ChatMessage[]).reverse();
    stickToBottom.current = false;
    setMessages((list) => rows.reduce((acc, m) => upsertMessage(acc, m), list));
    setHasMore((data ?? []).length === PAGE);
    requestAnimationFrame(() => {
      if (el) el.scrollTop = el.scrollHeight - prevHeight;
    });
  };

  const sendRow = useCallback(
    async (row: Partial<ChatMessage> & { type: ChatMessage["type"] }) => {
      const id = crypto.randomUUID();
      const { data, error: err } = await supabase
        .from("messages")
        .insert({ id, conversation_id: conversationId, sender_type: "agent", sender_agent_id: me.user_id, body: "", is_internal: false, ...row })
        .select("*")
        .single();
      if (err) throw err;
      setMessages((list) => upsertMessage(list, data as ChatMessage));
      stickToBottom.current = true;
    },
    [conversationId, me.user_id, supabase]
  );

  const submit = async () => {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setError(null);
    try {
      await sendRow({ type: "text", body, is_internal: note });
      setText("");
      if (!note && conversation?.status === "pending") onConversationChange({ status: "open" });
    } catch {
      setError("Message failed to send.");
    }
    setBusy(false);
  };

  const sendTyping = () => {
    const now = Date.now();
    if (now - typingSent.current > 2000 && !note) {
      typingSent.current = now;
      void channelRef.current?.send({ type: "broadcast", event: "typing", payload: { from: "agent" } });
    }
  };

  const uploadImages = async (files: File[]) => {
    setBusy(true);
    setError(null);
    try {
      const attachments: ChatMessage["attachments"] = [];
      for (const file of files.slice(0, 5)) {
        const img = await prepareImage(file);
        const path = `${conversationId}/${crypto.randomUUID()}.${img.ext}`;
        const { error: up } = await supabase.storage.from("chat-uploads").upload(path, img.blob, { contentType: img.mime });
        if (up) throw up;
        attachments.push({ path, mime: img.mime, size: img.size, width: img.width, height: img.height });
      }
      await sendRow({ type: "image", attachments, is_internal: note });
    } catch {
      setError("Photo upload failed.");
    }
    setBusy(false);
  };

  const requestForm = async (kind: "contact" | "vehicle" | "photos") => {
    const bodies = {
      contact: "Could you confirm your contact details so we can call you back?",
      vehicle: "Could you tell us a bit more about the vehicle?",
      photos: "Could you send a few photos of the vehicle?",
    };
    setBusy(true);
    try {
      await sendRow({ type: "form_request", body: bodies[kind], payload: { kind } });
    } catch {
      setError("Could not send the request.");
    }
    setBusy(false);
  };

  const sendOffer = async (amount: number, noteText: string, validUntil: string) => {
    try {
      await sendRow({
        type: "offer",
        body: `Cash offer: $${amount}`,
        payload: { amount, note: noteText, valid_until: validUntil ? new Date(`${validUntil}T23:59:59+10:00`).toISOString() : null },
      });
      await supabase.from("conversations").update({ lead_status: "offer_sent", offer_amount: amount }).eq("id", conversationId);
      onConversationChange({ lead_status: "offer_sent", offer_amount: amount });
      setOfferOpen(false);
    } catch {
      setError("Could not send the offer.");
    }
  };

  const setStatus = async (status: Conversation["status"]) => {
    const patch: Record<string, unknown> = { status };
    if (status === "closed") {
      patch.closed_at = new Date().toISOString();
      patch.closed_by = me.user_id;
    } else {
      patch.closed_at = null;
    }
    await supabase.from("conversations").update(patch).eq("id", conversationId);
    if (status === "closed") {
      await supabase.from("messages").insert({
        conversation_id: conversationId, sender_type: "agent", sender_agent_id: me.user_id, type: "text", body: "This chat has been closed. Thanks for contacting us!", is_internal: false,
      });
    }
    onConversationChange(patch as Partial<Conversation>);
  };

  const assign = async (agentId: string | null) => {
    await supabase.from("conversations").update({ assigned_agent_id: agentId }).eq("id", conversationId);
    onConversationChange({ assigned_agent_id: agentId });
  };

  const block = async () => {
    if (!conversation?.visitor || !confirm("Block this visitor? They will no longer be able to send messages.")) return;
    await supabase.from("visitors").update({ blocked_at: new Date().toISOString(), blocked_reason: "Blocked by agent" }).eq("id", conversation.visitor_id);
    onConversationChange({ visitor: { ...conversation.visitor, blocked_at: new Date().toISOString() } });
  };

  const exportTranscript = () => {
    const lines = messages.map((m) => {
      const who = m.is_internal ? "NOTE" : m.sender_type === "visitor" ? visitorLabel(conversation ?? { id: conversationId }) : m.sender_type === "agent" ? teamById[m.sender_agent_id ?? ""]?.display_name ?? "Agent" : "System";
      return `[${new Date(m.created_at).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}] ${who}: ${m.type === "image" ? "[Photo]" : m.body}`;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `chat-${conversationId.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const deleteConversation = async () => {
    if (!confirm("Permanently delete this conversation and its photos? This cannot be undone.")) return;
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch("/api/admin/conversations/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ conversation_id: conversationId }),
    });
    if (res.ok) router.push("/admin/inbox");
    else setError("Could not delete.");
  };

  // Keyboard: Ctrl/Cmd+Shift+C closes the chat; Alt+Up/Down moves between conversations.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        void setStatus("closed");
      } else if (e.altKey && e.key === "ArrowDown") {
        e.preventDefault();
        onNavigate(1);
      } else if (e.altKey && e.key === "ArrowUp") {
        e.preventDefault();
        onNavigate(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(min-width: 1024px)").matches) {
      e.preventDefault();
      void submit();
    }
  };

  const slash = text.startsWith("/") ? text.slice(1).toLowerCase() : null;
  const suggestions = slash !== null ? canned.filter((c) => c.shortcut.includes(slash) || c.title.toLowerCase().includes(slash)).slice(0, 6) : [];
  const applyCanned = (c: Canned) => {
    setText(fillCanned(c.body, { visitor_name: conversation?.visitor?.name, agent_name: me.display_name, business_phone: site.phoneDisplay }));
  };

  const groups = useMemo(() => {
    const grouped = groupMessages(messages.filter((m) => !m.deleted_at));
    return grouped.map((g, i) => {
      const day = dayLabel(g.messages[0].created_at);
      const showDay = i === 0 || day !== dayLabel(grouped[i - 1].messages[0].created_at);
      return { ...g, day, showDay };
    });
  }, [messages]);
  const lastSeenId = useMemo(() => {
    const seen = messages.filter((m) => m.sender_type === "agent" && !m.is_internal && !m.deleted_at && new Date(m.created_at).getTime() <= visitorReadAt);
    return seen[seen.length - 1]?.id;
  }, [messages, visitorReadAt]);

  const closed = conversation?.status === "closed";

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 px-3 py-2.5">
        <Link href="/admin/inbox" className="rounded-full p-2 hover:bg-zinc-100 lg:hidden" aria-label="Back to the list">
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-bold text-ink">{conversation ? visitorLabel(conversation) : "Conversation"}</p>
          <p className="truncate text-xs text-zinc-500">
            {conversation?.visitor?.current_page ? `Viewing ${conversation.visitor.current_page}` : "Offline"}
            {conversation?.visitor?.blocked_at ? " · Blocked" : ""}
          </p>
        </div>
        <select
          aria-label="Assign to"
          value={conversation?.assigned_agent_id ?? ""}
          onChange={(e) => void assign(e.target.value || null)}
          className="max-w-[9rem] rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm"
        >
          <option value="">Unassigned</option>
          {team.filter((t) => t.active).map((t) => <option key={t.user_id} value={t.user_id}>{t.user_id === me.user_id ? "Me" : t.display_name}</option>)}
        </select>
        <select
          aria-label="Status"
          value={conversation?.status ?? "open"}
          onChange={(e) => void setStatus(e.target.value as Conversation["status"])}
          className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm"
        >
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
        <button type="button" onClick={exportTranscript} className="rounded-lg p-2 hover:bg-zinc-100" aria-label="Export transcript" title="Export transcript"><Download className="h-4 w-4" aria-hidden /></button>
        <button type="button" onClick={block} className="rounded-lg p-2 hover:bg-zinc-100" aria-label="Block visitor" title="Block visitor"><Lock className="h-4 w-4" aria-hidden /></button>
        {isAdmin && <button type="button" onClick={deleteConversation} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>}
        <button type="button" onClick={onShowDetails} className="rounded-lg p-2 hover:bg-zinc-100 xl:hidden" aria-label="Visitor details"><Info className="h-4 w-4" aria-hidden /></button>
      </div>

      {others.length > 0 && (
        <p className="bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-900" role="status">
          {others.map((o) => o.name).join(", ")} {others.some((o) => o.typing) ? "is typing a reply" : "is also viewing this chat"}
        </p>
      )}

      {/* Messages */}
      <div
        ref={listRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        }}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-4 py-4"
      >
        {hasMore && <button type="button" onClick={() => void loadOlder()} className="mx-auto block text-sm font-semibold text-navy underline">Load earlier messages</button>}
        {loading && <p className="text-center text-sm text-zinc-500">Loading…</p>}
        {groups.map((g) => {
          const { day, showDay } = g;
          const isVisitor = g.senderType === "visitor";
          const sender = g.senderAgentId ? teamById[g.senderAgentId]?.display_name ?? "Agent" : "";
          return (
            <div key={g.key}>
              {showDay && <p className="my-2 text-center text-xs font-semibold text-zinc-400">{day}</p>}
              {g.senderType === "system" ? (
                g.messages.map((m) => <p key={m.id} className="text-center text-xs font-medium text-zinc-500">{m.body}</p>)
              ) : (
                <div className={`flex flex-col ${isVisitor ? "items-start" : "items-end"}`}>
                  <p className="mb-0.5 text-xs font-semibold text-zinc-500">{isVisitor ? (conversation ? visitorLabel(conversation) : "Visitor") : sender}</p>
                  <div className={`flex max-w-[85%] flex-col gap-1 ${isVisitor ? "items-start" : "items-end"}`}>
                    {g.messages.map((m) => <Row key={m.id} m={m} isVisitor={isVisitor} urls={urls} onZoom={setLightbox} seen={m.id === lastSeenId} />)}
                  </div>
                  <p className="mt-0.5 text-[11px] text-zinc-400">{clock(g.messages[g.messages.length - 1].created_at)}</p>
                </div>
              )}
            </div>
          );
        })}
        {visitorTyping && <p className="text-xs italic text-zinc-500">The visitor is typing…</p>}
      </div>

      {/* Composer */}
      <div className="relative border-t border-ink/10 bg-white p-3">
        {suggestions.length > 0 && (
          <ul className="absolute right-3 bottom-full left-3 mb-1 max-h-56 overflow-y-auto rounded-xl border border-ink/10 bg-white shadow-lg" role="listbox" aria-label="Canned responses">
            {suggestions.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => applyCanned(c)} className="block w-full px-3 py-2 text-left hover:bg-zinc-50">
                  <span className="text-sm font-bold text-ink">/{c.shortcut}</span> <span className="text-sm text-zinc-600">{c.title}</span>
                  <span className="block truncate text-xs text-zinc-500">{c.body}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => setNote(false)} className={`rounded-full px-3 py-1 text-xs font-bold ${!note ? "bg-navy text-white" : "bg-zinc-100 text-zinc-600"}`}>Reply</button>
          <button type="button" onClick={() => setNote(true)} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${note ? "bg-amber-400 text-ink" : "bg-zinc-100 text-zinc-600"}`}><StickyNote className="h-3 w-3" aria-hidden />Internal note</button>
          <span className="mx-1 hidden h-4 w-px bg-ink/10 sm:block" />
          <button type="button" onClick={() => void requestForm("contact")} className="flex items-center gap-1 rounded-full border border-ink/10 px-2.5 py-1 text-xs font-semibold text-ink hover:bg-zinc-50"><UserRound className="h-3 w-3" aria-hidden />Request contact</button>
          <button type="button" onClick={() => void requestForm("vehicle")} className="flex items-center gap-1 rounded-full border border-ink/10 px-2.5 py-1 text-xs font-semibold text-ink hover:bg-zinc-50"><CarFront className="h-3 w-3" aria-hidden />Request vehicle</button>
          <button type="button" onClick={() => void requestForm("photos")} className="flex items-center gap-1 rounded-full border border-ink/10 px-2.5 py-1 text-xs font-semibold text-ink hover:bg-zinc-50"><Camera className="h-3 w-3" aria-hidden />Request photos</button>
          <button type="button" onClick={() => setOfferOpen(true)} className="flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-ink"><BadgeDollarSign className="h-3 w-3" aria-hidden />Send cash offer</button>
        </div>
        {error && <p className="mb-2 text-xs font-medium text-red-600" role="alert">{error}</p>}
        <div className="flex items-end gap-2">
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { const f = Array.from(e.target.files ?? []); e.target.value = ""; void uploadImages(f); }} />
          <button type="button" onClick={() => fileRef.current?.click()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy hover:bg-blue/10" aria-label="Attach photos"><Camera className="h-5 w-5" aria-hidden /></button>
          <textarea
            value={text}
            rows={1}
            onChange={(e) => { setText(e.target.value); sendTyping(); setViewing(conversationId, true); if (typingTimer.current) clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => setViewing(conversationId, false), 3000); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`; }}
            onKeyDown={onKeyDown}
            placeholder={note ? "Write a private note. Only your team sees this." : closed ? "Chat is closed. Reply to reopen." : "Reply… (type / for canned responses)"}
            aria-label="Message"
            className={`max-h-[140px] min-h-[44px] flex-1 resize-none rounded-2xl border px-3.5 py-2.5 text-base focus:outline-none focus:ring-4 ${note ? "border-amber-300 bg-amber-50 focus:ring-amber-200" : "border-[#d9e3ee] bg-white focus:border-blue focus:ring-blue/15"}`}
          />
          <button type="button" onClick={() => void submit()} disabled={!text.trim() || busy} aria-label={note ? "Add note" : "Send reply"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-ink disabled:opacity-40"><Send className="h-5 w-5" aria-hidden /></button>
        </div>
      </div>

      {offerOpen && <OfferModal onClose={() => setOfferOpen(false)} onSend={sendOffer} />}
      {lightbox && (
        <button type="button" onClick={() => setLightbox(null)} aria-label="Close photo" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Photo from the visitor" className="max-h-full max-w-full object-contain" />
        </button>
      )}
    </div>
  );
}

function Row({ m, isVisitor, urls, onZoom, seen }: { m: ChatMessage; isVisitor: boolean; urls: Record<string, string>; onZoom: (u: string) => void; seen: boolean }) {
  if (m.type === "image") {
    return (
      <div className={`grid gap-1 ${m.attachments.length > 1 ? "grid-cols-2" : ""}`}>
        {m.attachments.map((a) => (
          <button key={a.path} type="button" onClick={() => urls[a.path] && onZoom(urls[a.path])} className="overflow-hidden rounded-xl bg-zinc-200" style={{ aspectRatio: `${a.width ?? 4} / ${a.height ?? 3}`, width: m.attachments.length > 1 ? "100%" : "min(260px, 100%)" }}>
            {urls[a.path] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urls[a.path]} alt="Photo" className="h-full w-full object-cover" />
            ) : null}
          </button>
        ))}
      </div>
    );
  }
  if (m.type === "offer") {
    const response = m.payload.response as string | undefined;
    return (
      <div className="rounded-2xl border-2 border-brand bg-white px-4 py-2.5 text-sm">
        <p className="text-xs font-bold uppercase text-zinc-500">Cash offer sent</p>
        <p className="text-xl font-extrabold text-ink">${Number(m.payload.amount ?? 0).toLocaleString("en-AU")}</p>
        {m.payload.note ? <p className="text-zinc-600">{String(m.payload.note)}</p> : null}
        <p className={`mt-1 font-semibold ${response === "accept" ? "text-emerald-700" : response ? "text-zinc-600" : "text-amber-700"}`}>
          {response === "accept" ? "✔ Accepted" : response === "decline" ? "Declined" : response === "call_me" ? "Wants a call" : "Waiting for a reply"}
        </p>
      </div>
    );
  }
  if (m.type === "form_request") {
    return <div className="flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-2 text-sm text-zinc-700 shadow-sm"><FileText className="h-4 w-4 text-blue" aria-hidden />Requested {String(m.payload.kind)} details{m.payload.done ? " (received)" : " (waiting)"}</div>;
  }
  if (m.type === "form_response") {
    const answers = (m.payload.answers ?? {}) as Record<string, string>;
    return (
      <div className="rounded-2xl bg-white px-3.5 py-2.5 text-sm shadow-sm">
        <p className="font-bold text-ink">{m.body}</p>
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-zinc-700">
          {Object.entries(answers).filter(([, v]) => v).map(([k, v]) => (<Fragment key={k}><dt className="text-zinc-500">{k.replace(/_/g, " ")}</dt><dd>{v}</dd></Fragment>))}
        </dl>
      </div>
    );
  }
  const cls = m.is_internal
    ? "rounded-2xl border border-amber-300 bg-amber-100 text-ink"
    : isVisitor
      ? "rounded-2xl rounded-bl-md bg-white text-ink shadow-sm"
      : "rounded-2xl rounded-br-md bg-navy text-white";
  return (
    <div className="flex flex-col items-end">
      <div className={`${cls} whitespace-pre-wrap break-words px-3.5 py-2 text-[15px] leading-snug`}>
        {m.is_internal && <p className="mb-0.5 text-[11px] font-bold uppercase text-amber-800">Only your team sees this</p>}
        <Text text={m.body} />
      </div>
      {seen && <span className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400"><CheckCheck className="h-3.5 w-3.5 text-blue" aria-hidden />Seen</span>}
    </div>
  );
}

function OfferModal({ onClose, onSend }: { onClose: () => void; onSend: (amount: number, note: string, validUntil: string) => Promise<void> }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [valid, setValid] = useState("");
  const [busy, setBusy] = useState(false);
  const n = Number(amount);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Send cash offer">
      <div className="w-full max-w-sm space-y-3 rounded-3xl bg-white p-5 shadow-2xl">
        <h2 className="font-display text-lg font-bold text-ink">Send a cash offer</h2>
        <label className="block text-sm font-semibold">Amount (AUD)
          <input className="mt-1 w-full rounded-xl border border-[#d9e3ee] px-3 py-2.5 text-base" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} autoFocus />
        </label>
        <label className="block text-sm font-semibold">Note (optional)
          <textarea className="mt-1 w-full rounded-xl border border-[#d9e3ee] px-3 py-2.5 text-base" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">Valid until (optional)
          <input type="date" className="mt-1 w-full rounded-xl border border-[#d9e3ee] px-3 py-2.5 text-base" value={valid} onChange={(e) => setValid(e.target.value)} />
        </label>
        <p className="text-xs text-zinc-500">The visitor sees this with Accept / Call me / No thanks buttons.</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-600">Cancel</button>
          <button type="button" disabled={!(n > 0) || busy} onClick={async () => { setBusy(true); await onSend(n, note.trim(), valid); setBusy(false); }} className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-ink disabled:opacity-50">Send offer</button>
        </div>
      </div>
    </div>
  );
}
