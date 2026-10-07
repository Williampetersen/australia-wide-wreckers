import "server-only";
import { timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import webpush from "web-push";
import { getServiceClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

export function bearer(request: Request): string | null {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

/** Constant-time check of the shared secret Postgres sends with webhook/cron calls. */
export function verifyWebhook(request: Request): boolean {
  const secret = process.env.CHAT_WEBHOOK_SECRET;
  const token = bearer(request);
  if (!secret || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Verifies a Supabase JWT and returns the user, or null. */
export async function userFromRequest(request: Request) {
  const token = bearer(request);
  const supabase = getServiceClient();
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

/** Verifies the caller is an active agent (and optionally an admin/owner). */
export async function agentFromRequest(request: Request, requireAdmin = false) {
  const user = await userFromRequest(request);
  const supabase = getServiceClient();
  if (!user || !supabase) return null;
  const { data } = await supabase
    .from("agents")
    .select("user_id, display_name, role, active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data || !data.active) return null;
  if (requireAdmin && !["owner", "admin"].includes(data.role)) return null;
  return { user, agent: data };
}

export function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Small in-memory limiter. Serverless instances are short lived, so this only blunts bursts;
// the real per-visitor limits live in the database trigger.
const hits = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length <= limit;
}

export function clientIp(request: Request): string {
  return (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

export function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua) || /CriOS\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Unknown";
  const device = /iPad|Tablet/.test(ua) ? "Tablet" : /Mobi|iPhone|Android/.test(ua) ? "Mobile" : "Desktop";
  return { device, browser, os };
}

function decode(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function vercelLocation(request: Request) {
  return {
    city: decode(request.headers.get("x-vercel-ip-city")),
    region: decode(request.headers.get("x-vercel-ip-country-region")),
    country: decode(request.headers.get("x-vercel-ip-country")),
  };
}

export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return {
    resend: new Resend(apiKey),
    to: process.env.CONTACT_TO_EMAIL || site.email,
    from: process.env.CONTACT_FROM_EMAIL || "Australia Wide Wreckers <onboarding@resend.dev>",
  };
}

export async function sendEmail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  const cfg = emailConfig();
  if (!cfg) {
    console.error("RESEND_API_KEY is not configured: chat email was not sent.");
    return false;
  }
  try {
    const { error } = await cfg.resend.emails.send({
      from: cfg.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo ?? cfg.to,
    });
    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Chat email failed:", err);
    return false;
  }
}

/** Team email recipients: chat settings first, then CONTACT_TO_EMAIL, then the site email. */
export async function teamEmails(): Promise<string[]> {
  const supabase = getServiceClient();
  const fallback = process.env.CONTACT_TO_EMAIL || site.email;
  if (!supabase) return [fallback];
  const { data } = await supabase.from("chat_settings").select("notify_emails").eq("id", 1).maybeSingle();
  const list = (data?.notify_emails as string[] | undefined)?.filter(Boolean) ?? [];
  return list.length ? list : [fallback];
}

let vapidReady = false;
function ensureVapid(): boolean {
  if (vapidReady) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || `mailto:${site.email}`, pub, priv);
  vapidReady = true;
  return true;
}

export type PushPayload = { title: string; body: string; url: string; tag?: string; urgent?: boolean };

/** Sends a Web Push to the given agents (all push-enabled agents when `agentIds` is omitted). */
export async function pushToAgents(payload: PushPayload, agentIds?: string[]) {
  const supabase = getServiceClient();
  if (!supabase || !ensureVapid()) return { sent: 0, removed: 0 };

  let agentQuery = supabase.from("agents").select("user_id").eq("active", true).eq("notify_push", true);
  if (agentIds?.length) agentQuery = agentQuery.in("user_id", agentIds);
  const { data: agents } = await agentQuery;
  const ids = (agents ?? []).map((a) => a.user_id as string);
  if (!ids.length) return { sent: 0, removed: 0 };

  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .in("agent_id", ids);

  let sent = 0;
  const dead: string[] = [];
  await Promise.all(
    (subs ?? []).map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
          { TTL: 60 * 60, urgency: payload.urgent ? "high" : "normal" }
        );
        sent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) dead.push(sub.id);
        else console.error("Web push failed:", err);
      }
    })
  );
  if (dead.length) await supabase.from("push_subscriptions").delete().in("id", dead);
  if (sent) await supabase.from("push_subscriptions").update({ last_used_at: new Date().toISOString() }).in("agent_id", ids);
  return { sent, removed: dead.length };
}
