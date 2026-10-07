"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { formatAuPhone } from "@/lib/chat/phone";
import { LEAD_STATUSES, visitorLabel, type Conversation, type LeadStatus } from "./inbox/types";

type Row = {
  key: string;
  source: "chat" | "quote";
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  suburb: string;
  status: LeadStatus;
  offer: number | null;
};

type QuoteRow = {
  id: string; created_at: string; name: string | null; phone: string | null; email: string | null;
  make: string | null; model: string | null; car_model: string | null; car_year: string | null;
  vehicle_type: string | null; suburb: string | null; status: LeadStatus;
};

export function LeadsApp() {
  const { supabase } = useAdmin();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [convs, quotes] = await Promise.all([
      supabase.from("conversations").select("*, visitor:visitors(*)").order("created_at", { ascending: false }).limit(500),
      supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    const chat: Row[] = ((convs.data ?? []) as unknown as Conversation[])
      .filter((c) => c.visitor?.phone || c.visitor?.email)
      .map((c) => ({
        key: `c-${c.id}`, source: "chat", id: c.id, created_at: c.created_at,
        name: visitorLabel(c), phone: c.visitor?.phone ? formatAuPhone(c.visitor.phone) : "", email: c.visitor?.email ?? "",
        vehicle: [c.vehicle_year, c.vehicle_make, c.vehicle_model].filter(Boolean).join(" ") || c.vehicle_type || "",
        suburb: c.suburb ?? "", status: c.lead_status, offer: c.offer_amount,
      }));
    const form: Row[] = ((quotes.data ?? []) as QuoteRow[]).map((q) => ({
      key: `q-${q.id}`, source: "quote", id: q.id, created_at: q.created_at,
      name: q.name ?? "", phone: q.phone ?? "", email: q.email ?? "",
      vehicle: [q.car_year, q.make, q.model].filter(Boolean).join(" ") || q.car_model || q.vehicle_type || "",
      suburb: q.suburb ?? "", status: q.status, offer: null,
    }));
    setRows([...chat, ...form].sort((a, b) => b.created_at.localeCompare(a.created_at)));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (status !== "all" && r.status !== status) return false;
        if (source !== "all" && r.source !== source) return false;
        if (from && r.created_at < new Date(`${from}T00:00:00+10:00`).toISOString()) return false;
        if (to && r.created_at > new Date(`${to}T23:59:59+10:00`).toISOString()) return false;
        return true;
      }),
    [rows, status, source, from, to]
  );

  const changeStatus = async (r: Row, next: LeadStatus) => {
    setRows((list) => list.map((x) => (x.key === r.key ? { ...x, status: next } : x)));
    await supabase.from(r.source === "chat" ? "conversations" : "quote_requests").update(r.source === "chat" ? { lead_status: next } : { status: next }).eq("id", r.id);
  };

  const exportCsv = () => {
    const esc = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["Date", "Source", "Name", "Phone", "Email", "Vehicle", "Suburb", "Status", "Offer"];
    const lines = filtered.map((r) =>
      [new Date(r.created_at).toLocaleString("en-AU", { timeZone: "Australia/Sydney" }), r.source, r.name, r.phone, r.email, r.vehicle, r.suburb, r.status, r.offer].map(esc).join(",")
    );
    const blob = new Blob([[header.map(esc).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const input = "rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-sm";

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="font-display mr-auto text-2xl font-bold text-ink">Leads</h1>
        <label className="text-xs font-semibold">Status
          <select className={`${input} mt-1 block`} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold">Source
          <select className={`${input} mt-1 block`} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="all">All</option><option value="chat">Live chat</option><option value="quote">Quote form</option>
          </select>
        </label>
        <label className="text-xs font-semibold">From<input type="date" className={`${input} mt-1 block`} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-xs font-semibold">To<input type="date" className={`${input} mt-1 block`} value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button type="button" onClick={exportCsv} className="flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-bold text-white"><Download className="h-4 w-4" aria-hidden />CSV</button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>{["Date", "Source", "Name", "Phone", "Vehicle", "Suburb", "Status", ""].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {filtered.map((r) => (
              <tr key={r.key} className="hover:bg-zinc-50">
                <td className="whitespace-nowrap px-3 py-2.5 text-zinc-600">{new Date(r.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "Australia/Sydney" })}</td>
                <td className="px-3 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.source === "chat" ? "bg-blue/10 text-blue" : "bg-brand/25 text-ink"}`}>{r.source === "chat" ? "Chat" : "Form"}</span></td>
                <td className="px-3 py-2.5 font-semibold text-ink">{r.name}<span className="block text-xs font-normal text-zinc-500">{r.email}</span></td>
                <td className="whitespace-nowrap px-3 py-2.5">{r.phone ? <a className="font-semibold text-navy underline" href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a> : "—"}</td>
                <td className="px-3 py-2.5 text-zinc-700">{r.vehicle || "—"}{r.offer ? <span className="block text-xs font-semibold text-emerald-700">Offer ${r.offer}</span> : null}</td>
                <td className="px-3 py-2.5 text-zinc-700">{r.suburb || "—"}</td>
                <td className="px-3 py-2.5">
                  <select aria-label="Lead status" className={input} value={r.status} onChange={(e) => void changeStatus(r, e.target.value as LeadStatus)}>
                    {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5">{r.source === "chat" && <Link href={`/admin/inbox/${r.id}`} className="text-sm font-semibold text-navy underline">Open chat</Link>}</td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-zinc-500">No leads match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
