"use client";

import { useState } from "react";
import { Faq } from "@/lib/faqs";
import { ChevronRight } from "./Icons";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-bold text-ink sm:text-lg">
                {item.question}
              </span>
              <ChevronRight
                className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${
                  isOpen ? "rotate-90 text-brand-dark" : ""
                }`}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-sm leading-relaxed text-zinc-600 sm:text-base">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
