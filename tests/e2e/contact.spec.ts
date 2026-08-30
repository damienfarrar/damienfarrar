import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact");
});

test("a valid submission reports success", async ({ page }) => {
  await page.getByLabel("Name").fill("Playwright Visitor");
  await page.getByLabel("Email").fill("visitor@example.com");
  await page
    .getByLabel("Message")
    .fill("This is an end-to-end test of the contact happy path.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/message sent/i)).toBeVisible();
});

test("a too-short message is caught client-side, before any request", async ({
  page,
}) => {
  await page.getByLabel("Name").fill("Short Message");
  await page.getByLabel("Email").fill("short@example.com");
  await page.getByLabel("Message").fill("hi");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  await expect(page.getByLabel("Message")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("a malformed email is caught client-side", async ({ page }) => {
  await page.getByLabel("Name").fill("Bad Email");
  await page.getByLabel("Email").fill("not-an-email");
  await page
    .getByLabel("Message")
    .fill("This message is long enough to pass validation.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/valid email address/i)).toBeVisible();
});

test("a honeypot submission sees fake success (bots learn nothing)", async ({
  page,
}) => {
  await page.getByLabel("Name").fill("Definitely Human");
  await page.getByLabel("Email").fill("bot@example.com");
  await page
    .getByLabel("Message")
    .fill("Great offers for your website today, act now.");
  // The honeypot is visually hidden; a bot autofills it via the DOM.
  await page.evaluate(() => {
    const el = document.getElementById(
      "contact-company",
    ) as HTMLInputElement | null;
    if (el) el.value = "Bots Inc";
  });
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/message sent/i)).toBeVisible();
});
