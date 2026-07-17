import { describe, expect, it } from "vitest";
import { getAllProjects, getExperience, getProfile } from "@/lib/content/repo";

// Loads the real files in /content through the repo, so invalid frontmatter
// or malformed JSON fails here (and in CI) before it can fail a build.
describe("content repo over real content", () => {
  it("loads and validates every project file", () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project.body.length).toBeGreaterThan(0);
    }
  });

  it("has unique slugs and orders across projects", () => {
    const projects = getAllProjects();
    const slugs = projects.map((p) => p.slug);
    const orders = projects.map((p) => p.order);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("loads and validates experience and profile", () => {
    expect(getExperience().roles.length).toBeGreaterThan(0);
    expect(getProfile().name).toBe("Damien Farrar");
  });
});
