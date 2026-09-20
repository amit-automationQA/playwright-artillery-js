const { loginValidCredentialsFlow, invalidPasswordFlow } = require('./scenarios/auth/login-valid.js');
const { dashboardLoadFlow } = require('./scenarios/dashboard/dashboard-load.js');
const { employeeListLoadFlow } = require('./scenarios/pim/employee-list.js');

module.exports = {
  loginValidCredentialsFlow,
  invalidPasswordFlow,
  dashboardLoadFlow,
  employeeListLoadFlow,
};
