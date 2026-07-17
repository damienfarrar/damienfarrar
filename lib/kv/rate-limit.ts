import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/kv/client";

// Sliding window in Redis because in-memory limiters silently no-op on
// serverless (every invocation is a fresh process — plan principle 3).
// Without KV configured this FAILS OPEN, loudly: the contact form keeps
// working in dev/preview, and the warning makes the gap impossible to miss.

let limiter: Ratelimit | null | undefined;
let warned = false;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const redis = getRedis();
  limiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "rl:contact",
      })
    : null;
  return limiter;
}

export async function allowContactRequest(ip: string): Promise<boolean> {
  const rl = getLimiter();
  if (!rl) {
    if (!warned) {
      warned = true;
      console.warn(
        "[rate-limit] Upstash env vars missing — contact rate limiting is OFF (fail-open).",
      );
    }
    return true;
  }
  try {
    const { success } = await rl.limit(ip);
    return success;
  } catch {
    // Redis unreachable: prefer a working contact form over a hard failure.
    return true;
  }
}
