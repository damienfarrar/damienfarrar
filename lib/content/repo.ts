import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import {
  experienceSchema,
  profileSchema,
  projectSchema,
  type Experience,
  type Profile,
  type Project,
} from "@/lib/content/schemas";

// The only place that touches the filesystem. Everything above this layer
// works with validated, typed data — swapping MDX/JSON for a CMS or database
// means replacing this file and nothing else.

const contentDir = path.join(process.cwd(), "content");
const projectsDir = path.join(contentDir, "projects");

function loadProjectFile(filename: string): Project {
  const filePath = path.join(projectsDir, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const parsed = projectSchema.safeParse({ ...data, body: content });
  if (!parsed.success) {
    throw new Error(
      `Invalid project frontmatter in ${filePath}:\n${parsed.error.message}`,
    );
  }

  const expectedSlug = filename.replace(/\.mdx$/, "");
  if (parsed.data.slug !== expectedSlug) {
    throw new Error(
      `Slug mismatch in ${filePath}: frontmatter says "${parsed.data.slug}" but the filename implies "${expectedSlug}"`,
    );
  }

  return parsed.data;
}

export const getAllProjects = cache((): Project[] => {
  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map(loadProjectFile);
});

export const getProjectBySlug = cache((slug: string): Project | undefined => {
  return getAllProjects().find((project) => project.slug === slug);
});

export const getExperience = cache((): Experience => {
  const raw = fs.readFileSync(path.join(contentDir, "experience.json"), "utf8");
  return experienceSchema.parse(JSON.parse(raw));
});

export const getProfile = cache((): Profile => {
  const raw = fs.readFileSync(path.join(contentDir, "profile.json"), "utf8");
  return profileSchema.parse(JSON.parse(raw));
});
