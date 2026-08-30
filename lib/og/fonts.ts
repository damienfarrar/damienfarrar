import { readFile } from "node:fs/promises";

// IBM Plex, for the generated OG images. satori (behind next/og) reads
// ttf / otf / woff — not the woff2 that next/font ships — so three
// latin-subset woff files are vendored alongside this module under the SIL
// Open Font License (see OFL.txt). Regenerate from
// @fontsource/ibm-plex-sans and @fontsource/ibm-plex-mono.
//
// Read with fs, not fetch: `new URL(...)` resolves to a file:// URL that the
// build's prerender step can't fetch, but node:fs reads it fine, and the
// woff files are traced into the deployment because of the new URL reference.

type Weight = 400 | 500 | 700;

type OgFont = {
  name: string;
  data: Buffer;
  weight: Weight;
  style: "normal";
};

const read = (file: string) => readFile(new URL(file, import.meta.url));

let cache: Promise<OgFont[]> | null = null;

/** IBM Plex Sans 700 + IBM Plex Mono 400/500, for `ImageResponse`. */
export function ogFonts(): Promise<OgFont[]> {
  cache ??= (async () => {
    const [sans700, mono400, mono500] = await Promise.all([
      read("./ibm-plex-sans-latin-700-normal.woff"),
      read("./ibm-plex-mono-latin-400-normal.woff"),
      read("./ibm-plex-mono-latin-500-normal.woff"),
    ]);
    return [
      { name: "IBM Plex Sans", data: sans700, weight: 700, style: "normal" },
      { name: "IBM Plex Mono", data: mono400, weight: 400, style: "normal" },
      { name: "IBM Plex Mono", data: mono500, weight: 500, style: "normal" },
    ];
  })();
  return cache;
}
