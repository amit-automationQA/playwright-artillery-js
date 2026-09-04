import { test as setup, expect } from '../src/fixtures/base.fixture.js';

/**
 * Logs in once as the admin role and persists storage state to auth/admin.json.
 * All authenticated specs consume this via playwright.config.js `storageState`.
 * Never call loginPage.login() from inside a regular spec — see
 * .claude/rules/auth-strategy.md
 */
const adminAuthFile = 'auth/admin.json';

setup('authenticate as admin', async ({ page, loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login(
    process.env.TEST_ADMIN_USER || 'admin',
    process.env.TEST_ADMIN_PASS || 'admin123'
  );

  await expect(dashboardPage.pageHeader).toBeVisible();
  await page.context().storageState({ path: adminAuthFile });
});
