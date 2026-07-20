import { describe, expect, it } from "vitest";
import {
  sortRolesCurrentFirst,
  yearsInProduction,
} from "@/lib/domain/experience";
import type { Role } from "@/lib/content/schemas";

function role(overrides: Partial<Role>): Role {
  return {
    company: "Somewhere",
    title: "Engineer",
    start: "2019",
    end: "2024",
    summary: "Built things.",
    highlights: [],
    tech: [],
    ...overrides,
  };
}

describe("sortRolesCurrentFirst", () => {
  it("puts current roles (no end date) first, then most recent start", () => {
    const sorted = sortRolesCurrentFirst([
      role({ start: "2014", end: "2019" }),
      role({ start: "2024", end: null }),
      role({ start: "2019", end: "2024" }),
    ]);
    expect(sorted.map((r) => r.start)).toEqual(["2024", "2019", "2014"]);
    expect(sorted[0].end).toBeNull();
  });
});

describe("yearsInProduction", () => {
  it("counts calendar years from the career start", () => {
    expect(yearsInProduction(2008, new Date("2026-07-17"))).toBe(18);
    expect(yearsInProduction(2026, new Date("2026-07-17"))).toBe(0);
  });

  it("never goes negative on a future start year", () => {
    expect(yearsInProduction(2030, new Date("2026-07-17"))).toBe(0);
  });
});
