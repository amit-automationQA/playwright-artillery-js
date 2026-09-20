# Playwright + Artillery Automation Framework

End-to-end UI automation for the OrangeHRM demo application, built with Playwright and JavaScript, plus a separate Artillery performance layer for browser-based load testing.

This project combines:

- Playwright functional UI tests
- Page Object Model design
- Authenticated storage-state setup
- Coverage tracking across requirements and specs
- GitHub Actions automation for local and CI validation
- Separate Artillery smoke and full-load profiles for performance testing

## What is included

- Functional page objects in [src/pages](src/pages)
- Shared fixture injection in [src/fixtures/base.fixture.js](src/fixtures/base.fixture.js)
- Reusable browser flow helpers in [src/utils/orangehrm-flow.js](src/utils/orangehrm-flow.js)
- Auth setup in [tests-setup/auth.setup.js](tests-setup/auth.setup.js)
- Playwright config in [playwright.config.js](playwright.config.js)
- Requirement-based coverage in [test-requirements](test-requirements) and [test-cases](test-cases)
- Artillery automation in [artillery](artillery)
- GitHub Actions workflows in [.github/workflows](.github/workflows)

## Local setup

```powershell
npm install
npx playwright install --with-deps chromium
Copy-Item .env.example .env
```

Add your login values to the local `.env` file:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com
TEST_ADMIN_USER=your-user
TEST_ADMIN_PASS=your-password
```

The project uses `dotenv` and the same values can be supplied in GitHub Actions as repository secrets.

## Run the project

### Functional Playwright tests

```powershell
npm test
npm run test:headed
npm run test:ui
npm run test:auth-setup
npm run report
npm run coverage
```

### Artillery performance tests

```powershell
npm run artillery:quick
npm run artillery:load
npm run artillery:report:quick
npm run artillery:report:load
```

## Project structure

```text
.github/
  workflows/
    artillery-quick.yml           # quick smoke workflow
    artillery-full.yml            # full load workflow
    artillery-load.yml            # legacy combined load workflow
    automate-test-case.yml        # AI-driven test automation workflow
    playwright.yml                # functional Playwright workflow

.claude/
  rules/                         # project rules and standards
  skills/
    create-new-tests/SKILL.md    # skill used by automated test generation

artillery/
  quick-smoke.yml                # lightweight smoke profile
  quick-smoke.js                 # smoke flow processor
  load-suite.yml                 # full suite profile
  load-suite.js                  # full-suite scenario aggregator
  package.json                   # local CommonJS compatibility shim
  scenarios/
    auth/login-valid.js
    auth/login-valid.yml
    dashboard/dashboard-load.js
    dashboard/dashboard-load.yml
    pim/employee-list.js
    pim/employee-list.yml

src/
  fixtures/base.fixture.js       # Playwright fixture injection
  pages/
    auth/login.page.js
    dashboard/dashboard.page.js
    pim/pim.page.js
    base.page.js
  utils/
    orangehrm-flow.js            # shared browser flows used by Playwright and Artillery

tests-setup/
  auth.setup.js                 # admin login setup and storage state generation

auth/
  admin.json                    # generated storage state (not committed in CI copies)

tests/
  auth/login.spec.js
  dashboard/dashboard.spec.js
  pim/pim.spec.js

test-requirements/
  auth.md
  dashboard.md
  pim.md
  test-coverage.md             # generated copy of the master coverage summary

test-cases/
  auth/login.md
  dashboard/dashboard.md
  pim/pim.md

test-coverage.md              # generated master coverage rollup
scripts/
  update-coverage.js

playwright.config.js
package.json
README.md
.gitignore
.env.example
```

## Functional test execution flow

The Playwright suite runs against the OrangeHRM demo app and uses storage-state authentication to avoid repeated login steps in normal specs.

```text
Run Playwright tests
  ↓
Load config and environment
  ↓
Read credentials from .env or GitHub secrets
  ↓
Login setup runs once
  ↓
Run all functional specs
  ↓
Test passed?
  ├─ No → Retry failed test once
  │        ├─ Already retried? → Mark as failed
  │        └─ No → Retry and continue
  └─ Yes → Mark as passed
  ↓
Generate Playwright HTML report
  ↓
Upload report artifact
```

- The setup project in [tests-setup/auth.setup.js](tests-setup/auth.setup.js) logs in once as the admin user.
- Storage state is written to [auth/admin.json](auth/admin.json).
- Most authenticated specs reuse that saved state.
- Login-flow tests explicitly disable the default state so they can validate the login behavior itself.

## Load test execution flow

Artillery is intentionally kept separate from the Playwright suite so browser load testing does not interfere with the functional automation lifecycle.

```text
Run Artillery profile
  ↓
Load the selected YAML config and phases
  ↓
Read target URL and environment values
  ↓
Execute browser-based scenario flow
  ↓
Capture latency, throughput, and status metrics
  ↓
Write JSON result file
  ↓
Generate HTML summary report
  ↓
Upload performance artifact
```

- Quick smoke runs use a short validation profile for fast feedback.
- Full load runs execute the multi-scenario suite for deeper performance validation.
- Reporting is kept in a separate output/report flow from the Playwright HTML report.

## Coverage workflow

1. Update the module requirements in [test-requirements](test-requirements).
2. Implement the matching page objects and tests.
3. Create or update the relevant tracking file in [test-cases](test-cases).
4. Run `npm run coverage`.
5. Regenerate the master summary in [test-coverage.md](test-coverage.md).

Do not edit computed coverage values manually.

## Artillery workflow

Artillery is intentionally separate from the Playwright test runner. The project keeps the load-testing layer independent so performance runs do not interfere with the functional suite lifecycle.

### Quick smoke profile

Purpose: a short, lightweight validation run.

```powershell
npm run artillery:quick
```

### Full load profile

Purpose: multi-scenario browser load simulation for the same core flows.

```powershell
npm run artillery:load
```

### HTML reporting

Artillery can emit JSON and then generate a browser-friendly HTML summary:

```powershell
npm run artillery:report:quick
npm run artillery:report:load
```

This is useful for sharing a compact summary in CI artifacts or leadership discussions.

## GitHub Actions

The repo contains separate CI workflows for functional and load testing.

### Functional CI

- [.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs the standard Playwright suite.

### Artillery CI

- [.github/workflows/artillery-quick.yml](.github/workflows/artillery-quick.yml) runs the smoke profile
- [.github/workflows/artillery-full.yml](.github/workflows/artillery-full.yml) runs the full suite
- [.github/workflows/artillery-load.yml](.github/workflows/artillery-load.yml) is kept as a combined/legacy variant

### AI automation workflow

- [.github/workflows/automate-test-case.yml](.github/workflows/automate-test-case.yml) is a manual workflow that can generate a Playwright test for a requested requirement.
- It includes a boolean input called `create_load_tests`.
- When set to `true`, the workflow also creates and verifies a matching Artillery load scenario for the same flow.

Required secrets:

- `TEST_ADMIN_USER`
- `TEST_ADMIN_PASS`
- `ANTHROPIC_API_KEY` for the Claude automation workflow

## Notes

- All functional reporting is done with Playwright’s native HTML reporter only.
- Artillery output is kept separate and generated to the [artillery](artillery) output/report folders.
- The project intentionally separates functional validation from load validation so each layer can scale independently.
