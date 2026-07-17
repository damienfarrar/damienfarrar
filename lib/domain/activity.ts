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
