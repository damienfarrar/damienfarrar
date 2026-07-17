import { describe, expect, it } from "vitest";
import {
  featuredProjects,
  readingTimeMinutes,
  sortProjects,
} from "@/lib/domain/projects";

describe("sortProjects", () => {
  it("sorts by order ascending without mutating the input", () => {
    const input = [{ order: 3 }, { order: 1 }, { order: 2 }];
    const sorted = sortProjects(input);
    expect(sorted.map((p) => p.order)).toEqual([1, 2, 3]);
    expect(input.map((p) => p.order)).toEqual([3, 1, 2]);
  });
});

describe("featuredProjects", () => {
  it("keeps only featured projects, in order", () => {
    const result = featuredProjects([
      { order: 2, featured: true },
      { order: 1, featured: false },
      { order: 0, featured: true },
    ]);
    expect(result).toEqual([
      { order: 0, featured: true },
      { order: 2, featured: true },
    ]);
  });
});

describe("readingTimeMinutes", () => {
  it("never reports less than one minute", () => {
    expect(readingTimeMinutes("short body")).toBe(1);
    expect(readingTimeMinutes("")).toBe(1);
  });

  it("scales with word count", () => {
    const words = Array.from({ length: 660 }, () => "word").join(" ");
    expect(readingTimeMinutes(words)).toBe(3);
  });
});
