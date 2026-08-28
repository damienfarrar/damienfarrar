import type { Metadata } from "next";
import { ViewTracker } from "@/components/view-tracker";
import { getAllProjects, getProjectBySlug } from "@/lib/content/repo";
import { readingTimeMinutes } from "@/lib/domain/projects";
import { getViews } from "@/lib/kv/views";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

// Only slugs from generateStaticParams exist; anything else 404s.
export const dynamicParams = false;

// ISR so the read counter (when KV is configured) refreshes hourly
// instead of freezing at build time.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return {
    title: project?.title,
    description: project?.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug)!;
  const { default: Body } = await import(`@/content/projects/${slug}.mdx`);
  const views = await getViews(slug);

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    author: { "@type": "Person", name: "Damien Farrar" },
    keywords: project.stack.join(", "),
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pt-14 pb-20 sm:px-10 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWorkJsonLd),
        }}
      />
      <ViewTracker slug={slug} />
      <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
        {project.dates} &middot; {project.role} &middot;{" "}
        {readingTimeMinutes(project.body)} min read
        {views !== null && <> &middot; {views} reads</>}
      </p>
      <h1 className="font-heading mt-4 text-4xl font-bold sm:text-5xl">
        {project.title}
      </h1>
      <p className="text-muted-foreground mt-5 text-lg">{project.summary}</p>
      <p className="font-mono text-muted-foreground border-border mt-6 border-b pb-6 text-[0.62rem] tracking-[0.04em]">
        {project.stack.join(" · ")}
      </p>
      <div className="prose-case-study mt-8">
        <Body />
      </div>
    </article>
  );
}
