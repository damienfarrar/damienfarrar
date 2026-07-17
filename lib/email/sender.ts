export interface ContactEmail {
  fromName: string;
  replyTo: string;
  message: string;
}

export interface EmailSender {
  send(email: ContactEmail): Promise<void>;
}

// Resend via its plain REST API — an SDK is a dependency this one call
// doesn't earn. Behind the interface so tests (and CI) never touch it.
class ResendSender implements EmailSender {
  constructor(
    private apiKey: string,
    private to: string,
  ) {}

  async send(email: ContactEmail): Promise<void> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "contact@damienfarrar.com",
        to: this.to,
        reply_to: email.replyTo,
        subject: `Contact form — ${email.fromName}`,
        text: email.message,
      }),
    });
    if (!res.ok) {
      // Status only — never the payload, which contains PII.
      throw new Error(`Resend responded ${res.status}`);
    }
  }
}

class DevLogSender implements EmailSender {
  async send(): Promise<void> {
    // No PII in logs — the fact of a send is all dev needs to see.
    console.info("[email] dev stub: contact email would send here");
  }
}

export function getEmailSender(): EmailSender {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  return apiKey && to ? new ResendSender(apiKey, to) : new DevLogSender();
}
