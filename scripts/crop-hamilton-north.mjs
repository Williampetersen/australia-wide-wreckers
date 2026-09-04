import sharp from "sharp";
import path from "node:path";

const input = path.join(
  process.cwd(),
  "public",
  "newimages",
  "Scrap-My-Car-Adamstown-Heights-–-Get-Cash-Today.png"
);
const output = path.join(
  process.cwd(),
  "public",
  "images",
  "locations",
  "cash-for-cars-hamilton-north.webp"
);

const image = sharp(input);
const meta = await image.metadata();
const left = Math.round(meta.width * 0.41);
const width = meta.width - left;
const height = Math.round(meta.height * 0.83);

await image
  .extract({ left, top: 0, width, height })
  .toFile(output);

console.log(`Cropped to ${width}x${height} at left=${left}`);
