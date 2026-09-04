# Module: Auth

## Description
Covers user authentication for the OrangeHRM application — logging in with valid/invalid
credentials, form validation on the login page, and navigation to the password reset flow.
This module is unauthenticated by nature and does not depend on any storage-state session.

---

## Page: Login
URL: `/web/index.php/auth/login`

### Section: Credential Validation
| ID | Test Case | Status |
|----|-----------|--------|
| TC-AUTH-LOGIN-001 | Valid credentials (admin/admin123) log the user in and land on the Dashboard | Automated |
| TC-AUTH-LOGIN-002 | Invalid password shows an "Invalid credentials" error message | Automated |
| TC-AUTH-LOGIN-003 | Submitting the form with both fields empty shows required-field validation errors | Automated |

### Section: Navigation
| ID | Test Case | Status |
|----|-----------|--------|
| TC-AUTH-LOGIN-004 | Clicking "Forgot your password?" navigates to the password reset request page | Automated |

---

## Module Coverage Summary
| Total | Automated | Not Automated | Coverage % |
|-------|-----------|----------------|------------|
| 4 | 4 | 0 | 100% |

> `Status` is flipped from `Not Automated` to `Automated` by the `create-new-tests` skill once a
> passing spec exists for that test case (see `.claude/rules/coverage-tracking-rules.md`). The
> `Module Coverage Summary` table above is recalculated by `node scripts/update-coverage.js` —
> never hand-edit these numbers.