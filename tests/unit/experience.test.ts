import { describe, expect, it } from "vitest";
import {
  sortRolesCurrentFirst,
  yearsOfExperience,
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

describe("yearsOfExperience", () => {
  it("counts from the earliest role start", () => {
    const roles = [
      role({ start: "2008", end: "2014" }),
      role({ start: "2024", end: null }),
    ];
    expect(yearsOfExperience(roles, new Date("2026-07-17"))).toBe(18);
  });

  it("returns 0 for no roles", () => {
    expect(yearsOfExperience([], new Date("2026-07-17"))).toBe(0);
  });
});
