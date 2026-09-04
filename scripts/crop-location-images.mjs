import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const srcDir = path.join(process.cwd(), "public", "04");
const outDir = path.join(process.cwd(), "public", "images", "locations");
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  {
    input: "Cash-for-Cars-Cameron-Park.webp",
    output: "cash-for-cars-cameron-park.webp",
    cropWidthPct: 0.41,
  },
  {
    input: "Cash-for-Cars-Edgeworth-1280x853.webp",
    output: "cash-for-cars-edgeworth.webp",
    cropWidthPct: 0.49,
  },
  {
    input: "Cash-for-Cars-Mayfield.webp",
    output: "cash-for-cars-mayfield.webp",
    cropWidthPct: 0.42,
  },
];

for (const job of jobs) {
  const inputPath = path.join(srcDir, job.input);
  const outputPath = path.join(outDir, job.output);
  const image = sharp(inputPath);
  const meta = await image.metadata();
  const width = Math.round(meta.width * job.cropWidthPct);
  await image
    .extract({ left: 0, top: 0, width, height: meta.height })
    .toFile(outputPath);
  console.log(`Cropped ${job.input} -> ${job.output} (${width}x${meta.height})`);
}
