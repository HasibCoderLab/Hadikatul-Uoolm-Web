import { expect, test } from "@playwright/test";

/** The exact matrix required by the brief. Checked explicitly here so the
 *  overflow guarantee does not depend on playwright.config.ts projects. */
const REQUIRED_VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
] as const;

test.describe("home page", () => {
  test("renders without console or page errors", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));

    await page.goto("/");
    await expect(page.locator("h1")).toContainText("চাঁপাইনবাবগঞ্জের সেরা");

    expect(problems).toEqual([]);
  });

  test("has no horizontal overflow at 360 / 768 / 1280 / 1920", async ({ page }) => {
    await page.goto("/");

    for (const viewport of REQUIRED_VIEWPORTS) {
      await page.setViewportSize(viewport);
      await page.waitForLoadState("domcontentloaded");

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
      }));

      // 1px tolerance for sub-pixel rounding.
      expect(
        metrics.scrollWidth,
        `documentElement overflows at ${viewport.width}px`,
      ).toBeLessThanOrEqual(viewport.width + 1);
      expect(
        metrics.scrollWidth,
        `clientWidth mismatch at ${viewport.width}px`,
      ).toBeLessThanOrEqual(metrics.clientWidth + 1);
      expect(metrics.bodyScrollWidth, `body overflows at ${viewport.width}px`).toBeLessThanOrEqual(
        viewport.width + 1,
      );
    }
  });

  test("keeps every section inside the viewport", async ({ page }) => {
    await page.goto("/");

    const ids = ["home", "courses", "aboutus", "team", "contactus"];
    for (const viewport of REQUIRED_VIEWPORTS) {
      await page.setViewportSize(viewport);

      for (const id of ids) {
        const box = await page.locator(`#${id}`).boundingBox();
        expect(box, `section #${id} should be laid out`).not.toBeNull();
        if (box) {
          expect(box.width, `section #${id} exceeds ${viewport.width}px`).toBeLessThanOrEqual(
            viewport.width + 1,
          );
        }
      }
    }
  });

  test("has no dead links and every hash target exists", async ({ page }) => {
    await page.goto("/");

    const audit = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));
      const dead: string[] = [];
      const missingTargets: string[] = [];

      for (const anchor of anchors) {
        const href = anchor.getAttribute("href") ?? "";
        if (href === "#" || href === "" || href.toLowerCase().startsWith("javascript:")) {
          dead.push(anchor.textContent?.trim() ?? href);
          continue;
        }
        if (href.startsWith("#") && !document.querySelector(href)) {
          missingTargets.push(href);
        }
      }

      return {
        count: anchors.length,
        dead,
        missingTargets,
        invalidProtocols: anchors
          .map((a) => a.getAttribute("href") ?? "")
          .filter((href) => /^[a-z]+:/i.test(href) && !/^(https?|mailto|tel):/i.test(href)),
      };
    });

    expect(audit.count).toBeGreaterThan(5);
    expect(audit.dead).toEqual([]);
    expect(audit.missingTargets).toEqual([]);
    expect(audit.invalidProtocols).toEqual([]);
  });

  test("mobile drawer opens, closes on Escape and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "মেনু খুলুন" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();

    const drawer = page.locator("#site-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "আমাদের টিম" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
