/**
 * Remove the green backdrop from Saaniya's portrait and crop to her.
 * Run: node scripts/build-saaniya-avatar.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "assets/mascot/girl/girl-work-school-a.png");
const dest = join(root, "assets/mascot/girl/saaniya-chat-avatar.png");

const decoded = jpeg.decode(readFileSync(src), { useTArray: true, formatAsRGBA: true });
const width = decoded.width;
const height = decoded.height;
const data = decoded.data;

function green(r, g, b) {
  return g > 80 && g > r + 30 && g > b + 30;
}

let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (width * y + x) << 2;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const spill = g - Math.max(r, b);
    if (green(r, g, b) || spill > 28) {
      data[i + 3] = 0;
      continue;
    }
    if (spill > 8) data[i + 1] = Math.max(r, b);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
}

const cropW = maxX - minX + 1;
const cropH = Math.min(maxY - minY + 1, Math.round(cropW * 1.15));
const out = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcI = (width * (minY + y) + (minX + x)) << 2;
    const dstI = (cropW * y + x) << 2;
    out.data[dstI] = data[srcI];
    out.data[dstI + 1] = data[srcI + 1];
    out.data[dstI + 2] = data[srcI + 2];
    out.data[dstI + 3] = data[srcI + 3];
  }
}

writeFileSync(dest, PNG.sync.write(out));
console.log(`Wrote ${cropW}x${cropH} avatar`);
