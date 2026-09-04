# Coverage Tracking Rules

## File layout
- `test-requirements/<module>.md` — INPUT ONLY. Provided by the test automation engineer. Never edit or overwrite this file; it is the source of truth for what should be tested.
- `test-requirements/test-coverage.md` — GENERATED copy of the master coverage rollup. Never edit it manually.
- `test-cases/<module>/<page>.md` — GENERATED/MAINTAINED tracking file, one per page, grouped by section, with a running Status per test case.
- `test-coverage.md` — GENERATED master rollup across all modules. Fully rebuilt by `scripts/update-coverage.js`; the same content is mirrored to `test-requirements/test-coverage.md`. Never hand-edit either file.

## test-cases/<module>/<page>.md schema

```markdown
## <Page Name>

### Section: <Section Name>
| ID | Test Case | Status | Spec Ref |
|----|-----------|--------|----------|
| TC-MOD-PAGE-001 | Description of the test case | Automated | tests/module/page.spec.js |
| TC-MOD-PAGE-002 | Description of the test case | Not Automated | - |

**Section coverage:** <computed> (<computed>%)

## Page Summary
| Total | Automated | Not Automated | Coverage % |
|-------|-----------|----------------|------------|
| <computed> | <computed> | <computed> | <computed>% |
```

- Allowed `Status` values: `Automated`, `Not Automated`, `Blocked`, `Skipped`.
  - `Blocked` = cannot be automated yet (e.g. missing test data/environment) — counts as NOT automated for coverage %.
  - `Skipped` = intentionally excluded (e.g. deprecated flow) — excluded entirely from coverage denominator; note the reason inline in the Test Case column.
- `Spec Ref` must be a real, existing relative path once Status is `Automated`.

## Skill responsibilities vs script responsibilities
- The `create-new-tests` skill (and a human) may ONLY:
  - Add new rows for new test cases found in `test-requirements/<module>.md`.
  - Flip a row's Status to `Automated` and fill in Spec Ref once a passing spec exists.
- The skill must NEVER hand-compute or hand-edit any percentage, "Section coverage" line, "Page Summary" table, or any row/total in `test-coverage.md`.
- After editing any `test-cases/**/*.md` file, always run `node scripts/update-coverage.js` to regenerate all computed numbers and the master `test-coverage.md` rollup.

## test-coverage.md schema (fully generated)

```markdown
| Module | Total | Automated | Not Automated | Coverage % |
|--------|-------|-----------|----------------|------------|
| Auth   | 4     | 4         | 0              | 100%       |
| Dashboard | 3  | 3         | 0              | 100%       |
| PIM    | 2     | 2         | 0              | 100%       |
| **Overall** | 9 | 9        | 0              | 100%       |
```
