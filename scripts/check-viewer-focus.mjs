// Run with Playwright installed, or PLAYWRIGHT_MODULE pointing to its package.
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium, webkit } = createRequire(import.meta.url)(
  process.env.PLAYWRIGHT_MODULE || "playwright",
);
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const access =
  process.env.READ_PREVIEW_ACCESS === "true"
    ? fs.readFileSync(0, "utf8").trim()
    : null;
const results = [];
for (const [engine, type] of Object.entries({ chromium, webkit })) {
  const browser = await type.launch({ headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 1000 },
      });
      const page = await context.newPage();
      if (access) await page.goto(access);
      for (const mode of ["Sequence", "Overview"])
        for (const opening of ["pointer", "keyboard"])
          for (const closing of ["button", "Escape"]) {
            await page.goto(base + "/collections/tango");
            if (mode === "Overview")
              await page
                .getByRole("button", { name: "Overview", exact: true })
                .click();
            const trigger = page.getByRole("button", {
              name: "Enlarge photograph 2",
              exact: true,
            });
            await trigger.scrollIntoViewIfNeeded();
            // Reproduce the Next.js/skip-link page-focus state before pointer activation.
            await page
              .locator("main")
              .evaluate((e) => e.focus({ preventScroll: true }));
            if (opening === "keyboard") await trigger.focus();
            const scroll = await page.evaluate(() => ({
              x: scrollX,
              y: scrollY,
            }));
            if (opening === "pointer") await trigger.click();
            else await trigger.press("Enter");
            await page.locator("dialog[open]").waitFor();
            await page
              .getByRole("button", { name: "Next photograph", exact: true })
              .click();
            await page.keyboard.press("ArrowRight");
            assert.equal(
              await page.locator(".lightbox-bottom span").innerText(),
              "4 / 5",
            );
            assert(
              await page.evaluate(() =>
                document.body.classList.contains("modal-open"),
              ),
            );
            if (closing === "button")
              await page
                .getByRole("button", {
                  name: "Close photograph viewer",
                  exact: true,
                })
                .click();
            else await page.keyboard.press("Escape");
            await page.locator("dialog[open]").waitFor({ state: "detached" });
            const restored = await trigger.evaluate((e) => ({
              focused: document.activeElement === e,
              visible: e.matches(":focus-visible"),
              outline: getComputedStyle(e).outlineStyle,
              mainOutline: getComputedStyle(document.querySelector("main"))
                .outlineStyle,
              x: scrollX,
              y: scrollY,
              locked: document.body.classList.contains("modal-open"),
            }));
            assert(
              restored.focused,
              `${engine}: exact trigger must regain focus`,
            );
            assert.equal(restored.mainOutline, "none");
            assert(
              Math.abs(restored.x - scroll.x) <= 1 &&
                Math.abs(restored.y - scroll.y) <= 1,
              `${engine}: scroll changed ${scroll.y} -> ${restored.y}`,
            );
            assert(!restored.locked);
            if (opening === "keyboard" && closing === "Escape") {
              assert(restored.visible);
              assert.notEqual(restored.outline, "none");
            }
            results.push({
              engine,
              width,
              mode,
              opening,
              closing,
              passed: true,
            });
            if (
              process.env.EVIDENCE_DIR &&
              mode === "Sequence" &&
              opening === "pointer" &&
              closing === "Escape"
            ) {
              fs.mkdirSync(process.env.EVIDENCE_DIR, { recursive: true });
              await page.screenshot({
                path: `${process.env.EVIDENCE_DIR}/viewer-close-${engine}-${width}.png`,
              });
            }
          }
      // The main landmark still has a meaningful indicator when explicitly focused
      // by the skip-link/keyboard flow; no global outline suppression was introduced.
      await page.keyboard.press("Tab");
      await page.locator("main").focus();
      assert.notEqual(
        await page
          .locator("main")
          .evaluate((e) => getComputedStyle(e).outlineStyle),
        "none",
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
console.log(JSON.stringify({ base, cases: results.length, results }, null, 2));
