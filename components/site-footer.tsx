export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-4 px-5 py-6 font-mono text-[0.62rem] tracking-[0.08em] uppercase sm:px-10">
        <span>Damien Farrar &middot; Melbourne, Australia</span>
        <a
          href="https://github.com/damienfarrar/damienfarrar"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          Source on GitHub &nearr;
        </a>
      </div>
    </footer>
  );
}
