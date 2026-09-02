import { z } from "zod";
import { getRedis } from "@/lib/kv/client";

// Measurements CI publishes about the deployed site (ADR-0008). The write
// side lives in scripts/publish-metrics.mjs and runs in Actions; the app only
// ever reads. Anything malformed or missing reads as null so the tile hides
// rather than inventing a number.

const LIGHTHOUSE_KEY = "metrics:lighthouse";

export const lighthouseMetricSchema = z.object({
  performance: z.number().int().min(0).max(100),
  accessibility: z.number().int().min(0).max(100),
  seo: z.number().int().min(0).max(100),
  /** ISO timestamp the measuring run finished. */
  measuredAt: z.string(),
  /** Short SHA the run measured. */
  sha: z.string(),
});

export type LighthouseMetric = z.infer<typeof lighthouseMetricSchema>;

export async function getLighthouseMetric(): Promise<LighthouseMetric | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get<unknown>(LIGHTHOUSE_KEY);
    const parsed = lighthouseMetricSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
