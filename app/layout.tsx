import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProfile } from "@/lib/content/repo";
import { yearsInProduction } from "@/lib/domain/experience";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Dispatch system: the IBM Plex superfamily — Plex Sans (headings + body,
// engineered for screen reading) with Plex Mono for labels and telemetry.
const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Damien Farrar — Full-stack engineer & architect",
    template: "%s · Damien Farrar",
  },
  description: `Full-stack engineer and architect based in Melbourne, Australia. ${yearsInProduction(getProfile().careerStartYear)} years in production: case studies, experience, and the source behind this site.`,
  openGraph: {
    siteName: "Damien Farrar",
    type: "website",
    locale: "en_AU",
  },
};

// Runs during HTML parsing, before first paint, so the saved (or system)
// theme applies with no flash. See the "preventing flash" pattern in the
// Next.js docs; the toggle in <SiteHeader> writes the same storage key.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only px-4 py-2 focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
