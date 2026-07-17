import type { MDXComponents } from "mdx/types";

// Required by @next/mdx with App Router. Element styling for case-study
// bodies lands with the pages phase; keep the mapping minimal until then.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
