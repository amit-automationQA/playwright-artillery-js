# playwright-artillery-js

Playwright JS test framework for **OrangeHRM Demo** (`https://opensource-demo.orangehrmlive.com/`), built around:

- **Page Object Model** (`src/pages/`)
- **Storage-state based login** (log in once, reuse the session everywhere)
- **Native Playwright HTML report only** — no other reporters
- **`.claude/skills` + `.claude/rules`** — the agent creates new tests from a `module.md` file the test automation engineer provides, then reviews its own code against the rules
- **Per-page + master markdown coverage tracking**, recalculated by a deterministic Node script (never hand-computed)
- **GitHub Actions** pipeline that runs the suite and uploads the native HTML report as a build artifact

> Note: Artillery-based load testing is intentionally out of scope for this iteration.

## Getting started

```bash
npm install
npx playwright install
cp .env.example .env   # fill in TEST_ADMIN_USER / TEST_ADMIN_PASS
```

Default demo credentials: `admin` / `admin123`.

## Running tests

```bash
npm test                 # headless run, generates auth/admin.json via the setup project automatically
npm run test:headed      # headed run
npm run test:ui          # Playwright UI mode
npm run report           # open the last native HTML report
npm run coverage         # recalculate test-cases/**/*.md and test-coverage.md
```

The `setup` project (`tests-setup/auth.setup.js`) always runs first (via `dependencies: ['setup']` in `playwright.config.js`) and logs in fresh — storage state is never cached across CI runs.

## Project layout

```
.claude/
  skills/
    create-new-tests/SKILL.md   # agent workflow: module.md -> page objects + specs + coverage update
    code-review/SKILL.md        # agent workflow: review generated code against rules
  rules/                        # the actual standards both skills enforce
.mcp.json                       # Playwright MCP server (dev-time exploration only, not used in CI)
src/
  pages/                        # Page Object Model classes
  fixtures/base.fixture.js      # auto-injects page objects into tests
tests-setup/
  auth.setup.js                 # logs in once, saves auth/admin.json
tests/
  auth/login.spec.js            # unauthenticated (exempt from storage state)
  dashboard/dashboard.spec.js
  pim/pim.spec.js
test-requirements/              # INPUT: module.md files from the test automation engineer
test-cases/                     # GENERATED: per-page coverage tracking (module/page/section)
test-coverage.md                # GENERATED: master rollup across all modules
scripts/update-coverage.js      # recalculates all coverage numbers — run after editing test-cases
.github/workflows/playwright.yml
```

## The engineer's workflow

1. Drop or update a file at `test-requirements/<module>.md` listing pages, sections, and test cases in plain language.
2. Tell the agent: *"Automate the tests in `test-requirements/pim.md`."*
3. The agent runs the **`create-new-tests`** skill: explores the real app via Playwright MCP, writes/updates page objects and specs following the rules, updates `test-cases/pim/*.md`, and regenerates `test-coverage.md`.
4. The agent runs the **`code-review`** skill to check its own output against every rule file before reporting back.
5. You get a summary: tests added, new page/module/overall coverage %.

## Current coverage snapshot

See [`test-coverage.md`](./test-coverage.md) for the live rollup. As scaffolded: Auth 100%, Dashboard 100%, PIM 50% (search test cases intentionally left `Not Automated` to demonstrate partial coverage reporting).

## CI

`.github/workflows/playwright.yml` runs on push/PR to `main` and on manual dispatch: installs deps + Chromium, runs the full suite, and uploads `playwright-report/` and the coverage markdown as build artifacts regardless of pass/fail. Add `TEST_ADMIN_USER` / `TEST_ADMIN_PASS` as repository secrets before running.
