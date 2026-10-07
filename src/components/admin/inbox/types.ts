export type Visitor = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  first_seen_at: string;
  last_seen_at: string;
  current_page: string | null;
  landing_page: string | null;
  referrer: string | null;
  utm: Record<string, string>;
  click_ids: Record<string, string>;
  city: string | null;
  region: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  blocked_at: string | null;
  blocked_reason: string | null;
};

export type LeadStatus = "new" | "contacted" | "offer_sent" | "offer_accepted" | "pickup_booked" | "purchased" | "lost";

export const LEAD_STATUSES: { id: LeadStatus; label: string; tone: string }[] = [
  { id: "new", label: "New", tone: "bg-blue/10 text-blue" },
  { id: "contacted", label: "Contacted", tone: "bg-zinc-200 text-zinc-700" },
  { id: "offer_sent", label: "Offer sent", tone: "bg-amber-100 text-amber-800" },
  { id: "offer_accepted", label: "Offer accepted", tone: "bg-emerald-100 text-emerald-800" },
  { id: "pickup_booked", label: "Pickup booked", tone: "bg-emerald-200 text-emerald-900" },
  { id: "purchased", label: "Purchased", tone: "bg-navy text-white" },
  { id: "lost", label: "Lost", tone: "bg-red-100 text-red-700" },
];

export type Conversation = {
  id: string;
  visitor_id: string;
  status: "open" | "pending" | "closed";
  assigned_agent_id: string | null;
  source_page: string | null;
  vehicle_type: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  vehicle_condition: string | null;
  rego: string | null;
  suburb: string | null;
  postcode: string | null;
  lead_status: LeadStatus;
  offer_amount: number | null;
  pickup_at: string | null;
  tags: string[];
  notes: string | null;
  last_message_at: string;
  last_message_preview: string | null;
  last_message_sender: "visitor" | "agent" | "system" | null;
  unread_for_agents: number;
  first_response_at: string | null;
  created_at: string;
  visitor?: Visitor | null;
};

export type TeamMember = { user_id: string; display_name: string; avatar_url: string | null; role: string; status: string; active: boolean };

export type Canned = { id: string; shortcut: string; title: string; body: string };

export type InboxFilter = "unassigned" | "mine" | "open" | "pending" | "offers" | "closed";

export const FILTERS: { id: InboxFilter; label: string }[] = [
  { id: "unassigned", label: "Unassigned" },
  { id: "mine", label: "Mine" },
  { id: "open", label: "All open" },
  { id: "pending", label: "Pending" },
  { id: "offers", label: "Offers" },
  { id: "closed", label: "Closed" },
];

export function visitorLabel(c: Pick<Conversation, "id" | "visitor">) {
  return c.visitor?.name || c.visitor?.phone || `Visitor #${c.id.slice(0, 4)}`;
}

export function timeAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
