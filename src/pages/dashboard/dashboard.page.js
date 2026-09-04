import { BasePage } from '../base.page.js';

/**
 * DashboardPage — https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
 */
export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeader = page.getByRole('heading', { name: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    this.mainMenu = page.locator('ul.oxd-main-menu');
    this.quickLaunchCards = page.locator('.orangehrm-quick-launch-card');
    this.timeAtWorkWidget = page.getByText('Time at Work');
    this.myActionsWidget = page.getByRole('heading', { name: 'My Actions' });
  }

  async goto() {
  await super.goto('/web/index.php/dashboard/index', { requireAuth: true });
}

  async logout() {
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
  }

  async openMenuItem(name) {
    await this.mainMenu.getByRole('link', { name }).click();
  }

  async isLoaded() {
    return this.pageHeader.isVisible();
  }
}
