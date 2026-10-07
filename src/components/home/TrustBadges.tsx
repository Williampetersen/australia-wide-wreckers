import { Container } from "../Container";
import { Clock, Truck, BadgeDollarSign, MapPin } from "../Icons";
import { Stagger, StaggerItem } from "../motion/Stagger";

const badges = [
  { icon: Truck, label: "Free Same-Day Towing", sub: "No callout fees", tone: "bg-blue/10 text-blue" },
  { icon: BadgeDollarSign, label: "Cash On The Spot", sub: "Paid on pick-up", tone: "bg-cash/15 text-cash-dark" },
  { icon: MapPin, label: "Two Depots Across NSW", sub: "Muswellbrook & Morisset", tone: "bg-brand/20 text-ink" },
  { icon: Clock, label: "Open Six Days", sub: "Mon – Sat, 9am – 5pm", tone: "bg-navy/10 text-navy" },
];

export function TrustBadges() {
  return (
    <section className="border-b border-ink/5 bg-white py-10">
      <Container>
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {badges.map(({ icon: Icon, label, sub, tone }) => (
            <StaggerItem
              key={label}
              className="group flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_6px_24px_rgba(0,35,80,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,35,80,0.12)]"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:-rotate-6 ${tone}`}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold leading-tight text-ink">{label}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">{sub}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
