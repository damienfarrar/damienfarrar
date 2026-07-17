import type { NextRequest } from "next/server";
import { getProjectBySlug } from "@/lib/content/repo";
import { incrementViews } from "@/lib/kv/views";

// The KV write path (plan §3): increments a per-project counter. Only
// slugs that exist as content are accepted; without KV configured it's a
// silent no-op so the client never sees an error.

export async function POST(
  _request: NextRequest,
  ctx: RouteContext<"/api/views/[slug]">,
) {
  const { slug } = await ctx.params;

  if (!getProjectBySlug(slug)) {
    return new Response(null, { status: 404 });
  }

  await incrementViews(slug);
  return new Response(null, { status: 204 });
}
