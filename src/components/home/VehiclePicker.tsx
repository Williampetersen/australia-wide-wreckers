import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "../Container";
import { vehicleTypes } from "@/lib/quote";

export function VehiclePicker() {
  return (
    <section className="relative z-10 -mt-6 pb-6 sm:-mt-10">
      <Container>
        <div className="rounded-3xl border border-[#d9e3ee] bg-white p-6 shadow-[0_24px_80px_rgba(0,35,80,0.14)] sm:p-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue">Step 1 of 5</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-ink sm:text-3xl">We buy all types of vehicles</h2>
              <p className="mt-1 text-base text-zinc-600">Choose what you want to sell and get your cash offer.</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {vehicleTypes.map((type) => {
              return (
                <Link
                  key={type.id}
                  href={`/get-quote?type=${type.id}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-[#d9e3ee] bg-white p-4 text-center transition hover:-translate-y-1 hover:border-blue hover:shadow-[0_18px_40px_rgba(0,113,194,0.14)]"
                >
                  <span className="relative block h-16 w-full">
                    <Image src={type.image} alt="" fill sizes="160px" className="object-contain" />
                  </span>
                  <span className="text-sm font-bold text-ink">{type.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-[#e6edf5] pt-6 sm:flex-row">
            <p className="text-sm text-zinc-500">Running, damaged, old or scrap. We take it all.</p>
            <Link
              href="/get-quote"
              className="cta-alive inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3 text-sm font-bold text-navy shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition hover:brightness-105"
            >
              Start my cash offer
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
