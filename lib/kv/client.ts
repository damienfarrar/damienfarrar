import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";

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

// Matches the hourly ISR window of the pages that show KV data.
const READ_REVALIDATE_SECONDS = 3600;

/**
 * Wraps a KV read in Next's data cache. Upstash fetches with
 * `cache: "no-store"`, which on its own makes any page that reads KV render
 * per request and ignore its `revalidate`. Errors propagate out of the cached
 * function so a Redis outage isn't cached for an hour; they become `null`
 * here instead.
 */
export function cachedRead<A extends unknown[], R>(
  keyParts: string[],
  read: (redis: Redis, ...args: A) => Promise<R>,
): (...args: A) => Promise<R | null> {
  const cachedFn = unstable_cache(
    (...args: A) => read(getRedis() as Redis, ...args),
    keyParts,
    { revalidate: READ_REVALIDATE_SECONDS },
  );
  return async (...args) => {
    if (!getRedis()) return null;
    try {
      return await cachedFn(...args);
    } catch {
      return null;
    }
  };
}
