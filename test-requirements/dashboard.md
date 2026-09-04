# Module: Dashboard

## Description
Covers the authenticated landing page a user sees immediately after login — layout elements
(header, main navigation menu, widgets) and session lifecycle behavior (logout). Most tests in
this module rely on the shared `admin` storage-state session; the logout test is isolated with
its own fresh login since it destroys the session server-side (see
`.claude/rules/auth-strategy.md`, point 8).

---

## Page: Dashboard
URL: `/web/index.php/dashboard/index`

### Section: Layout
| ID | Test Case | Status |
|----|-----------|--------|
| TC-DASH-HOME-001 | Dashboard loads with the page header and main navigation menu visible after login | Automated |
| TC-DASH-HOME-002 | "Time at Work" widget is visible on the dashboard | Automated |

### Section: Session
| ID | Test Case | Status |
|----|-----------|--------|
| TC-DASH-HOME-003 | Logging out via the user dropdown returns the user to the Login page | Automated |

---

## Module Coverage Summary
| Total | Automated | Not Automated | Coverage % |
|-------|-----------|----------------|------------|
| 3 | 3 | 0 | 100% |

> `Status` is flipped from `Not Automated` to `Automated` by the `create-new-tests` skill once a
> passing spec exists for that test case (see `.claude/rules/coverage-tracking-rules.md`). The
> `Module Coverage Summary` table above is recalculated by `node scripts/update-coverage.js` —
> never hand-edit these numbers.