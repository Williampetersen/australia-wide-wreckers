"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Phone, Mail, MapPin, Monitor, X } from "lucide-react";
import { useAdmin } from "../AdminContext";
import { formatAuPhone } from "@/lib/chat/phone";
import { conditions, vehicleTypes, vehicleYears } from "@/lib/quote";
import { LEAD_STATUSES, timeAgo, visitorLabel, type Conversation, type LeadStatus } from "./types";

const field =
  "mt-1 w-full rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-sm text-ink focus:border-blue focus:outline-none";

export function DetailsPane({
  conversation, onChange, onClose,
}: {
  conversation: Conversation;
  onChange: (patch: Partial<Conversation>) => void;
  onClose?: () => void;
}) {
  const { supabase } = useAdmin();
  const v = conversation.visitor;
  const [previous, setPrevious] = useState<Pick<Conversation, "id" | "status" | "last_message_at" | "last_message_preview">[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState(conversation.notes ?? "");
  const [offer, setOffer] = useState(conversation.offer_amount?.toString() ?? "");

  useEffect(() => {
    let cancelled = false;
    void supabase
      .from("conversations")
      .select("id, status, last_message_at, last_message_preview")
      .eq("visitor_id", conversation.visitor_id)
      .neq("id", conversation.id)
      .order("last_message_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (!cancelled) setPrevious((data ?? []) as typeof previous);
      });
    return () => {
      cancelled = true;
    };
  }, [conversation.id, conversation.visitor_id, supabase]);

  const save = async (patch: Partial<Conversation>) => {
    onChange(patch);
    await supabase.from("conversations").update(patch).eq("id", conversation.id);
  };

  const addTag = async () => {
    const tag = tagInput.trim().toLowerCase().slice(0, 30);
    if (!tag || conversation.tags.includes(tag)) return setTagInput("");
    setTagInput("");
    await save({ tags: [...conversation.tags, tag] });
  };

  const utm = v ? Object.entries(v.utm ?? {}) : [];

  return (
    <div className="h-full space-y-5 overflow-y-auto bg-white p-4">
      {onClose && (
        <button type="button" onClick={onClose} className="ml-auto flex rounded-full p-1.5 hover:bg-zinc-100 xl:hidden" aria-label="Close details"><X className="h-5 w-5" aria-hidden /></button>
      )}

      <section>
        <p className="font-display text-lg font-bold text-ink">{visitorLabel(conversation)}</p>
        <div className="mt-2 space-y-1.5 text-sm">
          {v?.phone ? (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue" aria-hidden />
              <a href={`tel:${v.phone}`} className="font-bold text-navy underline">{formatAuPhone(v.phone)}</a>
              <a href={`sms:${v.phone}`} className="ml-auto flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:underline"><MessageSquare className="h-3.5 w-3.5" aria-hidden />SMS</a>
            </div>
          ) : (
            <p className="text-zinc-500">No phone yet. Use “Request contact”.</p>
          )}
          {v?.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue" aria-hidden /><a href={`mailto:${v.email}`} className="truncate underline">{v.email}</a></div>}
          {(v?.city || v?.region) && <div className="flex items-center gap-2 text-zinc-700"><MapPin className="h-4 w-4 text-blue" aria-hidden />{[v?.city, v?.region, v?.country].filter(Boolean).join(", ")}</div>}
          {v && <div className="flex items-center gap-2 text-zinc-700"><Monitor className="h-4 w-4 text-blue" aria-hidden />{[v.device, v.browser, v.os].filter(Boolean).join(" · ")}</div>}
        </div>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-zinc-600">
          <dt className="font-semibold">On page</dt><dd className="truncate">{v?.current_page ?? "—"}</dd>
          <dt className="font-semibold">Landed on</dt><dd className="truncate">{v?.landing_page ?? "—"}</dd>
          <dt className="font-semibold">Referrer</dt><dd className="truncate">{v?.referrer || "Direct"}</dd>
          {utm.map(([k, val]) => (<Fragment key={k}><dt className="font-semibold">{k.replace("utm_", "UTM ")}</dt><dd className="truncate">{val}</dd></Fragment>))}
          {v?.click_ids && Object.keys(v.click_ids).length > 0 && (<><dt className="font-semibold">Click ID</dt><dd className="truncate">{Object.keys(v.click_ids).join(", ")}</dd></>)}
          <dt className="font-semibold">First seen</dt><dd>{v ? new Date(v.first_seen_at).toLocaleString("en-AU", { timeZone: "Australia/Sydney" }) : "—"}</dd>
        </dl>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Lead</h3>
        <label className="block text-xs font-semibold">Status
          <select className={field} value={conversation.lead_status} onChange={(e) => void save({ lead_status: e.target.value as LeadStatus })}>
            {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-xs font-semibold">Vehicle type
            <select className={field} value={conversation.vehicle_type ?? ""} onChange={(e) => void save({ vehicle_type: e.target.value || null })}>
              <option value="">—</option>
              {vehicleTypes.map((t) => <option key={t.id} value={t.label}>{t.label}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold">Condition
            <select className={field} value={conversation.vehicle_condition ?? ""} onChange={(e) => void save({ vehicle_condition: e.target.value || null })}>
              <option value="">—</option>
              {conditions.map((c) => <option key={c.id} value={c.label}>{c.label}</option>)}
            </select>
          </label>
          <TextField label="Make" value={conversation.vehicle_make} onSave={(val) => save({ vehicle_make: val })} />
          <TextField label="Model" value={conversation.vehicle_model} onSave={(val) => save({ vehicle_model: val })} />
          <label className="block text-xs font-semibold">Year
            <select className={field} value={conversation.vehicle_year ?? ""} onChange={(e) => void save({ vehicle_year: e.target.value || null })}>
              <option value="">—</option>
              {vehicleYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <TextField label="Rego" value={conversation.rego} onSave={(val) => save({ rego: val?.toUpperCase() ?? null })} />
          <TextField label="Suburb" value={conversation.suburb} onSave={(val) => save({ suburb: val })} />
          <TextField label="Postcode" value={conversation.postcode} onSave={(val) => save({ postcode: val })} />
        </div>
        <label className="block text-xs font-semibold">Offer amount (AUD)
          <input className={field} inputMode="decimal" value={offer} onChange={(e) => setOffer(e.target.value.replace(/[^\d.]/g, ""))} onBlur={() => void save({ offer_amount: offer ? Number(offer) : null })} />
        </label>
        <label className="block text-xs font-semibold">Pickup date and time
          <input
            type="datetime-local"
            className={field}
            defaultValue={conversation.pickup_at ? new Date(conversation.pickup_at).toLocaleString("sv-SE", { timeZone: "Australia/Sydney" }).replace(" ", "T").slice(0, 16) : ""}
            onBlur={(e) => void save({ pickup_at: e.target.value ? new Date(`${e.target.value}:00+10:00`).toISOString() : null })}
          />
        </label>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Tags</h3>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {conversation.tags.map((t) => (
            <button key={t} type="button" onClick={() => void save({ tags: conversation.tags.filter((x) => x !== t) })} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-red-50" aria-label={`Remove tag ${t}`}>
              {t} ×
            </button>
          ))}
        </div>
        <input className={field} placeholder="Add a tag and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void addTag(); } }} />
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Private notes</h3>
        <textarea className={field} rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => void save({ notes: notes || null })} placeholder="Only your team sees this." />
      </section>

      {previous.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Previous conversations</h3>
          <ul className="mt-1.5 space-y-1.5">
            {previous.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/inbox/${p.id}`} className="block rounded-lg border border-ink/10 px-2.5 py-2 text-xs hover:bg-zinc-50">
                  <span className="font-semibold">{timeAgo(p.last_message_at)} ago</span> · {p.status}
                  <span className="block truncate text-zinc-500">{p.last_message_preview}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TextField({ label, value, onSave }: { label: string; value: string | null; onSave: (v: string | null) => void }) {
  const [v, setV] = useState(value ?? "");
  return (
    <label className="block text-xs font-semibold">{label}
      <input className={field} value={v} onChange={(e) => setV(e.target.value)} onBlur={() => onSave(v.trim() || null)} />
    </label>
  );
}
