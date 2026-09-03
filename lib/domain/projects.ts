import type { Project } from "@/lib/content/schemas";

// Pure project logic — no filesystem, no framework. Testable in isolation.

export function sortProjects<T extends Pick<Project, "order">>(
  projects: readonly T[],
): T[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

const WORDS_PER_MINUTE = 220;

export function readingTimeMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
