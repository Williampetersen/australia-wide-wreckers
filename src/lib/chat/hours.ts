export type DayHours = { open: string; close: string } | null;
export type BusinessHours = Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", DayHours>;

const KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

type LocalParts = { year: number; month: number; day: number; hour: number; minute: number; dow: number };

/** Wall-clock parts of `date` in the given IANA timezone (handles daylight saving). */
export function localParts(date: Date, timeZone: string): LocalParts {
  const fmt = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    weekday: "short",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    dow: weekdays.indexOf(String(parts.weekday)),
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function isWithinHours(date: Date, hours: BusinessHours, timeZone: string): boolean {
  const p = localParts(date, timeZone);
  const day = hours[KEYS[p.dow]];
  if (!day) return false;
  const now = p.hour * 60 + p.minute;
  return now >= toMinutes(day.open) && now < toMinutes(day.close);
}

/** UTC instant for a wall-clock time in `timeZone` (iterates to settle on DST boundaries). */
function zonedToUtc(year: number, month: number, day: number, minutes: number, timeZone: string): Date {
  const target = Date.UTC(year, month - 1, day, 0, minutes);
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const p = localParts(new Date(guess), timeZone);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
    guess += target - asUtc;
  }
  return new Date(guess);
}

/** Next opening instant strictly after `date` (null if the week has no opening hours). */
export function nextOpenAt(date: Date, hours: BusinessHours, timeZone: string): Date | null {
  const start = localParts(date, timeZone);
  for (let i = 0; i < 8; i++) {
    const probe = new Date(Date.UTC(start.year, start.month - 1, start.day + i, 12));
    const day = hours[KEYS[probe.getUTCDay()]];
    if (!day) continue;
    const at = zonedToUtc(
      probe.getUTCFullYear(),
      probe.getUTCMonth() + 1,
      probe.getUTCDate(),
      toMinutes(day.open),
      timeZone
    );
    if (at.getTime() > date.getTime()) return at;
  }
  return null;
}

/** "9:00 am today", "9:00 am tomorrow" or "9:00 am Monday", in the business timezone. */
export function describeOpening(opening: Date, now: Date, timeZone: string): string {
  const p = localParts(opening, timeZone);
  const hour12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  const time = `${hour12}:${String(p.minute).padStart(2, "0")} ${p.hour < 12 ? "am" : "pm"}`;
  const a = localParts(now, timeZone);
  const dayDiff = Math.round(
    (Date.UTC(p.year, p.month - 1, p.day) - Date.UTC(a.year, a.month - 1, a.day)) / 86_400_000
  );
  if (dayDiff === 0) return `${time} today`;
  if (dayDiff === 1) return `${time} tomorrow`;
  const weekday = new Intl.DateTimeFormat("en-AU", { timeZone, weekday: "long" }).format(opening);
  return `${time} ${weekday}`;
}
