# POM Standards

1. One class per page, one file per class: `src/pages/<module>/<page>.page.js`.
2. Every page object extends `BasePage` (`src/pages/base.page.js`).
3. Page objects contain ONLY:
   - Locators, defined as class fields in the constructor.
   - Action methods (`login()`, `addEmployee()`, `logout()`, `openMenuItem()`).
4. Page objects must NEVER contain `expect(...)` assertions. Assertions live only in spec files.
5. Constructor signature is always `constructor(page) { super(page); ... }`.
6. Method naming:
   - Actions: verb-first — `fill<Field>`, `click<Element>`, `select<Option>`, `login`, `logout`, `search<Thing>`.
   - Never prefix a page-object method with `expect` or `verify` — that belongs in the spec.
7. New page object required whenever a test targets a URL/page not yet covered. Do not bloat an existing page object with unrelated pages' locators.
8. Every new page object must be registered in `src/fixtures/base.fixture.js` so specs consume it via fixture injection, never `new SomePage(page)` inline in a spec.
9. Keep page objects framework-agnostic of test data — accept parameters, don't hardcode test values (except placeholder defaults documented as such).
