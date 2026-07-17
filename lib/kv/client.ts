import { Redis } from "@upstash/redis";

// Single place that knows about Upstash env vars. Everything else asks for
// a client and handles `null` — the whole KV layer is optional by design:
// without keys the site renders, minus the live tiles.

let cached: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (cached !== undefined) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  cached = url && token ? new Redis({ url, token }) : null;
  return cached;
}
