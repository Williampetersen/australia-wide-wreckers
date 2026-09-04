import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";
import path from "node:path";

const xmlPath = path.join(process.env.USERPROFILE, "wp-import", "wp-export.xml");
const outDir = path.join(process.cwd(), "wp-data");
const SKIP_TYPES = new Set(["flamingo_contact", "flamingo_inbound"]);
fs.mkdirSync(outDir, { recursive: true });

const xml = fs.readFileSync(xmlPath, "utf8");

const parser = new XMLParser({
  ignoreAttributes: false,
  cdataPropName: "__cdata",
  parseTagValue: true,
  trimValues: true,
});

const doc = parser.parse(xml);
const channel = doc.rss.channel;
const items = Array.isArray(channel.item) ? channel.item : [channel.item];

function text(val) {
  if (val == null) return "";
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && "__cdata" in val) return val.__cdata ?? "";
  return "";
}

const summary = {
  siteTitle: text(channel.title),
  siteDescription: text(channel.description),
  totalItems: items.length,
  byType: {},
};

const records = items
  .filter((item) => !SKIP_TYPES.has(text(item["wp:post_type"])))
  .map((item) => {
  const postType = text(item["wp:post_type"]);
  summary.byType[postType] = (summary.byType[postType] || 0) + 1;
  return {
    postType,
    id: text(item["wp:post_id"]),
    title: text(item.title),
    slug: text(item["wp:post_name"]),
    status: text(item["wp:status"]),
    parentId: text(item["wp:post_parent"]),
    menuOrder: text(item["wp:menu_order"]),
    link: text(item.link),
    content: text(item["content:encoded"]),
    excerpt: text(item["excerpt:encoded"]),
    attachmentUrl: text(item["wp:attachment_url"]),
    postDate: text(item["wp:post_date"]),
    categories: (Array.isArray(item.category) ? item.category : item.category ? [item.category] : [])
      .map((c) => ({
        domain: c["@_domain"],
        name: text(c),
        nicename: c["@_nicename"],
      })),
  };
});

fs.writeFileSync(
  path.join(outDir, "summary.json"),
  JSON.stringify(summary, null, 2)
);
fs.writeFileSync(
  path.join(outDir, "all-items.json"),
  JSON.stringify(records, null, 2)
);

const pages = records.filter((r) => r.postType === "page");
const posts = records.filter((r) => r.postType === "post");
const attachments = records.filter((r) => r.postType === "attachment");

fs.writeFileSync(
  path.join(outDir, "pages.json"),
  JSON.stringify(
    pages.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      parentId: p.parentId,
      link: p.link,
    })),
    null,
    2
  )
);

fs.writeFileSync(
  path.join(outDir, "posts.json"),
  JSON.stringify(
    posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      link: p.link,
      categories: p.categories.map((c) => c.name),
    })),
    null,
    2
  )
);

fs.writeFileSync(
  path.join(outDir, "attachments.json"),
  JSON.stringify(
    attachments.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      url: a.attachmentUrl,
      parentId: a.parentId,
    })),
    null,
    2
  )
);

console.log(JSON.stringify(summary, null, 2));
console.log(`\nWrote ${pages.length} pages, ${posts.length} posts, ${attachments.length} attachments to ./wp-data/`);
