"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

// Matches site.hours: Monday–Saturday 9:00 AM–5:00 PM, Sunday closed (Sydney time).
const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;

function isOpenNow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  return weekday !== "Sun" && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

// Rendered only after mount so the server and browser never disagree about the time.
export function OpenNow({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenNow(new Date()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  if (open === null) return null;

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/95 px-4 py-2 text-sm font-semibold text-ink shadow-sm ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5" aria-hidden>
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping ${
            open ? "bg-emerald-400" : "bg-zinc-300"
          }`}
        />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${open ? "bg-emerald-500" : "bg-zinc-400"}`} />
      </span>
      {open ? (
        <span>
          Open now · <a href={site.landlineHref} className="text-blue underline-offset-2 hover:underline">{site.landlineDisplay}</a>
        </span>
      ) : (
        <span>Closed now · open Mon–Sat, 9 AM–5 PM</span>
      )}
    </div>
  );
}
