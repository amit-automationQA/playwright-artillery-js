# Module: Auth

## Login Page

### Section: Credential Validation
| ID | Test Case | Status | Spec Ref |
|----|-----------|--------|----------|
| TC-AUTH-LOGIN-001 | Valid credentials log the user in and land on the Dashboard | Automated | tests/auth/login.spec.js |
| TC-AUTH-LOGIN-002 | Invalid password shows an "Invalid credentials" error message | Automated | tests/auth/login.spec.js |
| TC-AUTH-LOGIN-003 | Empty form submission shows required field errors | Automated | tests/auth/login.spec.js |

**Section coverage:** 3/3 (100%)

### Section: Navigation
| ID | Test Case | Status | Spec Ref |
|----|-----------|--------|----------|
| TC-AUTH-LOGIN-004 | Forgot password link navigates to reset page | Automated | tests/auth/login.spec.js |

**Section coverage:** 1/1 (100%)

## Page Summary
| Total | Automated | Not Automated | Coverage % |
|-------|-----------|----------------|------------|
| 4 | 4 | 0 | 100% |
