import { describe, expect, it } from "vitest";
import { normaliseAuPhone, formatAuPhone } from "./phone";
import { describeOpening, isWithinHours, nextOpenAt, type BusinessHours } from "./hours";
import { groupMessages, upsertMessage, lastSeq, type ChatMessage } from "./messages";
import { fillCanned } from "./canned";
import { linkify } from "./linkify";

const TZ = "Australia/Sydney";
const day = { open: "09:00", close: "17:00" };
const hours: BusinessHours = { mon: day, tue: day, wed: day, thu: day, fri: day, sat: day, sun: null };

describe("normaliseAuPhone", () => {
  it.each([
    ["0412 345 678", "+61412345678"],
    ["04 1234 5678", "+61412345678"],
    ["+61 412 345 678", "+61412345678"],
    ["61412345678", "+61412345678"],
    ["0061412345678", "+61412345678"],
    ["(02) 6541 1711", "+61265411711"],
  ])("normalises %s", (input, expected) => {
    expect(normaliseAuPhone(input)).toBe(expected);
  });

  it.each(["", "12345", "0112345678", "+1 415 555 2671", "04123456", "abc"])("rejects %s", (input) => {
    expect(normaliseAuPhone(input)).toBeNull();
  });

  it("formats numbers for display", () => {
    expect(formatAuPhone("+61412345678")).toBe("0412 345 678");
    expect(formatAuPhone("+61265411711")).toBe("(02) 6541 1711");
  });
});

describe("business hours (Australia/Sydney)", () => {
  // 2026-10-05 is a Monday; daylight saving (UTC+11) started on Sunday 4 October 2026.
  it("is open at 10:00 Sydney time on a weekday", () => {
    expect(isWithinHours(new Date("2026-10-05T10:00:00+11:00"), hours, TZ)).toBe(true);
  });
  it("is closed before 9:00 and at 17:00 exactly", () => {
    expect(isWithinHours(new Date("2026-10-05T08:59:00+11:00"), hours, TZ)).toBe(false);
    expect(isWithinHours(new Date("2026-10-05T17:00:00+11:00"), hours, TZ)).toBe(false);
  });
  it("is closed on Sunday", () => {
    expect(isWithinHours(new Date("2026-10-11T12:00:00+11:00"), hours, TZ)).toBe(false);
  });
  it("finds the next opening after Saturday close as Monday 9:00", () => {
    const next = nextOpenAt(new Date("2026-10-10T18:00:00+11:00"), hours, TZ);
    expect(next?.toISOString()).toBe(new Date("2026-10-12T09:00:00+11:00").toISOString());
  });
  it("handles the daylight saving switch (clocks go forward on Sun 4 Oct 2026)", () => {
    // Saturday 3 Oct is AEST (+10); Monday 5 Oct is AEDT (+11).
    const next = nextOpenAt(new Date("2026-10-03T18:00:00+10:00"), hours, TZ);
    expect(next?.toISOString()).toBe(new Date("2026-10-05T09:00:00+11:00").toISOString());
  });
  it("describes openings relative to now", () => {
    const now = new Date("2026-10-05T07:00:00+11:00");
    expect(describeOpening(new Date("2026-10-05T09:00:00+11:00"), now, TZ)).toBe("9:00 am today");
    expect(describeOpening(new Date("2026-10-06T09:00:00+11:00"), now, TZ)).toBe("9:00 am tomorrow");
    expect(describeOpening(new Date("2026-10-08T09:00:00+11:00"), now, TZ)).toBe("9:00 am Thursday");
  });
});

function msg(partial: Partial<ChatMessage> & { id: string }): ChatMessage {
  return {
    conversation_id: "c1",
    sender_type: "visitor",
    sender_agent_id: null,
    type: "text",
    body: "hi",
    attachments: [],
    payload: {},
    is_internal: false,
    created_at: "2026-10-05T10:00:00Z",
    ...partial,
  };
}

describe("message helpers", () => {
  it("groups consecutive messages from the same sender", () => {
    const groups = groupMessages([
      msg({ id: "1", created_at: "2026-10-05T10:00:00Z" }),
      msg({ id: "2", created_at: "2026-10-05T10:01:00Z" }),
      msg({ id: "3", sender_type: "agent", sender_agent_id: "a1", created_at: "2026-10-05T10:02:00Z" }),
      msg({ id: "4", created_at: "2026-10-05T10:30:00Z" }),
    ]);
    expect(groups.map((g) => g.messages.length)).toEqual([2, 1, 1]);
  });

  it("keeps internal notes out of visitor groups and system messages alone", () => {
    const groups = groupMessages([
      msg({ id: "1", sender_type: "agent", sender_agent_id: "a1" }),
      msg({ id: "2", sender_type: "agent", sender_agent_id: "a1", is_internal: true }),
      msg({ id: "3", sender_type: "system", type: "system" }),
      msg({ id: "4", sender_type: "system", type: "system" }),
    ]);
    expect(groups.map((g) => g.messages.length)).toEqual([1, 1, 1, 1]);
  });

  it("replaces the optimistic copy when the realtime echo arrives and dedupes", () => {
    const optimistic = msg({ id: "x", status: "sending" });
    const echoed = msg({ id: "x", seq: 7, status: "sent" });
    const list = upsertMessage(upsertMessage([], optimistic), echoed);
    expect(list).toHaveLength(1);
    expect(list[0].seq).toBe(7);
    expect(list[0].status).toBe("sent");
    expect(lastSeq(list)).toBe(7);
  });

  it("orders by seq", () => {
    let list: ChatMessage[] = [];
    list = upsertMessage(list, msg({ id: "b", seq: 2 }));
    list = upsertMessage(list, msg({ id: "a", seq: 1 }));
    expect(list.map((m) => m.id)).toEqual(["a", "b"]);
  });
});

describe("canned responses and linkify", () => {
  it("fills variables with sensible fallbacks", () => {
    const out = fillCanned("Hi {{visitor_name}}, I'm {{agent_name}}. Call {{business_phone}}.", {
      visitor_name: null,
      agent_name: "Chris",
      business_phone: "0456 009 004",
    });
    expect(out).toBe("Hi there, I'm Chris. Call 0456 009 004.");
  });

  it("linkifies urls and phone numbers without producing HTML", () => {
    const segs = linkify("Call 0412 345 678 or see https://example.com/a. <b>x</b>");
    expect(segs.find((s) => s.type === "phone")?.href).toBe("tel:0412345678");
    expect(segs.find((s) => s.type === "url")?.value).toBe("https://example.com/a");
    expect(segs.map((s) => s.value).join("")).toContain("<b>x</b>");
  });
});
