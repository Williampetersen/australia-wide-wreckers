"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "./AdminContext";

type Analytics = {
  chats_per_day: { day: string; count: number }[];
  total_chats: number;
  missed_chats: number;
  median_first_response_seconds: number | null;
  median_resolution_seconds: number | null;
  heatmap: { dow: number; hour: number; count: number }[];
  top_pages: { page: string; count: number }[];
  top_sources: { source: string; count: number }[];
  leads_captured: number;
  offers_sent: number;
  offers_accepted: number;
  pickups_booked: number;
  avg_rating: number | null;
  per_agent: { agent_id: string; name: string; chats: number; messages: number }[];
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function duration(seconds: number | null) {
  if (seconds == null) return "—";
  if (seconds < 90) return `${Math.round(seconds)}s`;
  if (seconds < 5400) return `${Math.round(seconds / 60)} min`;
  return `${(seconds / 3600).toFixed(1)} h`;
}

function sydneyDay(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return d.toLocaleDateString("sv-SE", { timeZone: "Australia/Sydney" });
}

export function AnalyticsApp() {
  const { supabase } = useAdmin();
  const [from, setFrom] = useState(() => sydneyDay(-29));
  const [to, setTo] = useState(() => sydneyDay(0));
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setError(null);
      const { data: res, error: err } = await supabase.rpc("admin_analytics", {
        p_from: new Date(`${from}T00:00:00+10:00`).toISOString(),
        p_to: new Date(new Date(`${to}T00:00:00+10:00`).getTime() + 86_400_000).toISOString(),
      });
      if (cancelled) return;
      if (err) setError("Could not load analytics.");
      else setData(res as Analytics);
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [from, to, supabase]);

  const maxDay = useMemo(() => Math.max(1, ...(data?.chats_per_day ?? []).map((d) => d.count)), [data]);
  const heat = useMemo(() => {
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const h of data?.heatmap ?? []) grid[h.dow][h.hour] = h.count;
    return { grid, max: Math.max(1, ...grid.flat()) };
  }, [data]);

  const stat = (label: string, value: string | number) => (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
    </div>
  );

  return (
    <div className="h-full space-y-5 overflow-y-auto p-4 lg:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="font-display mr-auto text-2xl font-bold text-ink">Analytics</h1>
        <label className="text-xs font-semibold">From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 block rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-sm" /></label>
        <label className="text-xs font-semibold">To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-sm" /></label>
      </div>
      <p className="-mt-2 text-xs text-zinc-500">Times are shown in Sydney time.</p>
      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
      {!data && !error && <p className="text-sm text-zinc-500">Loading…</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stat("Chats", data.total_chats)}
            {stat("Missed chats", data.missed_chats)}
            {stat("Median first response", duration(data.median_first_response_seconds))}
            {stat("Median resolution", duration(data.median_resolution_seconds))}
            {stat("Leads captured", data.leads_captured)}
            {stat("Offers sent / accepted", `${data.offers_sent} / ${data.offers_accepted}`)}
            {stat("Pickups booked", data.pickups_booked)}
            {stat("Average rating", data.avg_rating ? `${data.avg_rating} / 5` : "—")}
          </div>

          <section className="rounded-2xl border border-ink/10 bg-white p-4">
            <h2 className="font-display font-bold text-ink">Chats per day</h2>
            {data.chats_per_day.length ? (
              <svg viewBox={`0 0 ${Math.max(300, data.chats_per_day.length * 24)} 140`} className="mt-3 h-40 w-full" role="img" aria-label="Chats per day bar chart" preserveAspectRatio="none">
                {data.chats_per_day.map((d, i) => {
                  const h = (d.count / maxDay) * 110;
                  return (
                    <g key={d.day}>
                      <rect x={i * 24 + 4} y={120 - h} width={16} height={h} rx={3} fill="#003580"><title>{`${d.day}: ${d.count}`}</title></rect>
                    </g>
                  );
                })}
              </svg>
            ) : <p className="mt-3 text-sm text-zinc-500">No chats in this period.</p>}
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-4">
            <h2 className="font-display font-bold text-ink">Busiest times</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="text-[10px]" aria-label="Chats by weekday and hour">
                <thead><tr><th />{Array.from({ length: 24 }, (_, h) => <th key={h} className="px-0.5 font-medium text-zinc-500">{h}</th>)}</tr></thead>
                <tbody>
                  {heat.grid.map((row, d) => (
                    <tr key={DAYS[d]}>
                      <th className="pr-2 text-right font-semibold text-zinc-600">{DAYS[d]}</th>
                      {row.map((n, h) => (
                        <td key={h} title={`${DAYS[d]} ${h}:00, ${n} chats`} className="h-5 w-5 rounded-sm" style={{ background: n ? `rgba(0,53,128,${0.15 + (n / heat.max) * 0.85})` : "#f4f4f5" }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-ink/10 bg-white p-4">
              <h2 className="font-display font-bold text-ink">Top pages that start chats</h2>
              <ul className="mt-2 divide-y divide-ink/5 text-sm">{data.top_pages.map((p) => <li key={p.page} className="flex justify-between gap-3 py-1.5"><span className="truncate">{p.page}</span><b>{p.count}</b></li>)}</ul>
            </section>
            <section className="rounded-2xl border border-ink/10 bg-white p-4">
              <h2 className="font-display font-bold text-ink">Traffic sources</h2>
              <ul className="mt-2 divide-y divide-ink/5 text-sm">{data.top_sources.map((p) => <li key={p.source} className="flex justify-between gap-3 py-1.5"><span className="truncate">{p.source}</span><b>{p.count}</b></li>)}</ul>
            </section>
          </div>

          <section className="rounded-2xl border border-ink/10 bg-white p-4">
            <h2 className="font-display font-bold text-ink">Team</h2>
            <table className="mt-2 w-full text-sm">
              <thead className="text-left text-xs uppercase text-zinc-500"><tr><th className="py-1.5">Agent</th><th>Chats assigned</th><th>Messages sent</th></tr></thead>
              <tbody className="divide-y divide-ink/5">{data.per_agent.map((a) => <tr key={a.agent_id}><td className="py-1.5 font-semibold">{a.name}</td><td>{a.chats}</td><td>{a.messages}</td></tr>)}</tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
