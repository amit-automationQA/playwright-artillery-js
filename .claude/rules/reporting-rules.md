# Reporting Rules

- `playwright.config.js` must define exactly one reporter: the native HTML reporter.
  ```js
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]]
  ```
- Do NOT add `list`, `json`, `junit`, `dot`, `github`, or any third-party reporter, even temporarily for debugging — remove any such addition before finishing a task.
- `playwright-report/` and `test-results/` are gitignored and must never be committed.
- CI must upload `playwright-report/` as a build artifact after every run (pass or fail) so the native report is retrievable without local reproduction.
- Do not introduce custom reporter scripts. If richer reporting is needed later, that is a deliberate framework decision outside the scope of the create-new-tests / code-review skills — flag it instead of implementing it silently.
