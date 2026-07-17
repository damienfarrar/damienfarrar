import { z } from "zod";

// Pure contact logic: schema + submission decision. The route handler
// stays thin, and this is the part unit tests exercise deterministically.

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(10).max(5000),
  // Honeypot: hidden from humans, autofilled by naive bots. Named like a
  // real field on purpose.
  company: z.string().max(200).optional().default(""),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export type ContactDecision =
  | { action: "invalid" }
  | { action: "drop" }
  | { action: "send"; submission: ContactSubmission };

export function decideContact(input: unknown): ContactDecision {
  const parsed = contactSubmissionSchema.safeParse(input);
  if (!parsed.success) return { action: "invalid" };
  // A filled honeypot gets a silent success so bots learn nothing.
  if (parsed.data.company !== "") return { action: "drop" };
  return { action: "send", submission: parsed.data };
}
