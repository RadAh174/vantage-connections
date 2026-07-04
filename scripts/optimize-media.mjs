import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const media = path.resolve(__dirname, "../public/media");

const jobs = [
  { in: "hero-still.png", out: "hero-poster.webp", width: 1920, quality: 82 },
  { in: "feature-storefront.png", out: "feature-storefront.webp", width: 1600, quality: 82 },
  { in: "feature-creative.png", out: "feature-creative.webp", width: 1300, quality: 82 },
  { in: "feature-product.png", out: "feature-product.webp", width: 1600, quality: 82 },
];

for (const j of jobs) {
  const src = path.join(media, j.in);
  const dest = path.join(media, j.out);
  const info = await sharp(src)
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: j.quality, effort: 5 })
    .toFile(dest);
  console.log(`${j.out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
console.log("images done");
