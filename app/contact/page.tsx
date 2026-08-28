import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Damien Farrar.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-20 sm:px-10 sm:pt-24">
      <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
        Open channel
      </p>
      <h1 className="font-heading mt-4 text-4xl font-bold sm:text-6xl">
        Contact
      </h1>
      <p className="text-muted-foreground mt-5 mb-10 max-w-xl text-lg">
        For roles, projects, or questions about how this site is built. Messages
        go straight to my inbox.
      </p>
      <ContactForm />
    </div>
  );
}
