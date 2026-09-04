import { test, expect } from '../../src/fixtures/base.fixture.js';

/**
 * Login flow tests run WITHOUT storage state (they test the login flow itself).
 * See .claude/rules/auth-strategy.md — this spec is the documented exemption.
 * Maps to test-cases/auth/login.md
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Module: Auth > Page: Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-AUTH-LOGIN-001: valid credentials log the user in', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(
      process.env.TEST_ADMIN_USER || 'admin',
      process.env.TEST_ADMIN_PASS || 'admin123'
    );
    await expect(dashboardPage.pageHeader).toBeVisible();
  });

  test('TC-AUTH-LOGIN-002: invalid password shows an error message', async ({
    loginPage,
  }) => {
    await loginPage.login('admin', 'wrong-password');
    await expect(loginPage.errorAlert).toBeVisible();
  });

  test('TC-AUTH-LOGIN-003: empty form submission shows required field errors', async ({
    loginPage,
  }) => {
    await loginPage.submitEmptyForm();
    await expect(loginPage.requiredFieldErrors.first()).toBeVisible();
    await expect(loginPage.requiredFieldErrors).toHaveCount(2);
  });

  test('TC-AUTH-LOGIN-004: forgot password link navigates to reset page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/requestPasswordResetCode/);
  });
});
