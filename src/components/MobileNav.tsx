"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, PhoneCall } from "./Icons";
import { NAV_LINKS, site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-lg font-semibold text-ink-soft hover:bg-zinc-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href={site.phoneHref}
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-bold text-ink"
            >
              <PhoneCall className="h-5 w-5" aria-hidden />
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
