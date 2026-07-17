import { getRedis } from "@/lib/kv/client";

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

export async function getViews(slug: string): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const value = await redis.get<number>(key(slug));
    return value ?? 0;
  } catch {
    return null;
  }
}

export async function getTotalViews(
  slugs: readonly string[],
): Promise<number | null> {
  const redis = getRedis();
  if (!redis || slugs.length === 0) return null;
  try {
    const values = await redis.mget<(number | null)[]>(
      ...slugs.map((slug) => key(slug)),
    );
    return values.reduce((sum: number, v) => sum + (v ?? 0), 0);
  } catch {
    return null;
  }
}
