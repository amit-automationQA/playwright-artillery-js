# Module: PIM

## Description
Covers the Personal Information Management (PIM) module — viewing the employee list, adding new
employees, and searching/filtering existing employees. Requires the authenticated `admin` storage
state (`auth/admin.json`).

---

## Page: Employee List
URL: `/web/index.php/pim/viewEmployeeList`

### Section: Page Load
| ID | Test Case | Status |
|----|-----------|--------|
| TC-PIM-EMPLIST-001 | Employee List page loads with the "Add" button visible | Automated |

### Section: Add Employee
| ID | Test Case | Status |
|----|-----------|--------|
| TC-PIM-EMPLIST-002 | Adding a new employee (first + last name) navigates to that employee's Personal Details page and displays their name | Automated |

### Section: Search
| ID | Test Case | Status |
|----|-----------|--------|
| TC-PIM-EMPLIST-003 | Searching by employee name filters the employee list to matching results | Not Automated |
| TC-PIM-EMPLIST-004 | Resetting the search clears the filter and shows the full list again | Not Automated |

---

## Module Coverage Summary
| Total | Automated | Not Automated | Coverage % |
|-------|-----------|----------------|------------|
| 4 | 2 | 2 | 50% |

> `Status` is flipped from `Not Automated` to `Automated` by the `create-new-tests` skill once a
> passing spec exists for that test case (see `.claude/rules/coverage-tracking-rules.md`). The
> `Module Coverage Summary` table above is recalculated by `node scripts/update-coverage.js` —
> never hand-edit these numbers.