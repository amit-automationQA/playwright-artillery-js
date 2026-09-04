import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/auth/login.page.js';
import { DashboardPage } from '../pages/dashboard/dashboard.page.js';
import { PimPage } from '../pages/pim/pim.page.js';

/**
 * Custom test fixture — auto-injects page objects so specs never do
 * `new LoginPage(page)` manually. Add new page objects here as the
 * create-new-tests skill introduces new modules/pages.
 */
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
});

export { expect } from '@playwright/test';
