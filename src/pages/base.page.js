/**
 * BasePage
 * Shared behaviour for every page object. Page objects hold locators + actions.
 * They must NOT contain test assertions (expect(...)) — assertions live in specs.
 * See .claude/rules/pom-standards.md
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

async goto(path = '/', { requireAuth = false } = {}) {
  await this.page.goto(path);
  await this.page.waitForLoadState('networkidle');

  if (requireAuth && this.page.url().includes('/auth/login')) {
    throw new Error(
      `Redirected to login while navigating to "${path}". The shared OrangeHRM demo session was likely invalidated by another user on the same public admin account. Re-run the tests.`
    );
  }
}

  async waitForLoadState(state = 'load') {
    await this.page.waitForLoadState(state);
  }

  async title() {
    return this.page.title();
  }
}
