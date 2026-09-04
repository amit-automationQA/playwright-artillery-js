# Auth Strategy — Storage State

1. Login happens exactly once per role, inside a `tests-setup/<role>.setup.js` file, using the `setup` project defined in `playwright.config.js`.
2. That setup writes a storage state JSON file to `auth/<role>.json` (gitignored — never commit these files).
3. All authenticated specs consume the role's storage state automatically via `use: { storageState: 'auth/<role>.json' }` and `dependencies: ['setup']` in `playwright.config.js` — specs do NOT call `loginPage.login()` themselves.
4. Exception: specs whose purpose IS to test the login flow (e.g. `tests/auth/login.spec.js`) are exempt. They must explicitly opt out of the default storage state:
   ```js
   test.use({ storageState: { cookies: [], origins: [] } });
   ```
5. Credentials are read from environment variables only — never hardcoded in setup files or page objects. Standard names: `TEST_ADMIN_USER`, `TEST_ADMIN_PASS`. Add new role-specific env var names here if a new role is introduced (e.g. `TEST_ESS_USER` for an Employee Self-Service role).
6. If a new module.md requires a role/permission level with no existing setup file:
   - Check whether an existing role's storage state already satisfies the requirement before creating a new one.
   - If genuinely new, create `tests-setup/<role>.setup.js` following the pattern in `tests-setup/admin.setup.js` (or `auth.setup.js`), and add a corresponding project entry in `playwright.config.js`.
   - If the required role/credentials aren't available in the environment, STOP and report back to the engineer rather than inventing test data.
7. CI must never cache `auth/`; each CI run must perform a fresh login so expired-session or credential-rotation issues are caught immediately.
8. Any test that performs a real logout (destroying the server-side session) must run with an isolated, freshly-logged-in session (`test.use({ storageState: { cookies: [], origins: [] } })`) — never against the shared role storage state file other specs depend on.

