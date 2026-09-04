# Playwright Automation Framework

End-to-end UI test framework for the OrangeHRM demo application, built with Playwright and JavaScript. It uses page objects, reusable fixtures, authenticated storage state, coverage tracking, and GitHub Actions.

## What it includes

- Page Object Model under `src/pages/`
- Reusable page-object fixtures under `src/fixtures/`
- One-time admin login setup with Playwright storage state
- Native Playwright HTML reports, including screenshots, video, and traces for failures
- Requirement-to-test coverage tracking in Markdown
- GitHub Actions workflow for tests on pushes, pull requests, and manual runs
- Project-local `.claude` skills and rules for consistent test authoring

## Local setup

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
```

Add your local credentials to `.env`:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com
TEST_ADMIN_USER=your-user
TEST_ADMIN_PASS=your-password
```

`.env` is ignored by Git. The Playwright configuration loads it automatically with `dotenv`.

## Run tests

```powershell
npm test                 # complete headless suite
npm run test:headed      # visible browser
npm run test:ui          # Playwright UI Mode
npm run test:auth-setup  # refresh only the admin storage state
npm run report           # open the latest local HTML report
npm run coverage         # regenerate all coverage rollups
```

The `setup` project authenticates once and writes `auth/admin.json`. Authenticated specs reuse that state; login-flow tests explicitly use an empty state instead.

## Test execution flow

```mermaid
flowchart TD
    A["Run tests<br/>npm test locally<br/>or GitHub Actions"] --> B["Load configuration"]
    B --> C["Read credentials<br/>.env locally / GitHub Secrets in CI"]
    C --> D["Login setup runs once"]
    D --> E["Run all test files"]

    E --> F{"Test passed?"}
    F -->|Yes| G["Mark as passed"]
    F -->|No| H{"Already retried?"}

    H -->|No| I["Retry failed test once"]
    I --> F
    H -->|Yes| J["Mark as failed<br/>capture screenshot, video, trace"]

    G --> K["Create HTML report"]
    J --> K
    K --> L["Local: npm run report<br/>CI: download artifact"]
```

A test that passes on its retry is marked as **flaky** in the Playwright report.

## Coverage workflow

1. Add test requirements to `test-requirements/<module>.md`.
2. Implement matching page objects and specs.
3. Set the implemented test case to `Automated` in `test-cases/<module>/<page>.md`.
4. Run `npm run coverage`.

The coverage script regenerates these two identical master rollups:

- `test-coverage.md`
- `test-requirements/test-coverage.md`

Do not edit calculated coverage totals manually.

## GitHub Actions and secrets

The workflow at `.github/workflows/playwright.yml` runs on pushes and pull requests to `main`, and can also be started manually from the GitHub **Actions** tab.

Add these repository secrets in **Settings → Secrets and variables → Actions**:

- `TEST_ADMIN_USER`
- `TEST_ADMIN_PASS`

Optionally add the repository variable `BASE_URL` for a different target environment. The workflow uploads the Playwright HTML report as an artifact after every non-cancelled run. Download and extract it, then open `index.html` to view the interactive report.

### AI test automation workflow

`.github/workflows/automate-test-case.yml` is a manual workflow template for automating one requirement at a time. After adding the `ANTHROPIC_API_KEY` repository secret, run **Automate Test Case** from the GitHub **Actions** tab and enter a test ID such as `TC-PIM-EMPLIST-004`.

The workflow validates the ID in `test-requirements/`, creates `feature/<test-case-id>` from `main`, instructs Claude Code to follow the project `create-new-tests` skill, runs the targeted test, commits the generated allowed files, and opens a pull request to `main`. It needs `TEST_ADMIN_USER` and `TEST_ADMIN_PASS` secrets as well.

## Project layout

```text
.github/workflows/playwright.yml  GitHub Actions workflow
.claude/                          Test-authoring skills and framework rules
src/pages/                        Page objects
src/fixtures/                     Shared Playwright fixtures
tests-setup/                      Authentication setup project
tests/                            Playwright specifications
test-requirements/                Test requirements and a generated coverage copy
test-cases/                       Per-page coverage tracking
scripts/update-coverage.js        Coverage generator
```

## Future scope: Artillery

This repository is prepared to evolve into a combined functional and performance-testing framework. Artillery load-test scenarios, configuration, scripts, CI jobs, and result publishing are intentionally not implemented yet. When that scope begins, Artillery should be integrated as a separate test layer so its load profiles and reports do not change the Playwright functional-test workflow.
