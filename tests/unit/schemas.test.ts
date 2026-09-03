import { describe, expect, it } from "vitest";
import { projectFrontmatterSchema, roleSchema } from "@/lib/content/schemas";

const validFrontmatter = {
  title: "A case study",
  slug: "a-case-study",
  summary: "What it was and why it mattered.",
  role: "Lead Engineer",
  dates: "2024",
  stack: ["react", "typescript"],
  order: 1,
};

describe("projectFrontmatterSchema", () => {
  it("accepts a minimal valid frontmatter and applies defaults", () => {
    const parsed = projectFrontmatterSchema.parse(validFrontmatter);
    expect(parsed.links).toEqual({});
  });

  it("rejects a non-kebab-case slug", () => {
    const result = projectFrontmatterSchema.safeParse({
      ...validFrontmatter,
      slug: "Not A Slug",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty stack", () => {
    const result = projectFrontmatterSchema.safeParse({
      ...validFrontmatter,
      stack: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-URL link values", () => {
    const result = projectFrontmatterSchema.safeParse({
      ...validFrontmatter,
      links: { repo: "not-a-url" },
    });
    expect(result.success).toBe(false);
  });
});

describe("roleSchema", () => {
  const validRole = {
    company: "Somewhere",
    title: "Engineer",
    start: "2019",
    end: null,
    summary: "Built things.",
  };

  it("accepts YYYY and YYYY-MM dates", () => {
    expect(roleSchema.safeParse(validRole).success).toBe(true);
    expect(
      roleSchema.safeParse({ ...validRole, start: "2019-03", end: "2024-01" })
        .success,
    ).toBe(true);
  });

  it("rejects malformed dates", () => {
    expect(
      roleSchema.safeParse({ ...validRole, start: "March 2019" }).success,
    ).toBe(false);
  });
});
