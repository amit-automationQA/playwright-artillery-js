import { BasePage } from '../base.page.js';

/**
 * PimPage — Employee List: /web/index.php/pim/viewEmployeeList
 */
export class PimPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeader = page.getByText('Employee Information');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.employeeNameSearchInput = page.getByPlaceholder('Type for hints...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.recordsFoundText = page.locator('.orangehrm-horizontal-padding.orangehrm-vertical-padding span');
    this.tableRows = page.locator('.oxd-table-card');
    this.noRecordsFound = page.getByText('No Records Found');

    // Add Employee form
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.employeeIdInput = page.locator('.oxd-input').nth(2);
  }

  async goto() {
  await super.goto('/web/index.php/pim/viewEmployeeList', { requireAuth: true });
}

  async clickAdd() {
    await this.addButton.click();
    await this.page.waitForURL(/pim\/addEmployee/);
  }

  async addEmployee(firstName, lastName) {
    await this.clickAdd();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }

  async searchByName(name) {
    await this.employeeNameSearchInput.fill(name);
    await this.page.getByText(name).first().click().catch(() => {});
    await this.searchButton.click();
  }

  async resultsCount() {
    return this.tableRows.count();
  }
}
