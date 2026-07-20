import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Kill the boot animation so assertions never race it.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("home shows the console and routes to a case study", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /years in production/i }),
  ).toBeVisible();
  await expect(page.getByText(/self-report/i)).toBeVisible();

  await page.getByRole("link", { name: /read the case studies/i }).click();
  await expect(page).toHaveURL(/\/projects$/);

  await page.getByRole("link", { name: /eleven services, one bill/i }).click();
  await expect(page).toHaveURL(/\/projects\/eleven-services-one-bill$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /eleven services/i }),
  ).toBeVisible();
});

test("header navigation reaches experience, about, and contact", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Site" });

  await nav.getByRole("link", { name: "Experience" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Experience" }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "About" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "About" }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Contact" }),
  ).toBeVisible();
});

test("theme toggle flips the data-theme attribute and persists", async ({
  page,
}) => {
  await page.goto("/");
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");
  const after = before === "dark" ? "light" : "dark";

  await page.getByRole("button", { name: "Switch theme" }).click();
  await expect(html).toHaveAttribute("data-theme", after);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", after);
});

test("unknown routes get the console-voice 404", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/404 — not found/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /back to the console/i }),
  ).toBeVisible();
});
