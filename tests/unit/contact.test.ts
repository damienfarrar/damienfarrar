import { describe, expect, it } from "vitest";
import { decideContact } from "@/lib/domain/contact";

const valid = {
  name: "A recruiter",
  email: "someone@example.com",
  message: "I read the eleven-services case study and have a question.",
  company: "",
};

describe("decideContact", () => {
  it("sends a valid submission", () => {
    const decision = decideContact(valid);
    expect(decision.action).toBe("send");
    if (decision.action === "send") {
      expect(decision.submission.email).toBe(valid.email);
    }
  });

  it("silently drops submissions with a filled honeypot", () => {
    expect(decideContact({ ...valid, company: "Bots Inc" }).action).toBe(
      "drop",
    );
  });

  it("rejects invalid emails, short messages, and junk shapes", () => {
    expect(decideContact({ ...valid, email: "not-an-email" }).action).toBe(
      "invalid",
    );
    expect(decideContact({ ...valid, message: "hi" }).action).toBe("invalid");
    expect(decideContact("garbage").action).toBe("invalid");
    expect(decideContact(null).action).toBe("invalid");
  });

  it("treats a missing honeypot field as human (progressive enhancement)", () => {
    const withoutHoneypot: Partial<typeof valid> = { ...valid };
    delete withoutHoneypot.company;
    expect(decideContact(withoutHoneypot).action).toBe("send");
  });
});
