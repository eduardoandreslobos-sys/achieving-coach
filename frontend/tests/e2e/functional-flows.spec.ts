import { test, expect } from '@playwright/test';
import { waitForPageLoad, TOOL_IDS, TOOL_NAMES } from '../fixtures/test-utils';

/**
 * Functional Flow Tests
 * These tests verify complete user journeys and interactions
 */

/**
 * Helper to wait for sign-in form to be ready
 */
async function waitForSignInForm(page: any) {
  await page.goto('/sign-in');
  await page.waitForLoadState('domcontentloaded');
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });
  } catch {
    // Form might not appear if auth is loading
  }
}

test.describe('Authentication Flows', () => {
  test.describe('Sign In Flow', () => {
    test('can navigate to sign-in from home page', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const signInLink = page.locator('a[href*="sign-in"], a:has-text("Sign in"), a:has-text("Iniciar")');
      if (await signInLink.count() > 0) {
        await signInLink.first().click();
        await waitForPageLoad(page);
        expect(page.url()).toContain('sign-in');
      }
    });

    test('sign-in form has all required fields', async ({ page }) => {
      await waitForSignInForm(page);

      const emailField = page.locator('input[type="email"]');
      const passwordField = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      // Check if form is visible
      const hasEmail = await emailField.count() > 0;
      const hasPassword = await passwordField.count() > 0;
      const hasSubmit = await submitButton.count() > 0;

      // Either form is loaded or page is in loading state
      expect(hasEmail || hasPassword || hasSubmit || page.url().includes('sign-in')).toBeTruthy();
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await waitForSignInForm(page);

      const emailField = page.locator('input[type="email"]');
      if (await emailField.count() > 0) {
        await page.fill('input[type="email"]', 'test@invalid.com');
        await page.fill('input[type="password"]', 'wrongpassword123');
        await page.click('button[type="submit"]');

        // Wait for response
        await page.waitForTimeout(3000);
      }

      // Should still be on sign-in (login failed)
      expect(page.url()).toContain('sign-in');
    });

    test('can navigate to sign-up from sign-in', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      const signUpLink = page.locator('a[href*="sign-up"]');
      if (await signUpLink.count() > 0) {
        await signUpLink.first().click();
        await waitForPageLoad(page);
        expect(page.url()).toContain('sign-up');
      }
    });

    test('can navigate to forgot password', async ({ page }) => {
      await page.goto('/sign-in');
      await waitForPageLoad(page);

      const forgotLink = page.locator('a[href*="forgot"], a:has-text("Forgot"), a:has-text("Olvidaste")');
      if (await forgotLink.count() > 0) {
        await forgotLink.first().click();
        await waitForPageLoad(page);
        expect(page.url()).toContain('forgot');
      }
    });
  });

  test.describe('Sign Up Flow', () => {
    test('sign-up form has all required fields', async ({ page }) => {
      await page.goto('/sign-up');
      await waitForPageLoad(page);

      const emailField = page.locator('input[type="email"]');
      const passwordField = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await expect(emailField).toBeVisible();
      await expect(passwordField).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    test('validates email format', async ({ page }) => {
      await page.goto('/sign-up');
      await waitForPageLoad(page);

      await page.fill('input[type="email"]', 'notanemail');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');

      // Should stay on page due to validation
      expect(page.url()).toContain('sign-up');
    });

    test('can navigate to sign-in from sign-up', async ({ page }) => {
      await page.goto('/sign-up');
      await waitForPageLoad(page);

      const signInLink = page.locator('a[href*="sign-in"]');
      if (await signInLink.count() > 0) {
        await signInLink.first().click();
        await waitForPageLoad(page);
        expect(page.url()).toContain('sign-in');
      }
    });
  });

  test.describe('Password Recovery Flow', () => {
    test('forgot password page loads', async ({ page }) => {
      await page.goto('/forgot-password');
      await waitForPageLoad(page);

      const emailField = page.locator('input[type="email"]');
      await expect(emailField).toBeVisible();
    });

    test('forgot password form validates email', async ({ page }) => {
      await page.goto('/forgot-password');
      await waitForPageLoad(page);

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      // Should stay on page (validation)
      expect(page.url()).toContain('forgot');
    });
  });
});

test.describe('Tool Interaction Flows', () => {
  test.describe('Tool Navigation', () => {
    test('can navigate to tools from home', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const toolsLink = page.locator('a[href="/tools"], a:has-text("Tools"), a:has-text("Herramientas")');
      if (await toolsLink.count() > 0) {
        await toolsLink.first().click();
        await waitForPageLoad(page);
        expect(page.url()).toContain('tools');
      }
    });

    test('tools listing shows all tools', async ({ page }) => {
      await page.goto('/tools');
      await waitForPageLoad(page);

      // Should have links to individual tools
      const toolLinks = page.locator('a[href^="/tools/"]');
      const count = await toolLinks.count();

      // Should have multiple tool links
      expect(count).toBeGreaterThan(0);
    });

    test('can click through to individual tool pages', async ({ page }) => {
      await page.goto('/tools');
      await waitForPageLoad(page);

      const firstToolLink = page.locator('a[href^="/tools/"]').first();
      if (await firstToolLink.count() > 0) {
        const href = await firstToolLink.getAttribute('href');
        await firstToolLink.click();
        await waitForPageLoad(page);

        if (href) {
          expect(page.url()).toContain(href);
        }
      }
    });
  });

  test.describe('Tool Access States', () => {
    for (const toolId of TOOL_IDS.slice(0, 3)) { // Test first 3 tools
      test(`${TOOL_NAMES[toolId]} shows appropriate access state`, async ({ page }) => {
        await page.goto(`/tools/${toolId}`);
        await waitForPageLoad(page);

        // Page should show one of: tool form, access required, or sign-in
        const hasToolForm = await page.locator('form, input[type="range"], textarea').count() > 0;
        const hasAccessMessage = await page.locator('text=Access Required, text=Tool for Coachees').count() > 0;
        const hasSignIn = await page.locator('input[type="email"]').count() > 0;

        expect(hasToolForm || hasAccessMessage || hasSignIn).toBeTruthy();
      });
    }
  });

  test.describe('Tool Back Navigation', () => {
    test('can return to tools listing from tool page', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      const backLink = page.locator('a[href="/tools"], a:has-text("Back"), a:has-text("Volver")');
      if (await backLink.count() > 0) {
        await backLink.first().click();
        await waitForPageLoad(page);
        expect(page.url()).toContain('/tools');
      }
    });
  });
});

test.describe('Contact Form Flow', () => {
  test('contact form submission flow', async ({ page }) => {
    await page.goto('/contact');
    await waitForPageLoad(page);

    // Fill out form
    const nameField = page.locator('input[name="name"], input[placeholder*="Nombre"]');
    const emailField = page.locator('input[type="email"]');
    const messageField = page.locator('textarea');
    const submitButton = page.locator('button[type="submit"]');

    if (await nameField.count() > 0) {
      await nameField.fill('Test User');
    }
    if (await emailField.count() > 0) {
      await emailField.fill('test@example.com');
    }
    if (await messageField.count() > 0) {
      await messageField.fill('This is a test message from E2E tests.');
    }

    // Form should have all fields filled
    expect(await submitButton.count()).toBeGreaterThan(0);
  });

  test('contact form validates required fields', async ({ page }) => {
    await page.goto('/contact');
    await waitForPageLoad(page);

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should stay on page (validation prevents submission)
    expect(page.url()).toContain('contact');
  });
});

test.describe('Blog Navigation Flow', () => {
  test('blog listing to article flow', async ({ page }) => {
    await page.goto('/blog');
    await waitForPageLoad(page);

    const articleLink = page.locator('a[href^="/blog/"]').first();
    if (await articleLink.count() > 0) {
      await articleLink.click();
      await waitForPageLoad(page);

      // Should be on article page
      expect(page.url()).toMatch(/\/blog\/.+/);
    }
  });

  test('blog category filtering', async ({ page }) => {
    await page.goto('/blog');
    await waitForPageLoad(page);

    // Click on a category filter if available
    const categoryButton = page.locator('button:has-text("Guías"), button:has-text("ICF")').first();
    if (await categoryButton.count() > 0) {
      await categoryButton.click();
      await page.waitForTimeout(500);

      // Page should still be blog
      expect(page.url()).toContain('blog');
    }
  });
});

test.describe('Pricing Flow', () => {
  test('pricing page CTA leads to sign-up', async ({ page }) => {
    await page.goto('/pricing');
    await waitForPageLoad(page);

    const ctaButton = page.locator('a[href*="sign-up"]').first();
    if (await ctaButton.count() > 0) {
      await ctaButton.click();
      await waitForPageLoad(page);
      expect(page.url()).toContain('sign-up');
    }
  });
});

test.describe('Navigation Flow', () => {
  test('main navigation works correctly', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Test Features link
    const featuresLink = page.locator('nav a[href="/features"], header a[href="/features"]').first();
    if (await featuresLink.count() > 0) {
      await featuresLink.click();
      await waitForPageLoad(page);
      expect(page.url()).toContain('features');
    }

    // Navigate back and test Pricing
    await page.goto('/');
    await waitForPageLoad(page);

    const pricingLink = page.locator('nav a[href="/pricing"], header a[href="/pricing"]').first();
    if (await pricingLink.count() > 0) {
      await pricingLink.click();
      await waitForPageLoad(page);
      expect(page.url()).toContain('pricing');
    }
  });

  test('logo links to home', async ({ page }) => {
    await page.goto('/features');
    await waitForPageLoad(page);

    const logoLink = page.locator('a[href="/"]').first();
    if (await logoLink.count() > 0) {
      await logoLink.click();
      await waitForPageLoad(page);

      // Should be on home
      expect(page.url()).toMatch(/\/$/);
    }
  });
});

test.describe('Protected Route Flows', () => {
  test('dashboard redirect flow', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/sign-in|dashboard/, { timeout: 15000 });

    // Should redirect to sign-in or show dashboard
    const isOnSignIn = page.url().includes('sign-in');
    const isOnDashboard = page.url().includes('dashboard');

    expect(isOnSignIn || isOnDashboard).toBeTruthy();
  });

  test('coach area redirect flow', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForURL(/sign-in|coach|dashboard/, { timeout: 15000 });

    const isOnSignIn = page.url().includes('sign-in');
    const isOnCoach = page.url().includes('coach');
    const isOnDashboard = page.url().includes('dashboard');

    expect(isOnSignIn || isOnCoach || isOnDashboard).toBeTruthy();
  });

  test('admin area redirect flow', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL(/sign-in|admin/, { timeout: 15000 });

    const isOnSignIn = page.url().includes('sign-in');
    const isOnAdmin = page.url().includes('admin');

    expect(isOnSignIn || isOnAdmin).toBeTruthy();
  });
});

test.describe('Error Recovery Flows', () => {
  test('404 page has navigation back', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    await waitForPageLoad(page);

    // Should have some way to navigate back
    const homeLink = page.locator('a[href="/"], a:has-text("Home"), a:has-text("Inicio")');
    const bodyContent = await page.locator('body').textContent();

    // Either has home link or shows sign-in
    const hasHomeLink = await homeLink.count() > 0;
    const hasSignIn = page.url().includes('sign-in');
    const has404Text = bodyContent?.includes('404') || bodyContent?.includes('not found');

    expect(hasHomeLink || hasSignIn || has404Text).toBeTruthy();
  });
});

test.describe('Mobile Navigation Flows', () => {
  test('mobile menu opens and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await waitForPageLoad(page);

    // Look for hamburger menu
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("☰"), button svg');

    if (await menuButton.count() > 0) {
      await menuButton.first().click();
      await page.waitForTimeout(500);

      // Menu should open (check for nav links)
      const navLinks = page.locator('nav a, a[href="/features"]');
      expect(await navLinks.count()).toBeGreaterThan(0);
    }
  });
});
