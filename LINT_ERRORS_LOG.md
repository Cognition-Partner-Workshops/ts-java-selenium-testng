# Linting & Compilation Error Log

This document records common linting/compilation mistakes encountered during the Katalon Groovy to Playwright TypeScript conversion.

## Compilation Run: 2026-02-26

### Result: PASS (0 errors)

### Common Mistakes to Watch For (Based on Migration Patterns)

| # | Mistake | Description | Fix |
|---|---------|-------------|-----|
| 1 | Missing `await` on async Playwright calls | Katalon methods are synchronous; Playwright is async. Every `page.*`, `locator.*` call needs `await`. | Always prefix Playwright API calls with `await`. |
| 2 | Using `WebUI.delay(n)` literally | Katalon uses `WebUI.delay(seconds)`. Playwright's `waitForTimeout` takes milliseconds. | Use `page.waitForTimeout(n * 1000)` or the `common.wait(seconds)` helper. |
| 3 | Implicit waits via `setImplicitWait` | Playwright does not support implicit waits like Selenium/Katalon. | Replace with explicit `waitForTimeout` or proper `waitFor` on locators. |
| 4 | Window/tab switching with index | Katalon uses `WebUI.switchToWindowIndex()`. Playwright uses `BrowserContext` to create new pages. | Use `context.newPage()` and `page.close()` instead of index-based switching. |
| 5 | `findTestObject` string paths | Katalon's object repository uses string paths like `"Pg_Login/Edit_UserID"`. | Replace with Page Object Model locators (`loginPage.editUserID`). |
| 6 | `getText` vs `innerText` | Katalon uses `WebUI.getText(findTestObject(...))`. | Use `locator.innerText()` or `locator.textContent()` in Playwright. |
| 7 | Missing `context` parameter for multi-tab tests | Tests that open new tabs need the `context` fixture from Playwright. | Destructure `{ page, context }` in the test function signature. |
| 8 | Groovy string interpolation `${var}` in single quotes | Groovy allows GString interpolation. TypeScript uses template literals with backticks. | Use backtick strings: `` `text ${variable}` ``. |
| 9 | `FailureHandling.CONTINUE_ON_FAILURE` | Katalon's soft assertion pattern. | Use try/catch or Playwright's `expect.soft()` for non-blocking assertions. |
| 10 | `WebUI.executeJavaScript` for new tabs | Katalon opens tabs via JS execution. | Use `context.newPage()` in Playwright for cleaner tab management. |
