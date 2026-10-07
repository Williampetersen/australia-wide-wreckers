"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { getWidgetClient } from "@/lib/supabase/widget";
import { lastSeq, upsertMessage, type ChatMessage } from "@/lib/chat/messages";
import { normaliseAuPhone } from "@/lib/chat/phone";
import { prepareImage } from "./image";
import { getTurnstileToken } from "./turnstile";

export type ChatConfig = {
  enabled: boolean;
  settings?: {
    accent_colour: string;
    launcher_label: string;
    welcome_title: string;
    welcome_text: string;
    quick_chips: string[];
    hidden_paths: string[];
    timezone: string;
    offline_message: string;
    turnstile_enabled: boolean;
  };
  live?: boolean;
  next_open_text?: string | null;
};

export type AgentInfo = { user_id: string; display_name: string; avatar_url: string | null };
export type VisitorInfo = { name: string | null; email: string | null; phone: string | null; blocked: boolean };
export type ConversationInfo = {
  id: string;
  status: "open" | "pending" | "closed";
  unread_for_visitor: number;
  agent_last_read_at: string | null;
  rating: number | null;
};

const LS_UNREAD = "aww-chat-unread";
const LS_OPEN = "aww-chat-has-conversation";

type Track = (event: string, params?: Record<string, unknown>) => void;
const track: Track = (event, params) => {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  try {
    w.gtag?.("event", event, params ?? {});
    if (event === "chat_contact_captured") w.fbq?.("track", "Lead");
  } catch {
    /* analytics must never break chat */
  }
};

function friendly(error: unknown): string {
  const message = (error as { message?: string })?.message ?? "";
  if (/too quickly|limit reached/i.test(message)) return message;
  if (/chat unavailable|blocked/i.test(message)) return "UNAVAILABLE";
  return "Couldn't send. Tap to retry.";
}

export function useChat(open: boolean, onUnread: (count: number) => void) {
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [conversation, setConversation] = useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agents, setAgents] = useState<Record<string, AgentInfo>>({});
  const [visitor, setVisitor] = useState<VisitorInfo | null>(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [uploading, setUploading] = useState(false);

  const clientRef = useRef<SupabaseClient | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const convIdRef = useRef<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const openRef = useRef(open);
  const typingSentAt = useRef(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hiddenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const client = useCallback(() => {
    if (!clientRef.current) clientRef.current = getWidgetClient();
    return clientRef.current;
  }, []);

  const loadAgents = useCallback(async () => {
    const { data } = await client().from("agents_public").select("user_id, display_name, avatar_url");
    if (data) setAgents(Object.fromEntries((data as AgentInfo[]).map((a) => [a.user_id, a])));
  }, [client]);

  const markRead = useCallback(async () => {
    const id = convIdRef.current;
    if (!id) return;
    await client().rpc("mark_read", { p_conversation_id: id });
    setConversation((c) => (c ? { ...c, unread_for_visitor: 0 } : c));
    onUnread(0);
    try {
      localStorage.setItem(LS_UNREAD, "0");
    } catch {
      /* storage may be blocked */
    }
  }, [client, onUnread]);

  const addMessage = useCallback(
    (incoming: ChatMessage, fromRealtime = false) => {
      if (incoming.is_internal) return;
      setMessages((list) => upsertMessage(list, { ...incoming, status: incoming.sender_type === "visitor" ? "sent" : undefined }));
      if (fromRealtime && incoming.sender_type !== "visitor") {
        setAgentTyping(false);
        if (openRef.current && document.visibilityState === "visible") {
          void markRead();
        } else {
          setConversation((c) => (c ? { ...c, unread_for_visitor: c.unread_for_visitor + 1 } : c));
          onUnread(1);
          try {
            const next = Number(localStorage.getItem(LS_UNREAD) ?? "0") + 1;
            localStorage.setItem(LS_UNREAD, String(next));
            onUnread(next);
          } catch {
            /* ignore */
          }
          window.dispatchEvent(new CustomEvent("aww-chat-incoming"));
        }
      }
    },
    [markRead, onUnread]
  );

  const gapFill = useCallback(async () => {
    const id = convIdRef.current;
    if (!id) return;
    const since = lastSeq(messagesRef.current);
    const { data } = await client()
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .gt("seq", since)
      .order("seq", { ascending: true })
      .limit(200);
    if (data?.length) {
      const hadAgentMessage = (data as ChatMessage[]).some((m) => m.sender_type !== "visitor");
      setMessages((list) => (data as ChatMessage[]).reduce((acc, m) => upsertMessage(acc, { ...m, status: m.sender_type === "visitor" ? "sent" : undefined }), list));
      if (hadAgentMessage && !openRef.current) onUnread(Math.max(1, Number(localStorage.getItem(LS_UNREAD) ?? "0")));
    }
    // refresh read receipt / status
    const { data: conv } = await client().from("my_conversations").select("*").eq("id", id).maybeSingle();
    if (conv) setConversation((c) => ({ ...(c ?? (conv as ConversationInfo)), ...(conv as ConversationInfo) }));
  }, [client, onUnread]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      void client().removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [client]);

  const subscribe = useCallback(
    async (id: string) => {
      unsubscribe();
      const supabase = client();
      await supabase.realtime.setAuth();
      const channel = supabase.channel(`conversation:${id}`, { config: { private: true } });
      channel
        .on("broadcast", { event: "message" }, ({ payload }) => addMessage(payload as ChatMessage, true))
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if ((payload as { from?: string })?.from !== "agent") return;
          setAgentTyping(true);
          if (typingTimer.current) clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => setAgentTyping(false), 5000);
        })
        .on("broadcast", { event: "status" }, ({ payload }) => {
          const p = payload as { status: ConversationInfo["status"] };
          setConversation((c) => (c ? { ...c, status: p.status } : c));
        })
        .on("broadcast", { event: "read" }, ({ payload }) => {
          const p = payload as { reader: string; at: string };
          if (p.reader === "agent") setConversation((c) => (c ? { ...c, agent_last_read_at: p.at } : c));
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") void gapFill();
        });
      channelRef.current = channel;
    },
    [addMessage, client, gapFill, unsubscribe]
  );

  /** Loads config, then (if the visitor already has a session) their latest conversation. */
  const init = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    try {
      const res = await fetch("/api/chat/config");
      const cfg = (await res.json()) as ChatConfig;
      setConfig(cfg);
      if (!cfg.enabled) return;

      const supabase = client();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const [{ data: convs }, { data: me }] = await Promise.all([
        supabase.from("my_conversations").select("*").order("created_at", { ascending: false }).limit(1),
        supabase.from("my_visitor").select("*").maybeSingle(),
      ]);
      if (me) {
        setVisitor(me as VisitorInfo);
        if ((me as VisitorInfo).blocked) setBlocked(true);
      }
      const latest = convs?.[0] as ConversationInfo | undefined;
      if (!latest) return;
      // A closed chat that was already rated starts fresh next time.
      if (latest.status === "closed" && latest.rating) return;

      convIdRef.current = latest.id;
      setConversation(latest);
      try {
        localStorage.setItem(LS_OPEN, "1");
      } catch {
        /* ignore */
      }
      await loadAgents();
      const { data: rows } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", latest.id)
        .order("seq", { ascending: false })
        .limit(50);
      setMessages(((rows ?? []) as ChatMessage[]).reverse().map((m) => ({ ...m, status: m.sender_type === "visitor" ? "sent" : undefined })));
      await subscribe(latest.id);
      if (latest.unread_for_visitor > 0) onUnread(latest.unread_for_visitor);
    } catch {
      setError("Chat is unavailable right now. Please call us.");
    } finally {
      setLoading(false);
    }
  }, [client, loadAgents, onUnread, subscribe]);

  useEffect(() => {
    const t = setTimeout(() => void init(), 0);
    return () => {
      clearTimeout(t);
      unsubscribe();
    };
  }, [init, unsubscribe]);

  // Mark read when the panel opens or the tab becomes visible while open.
  useEffect(() => {
    if (open && conversation && conversation.unread_for_visitor > 0) void markRead();
  }, [open, conversation, markRead]);

  // Save battery/connections: drop the subscription if the tab stays hidden with the panel closed.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenTimer.current = setTimeout(() => {
          if (!openRef.current) unsubscribe();
        }, 5 * 60 * 1000);
      } else {
        if (hiddenTimer.current) clearTimeout(hiddenTimer.current);
        if (convIdRef.current && !channelRef.current) void subscribe(convIdRef.current);
        else void gapFill();
        if (openRef.current) void markRead();
      }
    };
    const onOnline = () => {
      if (convIdRef.current) void subscribe(convIdRef.current);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, [gapFill, markRead, subscribe, unsubscribe]);

  const sendTyping = useCallback(() => {
    const now = Date.now();
    if (now - typingSentAt.current < 2000 || !channelRef.current) return;
    typingSentAt.current = now;
    void channelRef.current.send({ type: "broadcast", event: "typing", payload: { from: "visitor" } });
  }, []);

  const pageContext = () => {
    let utm: Record<string, string> = {};
    let clickIds: Record<string, string> = {};
    let landing = location.href;
    let referrer = document.referrer;
    try {
      const raw = sessionStorage.getItem("aww-chat-ctx");
      if (raw) {
        const ctx = JSON.parse(raw) as { utm?: Record<string, string>; click_ids?: Record<string, string>; landing_page?: string; referrer?: string };
        utm = ctx.utm ?? {};
        clickIds = ctx.click_ids ?? {};
        landing = ctx.landing_page ?? landing;
        referrer = ctx.referrer ?? referrer;
      }
    } catch {
      /* ignore */
    }
    return { landing_page: landing, current_page: location.pathname + location.search, referrer, utm, click_ids: clickIds };
  };

  /** Sends a text message, starting the conversation (and the anonymous session) on the first one. */
  const send = useCallback(
    async (text: string, contact?: { name?: string; phone?: string; email?: string }, existingId?: string) => {
      const body = text.trim();
      if (!body) return;
      setError(null);
      const supabase = client();
      const id = existingId ?? crypto.randomUUID();
      const optimistic: ChatMessage = {
        id,
        conversation_id: convIdRef.current ?? "pending",
        sender_type: "visitor",
        sender_agent_id: null,
        type: "text",
        body,
        attachments: [],
        payload: {},
        is_internal: false,
        created_at: new Date().toISOString(),
        status: "sending",
      };
      setMessages((list) => upsertMessage(list, optimistic));

      try {
        if (!convIdRef.current) {
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData.session) {
            const captchaToken = await getTurnstileToken(Boolean(config?.settings?.turnstile_enabled));
            const { error: authError } = await supabase.auth.signInAnonymously(
              captchaToken ? { options: { captchaToken } } : undefined
            );
            if (authError) throw authError;
          }
          const token = (await supabase.auth.getSession()).data.session?.access_token;
          const res = await fetch("/api/chat/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ id, message: body, context: pageContext(), ...contact }),
          });
          const json = (await res.json()) as { ok: boolean; conversation_id?: string; error?: string };
          if (!res.ok || !json.ok || !json.conversation_id) {
            if (res.status === 403) throw new Error("chat unavailable");
            throw new Error(json.error ?? "failed");
          }
          convIdRef.current = json.conversation_id;
          try {
            localStorage.setItem(LS_OPEN, "1");
          } catch {
            /* ignore */
          }
          track("chat_start");
          const { data: conv } = await supabase.from("my_conversations").select("*").eq("id", json.conversation_id).maybeSingle();
          if (conv) setConversation(conv as ConversationInfo);
          const { data: me } = await supabase.from("my_visitor").select("*").maybeSingle();
          if (me) setVisitor(me as VisitorInfo);
          await loadAgents();
          setMessages((list) => list.map((m) => (m.id === id ? { ...m, conversation_id: json.conversation_id!, status: "sent" } : m)));
          await subscribe(json.conversation_id);
          return;
        }

        const { data, error: insertError } = await supabase
          .from("messages")
          .insert({ id, conversation_id: convIdRef.current, sender_type: "visitor", type: "text", body })
          .select("seq, created_at")
          .single();
        if (insertError && insertError.code !== "23505") throw insertError;
        setMessages((list) =>
          list.map((m) => (m.id === id ? { ...m, status: "sent", seq: data?.seq ?? m.seq, created_at: data?.created_at ?? m.created_at } : m))
        );
        setConversation((c) => (c && c.status === "closed" ? { ...c, status: "open" } : c));
      } catch (e) {
        const msg = friendly(e);
        if (msg === "UNAVAILABLE") setBlocked(true);
        else setError(msg);
        setMessages((list) => list.map((m) => (m.id === id ? { ...m, status: "failed" } : m)));
      }
    },
    [client, config, loadAgents, subscribe]
  );

  const retry = useCallback(
    (message: ChatMessage) => {
      setMessages((list) => list.filter((m) => m.id !== message.id));
      void send(message.body, undefined, message.id);
    },
    [send]
  );

  /** Compresses and uploads photos, then posts one image message. */
  const sendImages = useCallback(
    async (files: File[]) => {
      const id = convIdRef.current;
      if (!id || !files.length) return;
      setUploading(true);
      setError(null);
      try {
        const supabase = client();
        const attachments: ChatMessage["attachments"] = [];
        for (const file of files.slice(0, 5)) {
          const img = await prepareImage(file);
          const path = `${id}/${crypto.randomUUID()}.${img.ext}`;
          const { error: upError } = await supabase.storage.from("chat-uploads").upload(path, img.blob, {
            contentType: img.mime,
            upsert: false,
          });
          if (upError) throw upError;
          attachments.push({ path, mime: img.mime, size: img.size, width: img.width, height: img.height });
        }
        const messageId = crypto.randomUUID();
        const { data, error: insertError } = await supabase
          .from("messages")
          .insert({ id: messageId, conversation_id: id, sender_type: "visitor", type: "image", body: "", attachments })
          .select("*")
          .single();
        if (insertError) throw insertError;
        addMessage(data as ChatMessage);
      } catch (e) {
        setError((e as Error).message?.includes("too large") ? (e as Error).message : "Photo upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [addMessage, client]
  );

  const saveContact = useCallback(
    async (input: { name?: string; phone?: string; email?: string }) => {
      const phone = input.phone ? normaliseAuPhone(input.phone) : null;
      if (input.phone && !phone) return "Enter a valid Australian phone number.";
      if (input.email && !/^\S+@\S+\.\S+$/.test(input.email)) return "Enter a valid email address.";
      const { error: rpcError } = await client().rpc("update_my_visitor", {
        p_name: input.name ?? "",
        p_email: input.email ?? "",
        p_phone: phone ?? "",
        p_current_page: null,
      });
      if (rpcError) return "Could not save your details.";
      setVisitor((v) => ({ name: input.name || v?.name || null, email: input.email || v?.email || null, phone: phone || v?.phone || null, blocked: false }));
      track("chat_contact_captured");
      return null;
    },
    [client]
  );

  const submitForm = useCallback(
    async (messageId: string, answers: Record<string, string>) => {
      const { error: rpcError } = await client().rpc("submit_form", { p_message_id: messageId, p_answers: answers });
      if (!rpcError) {
        setMessages((list) => list.map((m) => (m.id === messageId ? { ...m, payload: { ...m.payload, done: true } } : m)));
        if (answers.phone || answers.email) track("chat_contact_captured");
      }
      return rpcError ? "Could not send. Please try again." : null;
    },
    [client]
  );

  const respondToOffer = useCallback(
    async (messageId: string, action: "accept" | "decline" | "call_me") => {
      const { error: rpcError } = await client().rpc("respond_to_offer", { p_message_id: messageId, p_action: action });
      if (!rpcError) {
        setMessages((list) => list.map((m) => (m.id === messageId ? { ...m, payload: { ...m.payload, response: action } } : m)));
        if (action === "accept") track("chat_offer_accepted");
      }
      return rpcError ? rpcError.message : null;
    },
    [client]
  );

  const rate = useCallback(
    async (rating: number, comment: string) => {
      const id = convIdRef.current;
      if (!id) return;
      await client().rpc("rate_conversation", { p_conversation_id: id, p_rating: rating, p_comment: comment || null });
      setConversation((c) => (c ? { ...c, rating } : c));
    },
    [client]
  );

  const emailTranscript = useCallback(async () => {
    const id = convIdRef.current;
    if (!id) return false;
    const token = (await client().auth.getSession()).data.session?.access_token;
    const res = await fetch("/api/chat/transcript", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ conversation_id: id }),
    });
    return res.ok;
  }, [client]);

  /** Starts a brand-new conversation after a closed one. */
  const startNew = useCallback(() => {
    unsubscribe();
    convIdRef.current = null;
    setConversation(null);
    setMessages([]);
    setError(null);
    try {
      localStorage.setItem(LS_UNREAD, "0");
    } catch {
      /* ignore */
    }
    onUnread(0);
  }, [onUnread, unsubscribe]);

  /** Short-lived signed URLs for photos in the conversation. */
  const signedUrls = useCallback(
    async (paths: string[]): Promise<Record<string, string>> => {
      if (!paths.length) return {};
      const { data } = await client().storage.from("chat-uploads").createSignedUrls(paths, 3600);
      return Object.fromEntries(
        (data ?? []).filter((d) => d.path && d.signedUrl).map((d) => [d.path as string, d.signedUrl as string])
      ) as Record<string, string>;
    },
    [client]
  );

  const trackOpen = useCallback(() => track("chat_open"), []);

  return useMemo(
    () => ({
      config,
      conversation,
      messages,
      agents,
      visitor,
      agentTyping,
      loading,
      error,
      blocked,
      uploading,
      send,
      retry,
      sendImages,
      sendTyping,
      saveContact,
      submitForm,
      respondToOffer,
      rate,
      emailTranscript,
      startNew,
      signedUrls,
      trackOpen,
      setError,
    }),
    [config, conversation, messages, agents, visitor, agentTyping, loading, error, blocked, uploading, send, retry, sendImages, sendTyping, saveContact, submitForm, respondToOffer, rate, emailTranscript, startNew, signedUrls, trackOpen]
  );
}
