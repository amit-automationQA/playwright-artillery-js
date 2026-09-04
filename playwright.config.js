import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

/**
 * Central Playwright configuration.
 * Reporting: native Playwright HTML report ONLY (see .claude/rules/reporting-rules.md).
 * Auth: storage-state based (see tests-setup/auth.setup.js and .claude/rules/auth-strategy.md).
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 15 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Retry a failed test once in both local and CI runs.
  retries: 1,
  workers: process.env.CI ? 2 : 2,

  // Native Playwright HTML reporter ONLY. Do not add list/json/junit/dot etc.
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    // Setup project: logs in once and saves storage state(s) for other projects to reuse.
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      testDir: './tests-setup',
    },

    // Main authenticated project. Every spec here starts already logged in
    // via storageState, unless a spec explicitly overrides it (e.g. login.spec.js).
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth/admin.json',
      },
      dependencies: ['setup'],
    },

    // Uncomment to add more browsers once the suite is stable:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], storageState: 'auth/admin.json' },
    //   dependencies: ['setup'],
    // },
  ],
});
