import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "wp-data");
const items = JSON.parse(fs.readFileSync(path.join(outDir, "all-items.json"), "utf8"));

const slugs = process.argv.slice(2);

function stripToText(html) {
  if (!html) return "";
  let s = html;
  // Remove Divi shortcodes like [et_pb_section ...] and [/et_pb_section]
  s = s.replace(/\[\/?et_pb[^\]]*\]/g, "\n");
  s = s.replace(/\[\/?[a-z_]+[^\]]*\]/gi, "\n");
  // Convert common block tags to newlines
  s = s.replace(/<\/(p|div|li|h[1-6]|br)>/gi, "\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  // Strip all remaining tags
  s = s.replace(/<[^>]+>/g, "");
  // Decode common entities
  s = s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "--");
  // Collapse whitespace
  s = s
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join("\n");
  return s;
}

for (const slug of slugs) {
  const item = items.find((i) => i.slug === slug && (i.postType === "page" || i.postType === "post"));
  if (!item) {
    console.log(`=== NOT FOUND: ${slug} ===\n`);
    continue;
  }
  console.log(`=== ${item.title} (${slug}) [${item.status}] ===`);
  console.log(stripToText(item.content));
  console.log("\n\n");
}
