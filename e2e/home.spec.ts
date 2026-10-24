import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("hero headline has a single readable accessible name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("I find the bug, file it, fix it.");
  });

  test("hero headline becomes visible after the intro", async ({ page }) => {
    await page.goto("/");
    const firstWord = page.locator("#hero-heading .word").first();
    await expect(firstWord).toBeVisible({ timeout: 6000 });
  });

  test("renders without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/", { waitUntil: "networkidle" });
    expect(errors).toEqual([]);
  });

  test("dock link scrolls to its section and marks it current", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.locator("html[data-intro='done']").waitFor({ timeout: 6000 });
    const nav = page.getByRole("navigation", { name: "Sections" });
    await nav.getByRole("link", { name: "Work" }).click();
    await expect(page.locator("#work")).toBeInViewport({ ratio: 0.2, timeout: 5000 });
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "true", { timeout: 5000 });
    if (isMobile) await expect(nav.getByRole("link", { name: "Index" })).toBeHidden();
  });

  test("every new-tab link is isolated from the opener", async ({ page }) => {
    await page.goto("/");
    const unsafe = await page.locator('a[target="_blank"]').evaluateAll((links) =>
      links.filter((link) => !(link.getAttribute("rel") ?? "").includes("noopener")).map((link) => link.getAttribute("href")),
    );
    expect(unsafe).toEqual([]);
  });

  test("bug trails link to the real issue and pull request", async ({ page }) => {
    await page.goto("/");
    const trail = page.locator("[data-trail]").first();
    // Trail steps reveal on scroll; hidden elements have no accessible role.
    await trail.scrollIntoViewIfNeeded();
    await expect(trail.getByRole("link", { name: /Issue #133/ })).toHaveAttribute("href", "https://github.com/hyperjump-io/json-schema/issues/133");
    await expect(trail.getByRole("link", { name: /PR #134/ })).toHaveAttribute("href", "https://github.com/hyperjump-io/json-schema/pull/134");
  });

  test("keyboard can reach links in sections that have not been revealed yet", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard flow is a desktop concern");
    await page.goto("/");
    await page.locator("html[data-intro='done']").waitFor({ timeout: 6000 });
    const issueLink = page.locator("[data-trail]").first().locator("a").first();
    // Still above the reveal trigger: must already be focusable, and visible once focused.
    await issueLink.focus();
    await expect(issueLink).toBeFocused();
    await expect(issueLink).toHaveCSS("opacity", "1");
  });

  test("hero stats end on their real values", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-count]").first()).toHaveText("10", { timeout: 6000 });
    await expect(page.locator("[data-count]").first()).toHaveCSS("opacity", "1");
  });

  for (const width of [320, 390, 768, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("shows everything immediately and skips the preloader", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".preloader")).toBeHidden();
    const hidden = await page
      .locator(".word, [data-reveal-item], [data-step], [data-count]")
      .evaluateAll((nodes) => nodes.filter((node) => getComputedStyle(node).opacity === "0").length);
    expect(hidden).toBe(0);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all content is readable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero-heading .word").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "PRism" })).toBeVisible();
    await expect(page.locator(".preloader")).toBeHidden();
  });
});
