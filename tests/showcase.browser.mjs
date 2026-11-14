import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const root = process.env.SHOWCASE_URL || "http://127.0.0.1:5182";
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: width > 700 ? 960 : 844 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(root, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    assert.equal(await page.locator("h1").textContent(), "Player2.sg");
    assert.equal(
      await page
        .locator("h1 .matrix-player")
        .evaluate((e) => getComputedStyle(e).color),
      "rgb(0, 0, 0)",
    );
    assert.equal(
      await page
        .locator("h1 .matrix-player")
        .evaluate((e) => getComputedStyle(e).webkitTextStrokeColor),
      "rgb(69, 255, 106)",
    );
    assert.equal(
      await page
        .locator("h1 .matrix-two")
        .evaluate((e) => getComputedStyle(e).color),
      "rgb(69, 255, 106)",
    );
    await page.screenshot({ path: `../out/pro-player2-${width}-hero.png` });
    assert.equal(
      await page.locator("video").count(),
      0,
      "No video content permitted",
    );
    assert.equal(
      await page.locator("[src*=reel],[src*=nick],[src*=playground]").count(),
      0,
    );
    for (const section of [
      ".intro",
      "#projects",
      ".fuwa-feature",
      "#approach",
      "#tiktok",
      "#about",
      "#contact",
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);
    }
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.equal(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every((i) => i.complete && i.naturalWidth > 0),
        ),
      true,
    );
    await page.locator(".filters button").filter({ hasText: "Play" }).click();
    assert.equal(await page.locator(".project").count(), 1);
    await page
      .getByRole("button", { name: "Explore FUWA", exact: true })
      .click();
    assert.equal(await page.locator("dialog").evaluate((d) => d.open), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").evaluate((d) => d.open), false);
    await page.locator(".filters button").filter({ hasText: "All" }).click();
    assert.equal(await page.locator(".project").count(), 3);
    await page
      .locator(".filters button")
      .filter({ hasText: "Automate" })
      .click();
    assert.equal(await page.locator(".project").count(), 1);
    await page
      .getByRole("button", {
        name: "Explore TIKTOK CONTENT PIPELINE",
        exact: true,
      })
      .click();
    assert.equal(await page.locator("dialog .pipeline-stage").count(), 4);
    assert.equal(
      await page.locator("dialog a").getAttribute("href"),
      "https://www.tiktok.com/@player2.sg",
    );
    await page.keyboard.press("Escape");
    await page.locator(".filters button").filter({ hasText: "All" }).click();
    if (width <= 700) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .locator("#mobile-navigation")
        .getByText("About", { exact: true })
        .click();
      await page.locator("#mobile-navigation").waitFor({ state: "detached" });
    }
    await page.screenshot({
      path: `../out/pro-player2-${width}-full.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        width,
        images: "pass",
        overflow: "none",
        filters: "pass",
        modal: "pass",
        videoContent: "none",
        errors,
      }),
    );
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(root + "/privacy/");
  await page.getByRole("heading", { name: "THE SMALL PRINT." }).waitFor();
  console.log("Privacy route: pass");
} finally {
  await browser.close();
}
