# Playwright MCP Exploration Rules

Playwright MCP is a dev/authoring-time tool for the agent to explore the REAL running app before writing code. It is never used in CI and never used to author test files directly.

1. Before writing or updating a page object's locators, use Playwright MCP to navigate to the target page and capture an accessibility snapshot (or DOM snapshot) of the real elements referenced by the module.md test cases.
2. If the page requires authentication, reuse the existing `auth/<role>.json` storage state when driving the MCP browser session, rather than re-implementing login logic inside MCP exploration.
3. Prefer locators confirmed present in the MCP snapshot over anything inferred purely from reading the module.md description. If the description and the real DOM disagree, trust the DOM and note the discrepancy back to the engineer.
4. If MCP navigation fails (page unreachable, selector not found, session expired), STOP and report the failure — do not fall back to guessing a locator to "make progress."
5. MCP may also be used post-authoring to do a quick sanity click-through of a new flow before finalizing a spec, catching unexpected modals, redirects, or validation states not mentioned in module.md.
6. All actual test code (page objects, specs) must still be written as normal files following `pom-standards.md`, `locator-strategy.md`, and `naming-conventions.md` — MCP informs the code, it does not generate or run it in place of Playwright's own test runner.
