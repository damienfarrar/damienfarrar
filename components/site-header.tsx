import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-border border-b">
      <div className="mx-auto flex w-full max-w-6xl items-baseline gap-6 px-5 py-5 sm:px-10">
        <Link
          href="/"
          className="font-mono text-primary text-[0.65rem] font-medium tracking-[0.1em] uppercase"
        >
          damienfarrar.com
        </Link>
        <nav
          aria-label="Site"
          className="ml-auto hidden items-baseline gap-6 sm:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-muted-foreground hover:text-foreground text-[0.65rem] tracking-[0.1em] uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
