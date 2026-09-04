import Link from "next/link";
import { PhoneCall, BadgeDollarSign } from "./Icons";
import { site } from "@/lib/site";

export function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.15)] lg:hidden">
      <a
        href={site.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 bg-ink py-3.5 text-sm font-bold text-white"
      >
        <PhoneCall className="h-4 w-4 text-brand" aria-hidden />
        Call Now
      </a>
      <Link
        href="/contact"
        className="flex flex-1 items-center justify-center gap-2 bg-brand py-3.5 text-sm font-bold text-ink"
      >
        <BadgeDollarSign className="h-4 w-4" aria-hidden />
        Free Quote
      </Link>
    </div>
  );
}
