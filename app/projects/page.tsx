import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/content/repo";
import { readingTimeMinutes, sortProjects } from "@/lib/domain/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies in full-stack engineering.",
};

export default function ProjectsPage() {
  const projects = sortProjects(getAllProjects());

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-20 sm:px-10 sm:pt-24">
      <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
        Case studies
      </p>
      <h1 className="font-heading mt-4 text-4xl font-bold uppercase sm:text-6xl">
        Projects
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-lg">
        Each one written as problem &rarr; approach &rarr; decisions &rarr;
        outcome. Placeholder prose for now; the structure is live.
      </p>

      <ul className="border-border mt-12 grid grid-cols-1 gap-3 border-t pt-6 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group border-border bg-card flex h-full flex-col gap-3 border p-5"
            >
              <span className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
                {project.dates} &middot; {project.role}
              </span>
              <span className="font-heading text-xl font-semibold uppercase group-hover:underline group-hover:underline-offset-4">
                {project.title}
              </span>
              <span className="text-muted-foreground text-sm">
                {project.summary}
              </span>
              <span className="font-mono text-muted-foreground mt-auto text-[0.62rem] tracking-[0.04em]">
                {project.stack.join(" · ")} &middot;{" "}
                {readingTimeMinutes(project.body)} min read
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
