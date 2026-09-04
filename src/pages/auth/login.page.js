import { BasePage } from '../base.page.js';

/**
 * LoginPage — https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
 * Locators verified via Playwright MCP accessibility snapshot.
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.getByText('Invalid credentials');
    this.requiredFieldErrors = page.locator('.oxd-input-group .oxd-input-field-error-message');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.orangehrmLogo = page.getByAltText('company-branding');
  }

  async goto() {
    await super.goto('/web/index.php/auth/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async submitEmptyForm() {
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}
