// Regenerates app/favicon.ico and app/apple-icon.png from app/icon.svg.
//
// icon.svg is the source of truth. Run this after editing it:
//   node scripts/gen-favicons.mjs
//
// favicon.ico carries RGBA PNG-encoded frames at 16/32/48 — Turbopack's ICO
// decoder rejects BMP-encoded frames, so we assemble the container by hand
// rather than leaning on a library that might emit BMP.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const svgPath = root + "app/icon.svg";
const icoPath = root + "app/favicon.ico";
const applePath = root + "app/apple-icon.png";

const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;

const svg = await readFile(svgPath);

const render = (size) =>
  sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toBuffer();

// apple-icon: a plain PNG.
await writeFile(applePath, await render(APPLE_SIZE));

// favicon.ico: ICONDIR + ICONDIRENTRY[] + PNG payloads.
const pngs = await Promise.all(ICO_SIZES.map(render));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);

const entries = [];
let offset = 6 + pngs.length * 16;
pngs.forEach((png, i) => {
  const size = ICO_SIZES[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += png.length;
});

await writeFile(icoPath, Buffer.concat([header, ...entries, ...pngs]));

console.log(
  `favicon.ico (${ICO_SIZES.map((s) => `${s}px`).join("/")}) + apple-icon.png (${APPLE_SIZE}px) written from icon.svg`,
);
