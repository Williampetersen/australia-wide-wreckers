import { Container } from "../Container";
import { ShieldCheck, Clock, Truck, BadgeDollarSign } from "../Icons";
import { Stagger, StaggerItem } from "../motion/Stagger";

const badges = [
  { icon: Truck, label: "Free Same-Day Towing" },
  { icon: BadgeDollarSign, label: "Cash On The Spot" },
  { icon: ShieldCheck, label: "Licensed & Insured" },
  { icon: Clock, label: "7 Days A Week" },
];

export function TrustBadges() {
  return (
    <section className="border-b border-ink/5 bg-white py-10">
      <Container>
        <Stagger className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {badges.map(({ icon: Icon, label }) => (
            <StaggerItem key={label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-ink">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-bold text-ink-soft">{label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
