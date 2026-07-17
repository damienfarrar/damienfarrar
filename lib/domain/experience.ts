import type { Role } from "@/lib/content/schemas";

// Pure experience logic. Dates are "YYYY" or "YYYY-MM" strings (schema
// enforced); string comparison is safe because both formats sort
// lexicographically within the same shape.

function startValue(role: Role): string {
  return role.start;
}

export function sortRolesCurrentFirst(roles: readonly Role[]): Role[] {
  return [...roles].sort((a, b) => {
    if ((a.end === null) !== (b.end === null)) {
      return a.end === null ? -1 : 1;
    }
    return startValue(b).localeCompare(startValue(a));
  });
}

export function yearsOfExperience(
  roles: readonly Role[],
  now: Date = new Date(),
): number {
  if (roles.length === 0) return 0;
  const earliestYear = Math.min(
    ...roles.map((role) => Number.parseInt(role.start.slice(0, 4), 10)),
  );
  return Math.max(0, now.getFullYear() - earliestYear);
}
