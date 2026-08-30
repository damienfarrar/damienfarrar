"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type FormState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

type Field = "name" | "email" | "message";
type FieldErrors = Partial<Record<Field, string>>;

const inputClasses =
  "border-input bg-card text-foreground placeholder:text-muted-foreground w-full border px-3 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

// Mirrors contactSubmissionSchema in lib/domain/contact.ts. The server stays
// the authority; this just saves the round trip and names the field.
function validate(values: Record<Field, string>): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Add your name.";
  else if (name.length > 100) errors.name = "That's over 100 characters.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";

  if (message.length < 10)
    errors.message = "A few more words — at least 10 characters.";
  else if (message.length > 5000)
    errors.message = "That's over the 5,000-character limit.";

  return errors;
}

export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const values: Record<Field, string> = {
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      message: String(data.message ?? ""),
    };

    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = (["name", "email", "message"] as const).find(
        (f) => fieldErrors[f],
      );
      if (first) form.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }

    setErrors({});
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
        <p className="font-heading text-success flex items-center gap-3 text-xl font-semibold">
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

  const clear = (field: Field) => () =>
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));

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
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          onInput={clear("name")}
          className={inputClasses}
        />
        {errors.name && (
          <p
            id="contact-name-error"
            className="text-destructive mt-1.5 text-xs"
          >
            {errors.name}
          </p>
        )}
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
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          onInput={clear("email")}
          className={inputClasses}
        />
        {errors.email && (
          <p
            id="contact-email-error"
            className="text-destructive mt-1.5 text-xs"
          >
            {errors.email}
          </p>
        )}
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
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          onInput={clear("message")}
          className={inputClasses}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            className="text-destructive mt-1.5 text-xs"
          >
            {errors.message}
          </p>
        )}
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
        className="font-mono h-11 px-6 tracking-[0.06em] uppercase"
      >
        {state.status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
