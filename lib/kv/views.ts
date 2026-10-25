import { cachedRead, getRedis } from "@/lib/kv/client";

// Per-project view counters. No cookies, no PII — a bare counter keyed by
// slug. Every function degrades to null so callers can simply not render.

const key = (slug: string) => `views:${slug}`;

export async function incrementViews(slug: string): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.incr(key(slug));
  } catch {
    return null;
  }
}

export const getViews = cachedRead(
  ["kv", "views"],
  async (redis, slug: string): Promise<number> =>
    (await redis.get<number>(key(slug))) ?? 0,
);

export const getTotalViews = cachedRead(
  ["kv", "views-total"],
  async (redis, slugs: readonly string[]): Promise<number | null> => {
    if (slugs.length === 0) return null;
    const values = await redis.mget<(number | null)[]>(
      ...slugs.map((slug) => key(slug)),
    );
    return values.reduce((sum: number, v) => sum + (v ?? 0), 0);
  },
);
