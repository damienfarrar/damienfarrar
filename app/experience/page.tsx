import type { Metadata } from "next";
import { getExperience, getProfile } from "@/lib/content/repo";
import {
  sortRolesCurrentFirst,
  yearsInProduction,
} from "@/lib/domain/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline of Damien Farrar — full-stack engineer in Melbourne.",
};

function formatRange(start: string, end: string | null): string {
  return `${start.slice(0, 4)} — ${end ? end.slice(0, 4) : "now"}`;
}

export default function ExperiencePage() {
  const roles = sortRolesCurrentFirst(getExperience().roles);
  const years = yearsInProduction(getProfile().careerStartYear);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-20 sm:px-10 sm:pt-24">
      <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
        Service history &middot; {years}+ years
      </p>
      <h1 className="font-heading mt-4 text-4xl font-bold uppercase sm:text-6xl">
        Experience
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-lg">
        Roles and what actually changed in each. Placeholder history for now
        &mdash; the pipeline is real, the companies are not yet.
      </p>

      <ol className="border-border mt-12 border-t">
        {roles.map((role) => (
          <li
            key={`${role.company}-${role.start}`}
            className="border-border grid grid-cols-1 gap-4 border-b py-8 sm:grid-cols-[180px_minmax(0,1fr)]"
          >
            <div className="flex items-start gap-3 sm:flex-col sm:gap-2">
              <span className="font-mono text-muted-foreground text-[0.68rem] tracking-[0.06em] tabular-nums">
                {formatRange(role.start, role.end)}
              </span>
              {role.end === null && (
                <span className="font-mono text-success border-success border px-2 py-0.5 text-[0.58rem] tracking-[0.1em] uppercase">
                  Current
                </span>
              )}
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold uppercase">
                {role.title}
              </h2>
              <p className="font-mono text-muted-foreground mt-1 text-[0.68rem] tracking-[0.06em] uppercase">
                {role.company}
              </p>
              <p className="mt-3 max-w-2xl">{role.summary}</p>
              {role.highlights.length > 0 && (
                <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5">
                  {role.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
              {role.tech.length > 0 && (
                <p className="font-mono text-muted-foreground mt-4 text-[0.62rem] tracking-[0.04em]">
                  {role.tech.join(" · ")}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
