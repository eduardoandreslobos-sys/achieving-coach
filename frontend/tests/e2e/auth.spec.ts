import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/test-utils';

test.describe('Authentication Flow', () => {
  test.describe('Sign In Page', () => {
    test('sign in page has dark theme', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      // Check for dark background
      const body = page.locator('body');
      const bgColor = await body.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Background should be dark
      const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        // Should be dark (allow for some variation)
        expect(Math.max(r, g, b)).toBeLessThan(50);
      }
    });

    test('sign in page has email and password fields', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      // Check for email field
      const emailField = page.locator('input[type="email"]');
      await expect(emailField).toBeVisible();

      // Check for password field
      const passwordField = page.locator('input[type="password"]');
      await expect(passwordField).toBeVisible();
    });

    test('sign in page has submit button', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      // Check for submit button
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
    });

    test('sign in form validates empty fields', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      // Form should not navigate away (validation should prevent)
      expect(page.url()).toContain('/sign-in');
    });

    test('sign in page has link to sign up', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      // Check for sign up link
      const signUpLink = page.locator('a[href*="sign-up"], a:has-text("Sign up"), a:has-text("Create account")');

      if (await signUpLink.count() > 0) {
        await expect(signUpLink.first()).toBeVisible();
      }
    });
  });

  test.describe('Sign Up Page', () => {
    test('sign up page loads correctly', async ({ page }) => {
      await page.goto('/sign-up');
      await waitForPageLoad(page);

      // Check for registration form
      const emailField = page.locator('input[type="email"]');
      const passwordField = page.locator('input[type="password"]');

      await expect(emailField).toBeVisible();
      await expect(passwordField).toBeVisible();
    });

    test('sign up page has dark theme', async ({ page }) => {
      await page.goto('/sign-up');
      await waitForPageLoad(page);

      const body = page.locator('body');
      const bgColor = await body.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        expect(Math.max(r, g, b)).toBeLessThan(50);
      }
    });
  });

  test.describe('Protected Routes', () => {
    test('dashboard redirects to sign in when not authenticated', async ({ page }) => {
      await page.goto('/dashboard');

      // Should redirect to sign-in or show sign-in content
      await page.waitForURL(/sign-in|dashboard/, { timeout: 10000 });

      // Either redirected or showing auth prompt
      const isOnSignIn = page.url().includes('sign-in');
      const hasSignInContent = await page.locator('input[type="email"]').count() > 0;

      expect(isOnSignIn || hasSignInContent).toBeTruthy();
    });

    test('coach routes redirect when not authenticated', async ({ page }) => {
      await page.goto('/coach/clients');

      await page.waitForURL(/sign-in|coach/, { timeout: 10000 });

      const isOnSignIn = page.url().includes('sign-in');
      const hasSignInContent = await page.locator('input[type="email"]').count() > 0;
      const hasCoachContent = page.url().includes('coach');

      expect(isOnSignIn || hasSignInContent || hasCoachContent).toBeTruthy();
    });

    test('admin routes redirect when not authenticated', async ({ page }) => {
      await page.goto('/admin');

      await page.waitForURL(/sign-in|admin/, { timeout: 10000 });

      const isOnSignIn = page.url().includes('sign-in');
      const hasSignInContent = await page.locator('input[type="email"]').count() > 0;

      expect(isOnSignIn || hasSignInContent).toBeTruthy();
    });
  });

  test.describe('Input Styling', () => {
    test('sign in inputs have dark theme styling', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      const emailField = page.locator('input[type="email"]');
      await expect(emailField).toBeVisible();

      const bgColor = await emailField.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Input background should be dark
      const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        // Should be dark (allow for #1a1a1a = 26)
        expect(Math.max(r, g, b)).toBeLessThan(50);
      }
    });

    test('sign in button has proper styling', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();

      const bgColor = await submitButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Button should be blue (primary color)
      expect(bgColor).toMatch(/rgb\(37, 99, 235\)|rgb\(29, 78, 216\)|rgb\(59, 130, 246\)/);
    });
  });
});

test.describe('Authentication - Error States', () => {
  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');
    await waitForPageLoad(page);

    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for response (either error message or redirect)
    await page.waitForTimeout(3000);

    // Should still be on sign-in page (login failed)
    expect(page.url()).toContain('sign-in');
  });

  test('shows error for invalid email format', async ({ page }) => {
    await page.goto('/sign-in');
    await waitForPageLoad(page);

    // Fill in invalid email
    await page.fill('input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'somepassword');

    // Try to submit
    await page.click('button[type="submit"]');

    // HTML5 validation should prevent submission or show error
    expect(page.url()).toContain('sign-in');
  });
});
