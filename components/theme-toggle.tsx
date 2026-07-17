"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Icon visibility is CSS-driven from [data-theme] so server and client
// render identical markup — no state, no hydration mismatch. The inline
// script in the root layout resolves the initial theme before paint.
export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Switch theme"
      onClick={() => {
        const root = document.documentElement;
        const next =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem("theme", next);
        } catch {
          // storage unavailable (private mode) — theme still applies for this page
        }
      }}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
