---
name: code-review
description: Use this skill after new/updated page objects and specs are created (typically right after create-new-tests), or whenever asked to review Playwright test code against the project's rules, before considering the work done.
---

# Code Review

## Trigger
Run automatically at the end of `create-new-tests`, or on demand: "review the tests you just wrote" / "code review tests/<module>/<page>.spec.js".

## Checklist

### POM compliance (`pom-standards.md`)
- [ ] No `expect(...)` calls inside any file under `src/pages/`.
- [ ] Every page object extends `BasePage`.
- [ ] Every new page object is registered in `src/fixtures/base.fixture.js`, and specs use the fixture (`{ pimPage }`) rather than `new PimPage(page)`.

### Locators (`locator-strategy.md`)
- [ ] Locators follow the priority order (role/label/placeholder/text before CSS).
- [ ] No absolute XPath.
- [ ] No unexplained `.nth()`/positional locators.
- [ ] Every locator in a NEW or CHANGED page object was verified via Playwright MCP exploration (flag any that appear hand-guessed from the module.md description with no exploration evidence — these are the most likely to be hallucinated or stale).

### Naming (`naming-conventions.md`)
- [ ] File paths match `<module>/<page>` conventions.
- [ ] Test IDs follow `TC-<MODULE>-<PAGE>-<SEQ>` and match the ID used in `test-cases/<module>/<page>.md`.
- [ ] `describe` block reads `Module: <X> > Page: <Y>`.

### Assertions (`assertions-style.md`)
- [ ] Only web-first `expect(locator)...` assertions used.
- [ ] No `page.waitForTimeout()` without an inline justification comment.
- [ ] Each test asserts the specific behavior in its module.md row, not something vaguer.

### Auth (`auth-strategy.md`)
- [ ] No spec calls `loginPage.login()` unless it's an explicitly-exempt login-flow spec that also sets `test.use({ storageState: { cookies: [], origins: [] } })`.
- [ ] No hardcoded credentials — env vars only.

### Reporting (`reporting-rules.md`)
- [ ] `playwright.config.js` still declares only the native `html` reporter — flag and revert any accidental addition of `list`/`json`/other reporters.

### Coverage (`coverage-tracking-rules.md`)
- [ ] Every newly-automated test case has a corresponding row flipped to `Automated` with a correct `Spec Ref` in `test-cases/<module>/<page>.md`.
- [ ] `node scripts/update-coverage.js` was run after the edits (check `test-coverage.md` timestamp/numbers reflect the new tests).
- [ ] No one hand-edited a percentage or summary table instead of running the script.

### Sanity
- [ ] `npx playwright test <changed spec>` passes locally (or was reported as run).
- [ ] No unused imports/locators left in page objects.

## Output
Summarize findings as a short pass/fail list per category above. If anything fails, fix it directly (this skill can edit files) and re-check, rather than just reporting the problem.
