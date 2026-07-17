import type { NextRequest } from "next/server";
import { decideContact } from "@/lib/domain/contact";
import { getEmailSender } from "@/lib/email/sender";
import { allowContactRequest } from "@/lib/kv/rate-limit";

// Hardened per plan §6: Zod validation, sliding-window rate limit by IP,
// honeypot, generic responses, and no PII in logs — errors log status
// names only, never form contents.

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Check the form fields and try again." },
      { status: 400 },
    );
  }

  const decision = decideContact(body);

  if (decision.action === "invalid") {
    return Response.json(
      { error: "Check the form fields and try again." },
      { status: 400 },
    );
  }

  // Honeypot hit: pretend success so bots learn nothing.
  if (decision.action === "drop") {
    return Response.json({ ok: true });
  }

  if (!(await allowContactRequest(clientIp(request)))) {
    return Response.json(
      { error: "Too many messages from this connection. Try again later." },
      { status: 429 },
    );
  }

  try {
    await getEmailSender().send({
      fromName: decision.submission.name,
      replyTo: decision.submission.email,
      message: decision.submission.message,
    });
  } catch (error) {
    console.error(
      "[contact] send failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return Response.json(
      { error: "The message could not be sent. Try again later." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
