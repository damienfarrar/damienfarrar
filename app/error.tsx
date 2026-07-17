"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-5 py-20 sm:px-10">
      <div className="border-border bg-card border p-6">
        <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
          System
        </p>
        <p className="font-heading mt-3 flex items-center gap-3 text-3xl font-bold uppercase">
          <span
            aria-hidden
            className="bg-destructive inline-block size-2 rounded-full"
          />
          Fault
        </p>
        <p className="font-mono text-muted-foreground mt-3 text-[0.68rem] tracking-[0.04em]">
          something failed while rendering this page &middot; retrying is safe
        </p>
      </div>
      <Button
        onClick={reset}
        className="font-heading mt-8 h-11 px-6 tracking-[0.06em] uppercase"
      >
        Try again
      </Button>
    </div>
  );
}
