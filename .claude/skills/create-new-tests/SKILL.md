---
name: create-new-tests
description: Use this skill when a test automation engineer provides a module.md file (in test-requirements/) and asks to create/automate new Playwright tests from it. Generates/updates page objects, spec files, per-page coverage tracking files, and refreshes the master coverage rollup.
---

# Create New Tests

## Trigger
The engineer says something like: "Automate tests from `test-requirements/<module>.md`" or points at a specific module/page/section within it.

## Inputs
- `test-requirements/<module>.md` — the engineer-authored list of required test cases per page/section (read-only, never modify).
- Existing `.claude/rules/*.md` — always reload all of them, they are the contract for output quality.
- Existing `test-cases/<module>/<page>.md` if present — don't duplicate rows already marked `Automated`.

## Procedure

1. **Load rules.** Read every file in `.claude/rules/` before writing anything.
2. **Parse requirements.** Read `test-requirements/<module>.md`. For each page and section, list test cases not yet `Automated` (cross-reference `test-cases/<module>/<page>.md` if it already exists).
3. **Explore the real app.** Per `mcp-exploration-rules.md`, use Playwright MCP to navigate to each target page (reusing `auth/<role>.json` if the page requires login) and capture the real locators needed for each test case. Do not skip this step.
4. **Update/create page object(s).** In `src/pages/<module>/<page>.page.js`, following `pom-standards.md` and `locator-strategy.md`. Register any new page object in `src/fixtures/base.fixture.js`.
5. **Check auth requirements.** Per `auth-strategy.md`: does this page's tests need a role with existing storage state, or a new one? Create a new `tests-setup/<role>.setup.js` + `playwright.config.js` project only if genuinely necessary; otherwise reuse what exists. If required credentials aren't available, stop and ask the engineer.
6. **Write the spec file.** In `tests/<module>/<page>.spec.js`, following `naming-conventions.md` (Test IDs, describe structure) and `assertions-style.md`. One `test()` per test case from the module.md, title prefixed with its Test ID.
7. **Sanity-check the flow** (optional but preferred). Use MCP to click through the new flow once before finalizing, to catch modals/redirects not mentioned in the module.md.
8. **Run the tests locally** if the environment allows it (`npx playwright test tests/<module>/<page>.spec.js`) to confirm they pass before declaring them `Automated`.
9. **Update coverage tracking.** In `test-cases/<module>/<page>.md`, following `coverage-tracking-rules.md`:
   - Add rows for any test cases not previously tracked.
   - Flip Status to `Automated` and set `Spec Ref` for every test case just implemented.
   - Do NOT hand-compute the Section coverage / Page Summary numbers.
10. **Regenerate rollups.** Run `node scripts/update-coverage.js`. This recalculates every Section coverage line, every Page Summary table, and rewrites `test-coverage.md`.
11. **Report back to the engineer**: which test cases were automated, the new page's coverage %, the module's coverage %, and the new overall coverage % from `test-coverage.md`. Mention anything skipped/blocked and why.

## Guardrails
- Never modify `test-requirements/<module>.md`.
- Never invent test cases not present in the module.md — if you spot an obviously missing edge case, mention it to the engineer as a suggestion rather than silently adding it.
- Never hardcode credentials — use the env vars defined in `auth-strategy.md`.
- Never add a reporter other than the native HTML reporter.
- If a test case is ambiguous or the real DOM doesn't match the module.md description, stop and ask rather than guessing.
