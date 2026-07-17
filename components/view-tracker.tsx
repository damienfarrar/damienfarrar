"use client";

import { useEffect } from "react";

// Fires the KV write path once per session per study. Invisible on purpose
// (plan: exists mainly for the code reader); failures are swallowed —
// analytics must never surface an error to a visitor.
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable — count anyway rather than double-guard
    }
    fetch(`/api/views/${slug}`, { method: "POST", keepalive: true }).catch(
      () => {},
    );
  }, [slug]);

  return null;
}
