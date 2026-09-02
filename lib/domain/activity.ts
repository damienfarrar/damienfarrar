// Pure aggregation over the GitHub events feed — no fetch, no clock of its
// own, so tests can pin `now` and feed fixtures.

export interface PushEventLike {
  type: string;
  created_at: string;
  payload?: { size?: number };
}

export interface CommitActivity {
  /** Commits per day, oldest first, `days` entries. */
  perDay: number[];
  total: number;
}

export function aggregateCommitDays(
  events: readonly PushEventLike[],
  now: Date,
  days = 7,
): CommitActivity {
  const dayMs = 24 * 60 * 60 * 1000;
  const end = now.getTime();
  const start = end - days * dayMs;
  const perDay = Array.from({ length: days }, () => 0);

  for (const event of events) {
    if (event.type !== "PushEvent") continue;
    const t = Date.parse(event.created_at);
    if (Number.isNaN(t) || t < start || t > end) continue;
    const index = Math.min(days - 1, Math.floor((t - start) / dayMs));
    perDay[index] += event.payload?.size ?? 1;
  }

  return { perDay, total: perDay.reduce((sum, n) => sum + n, 0) };
}

export interface RunAge {
  /** Whole days since the run completed, floored, never negative. */
  days: number;
  /** Terse console label: "today", "1d ago", "94d ago". */
  label: string;
  /** True once the run is too old to describe the current state. */
  stale: boolean;
}

/**
 * How long ago a CI run finished. A green conclusion only says something
 * about *now* while it is recent — past `staleAfterDays` (two missed weekly
 * runs) the tile stops presenting it as a live signal.
 */
export function describeRunAge(
  completedAt: string,
  now: Date,
  staleAfterDays = 14,
): RunAge | null {
  const t = Date.parse(completedAt);
  if (Number.isNaN(t)) return null;
  const days = Math.max(
    0,
    Math.floor((now.getTime() - t) / (24 * 60 * 60 * 1000)),
  );
  return {
    days,
    label: days === 0 ? "today" : `${days}d ago`,
    stale: days >= staleAfterDays,
  };
}
