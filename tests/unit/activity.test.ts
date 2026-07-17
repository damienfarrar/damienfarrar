import { describe, expect, it } from "vitest";
import { aggregateCommitDays } from "@/lib/domain/activity";

const now = new Date("2026-07-17T12:00:00Z");

function pushEvent(daysAgo: number, size: number) {
  return {
    type: "PushEvent",
    created_at: new Date(
      now.getTime() - daysAgo * 24 * 60 * 60 * 1000,
    ).toISOString(),
    payload: { size },
  };
}

describe("aggregateCommitDays", () => {
  it("buckets pushes into per-day counts, oldest first", () => {
    const { perDay, total } = aggregateCommitDays(
      [pushEvent(0.5, 3), pushEvent(1.5, 2), pushEvent(6.5, 1)],
      now,
    );
    expect(perDay).toHaveLength(7);
    expect(perDay[6]).toBe(3); // most recent day
    expect(perDay[5]).toBe(2);
    expect(perDay[0]).toBe(1); // oldest in window
    expect(total).toBe(6);
  });

  it("ignores non-push events, out-of-window pushes, and bad dates", () => {
    const { total } = aggregateCommitDays(
      [
        { type: "WatchEvent", created_at: now.toISOString() },
        pushEvent(9, 5),
        { type: "PushEvent", created_at: "not-a-date" },
      ],
      now,
    );
    expect(total).toBe(0);
  });

  it("counts a push without a size as one commit", () => {
    const { total } = aggregateCommitDays(
      [{ type: "PushEvent", created_at: now.toISOString() }],
      now,
    );
    expect(total).toBe(1);
  });
});
