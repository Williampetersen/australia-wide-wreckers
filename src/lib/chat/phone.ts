/**
 * Normalises an Australian phone number to E.164 (+61XXXXXXXXX).
 * Accepts 0412 345 678, 04 1234 5678, (02) 6541 1711, +61 412 345 678, 61412345678, 0061412345678.
 * Returns null when the number is not a valid AU mobile or landline.
 */
export function normaliseAuPhone(input: string): string | null {
  let digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("0061")) digits = digits.slice(4);
  else if (digits.startsWith("61") && digits.length === 11) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 10) digits = digits.slice(1);

  // Now expect 9 national digits: mobile 4XXXXXXXX, landline [2378]XXXXXXXX.
  if (!/^[2-478]\d{8}$/.test(digits)) return null;
  return `+61${digits}`;
}

/** Formats +61412345678 as "0412 345 678" and +61265411711 as "(02) 6541 1711". */
export function formatAuPhone(e164: string): string {
  const m = e164.match(/^\+61(\d{9})$/);
  if (!m) return e164;
  const n = m[1];
  if (n.startsWith("4")) return `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  return `(0${n[0]}) ${n.slice(1, 5)} ${n.slice(5)}`;
}
