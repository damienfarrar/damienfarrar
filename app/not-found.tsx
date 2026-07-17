import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-5 py-20 sm:px-10">
      <div className="border-border bg-card border p-6">
        <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
          Route
        </p>
        <p className="font-heading mt-3 flex items-center gap-3 text-3xl font-bold uppercase">
          <span
            aria-hidden
            className="bg-destructive inline-block size-2 rounded-full"
          />
          404 &mdash; not found
        </p>
        <p className="font-mono text-muted-foreground mt-3 text-[0.68rem] tracking-[0.04em]">
          no page at this address &middot; nothing was logged
        </p>
      </div>
      <Link
        href="/"
        className="font-heading text-primary mt-8 text-sm font-semibold tracking-[0.06em] uppercase underline-offset-4 hover:underline"
      >
        Back to the console &nearr;
      </Link>
    </div>
  );
}
