import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content/repo";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/experience", "/about", "/contact"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...getAllProjects().map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
