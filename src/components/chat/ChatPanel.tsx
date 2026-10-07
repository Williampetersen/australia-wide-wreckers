"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { BadgeDollarSign, Camera, Check, CheckCheck, ChevronDown, PhoneCall, Send, Star, X } from "lucide-react";
import { groupMessages, type ChatMessage } from "@/lib/chat/messages";
import { linkify } from "@/lib/chat/linkify";
import { conditions, vehicleTypes, vehicleYears } from "@/lib/quote";
import { site } from "@/lib/site";
import { useChat } from "./useChat";

type Props = {
  open: boolean;
  onClose: () => void;
  onUnread: (count: number) => void;
};

const fieldClass =
  "w-full rounded-xl border border-[#d9e3ee] bg-white px-3 py-2.5 text-base text-ink placeholder:text-zinc-400 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15";

function Linkified({ text }: { text: string }) {
  return (
    <>
      {linkify(text).map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{seg.value}</span>
        ) : (
          <a
            key={i}
            href={seg.href}
            target={seg.type === "url" ? "_blank" : undefined}
            rel="noopener noreferrer nofollow"
            className="font-semibold underline underline-offset-2"
          >
            {seg.value}
          </a>
        )
      )}
    </>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" });
}

export default function ChatPanel({ open, onClose, onUnread }: Props) {
  const chat = useChat(open, onUnread);
  const {
    config, conversation, messages, agents, visitor, agentTyping, loading, error, blocked, uploading,
    send, retry, sendImages, sendTyping, saveContact, submitForm, respondToOffer, rate, emailTranscript,
    startNew, signedUrls, trackOpen, setError,
  } = chat;

  const [text, setText] = useState("");
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [contactSkipped, setContactSkipped] = useState(false);
  const [offline, setOffline] = useState({ name: "", phone: "", email: "" });
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [kbOffset, setKbOffset] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const settings = config?.settings;
  const live = Boolean(config?.live);
  const closed = conversation?.status === "closed";
  const hasConversation = Boolean(conversation);
  const agentList = useMemo(() => Object.values(agents).slice(0, 3), [agents]);

  // Analytics + focus management
  useEffect(() => {
    if (!open) return;
    trackOpen();
    const t = setTimeout(() => textRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [open, trackOpen]);

  // Esc closes; lock body scroll on mobile while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    const prev = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Keep the composer above the on-screen keyboard.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!open || !vv) return;
    const update = () => setKbOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open]);

  // Signed URLs for any photos we have not resolved yet.
  useEffect(() => {
    const missing = messages.flatMap((m) => m.attachments.map((a) => a.path)).filter((p) => !urls[p]);
    if (!missing.length) return;
    let cancelled = false;
    void signedUrls(missing).then((map) => {
      if (!cancelled) setUrls((u) => ({ ...u, ...map }));
    });
    return () => {
      cancelled = true;
    };
  }, [messages, signedUrls, urls]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, agentTyping, open, kbOffset]);

  const needsContact = hasConversation && !contactSkipped && !visitor?.phone && !visitor?.email && messages.length > 0 && !closed;

  const submit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const body = text.trim();
      if (!body) return;
      setText("");
      const contact = !hasConversation && !live ? offline : undefined;
      await send(body, contact);
    },
    [text, hasConversation, live, offline, send]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (e.key === "Enter" && !e.shiftKey && desktop) {
      e.preventDefault();
      void submit();
    }
  };

  const groups = useMemo(() => groupMessages(messages.filter((m) => !m.is_internal)), [messages]);
  const lastVisitorSeenId = useMemo(() => {
    const read = conversation?.agent_last_read_at ? new Date(conversation.agent_last_read_at).getTime() : 0;
    const seen = messages.filter((m) => m.sender_type === "visitor" && m.status === "sent" && new Date(m.created_at).getTime() <= read);
    return seen[seen.length - 1]?.id;
  }, [messages, conversation]);

  const accent = settings?.accent_colour ?? "#feba02";
  const offlineNeedsContact = !hasConversation && !live && !offline.phone.trim() && !offline.email.trim();

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label="Chat with Australia Wide Wreckers"
      hidden={!open}
      style={{ ["--chat-accent" as string]: accent, bottom: kbOffset ? kbOffset : undefined }}
      className="fixed inset-x-0 top-0 z-[60] flex h-[100dvh] flex-col bg-white shadow-2xl lg:inset-x-auto lg:top-auto lg:right-6 lg:bottom-6 lg:h-[min(640px,85vh)] lg:w-[400px] lg:rounded-3xl lg:border lg:border-ink/10"
    >
      {/* Header */}
      <header className="flex items-center gap-3 bg-navy px-4 py-3 text-white lg:rounded-t-3xl">
        <div className="flex -space-x-2">
          {agentList.length ? (
            agentList.map((a) => (
              <span key={a.user_id} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-navy bg-brand text-sm font-bold text-ink">
                {a.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  a.display_name.slice(0, 1).toUpperCase()
                )}
              </span>
            ))
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink">A</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{settings?.welcome_title ?? "Australia Wide Wreckers"}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-400" : "bg-zinc-400"}`} aria-hidden />
            {live ? "Online. We usually reply in a few minutes" : "We're offline. Leave a message"}
          </p>
        </div>
        <a
          href={site.phoneHref}
          className="flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-bold hover:bg-white/20"
          aria-label={`Call ${site.phoneDisplay}`}
        >
          <PhoneCall className="h-4 w-4 text-brand" aria-hidden />
          Call
        </a>
        <button type="button" onClick={onClose} aria-label="Minimise chat" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
          <ChevronDown className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" onClick={onClose} aria-label="Close chat" className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 lg:flex">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-4 py-4" aria-live="polite">
        {loading && <p className="text-center text-sm text-zinc-500">Loading…</p>}

        {!loading && !hasConversation && (
          <div className="space-y-3">
            <div className="rounded-2xl rounded-bl-md bg-white p-3.5 text-sm leading-relaxed text-ink shadow-sm">
              <p className="font-bold">{settings?.welcome_title}</p>
              <p className="mt-1 text-zinc-700">{live ? settings?.welcome_text : settings?.offline_message}</p>
              {!live && config?.next_open_text && (
                <p className="mt-2 font-semibold text-navy">We&apos;re back {config.next_open_text}.</p>
              )}
            </div>
            {live && settings?.quick_chips?.length ? (
              <div className="flex flex-wrap gap-2">
                {settings.quick_chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => void send(chip)}
                    className="rounded-full border border-blue/30 bg-white px-3.5 py-2 text-sm font-semibold text-navy hover:bg-blue/10"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            ) : null}
            {!live && (
              <div className="space-y-2 rounded-2xl bg-white p-3.5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">So we can call you back</p>
                <input className={fieldClass} placeholder="Your name" autoComplete="name" value={offline.name} onChange={(e) => setOffline({ ...offline, name: e.target.value })} />
                <input className={fieldClass} placeholder="Mobile number" inputMode="tel" autoComplete="tel" value={offline.phone} onChange={(e) => setOffline({ ...offline, phone: e.target.value })} />
                <input className={fieldClass} placeholder="Email (optional)" inputMode="email" autoComplete="email" value={offline.email} onChange={(e) => setOffline({ ...offline, email: e.target.value })} />
              </div>
            )}
          </div>
        )}

        {groups.map((group) => {
          const isVisitor = group.senderType === "visitor";
          if (group.senderType === "system") {
            return group.messages.map((m) => (
              <p key={m.id} className="text-center text-xs font-medium text-zinc-500">{m.body}</p>
            ));
          }
          const agent = group.senderAgentId ? agents[group.senderAgentId] : undefined;
          return (
            <div key={group.key} className={`flex flex-col ${isVisitor ? "items-end" : "items-start"}`}>
              {!isVisitor && <p className="mb-1 ml-1 text-xs font-semibold text-zinc-500">{agent?.display_name ?? "Australia Wide Wreckers"}</p>}
              <div className={`flex max-w-[88%] flex-col gap-1 ${isVisitor ? "items-end" : "items-start"}`}>
                {group.messages.map((m) => (
                  <Bubble
                    key={m.id}
                    m={m}
                    isVisitor={isVisitor}
                    urls={urls}
                    seen={m.id === lastVisitorSeenId}
                    onRetry={() => retry(m)}
                    onZoom={setLightbox}
                    submitForm={submitForm}
                    respondToOffer={respondToOffer}
                    sendImages={sendImages}
                    visitor={visitor}
                  />
                ))}
              </div>
              <p className="mt-0.5 px-1 text-[11px] text-zinc-400">{formatTime(group.messages[group.messages.length - 1].created_at)}</p>
            </div>
          );
        })}

        {agentTyping && (
          <div className="flex items-center gap-1.5 pl-1 text-xs text-zinc-500" aria-label="The team is typing">
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:240ms]" />
            </span>
            typing…
          </div>
        )}

        {needsContact && (
          <ContactCard
            onSave={async (v) => saveContact(v)}
            onSkip={() => setContactSkipped(true)}
          />
        )}

        {closed && (
          <ClosedCard
            rated={Boolean(conversation?.rating)}
            hasEmail={Boolean(visitor?.email)}
            onRate={rate}
            onTranscript={emailTranscript}
            onNew={startNew}
          />
        )}
      </div>

      {/* Composer */}
      {blocked ? (
        <div className="border-t border-ink/10 bg-white p-4 text-center text-sm text-zinc-600">
          Chat unavailable. Please call us on <a className="font-bold text-navy" href={site.phoneHref}>{site.phoneDisplay}</a>.
        </div>
      ) : (
        !closed && (
          <form onSubmit={submit} className="border-t border-ink/10 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {error && (
              <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700" role="alert">
                {error}
                <button type="button" className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
              </p>
            )}
            <div className="flex items-end gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                capture={undefined}
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  void sendImages(files);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={!hasConversation || uploading}
                aria-label="Attach photos"
                title={hasConversation ? "Attach photos" : "Send a message first, then add photos"}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy hover:bg-blue/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Camera className="h-5 w-5" aria-hidden />
              </button>
              <textarea
                ref={textRef}
                value={text}
                rows={1}
                maxLength={4000}
                placeholder={live || hasConversation ? "Type your message…" : "Type your message and we'll call you back"}
                aria-label="Message"
                onChange={(e) => {
                  setText(e.target.value);
                  sendTyping();
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={onKeyDown}
                className="max-h-[120px] min-h-[44px] flex-1 resize-none rounded-2xl border border-[#d9e3ee] bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-zinc-400 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15"
              />
              <button
                type="submit"
                disabled={!text.trim() || offlineNeedsContact}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-ink shadow disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-zinc-400">
              {uploading ? "Uploading photo…" : null}
              {!uploading && (
                <>
                  Chats are read by our team. <a href="/privacy-policy" className="underline">Privacy</a>
                </>
              )}
            </p>
          </form>
        )
      )}

      {lightbox && (
        <button
          type="button"
          onClick={() => setLightbox(null)}
          aria-label="Close photo"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/85 p-4 lg:rounded-3xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Photo from the chat" className="max-h-full max-w-full rounded-lg object-contain" />
        </button>
      )}
    </div>
  );
}

function Bubble({
  m, isVisitor, urls, seen, onRetry, onZoom, submitForm, respondToOffer, sendImages, visitor,
}: {
  m: ChatMessage;
  isVisitor: boolean;
  urls: Record<string, string>;
  seen: boolean;
  onRetry: () => void;
  onZoom: (url: string) => void;
  submitForm: (id: string, answers: Record<string, string>) => Promise<string | null>;
  respondToOffer: (id: string, action: "accept" | "decline" | "call_me") => Promise<string | null>;
  sendImages: (files: File[]) => Promise<void>;
  visitor: { name: string | null; email: string | null; phone: string | null } | null;
}) {
  const bubble = isVisitor
    ? "rounded-2xl rounded-br-md bg-navy text-white"
    : "rounded-2xl rounded-bl-md bg-white text-ink shadow-sm";

  if (m.type === "image") {
    return (
      <div className={`grid gap-1 ${m.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {m.attachments.map((a) => {
          const w = a.width ?? 4;
          const h = a.height ?? 3;
          return (
            <button
              key={a.path}
              type="button"
              onClick={() => urls[a.path] && onZoom(urls[a.path])}
              className="overflow-hidden rounded-xl bg-zinc-200"
              style={{ aspectRatio: `${w} / ${h}`, width: m.attachments.length > 1 ? "100%" : "min(240px, 100%)" }}
              aria-label="View photo"
            >
              {urls[a.path] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urls[a.path]} alt="Photo you sent" className="h-full w-full object-cover" />
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  if (m.type === "form_request") return <FormCard m={m} submitForm={submitForm} sendImages={sendImages} visitor={visitor} />;
  if (m.type === "offer") return <OfferCard m={m} respondToOffer={respondToOffer} />;

  if (m.type === "form_response") {
    return <div className={`${bubble} px-3.5 py-2 text-sm`}><Check className="mr-1 inline h-4 w-4 text-emerald-300" aria-hidden />{m.body}</div>;
  }

  return (
    <div className="flex flex-col items-end">
      <div className={`${bubble} whitespace-pre-wrap break-words px-3.5 py-2 text-[15px] leading-snug ${m.status === "failed" ? "opacity-60" : ""}`}>
        <Linkified text={m.body} />
      </div>
      {isVisitor && (
        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400">
          {m.status === "failed" ? (
            <button type="button" onClick={onRetry} className="font-semibold text-red-600 underline">Not sent. Retry</button>
          ) : m.status === "sending" ? (
            "Sending…"
          ) : seen ? (
            <><CheckCheck className="h-3.5 w-3.5 text-blue" aria-hidden /> Seen</>
          ) : (
            <><Check className="h-3.5 w-3.5" aria-hidden /> Sent</>
          )}
        </span>
      )}
    </div>
  );
}

function FormCard({
  m, submitForm, sendImages, visitor,
}: {
  m: ChatMessage;
  submitForm: (id: string, answers: Record<string, string>) => Promise<string | null>;
  sendImages: (files: File[]) => Promise<void>;
  visitor: { name: string | null; email: string | null; phone: string | null } | null;
}) {
  const kind = String(m.payload.kind ?? "");
  const done = Boolean(m.payload.done);
  const [v, setV] = useState<Record<string, string>>({
    name: visitor?.name ?? "",
    phone: visitor?.phone ?? "",
    email: visitor?.email ?? "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: string) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));

  const title = kind === "contact" ? "Your contact details" : kind === "vehicle" ? "Your vehicle details" : "Photos of your vehicle";

  if (done) {
    return <div className="rounded-2xl bg-white px-3.5 py-2 text-sm text-ink shadow-sm"><Check className="mr-1 inline h-4 w-4 text-emerald-600" aria-hidden />{title}: sent</div>;
  }

  const go = async (answers: Record<string, string>) => {
    setBusy(true);
    setErr(null);
    const problem = await submitForm(m.id, answers);
    setBusy(false);
    if (problem) setErr(problem);
  };

  return (
    <div className="w-[min(320px,100%)] space-y-2 rounded-2xl border border-blue/20 bg-white p-3.5 shadow-sm">
      <p className="text-sm font-bold text-ink">{title}</p>
      {m.body && <p className="text-sm text-zinc-600">{m.body}</p>}

      {kind === "contact" && (
        <>
          <input className={fieldClass} placeholder="Name" autoComplete="name" value={v.name} onChange={set("name")} />
          <input className={fieldClass} placeholder="Mobile number" inputMode="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} />
          <input className={fieldClass} placeholder="Email (optional)" inputMode="email" autoComplete="email" value={v.email} onChange={set("email")} />
          <button type="button" disabled={busy} onClick={() => void go({ name: v.name, phone: v.phone, email: v.email })} className="w-full rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-ink">Send details</button>
        </>
      )}

      {kind === "vehicle" && (
        <>
          <select className={fieldClass} value={v.vehicle_type ?? ""} onChange={set("vehicle_type")} aria-label="Vehicle type">
            <option value="">Vehicle type</option>
            {vehicleTypes.map((t) => <option key={t.id} value={t.label}>{t.label}</option>)}
          </select>
          <select className={fieldClass} value={v.vehicle_condition ?? ""} onChange={set("vehicle_condition")} aria-label="Condition">
            <option value="">Condition</option>
            {conditions.map((c) => <option key={c.id} value={c.label}>{c.label}</option>)}
          </select>
          <select className={fieldClass} value={v.vehicle_year ?? ""} onChange={set("vehicle_year")} aria-label="Year">
            <option value="">Year</option>
            {vehicleYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input className={fieldClass} placeholder="Make" value={v.vehicle_make ?? ""} onChange={set("vehicle_make")} />
            <input className={fieldClass} placeholder="Model" value={v.vehicle_model ?? ""} onChange={set("vehicle_model")} />
          </div>
          <input className={fieldClass} placeholder="Rego (optional)" value={v.rego ?? ""} onChange={set("rego")} />
          <div className="grid grid-cols-[1fr_6rem] gap-2">
            <input className={fieldClass} placeholder="Suburb" value={v.suburb ?? ""} onChange={set("suburb")} />
            <input className={fieldClass} placeholder="Postcode" inputMode="numeric" maxLength={4} value={v.postcode ?? ""} onChange={set("postcode")} />
          </div>
          <button type="button" disabled={busy} onClick={() => void go(v)} className="w-full rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-ink">Send details</button>
        </>
      )}

      {kind === "photos" && (
        <>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            setBusy(true);
            void sendImages(files).then(() => go({})).finally(() => setBusy(false));
          }} />
          <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-ink">
            <Camera className="h-4 w-4" aria-hidden /> Choose photos
          </button>
        </>
      )}
      {err && <p className="text-xs font-medium text-red-600" role="alert">{err}</p>}
    </div>
  );
}

function OfferCard({ m, respondToOffer }: { m: ChatMessage; respondToOffer: (id: string, a: "accept" | "decline" | "call_me") => Promise<string | null> }) {
  const amount = Number(m.payload.amount ?? 0);
  const note = String(m.payload.note ?? "");
  const validUntil = m.payload.valid_until ? new Date(String(m.payload.valid_until)) : null;
  const response = m.payload.response as string | undefined;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const act = async (a: "accept" | "decline" | "call_me") => {
    setBusy(true);
    setErr(null);
    const problem = await respondToOffer(m.id, a);
    setBusy(false);
    if (problem) setErr(problem);
  };

  return (
    <div className="w-[min(320px,100%)] rounded-2xl border-2 border-brand bg-white p-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500">
        <BadgeDollarSign className="h-4 w-4 text-brand-dark" aria-hidden /> Cash offer
      </p>
      <p className="mt-1 text-3xl font-extrabold text-ink">${amount.toLocaleString("en-AU", { maximumFractionDigits: 0 })}</p>
      {note && <p className="mt-1 text-sm text-zinc-600">{note}</p>}
      {validUntil && <p className="mt-1 text-xs text-zinc-500">Valid until {validUntil.toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "Australia/Sydney" })}</p>}
      <p className="mt-1 text-xs text-zinc-500">Final price confirmed when we inspect the vehicle.</p>
      {response ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
          {response === "accept" ? "You accepted this offer" : response === "decline" ? "You declined this offer" : "We'll call you back"}
        </p>
      ) : (
        <div className="mt-3 grid gap-2">
          <button type="button" disabled={busy} onClick={() => void act("accept")} className="rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-ink">Accept offer</button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" disabled={busy} onClick={() => void act("call_me")} className="rounded-full border border-navy/30 px-3 py-2 text-sm font-semibold text-navy">Call me</button>
            <button type="button" disabled={busy} onClick={() => void act("decline")} className="rounded-full border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-600">No thanks</button>
          </div>
        </div>
      )}
      {err && <p className="mt-2 text-xs font-medium text-red-600" role="alert">{err}</p>}
    </div>
  );
}

function ContactCard({ onSave, onSkip }: { onSave: (v: { name?: string; phone?: string; email?: string }) => Promise<string | null>; onSkip: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2 rounded-2xl border border-blue/20 bg-white p-3.5 shadow-sm">
      <p className="text-sm font-bold text-ink">So we can call you back with an offer</p>
      <input className={fieldClass} placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={fieldClass} placeholder="Mobile number" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input className={fieldClass} placeholder="Email (optional)" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {err && <p className="text-xs font-medium text-red-600" role="alert">{err}</p>}
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={onSkip} className="px-2 text-sm font-semibold text-zinc-500 underline">Skip</button>
        <button
          type="button"
          disabled={busy || (!phone.trim() && !email.trim())}
          onClick={async () => {
            setBusy(true);
            setErr(await onSave({ name: name.trim(), phone: phone.trim(), email: email.trim() }));
            setBusy(false);
          }}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function ClosedCard({
  rated, hasEmail, onRate, onTranscript, onNew,
}: {
  rated: boolean;
  hasEmail: boolean;
  onRate: (rating: number, comment: string) => Promise<void>;
  onTranscript: () => Promise<boolean>;
  onNew: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState<"idle" | "ok" | "fail">("idle");
  return (
    <div className="space-y-3 rounded-2xl border border-ink/10 bg-white p-4 text-center shadow-sm">
      <p className="text-sm font-bold text-ink">This chat has been closed</p>
      {!rated ? (
        <>
          <p className="text-sm text-zinc-600">How did we do?</p>
          <div className="flex justify-center gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)} className="p-1">
                <Star className={`h-7 w-7 ${n <= rating ? "fill-brand text-brand" : "text-zinc-300"}`} aria-hidden />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <>
              <textarea className={fieldClass} rows={2} placeholder="Anything to add? (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
              <button type="button" onClick={() => void onRate(rating, comment)} className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-ink">Send feedback</button>
            </>
          )}
        </>
      ) : (
        <p className="text-sm text-zinc-600">Thanks for your feedback!</p>
      )}
      <div className="flex flex-col gap-2 pt-1">
        {hasEmail && sent !== "ok" && (
          <button type="button" onClick={async () => setSent((await onTranscript()) ? "ok" : "fail")} className="text-sm font-semibold text-navy underline">
            {sent === "fail" ? "Couldn't send. Try again" : "Email me a transcript"}
          </button>
        )}
        {sent === "ok" && <p className="text-sm text-emerald-700">Transcript sent to your email.</p>}
        <button type="button" onClick={onNew} className="rounded-full border border-navy/30 px-5 py-2 text-sm font-bold text-navy">Start a new chat</button>
      </div>
    </div>
  );
}
