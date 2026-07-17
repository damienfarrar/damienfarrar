"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type FormState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

const inputClasses =
  "border-input bg-card text-foreground placeholder:text-muted-foreground w-full border px-3 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        setState({ status: "sent" });
        return;
      }
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setState({
        status: "error",
        message:
          body?.error ?? "The message could not be sent. Try again later.",
      });
    } catch {
      setState({
        status: "error",
        message: "The message could not be sent. Check your connection.",
      });
    }
  }

  if (state.status === "sent") {
    return (
      <div className="border-border bg-card max-w-xl border p-6">
        <p className="font-heading text-success flex items-center gap-3 text-xl font-semibold uppercase">
          <span
            aria-hidden
            className="bg-success inline-block size-2 rounded-full"
          />
          Message sent
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          I&rsquo;ll reply by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5" noValidate>
      <div>
        <label
          htmlFor="contact-name"
          className="font-mono text-muted-foreground mb-1.5 block text-[0.62rem] tracking-[0.1em] uppercase"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="font-mono text-muted-foreground mb-1.5 block text-[0.62rem] tracking-[0.1em] uppercase"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="font-mono text-muted-foreground mb-1.5 block text-[0.62rem] tracking-[0.1em] uppercase"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className={inputClasses}
        />
      </div>

      {/* Honeypot: humans never see it; bots autofill it. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={state.status === "sending"}
        className="font-heading h-11 px-6 tracking-[0.06em] uppercase"
      >
        {state.status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
