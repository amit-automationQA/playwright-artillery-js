async function loginValidCredentialsFlow(page) {
  const { loginToDashboard } = await import('../../../src/utils/orangehrm-flow.js');
  await loginToDashboard(page);
}

async function invalidPasswordFlow(page) {
  const { loginWithInvalidPassword } = await import('../../../src/utils/orangehrm-flow.js');
  await loginWithInvalidPassword(page);
}

module.exports = {
  loginValidCredentialsFlow,
  invalidPasswordFlow,
};
