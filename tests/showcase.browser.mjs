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
    await page.screenshot({ path: `../out/showcase-${width}-hero.png` });
    for (const section of [
      ".intro",
      ".featured",
      "#experiments",
      "#playground",
      "#tiktok",
      "#about",
      "#contact",
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
    }
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      "Horizontal overflow",
    );
    assert.equal(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every((i) => i.complete && i.naturalWidth > 0),
        ),
      true,
      "Broken image",
    );
    await page.getByRole("button", { name: "Watch", exact: true }).click();
    assert.equal(await page.locator(".project").count(), 1);
    await page
      .getByRole("button", { name: "Explore A little more motion" })
      .click();
    assert.equal(await page.locator("dialog").evaluate((d) => d.open), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").evaluate((d) => d.open), false);
    await page.getByRole("button", { name: "All", exact: true }).click();
    assert.equal(await page.locator(".project").count(), 3);
    await page.getByRole("button", { name: "Shuffle composition" }).click();
    await page
      .getByRole("button", { name: "Electric garden", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Electric garden", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.getByRole("button", { name: "Play motion preview" }).click();
    await page.waitForTimeout(1000);
    assert.equal(
      await page
        .locator(".video-frame video")
        .evaluate((v) => !v.paused && v.currentTime > 0),
      true,
    );
    await page.getByRole("button", { name: "Pause motion preview" }).click();
    if (width <= 700) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.locator("#mobile-navigation").getByText("The person").click();
      await page.locator("#mobile-navigation").waitFor({ state: "detached" });
    }
    await page.screenshot({
      path: `../out/showcase-${width}-full.png`,
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
        video: "pass",
        playground: "pass",
        errors,
      }),
    );
    await page.close();
  }
  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await reduced.goto(root);
  assert.equal(
    await reduced
      .locator(".about-asterisk")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  await reduced.goto(root + "/privacy/");
  await reduced.getByRole("heading", { name: "A little privacy." }).waitFor();
  console.log("Reduced motion and privacy: pass");
} finally {
  await browser.close();
}
