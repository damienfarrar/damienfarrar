import { ImageResponse } from "next/og";
import { getAllProjects, getProjectBySlug } from "@/lib/content/repo";
import { ogFonts } from "@/lib/og/fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study — Damien Farrar";

const mono = { fontFamily: "IBM Plex Mono" } as const;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#141414",
        color: "#e9e9e9",
        padding: 72,
        fontFamily: "IBM Plex Sans",
      }}
    >
      <div
        style={{
          ...mono,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 3,
          color: "#ffb454",
        }}
      >
        <span>CASE STUDY</span>
        <span style={{ color: "#9a9a9c" }}>
          {project?.dates.toUpperCase()} · {project?.role.toUpperCase()}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.1,
        }}
      >
        {project?.title}
      </div>
      <div
        style={{
          ...mono,
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #38383a",
          paddingTop: 24,
          fontSize: 22,
          color: "#9a9a9c",
        }}
      >
        <span>damienfarrar.com</span>
        <span>{project?.stack.join(" · ")}</span>
      </div>
    </div>,
    { ...size, fonts: await ogFonts() },
  );
}
