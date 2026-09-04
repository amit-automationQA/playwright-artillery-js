# Naming Conventions

## Files
- Page objects: `src/pages/<module>/<page>.page.js` (e.g. `pim.page.js`, `login.page.js`).
- Specs: `tests/<module>/<page>.spec.js` (e.g. `tests/pim/pim.spec.js`).
- Setup/auth: `tests-setup/<role>.setup.js` (e.g. `admin.setup.js`).
- Module names must match the module.md filename in `test-requirements/` (e.g. `pim.md` -> module `pim`).

## describe/test structure
- Top-level `test.describe` block: `Module: <ModuleName> > Page: <PageName>`.
- Nest a second `test.describe` for a Section only if the module.md defines sub-sections with more than ~4 test cases each.

## Test IDs
- Format: `TC-<MODULE>-<PAGE>-<SEQ>`, all caps, zero-padded 3-digit sequence.
  - Example: `TC-AUTH-LOGIN-001`, `TC-PIM-EMPLIST-002`.
- MODULE and PAGE abbreviations must stay consistent across the spec file, the test-cases/*.md file, and test-coverage.md. Once an abbreviation is chosen for a module/page, do not rename it later — this breaks Spec Ref links.
- Every `test(...)` title must start with its Test ID: `test('TC-PIM-EMPLIST-002: adding a new employee ...', ...)`.

## Tags (optional, add as suite grows)
- `@smoke` — critical-path tests run on every PR.
- `@regression` — full suite, run nightly/on-merge.
Add tags via title suffix: `test('TC-AUTH-LOGIN-001: ... @smoke', ...)`.
