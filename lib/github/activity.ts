import {
  aggregateCommitDays,
  type CommitActivity,
} from "@/lib/domain/activity";

// Server-side GitHub reads, ISR-cached ~1h so unauthenticated rate limits
// are a non-issue. Everything returns null on any failure — the console
// tiles simply don't render (plan: no error states leak to visitors).

const GITHUB = "https://api.github.com";
const OWNER = "damienfarrar";
const REPO = "damienfarrar";
const REVALIDATE_SECONDS = 3600;

function headers(): HeadersInit {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "damienfarrar.com",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
}

async function ghFetch(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${GITHUB}${path}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export interface LatestCommit {
  sha: string;
  message: string;
  date: string; // YYYY-MM-DD
}

export async function getCommitActivity(): Promise<CommitActivity | null> {
  const events = await ghFetch(`/users/${OWNER}/events/public?per_page=100`);
  if (!Array.isArray(events)) return null;
  return aggregateCommitDays(events, new Date());
}

export async function getLatestCommit(): Promise<LatestCommit | null> {
  const commits = await ghFetch(`/repos/${OWNER}/${REPO}/commits?per_page=1`);
  if (!Array.isArray(commits) || commits.length === 0) return null;
  const head = commits[0];
  const sha: unknown = head?.sha;
  const message: unknown = head?.commit?.message;
  const date: unknown = head?.commit?.committer?.date;
  if (
    typeof sha !== "string" ||
    typeof message !== "string" ||
    typeof date !== "string"
  ) {
    return null;
  }
  return {
    sha: sha.slice(0, 7),
    message: message.split("\n")[0],
    date: date.slice(0, 10),
  };
}

export async function getCiStatus(): Promise<"passing" | "failing" | null> {
  const data = await ghFetch(
    `/repos/${OWNER}/${REPO}/actions/runs?per_page=1&status=completed`,
  );
  const run = (data as { workflow_runs?: { conclusion?: string }[] } | null)
    ?.workflow_runs?.[0];
  if (!run?.conclusion) return null;
  return run.conclusion === "success" ? "passing" : "failing";
}
