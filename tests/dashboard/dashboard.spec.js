import { test, expect } from '../../src/fixtures/base.fixture.js';

test.describe('Module: Dashboard > Page: Dashboard', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('TC-DASH-HOME-001: dashboard loads with header and main menu visible', async ({
    dashboardPage,
  }) => {
    await expect(dashboardPage.pageHeader).toBeVisible();
    await expect(dashboardPage.mainMenu).toBeVisible();
  });

  test('TC-DASH-HOME-002: time at work widget is visible', async ({
    dashboardPage,
  }) => {
    await expect(dashboardPage.timeAtWorkWidget).toBeVisible();
  });
});

// Isolated: logging out destroys the session server-side. Running it against the
// shared auth/admin.json storage state used by every other authenticated spec would
// invalidate that session for the rest of the suite. This block logs in fresh instead.
test.describe('Module: Dashboard > Page: Dashboard (session lifecycle)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC-DASH-HOME-003: logout returns user to login page', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_ADMIN_USER || 'admin',
      process.env.TEST_ADMIN_PASS || 'admin123'
    );
    await expect(dashboardPage.pageHeader).toBeVisible();

    await dashboardPage.logout();
    await expect(page).toHaveURL(/auth\/login/);
  });
});