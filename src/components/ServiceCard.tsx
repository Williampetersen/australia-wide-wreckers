import Link from "next/link";
import { Service } from "@/lib/services";
import { ServiceIcons, ChevronRight } from "./Icons";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ServiceIcons[service.icon];

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-soft"
    >
      <span className="bg-brand-soft flex h-12 w-12 items-center justify-center rounded-xl text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="font-display mt-5 text-xl text-ink">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {service.shortDescription}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand transition-colors group-hover:text-brand-dark">
        Learn more
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
