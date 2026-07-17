import { ImageResponse } from "next/og";
import { getAllProjects, getProjectBySlug } from "@/lib/content/repo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study — Damien Farrar";

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
        background: "#10151b",
        color: "#e2e8ee",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          letterSpacing: 4,
          color: "#ffb454",
        }}
      >
        <span>CASE STUDY</span>
        <span style={{ color: "#8494a3" }}>
          {project?.dates.toUpperCase()} · {project?.role.toUpperCase()}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.1,
          textTransform: "uppercase",
        }}
      >
        {project?.title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #27313d",
          paddingTop: 24,
          fontSize: 26,
          color: "#8494a3",
        }}
      >
        <span>damienfarrar.com</span>
        <span>{project?.stack.join(" · ")}</span>
      </div>
    </div>,
    size,
  );
}
