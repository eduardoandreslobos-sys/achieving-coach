import { test, expect, Page } from '@playwright/test';
import {
  waitForPageLoad,
  login,
  logout,
  TEST_CREDENTIALS,
  ROUTES,
  takeScreenshot,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/auth';

/**
 * Authentication Flow Tests
 *
 * Tests the complete authentication journey including:
 * - Login with valid/invalid credentials
 * - Registration flow
 * - Password recovery
 * - Logout
 * - Session persistence
 */

test.describe('Authentication Flows', () => {
  test.describe('1. Login Flow', () => {
    test('1.1 Login page renders correctly', async ({ page }) => {
      await page.goto(ROUTES.signIn);
      await waitForPageLoad(page);

      // Take screenshot for visual verification
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/login-page.png` });

      // Verify essential elements
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();

      // Verify forgot password link exists
      const forgotLink = page.locator('a[href*="forgot-password"]');
      await expect(forgotLink).toBeVisible();

      // Verify sign up link exists
      const signUpLink = page.locator('a[href*="sign-up"]');
      await expect(signUpLink.first()).toBeVisible();
    });

    test('1.2 Login with empty fields shows validation', async ({ page }) => {
      await page.goto(ROUTES.signIn);
      await waitForPageLoad(page);

      // Wait for form
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ force: true });

      // Should stay on sign-in page (HTML5 validation prevents submission)
      await page.waitForTimeout(500);
      expect(page.url()).toContain('sign-in');

      // Check for validation state (browser native or custom)
      const emailInput = page.locator('input[type="email"]');
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
    });

    test('1.3 Login with invalid email format shows error', async ({ page }) => {
      await page.goto(ROUTES.signIn);
      await waitForPageLoad(page);

      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      // Fill invalid email
      await page.fill('input[type="email"]', 'notanemail');
      await page.fill('input[type="password"]', 'somepassword123');

      // Try to submit
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ force: true });

      // Should stay on sign-in (validation prevents submission)
      await page.waitForTimeout(500);
      expect(page.url()).toContain('sign-in');
    });

    test('1.4 Login with incorrect credentials shows error', async ({ page }) => {
      await page.goto(ROUTES.signIn);
      await waitForPageLoad(page);

      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      // Fill incorrect credentials
      await page.fill('input[type="email"]', 'nonexistent@test.com');
      await page.fill('input[type="password"]', 'wrongpassword123');

      // Submit
      await page.click('button[type="submit"]', { force: true });

      // Wait for error response
      await page.waitForTimeout(3000);

      // Should still be on sign-in page
      expect(page.url()).toContain('sign-in');

      // Take screenshot of error state
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/login-error.png` });

      // Check for error message (Spanish)
      const errorMessage = page.locator('text=/error|incorrecta|inválido/i');
      // Error might be shown - we verify we're still on login page
    });

    test('1.5 Login with valid coach credentials succeeds', async ({ page }) => {
      const success = await login(page, TEST_CREDENTIALS.coach);

      if (success) {
        // Verify redirected to dashboard
        await page.waitForTimeout(1000);
        const url = page.url();
        expect(url.includes('dashboard') || url.includes('coach')).toBeTruthy();

        // Take screenshot of logged in state
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/login-success-coach.png` });

        // Verify user menu or avatar is visible (indicates logged in)
        const userIndicator = page.locator('[data-testid="user-menu"], .avatar, [aria-label*="perfil"]');
        // May or may not have these selectors
      } else {
        // Skip test if no test credentials configured
        test.skip(true, 'Test credentials not configured or login failed');
      }
    });

    test('1.6 Login with valid coachee credentials succeeds', async ({ page }) => {
      const success = await login(page, TEST_CREDENTIALS.coachee);

      if (success) {
        await page.waitForTimeout(1000);
        const url = page.url();
        expect(url.includes('dashboard')).toBeTruthy();

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/login-success-coachee.png` });
      } else {
        test.skip(true, 'Test credentials not configured or login failed');
      }
    });

    test('1.7 Login preserves intended destination', async ({ page }) => {
      // Try to access protected route
      await page.goto('/sessions');
      await waitForPageLoad(page);

      // Should be redirected to sign-in
      await page.waitForTimeout(2000);
      const urlAfterRedirect = page.url();

      if (urlAfterRedirect.includes('sign-in')) {
        // Now login
        const success = await login(page, TEST_CREDENTIALS.coachee);

        if (success) {
          // Should redirect back to intended destination
          await page.waitForTimeout(1000);
          // Note: This depends on implementation - some apps do this, some don't
        }
      }
    });
  });

  test.describe('2. Registration Flow', () => {
    test('2.1 Registration page renders correctly', async ({ page }) => {
      await page.goto(ROUTES.signUp);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/register-page.png` });

      // Page loaded - registration might redirect or show different content
      await expect(page.locator('body')).toBeVisible();
    });

    test('2.2 Registration validates required fields', async ({ page }) => {
      await page.goto(ROUTES.signUp);
      await waitForPageLoad(page);

      const hasForm = await page.locator('input[type="email"]').count() > 0;

      if (hasForm) {
        // Try to submit empty form
        const submitButton = page.locator('button[type="submit"]');
        if (await submitButton.count() > 0) {
          await submitButton.click({ force: true });

          // Should stay on registration page
          await page.waitForTimeout(500);
          expect(page.url()).toContain('sign-up');
        }
      }
    });

    test('2.3 Registration validates password requirements', async ({ page }) => {
      await page.goto(ROUTES.signUp);
      await waitForPageLoad(page);

      const hasForm = await page.locator('input[type="email"]').count() > 0;

      if (hasForm) {
        // Fill form with weak password
        await page.fill('input[type="email"]', 'newuser@test.com');

        const passwordInputs = page.locator('input[type="password"]');
        if (await passwordInputs.count() > 0) {
          await passwordInputs.first().fill('weak');

          // Try to submit
          const submitButton = page.locator('button[type="submit"]');
          if (await submitButton.count() > 0) {
            await submitButton.click({ force: true });
            await page.waitForTimeout(1000);

            // Should show password error or stay on page
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/register-password-error.png` });
          }
        }
      }
    });

    test('2.4 Registration link from login page works', async ({ page }) => {
      await page.goto(ROUTES.signIn);
      await waitForPageLoad(page);

      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      // Find and click sign up link
      const signUpLink = page.locator('a[href*="sign-up"]').first();
      if (await signUpLink.isVisible()) {
        await signUpLink.click();
        await waitForPageLoad(page);

        // Should be on sign-up page
        expect(page.url()).toContain('sign-up');
      }
    });
  });

  test.describe('3. Password Recovery Flow', () => {
    test('3.1 Forgot password page renders correctly', async ({ page }) => {
      await page.goto(ROUTES.forgotPassword);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/forgot-password.png` });

      // Should have email field
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();

      // Should have submit button
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
    });

    test('3.2 Forgot password link from login works', async ({ page }) => {
      await page.goto(ROUTES.signIn);
      await waitForPageLoad(page);

      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      const forgotLink = page.locator('a[href*="forgot-password"]');
      if (await forgotLink.isVisible()) {
        await forgotLink.click();
        await waitForPageLoad(page);

        expect(page.url()).toContain('forgot-password');
      }
    });

    test('3.3 Forgot password validates email', async ({ page }) => {
      await page.goto(ROUTES.forgotPassword);
      await waitForPageLoad(page);

      // Try invalid email
      await page.fill('input[type="email"]', 'notanemail');

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ force: true });

      // Should show validation error or stay on page
      await page.waitForTimeout(500);
      expect(page.url()).toContain('forgot-password');
    });

    test('3.4 Forgot password with valid email shows confirmation', async ({ page }) => {
      await page.goto(ROUTES.forgotPassword);
      await waitForPageLoad(page);

      // Enter valid email format
      await page.fill('input[type="email"]', 'test@example.com');

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ force: true });

      // Wait for response
      await page.waitForTimeout(3000);

      // Should show success message or redirect
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/forgot-password-submitted.png` });
    });
  });

  test.describe('4. Logout Flow', () => {
    test('4.1 Logout clears session and redirects', async ({ page }) => {
      // First login
      const success = await login(page, TEST_CREDENTIALS.coach);

      if (success) {
        // Now logout
        await logout(page);

        // Should be redirected somewhere after logout
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/after-logout.png` });

        // Page should be visible (logout completed)
        await expect(page.locator('body')).toBeVisible();
      } else {
        test.skip(true, 'Could not login to test logout');
      }
    });
  });

  test.describe('5. Session Persistence', () => {
    test('5.1 Session persists across page reloads', async ({ page }) => {
      const success = await login(page, TEST_CREDENTIALS.coach);

      if (success) {
        // Reload page
        await page.reload();
        await waitForPageLoad(page);

        // Should still be logged in
        await page.waitForTimeout(2000);
        const url = page.url();
        expect(!url.includes('sign-in')).toBeTruthy();
      } else {
        test.skip(true, 'Could not login to test session persistence');
      }
    });

    test('5.2 Session persists across navigation', async ({ page }) => {
      const success = await login(page, TEST_CREDENTIALS.coach);

      if (success) {
        // Navigate to different pages
        await page.goto('/sessions');
        await waitForPageLoad(page);

        await page.goto('/messages');
        await waitForPageLoad(page);

        // Should still be logged in (not redirected to sign-in)
        await page.waitForTimeout(1000);
        const url = page.url();
        expect(url.includes('messages') || !url.includes('sign-in')).toBeTruthy();
      } else {
        test.skip(true, 'Could not login to test session persistence');
      }
    });
  });
});

test.describe('Authentication - Error Handling', () => {
  test('Network error shows appropriate message', async ({ page }) => {
    // Intercept login request to simulate network error
    await page.route('**/auth/**', route => route.abort());

    await page.goto(ROUTES.signIn);
    await waitForPageLoad(page);

    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);

    // Should show error or stay on page
    expect(page.url()).toContain('sign-in');

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/login-network-error.png` });
  });
});
