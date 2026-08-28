import type { Metadata } from "next";
import { getProfile } from "@/lib/content/repo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Damien Farrar — full-stack engineer & architect in Melbourne.",
};

export default function AboutPage() {
  const profile = getProfile();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Lead Architect",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Melbourne",
      addressCountry: "AU",
    },
    url: siteUrl,
    sameAs: Object.values(profile.socials),
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-20 sm:px-10 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
        Operator profile
      </p>
      <h1 className="font-heading mt-4 text-4xl font-bold sm:text-6xl">
        About
      </h1>
      <p className="mt-6 max-w-2xl text-lg">{profile.bio}</p>
      <p className="font-mono text-muted-foreground mt-6 text-[0.68rem] tracking-[0.06em] uppercase">
        {profile.location}
      </p>

      <div className="border-border mt-12 grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-3">
        {(
          [
            [
              "Documented decisions",
              "Significant choices get written down — this site's are public in docs/adr.",
            ],
            [
              "Boring infrastructure",
              "The impressive diagram loses to the system that stays up and stays cheap.",
            ],
            [
              "Working in public",
              "The source for this site is the other half of the portfolio.",
            ],
          ] as const
        ).map(([title, body]) => (
          <div key={title} className="border-border bg-card border p-5">
            <h2 className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
              {title}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-6">
        {Object.entries(profile.socials).map(([label, url]) => (
          <a
            key={label}
            href={url}
            className="font-mono text-primary text-sm font-medium tracking-[0.06em] uppercase underline-offset-4 hover:underline"
          >
            {label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
