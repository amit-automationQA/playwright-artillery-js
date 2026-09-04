import { test, expect } from '../../src/fixtures/base.fixture.js';

/**
 * Uses default storageState (auth/admin.json) from playwright.config.js.
 * Maps to test-cases/pim/pim.md
 */
test.describe('Module: PIM > Page: Employee List', () => {
  test.beforeEach(async ({ pimPage }) => {
    await pimPage.goto();
  });

  test('TC-PIM-EMPLIST-001: employee list page loads with Add button visible', async ({
    pimPage,
  }) => {
    await expect(pimPage.pageHeader).toBeVisible();
    await expect(pimPage.addButton).toBeVisible();
  });

  test('TC-PIM-EMPLIST-002: adding a new employee navigates to their profile', async ({
    pimPage,
    page,
  }) => {
    const uniqueLastName = `Tester${Date.now()}`;
    const uniqueEmployeeId = String(Date.now()).slice(-9);
    await pimPage.addEmployee('Automation', uniqueLastName, uniqueEmployeeId);
    await expect(page).toHaveURL(/viewPersonalDetails/);
    await expect(page.getByText(`Automation ${uniqueLastName}`)).toBeVisible();
  });
});
