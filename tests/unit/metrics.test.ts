import { describe, expect, it } from "vitest";
import { lighthouseMetricSchema } from "@/lib/kv/metrics";

const valid = {
  performance: 97,
  accessibility: 100,
  seo: 100,
  measuredAt: "2026-09-02T11:24:00.795Z",
  sha: "abcdef1",
};

describe("lighthouseMetricSchema", () => {
  it("accepts a measurement as CI publishes it", () => {
    expect(lighthouseMetricSchema.parse(valid)).toEqual(valid);
  });

  it("rejects a partial write, so a half-published tile never renders", () => {
    for (const field of Object.keys(valid)) {
      const partial: Record<string, unknown> = { ...valid };
      delete partial[field];
      expect(lighthouseMetricSchema.safeParse(partial).success).toBe(false);
    }
  });

  it("rejects scores outside 0-100 and non-integers", () => {
    for (const performance of [-1, 101, 0.97]) {
      expect(
        lighthouseMetricSchema.safeParse({ ...valid, performance }).success,
      ).toBe(false);
    }
  });

  it("rejects a null read, which is what an unset key looks like", () => {
    expect(lighthouseMetricSchema.safeParse(null).success).toBe(false);
  });
});
