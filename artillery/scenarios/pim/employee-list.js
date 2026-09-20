async function employeeListLoadFlow(page) {
  const { openPimEmployeeList } = await import('../../../src/utils/orangehrm-flow.js');
  await openPimEmployeeList(page);
}

module.exports = {
  employeeListLoadFlow,
};
