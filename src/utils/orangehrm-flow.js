const appUrl = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export async function loginToDashboard(page, username = process.env.TEST_ADMIN_USER || 'admin', password = process.env.TEST_ADMIN_PASS || 'admin123') {
  await page.goto(`${appUrl}/web/index.php/auth/login`);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  await page.locator('ul.oxd-main-menu').waitFor();
}

export async function loginWithInvalidPassword(page, username = process.env.TEST_ADMIN_USER || 'admin', password = 'wrong-password') {
  await page.goto(`${appUrl}/web/index.php/auth/login`);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Invalid credentials').waitFor();
}

export async function openPimEmployeeList(page, username = process.env.TEST_ADMIN_USER || 'admin', password = process.env.TEST_ADMIN_PASS || 'admin123') {
  await loginToDashboard(page, username, password);
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.waitForURL(/\/pim\/viewEmployeeList/);
  await page.getByRole('button', { name: 'Add' }).waitFor();
}
