import { Container } from "../Container";
import { ShieldCheck, Clock, Truck, BadgeDollarSign } from "../Icons";
import { Stagger, StaggerItem } from "../motion/Stagger";

const badges = [
  { icon: Truck, label: "Free same-day towing" },
  { icon: BadgeDollarSign, label: "Cash on the spot" },
  { icon: ShieldCheck, label: "Licensed & insured" },
  { icon: Clock, label: "7 days a week" },
];

export function TrustBadges() {
  return (
    <section className="border-b border-ink/8 bg-white py-8">
      <Container>
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {badges.map(({ icon: Icon, label }) => (
            <StaggerItem key={label} className="flex items-center gap-2.5">
              <span className="bg-brand-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-ink">{label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
