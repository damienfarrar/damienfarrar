import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    // String form keeps the plugin serializable for Turbopack.
    // remark-frontmatter strips the YAML block so it never renders as text;
    // the content repo (lib/content) parses and Zod-validates it instead.
    remarkPlugins: ["remark-frontmatter"],
  },
});

export default withMDX(nextConfig);
