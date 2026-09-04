# Assertions Style

1. Use Playwright's web-first, auto-retrying assertions exclusively:
   `await expect(locator).toBeVisible()`, `.toHaveText()`, `.toHaveURL()`, `.toHaveCount()`, `.toBeEnabled()`, etc.
2. Never use `expect(await locator.isVisible()).toBe(true)` style — this defeats auto-waiting/retry.
3. Never use `page.waitForTimeout(...)` to "wait for something to appear." Use an assertion or `waitForURL`/`waitForLoadState` instead. `waitForTimeout` is only acceptable with an inline comment explaining an unavoidable, non-deterministic animation delay — treat this as a last resort requiring code-review sign-off.
4. Assertions belong only in spec files, never in page objects (see `pom-standards.md`).
5. Each test case should assert the specific outcome described in its module.md row — avoid vague/broad assertions (e.g. asserting `page.url()` contains the domain) when a precise one is available (e.g. asserting the exact expected path or a specific element's text).
6. Prefer a small number of meaningful assertions per test over asserting every visible pixel — one test = one behavior from the module.md test case list.
