export type Segment = { type: "text" | "url" | "phone"; value: string; href?: string };

const PATTERN = /(https?:\/\/[^\s<>"']+)|((?:\+?61|0)[\d\s()-]{8,14}\d)/g;

/** Splits plain text into text/url/phone segments. Never produces HTML. */
export function linkify(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ type: "text", value: text.slice(last, index) });
    const raw = match[0];
    if (match[1]) {
      const trimmed = raw.replace(/[.,;:!?)]+$/, "");
      out.push({ type: "url", value: trimmed, href: trimmed });
      if (trimmed.length < raw.length) out.push({ type: "text", value: raw.slice(trimmed.length) });
    } else {
      const digits = raw.replace(/[^\d+]/g, "");
      out.push({ type: "phone", value: raw, href: `tel:${digits}` });
    }
    last = index + raw.length;
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}
