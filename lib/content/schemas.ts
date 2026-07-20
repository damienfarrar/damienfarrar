import { z } from "zod";

// Single source of truth for content shapes. Types are inferred from these
// schemas and flow UI -> domain -> data; nothing declares them twice.
// Validation runs when the content repo loads a file, so a bad frontmatter
// key fails the build, not a visitor's request.

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  summary: z.string().min(1),
  role: z.string().min(1),
  dates: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  links: z.record(z.string(), z.url()).default({}),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative(),
  cover: z.string().optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export const projectSchema = projectFrontmatterSchema.extend({
  // MDX body is rendered separately (dynamic import); the repo carries the
  // raw source so domain logic (e.g. reading time) stays framework-free.
  body: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const roleSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  start: z.string().regex(/^\d{4}(-\d{2})?$/, "start must be YYYY or YYYY-MM"),
  end: z
    .string()
    .regex(/^\d{4}(-\d{2})?$/, "end must be YYYY or YYYY-MM")
    .nullable(),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).default([]),
  tech: z.array(z.string().min(1)).default([]),
});

export type Role = z.infer<typeof roleSchema>;

export const experienceSchema = z.object({
  roles: z.array(roleSchema).min(1),
});

export type Experience = z.infer<typeof experienceSchema>;

export const profileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  location: z.string().min(1),
  bio: z.string().min(1),
  // The single source for every "N years" claim on the site — deliberate
  // fact, not inferred from (possibly incomplete) role history.
  careerStartYear: z.number().int().min(1980).max(2100),
  socials: z.record(z.string(), z.url()).default({}),
});

export type Profile = z.infer<typeof profileSchema>;
