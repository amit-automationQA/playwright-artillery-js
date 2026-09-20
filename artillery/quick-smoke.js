async function quickSmokeFlow(page) {
  const { openPimEmployeeList } = await import('../src/utils/orangehrm-flow.js');
  await openPimEmployeeList(page);
}

module.exports = {
  quickSmokeFlow,
};
