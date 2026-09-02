// Publishes the Lighthouse numbers this run actually measured into KV, where
// the home-page panel reads them (ADR-0008). CI is the only writer.
//
// Deliberately exits 0 on every "can't publish" path — a missing secret on a
// fork PR, or a build that fell over before LHCI ran, is not a reason to fail
// a pipeline whose real job is the gates.

import { readdir, readFile } from "node:fs/promises";
import { Redis } from "@upstash/redis";

// `lhci collect` writes one lhr-<timestamp>.json per run here. A manifest.json
// only appears under `upload --target=filesystem`, which this project does not
// use — it uploads to temporary-public-storage instead.
const RESULTS_DIR = ".lighthouseci";
const KEY = "metrics:lighthouse";
const HOME = "http://localhost:3300/";

function skip(reason) {
  console.log(`publish-metrics: skipped — ${reason}`);
  process.exit(0);
}

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) skip("no Upstash credentials in this context");

let files;
try {
  files = (await readdir(RESULTS_DIR)).filter(
    (f) => f.startsWith("lhr-") && f.endsWith(".json"),
  );
} catch {
  skip(`no ${RESULTS_DIR} (LHCI did not run)`);
}
if (files.length === 0) skip(`no lhr-*.json in ${RESULTS_DIR}`);

// One config collects several URLs into the same directory; the panel reports
// on the home page, so keep only its runs.
const runs = [];
for (const file of files) {
  try {
    const lhr = JSON.parse(await readFile(`${RESULTS_DIR}/${file}`, "utf8"));
    if (lhr.requestedUrl === HOME && lhr.categories) runs.push(lhr.categories);
  } catch {
    // A truncated or unreadable run is dropped, not fatal — the median of the
    // rest is still a real measurement.
  }
}
if (runs.length === 0) skip(`no runs for ${HOME} in ${RESULTS_DIR}`);

// Median per category, matching `aggregationMethod: "median"` in
// lighthouserc.json. Even counts take the lower middle rather than averaging,
// so every published number is one Lighthouse actually recorded.
const median = (category) => {
  const scores = runs
    .map((c) => c[category]?.score)
    .filter((n) => typeof n === "number")
    .sort((a, b) => a - b);
  if (scores.length === 0) return null;
  return Math.round(scores[Math.floor((scores.length - 1) / 2)] * 100);
};

const metric = {
  performance: median("performance"),
  accessibility: median("accessibility"),
  seo: median("seo"),
  measuredAt: new Date().toISOString(),
  sha: (process.env.GITHUB_SHA ?? "").slice(0, 7),
};

if (Object.values(metric).some((value) => value === null)) {
  skip("a category score was missing from every run");
}

await new Redis({ url, token }).set(KEY, metric);
console.log(
  `publish-metrics: ${KEY} ← perf ${metric.performance}, a11y ${metric.accessibility}, seo ${metric.seo} (${metric.sha}, median of ${runs.length})`,
);
