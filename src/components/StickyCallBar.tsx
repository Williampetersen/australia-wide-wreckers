import Link from "next/link";
import { PhoneCall, BadgeDollarSign } from "./Icons";
import { site } from "@/lib/site";

export function StickyCallBar() {
  return (
    <div className="shadow-soft-lg fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/8 bg-white/95 p-2 backdrop-blur-md lg:hidden">
      <a
        href={site.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white"
      >
        <PhoneCall className="h-4 w-4 text-brand" aria-hidden />
        Call Now
      </a>
      <Link
        href="/contact"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white"
      >
        <BadgeDollarSign className="h-4 w-4" aria-hidden />
        Free Quote
      </Link>
    </div>
  );
}
