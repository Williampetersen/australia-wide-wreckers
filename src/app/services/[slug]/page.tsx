import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { ServiceCard } from "@/components/ServiceCard";
import { CheckCircle2, ServiceIcons } from "@/components/Icons";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { services, getServiceBySlug } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage(
  props: PageProps<"/services/[slug]">
) {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = ServiceIcons[service.icon];
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Service" title={service.name} description={service.description} />

      <section className="pt-20 sm:pt-28">
        <Container>
          <FadeIn className="relative h-64 w-full overflow-hidden rounded-3xl bg-zinc-50 sm:h-80">
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-contain p-6"
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          </FadeIn>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-brand">
              <Icon className="h-7 w-7" aria-hidden />
            </span>
            <h2 className="font-display mt-6 text-2xl font-bold text-ink">
              What&apos;s included
            </h2>
            <ul className="mt-6 space-y-4">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cash-dark" aria-hidden />
                  <span className="text-base leading-relaxed text-zinc-700">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <aside className="rounded-3xl border border-ink/8 bg-zinc-50 p-7 lg:sticky lg:top-28 lg:h-fit">
            <h3 className="font-display text-lg font-bold text-ink">
              Explore other services
            </h3>
            <div className="mt-5 flex flex-col gap-3">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="rounded-2xl border border-ink/8 bg-white px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-brand hover:text-ink"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-zinc-50 py-20 sm:py-28">
        <Container>
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-ink">
              Other services you might need
            </h2>
          </FadeIn>
          <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
