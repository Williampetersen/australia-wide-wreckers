import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const srcDir = path.join(process.cwd(), "public", "newimages");
const outDir = path.join(process.cwd(), "public", "images", "locations");
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  { input: "Cash-for-Cars-Hamilton.png", output: "cash-for-cars-hamilton.webp", cropWidthPct: 0.41 },
  { input: "Cash-for-Cars-Belmont-North.png", output: "cash-for-cars-belmont-north.webp", cropWidthPct: 0.41 },
  { input: "Cash-for-Cars-Cardiff.png", output: "cash-for-cars-cardiff.webp", cropWidthPct: 0.41 },
  { input: "Cash-for-Cars-Georgetown.png", output: "cash-for-cars-georgetown.webp", cropWidthPct: 0.41 },
  { input: "Cash-for-Cars-Kotara.png", output: "cash-for-cars-kotara.webp", cropWidthPct: 0.41 },
  { input: "Cash-for-Cars-Swansea.png", output: "cash-for-cars-swansea.webp", cropWidthPct: 0.41 },
  { input: "Cash-for-Cars-Wallsend-South.png", output: "cash-for-cars-wallsend-south.webp", cropWidthPct: 0.41 },
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
