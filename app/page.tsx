import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAllProjects } from "@/lib/content/repo";
import {
  getCiStatus,
  getCommitActivity,
  getLatestCommit,
} from "@/lib/github/activity";
import { getTotalViews } from "@/lib/kv/views";
import { cn } from "@/lib/utils";

// The self-report panel: live tiles (GitHub, KV) hide themselves when their
// source is unreachable or unconfigured — no error states, no fake numbers.
// Static tiles state config and targets, not measurements.
export const revalidate = 3600;

function TileLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
      {children}
    </span>
  );
}

function TileSub({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-muted-foreground mt-auto text-[0.62rem] tracking-[0.04em]">
      {children}
    </span>
  );
}

export default async function Home() {
  const slugs = getAllProjects().map((project) => project.slug);
  const [activity, latestCommit, ciStatus, totalReads] = await Promise.all([
    getCommitActivity(),
    getLatestCommit(),
    getCiStatus(),
    getTotalViews(slugs),
  ]);

  const maxDay = activity ? Math.max(1, ...activity.perDay) : 1;

  const tiles: React.ReactNode[] = [
    <>
      <TileLabel>System</TileLabel>
      <span className="font-heading flex items-center gap-2.5 text-2xl font-semibold">
        <span
          aria-hidden
          className="bg-success inline-block size-2 rounded-full"
        />
        <span className="text-success">Operational</span>
      </span>
      <TileSub>v4 &middot; vercel &middot; region syd1</TileSub>
    </>,
    <>
      <TileLabel>Lighthouse budgets</TileLabel>
      <div className="flex gap-7">
        {(
          [
            ["95+", "perf"],
            ["100", "a11y"],
            ["100", "seo"],
          ] as const
        ).map(([score, label]) => (
          <span key={label}>
            <span className="font-heading block text-2xl font-semibold tabular-nums">
              {score}
            </span>
            <small className="font-mono text-muted-foreground text-[0.55rem] tracking-[0.1em] uppercase">
              {label}
            </small>
          </span>
        ))}
      </div>
      <TileSub>targets &middot; asserted in ci, median of 3 runs</TileSub>
    </>,
  ];

  if (ciStatus !== null) {
    tiles.push(
      <>
        <TileLabel>CI &middot; latest run</TileLabel>
        <span
          className={cn(
            "font-heading text-2xl font-semibold",
            ciStatus === "passing" ? "text-success" : "text-destructive",
          )}
        >
          {ciStatus === "passing" ? "Passing" : "Failing"}
        </span>
        <TileSub>
          github actions &middot; format &middot; lint &middot; tests &middot;
          build
        </TileSub>
      </>,
    );
  }

  if (latestCommit !== null) {
    tiles.push(
      <>
        <TileLabel>Last commit</TileLabel>
        <span className="font-heading text-2xl font-semibold tabular-nums">
          {latestCommit.date}
        </span>
        <TileSub>
          {latestCommit.sha} &middot; &ldquo;
          {latestCommit.message.length > 42
            ? `${latestCommit.message.slice(0, 42)}…`
            : latestCommit.message}
          &rdquo;
        </TileSub>
      </>,
    );
  }

  // Zero is ambiguous (pre-launch the repo is private, so public events
  // undercount) — hide rather than show a misleading empty week.
  if (activity !== null && activity.total > 0) {
    tiles.push(
      <>
        <TileLabel>Commits &middot; 7 days</TileLabel>
        <div
          role="img"
          aria-label={`${activity.total} commits over the last 7 days`}
          className="flex h-11 items-end gap-1"
        >
          {activity.perDay.map((count, day) => (
            <span
              key={day}
              className="bg-primary min-h-1 flex-1 opacity-85"
              style={{ height: `${Math.round((count / maxDay) * 100)}%` }}
            />
          ))}
        </div>
        <TileSub>
          {activity.total} commits &middot; github, isr-cached ~1h
        </TileSub>
      </>,
    );
  }

  if (totalReads !== null) {
    tiles.push(
      <>
        <TileLabel>Case-study reads</TileLabel>
        <span className="font-heading text-2xl font-semibold tabular-nums">
          {totalReads}
        </span>
        <TileSub>all studies &middot; kv counter via /api/views</TileSub>
      </>,
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-10">
      <section className="pt-14 pb-10 sm:pt-24 sm:pb-16">
        <h1
          className="boot font-heading max-w-3xl text-5xl font-bold uppercase sm:text-7xl"
          style={{ animationDelay: "50ms" }}
        >
          Ten years <span className="text-primary">in production.</span>
        </h1>
        <p
          className="boot text-foreground mt-6 max-w-2xl text-lg"
          style={{ animationDelay: "120ms" }}
        >
          Full-stack engineer in Melbourne. This site runs like the systems I
          build — source public, decisions recorded, quality gates enforced in
          CI — and the panel below is it reporting on itself.
        </p>
        <div
          className="boot mt-9 flex flex-wrap items-center gap-6"
          style={{ animationDelay: "190ms" }}
        >
          <Link
            href="/projects"
            className={cn(
              buttonVariants({ size: "lg" }),
              "font-heading h-11 px-6 tracking-[0.06em] uppercase",
            )}
          >
            Read the case studies
          </Link>
          <a
            href="https://github.com/damienfarrar/damienfarrar"
            className="font-heading text-primary text-sm font-semibold tracking-[0.06em] uppercase underline-offset-4 hover:underline"
          >
            Read the source &nearr;
          </a>
        </div>
      </section>

      <section aria-label="Site telemetry" className="pb-20">
        <div
          className="boot border-border text-muted-foreground flex flex-wrap items-baseline justify-between gap-4 border-t px-0.5 py-3 font-mono text-[0.58rem] tracking-[0.12em] uppercase"
          style={{ animationDelay: "300ms" }}
        >
          <span>Self-report &mdash; damienfarrar.com</span>
          <span>
            live tiles refresh ~hourly &middot; sources hide on failure
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="boot border-border bg-card flex min-h-32 flex-col gap-3 border p-5"
              style={{ animationDelay: `${400 + index * 80}ms` }}
            >
              {tile}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
