const appUrl = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';
const username = process.env.TEST_ADMIN_USER || 'admin';
const password = process.env.TEST_ADMIN_PASS || 'admin123';

async function orangeHrmAdminFlow(page) {
  await page.goto(`${appUrl}/web/index.php/auth/login`);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.waitForURL(/\/pim\/viewEmployeeList/);
}

module.exports = {
  orangeHrmAdminFlow,
};
