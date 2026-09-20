async function dashboardLoadFlow(page) {
  const { loginToDashboard } = await import('../../../src/utils/orangehrm-flow.js');
  await loginToDashboard(page);
  await page.locator('ul.oxd-main-menu').waitFor();
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
}

module.exports = {
  dashboardLoadFlow,
};
