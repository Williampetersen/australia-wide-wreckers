import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { describeOpening, nextOpenAt, type BusinessHours } from "@/lib/chat/hours";

/** Public widget settings + live availability. Cached briefly at the edge. */
export async function GET() {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ enabled: false }, { status: 200 });
  }

  const [{ data: settings }, { data: availability }] = await Promise.all([
    supabase.from("chat_public_settings").select("*").maybeSingle(),
    supabase.rpc("chat_availability"),
  ]);
  if (!settings) {
    return NextResponse.json({ enabled: false }, { status: 200 });
  }

  const now = new Date();
  const tz = settings.timezone as string;
  const next = availability?.live
    ? null
    : nextOpenAt(now, settings.business_hours as BusinessHours, tz);

  return NextResponse.json(
    {
      enabled: true,
      settings,
      live: Boolean(availability?.live),
      next_open_at: next?.toISOString() ?? null,
      next_open_text: next ? describeOpening(next, now, tz) : null,
    },
    { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" } }
  );
}
