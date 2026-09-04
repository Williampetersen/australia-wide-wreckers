import Image from "next/image";
import { Container } from "../Container";

const BRAND_COUNT = 28;
const brands = Array.from({ length: BRAND_COUNT }, (_, i) => `/images/brands/brand-${i + 1}.png`);

export function BrandStrip() {
  return (
    <section className="border-y border-ink/8 bg-zinc-50 py-10">
      <Container>
        <p className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
          We buy all makes and models
        </p>
      </Container>
      <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[brand-scroll_36s_linear_infinite] items-center gap-12">
          {[...brands, ...brands].map((src, i) => (
            <div key={i} className="relative h-10 w-10 shrink-0 opacity-70 grayscale">
              <Image src={src} alt="" fill className="object-contain" sizes="40px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
