// Publishes the Lighthouse numbers this run actually measured into KV, where
// the home-page panel reads them (ADR-0008). CI is the only writer.
//
// Deliberately exits 0 on every "can't publish" path — a missing secret on a
// fork PR, or a build that fell over before LHCI ran, is not a reason to fail
// a pipeline whose real job is the gates.

import { readFile } from "node:fs/promises";
import { Redis } from "@upstash/redis";

const MANIFEST = ".lighthouseci/manifest.json";
const KEY = "metrics:lighthouse";
const HOME = "http://localhost:3300/";

function skip(reason) {
  console.log(`publish-metrics: skipped — ${reason}`);
  process.exit(0);
}

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) skip("no Upstash credentials in this context");

let manifest;
try {
  manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
} catch {
  skip(`no ${MANIFEST} (LHCI did not produce results)`);
}
if (!Array.isArray(manifest)) skip(`${MANIFEST} is not a run list`);

// LHCI flags one run per URL as representative — that is the median run the
// assertions were made against, so it is the number worth publishing.
const entry =
  manifest.find((run) => run.isRepresentativeRun && run.url === HOME) ??
  manifest.find((run) => run.isRepresentativeRun);
if (!entry?.summary) skip("no representative run in the manifest");

const score = (category) => {
  const value = entry.summary[category];
  return typeof value === "number" ? Math.round(value * 100) : null;
};

const metric = {
  performance: score("performance"),
  accessibility: score("accessibility"),
  seo: score("seo"),
  measuredAt: new Date().toISOString(),
  sha: (process.env.GITHUB_SHA ?? "").slice(0, 7),
};

if (Object.values(metric).some((value) => value === null)) {
  skip("representative run is missing a category score");
}

await new Redis({ url, token }).set(KEY, metric);
console.log(
  `publish-metrics: ${KEY} ← perf ${metric.performance}, a11y ${metric.accessibility}, seo ${metric.seo} (${metric.sha})`,
);
