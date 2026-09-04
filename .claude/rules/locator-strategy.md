# Locator Strategy

Priority order (highest to lowest). Always use the highest-priority option the real DOM/accessibility tree supports:

1. `page.getByRole(role, { name })` — preferred for interactive elements (buttons, links, menu items, textboxes with accessible names).
2. `page.getByLabel(...)` — form fields with associated `<label>`.
3. `page.getByPlaceholder(...)` — acceptable for OrangeHRM's inputs, which commonly use placeholders instead of labels (e.g. Username, Password, First Name, Last Name).
4. `page.getByText(...)` — for static, uniquely-identifiable text content. Use `{ exact: true }` when the text is short/common (e.g. "Dashboard").
5. `page.getByTestId(...)` — only if the app exposes `data-testid` attributes.
6. CSS class/selector (e.g. `.oxd-input-group`) — LAST RESORT, only when nothing above uniquely identifies the element (OrangeHRM's OXD component library sometimes requires this, e.g. generic error message containers).

Rules:
- Never use brittle absolute XPath (`/html/body/div[2]/div[3]/...`).
- Never rely on nth-child/nth() unless there is genuinely no other differentiator, and comment WHY in the page object when you do.
- Before writing a locator, verify it exists against the real page via Playwright MCP exploration (see `mcp-exploration-rules.md`) rather than guessing from the module.md description.
- Locators must be resilient to dynamic data (employee names, IDs) — scope with `.filter()` or nearest stable ancestor rather than assuming fixed row positions.
