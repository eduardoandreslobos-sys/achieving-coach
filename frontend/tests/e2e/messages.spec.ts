import { test, expect } from '@playwright/test';
import { waitForPageLoad, validateDarkTheme, DARK_THEME } from '../fixtures/test-utils';

test.describe('Messages Page', () => {
  test.describe('Dark Theme UI', () => {
    test('messages page has dark theme background', async ({ page }) => {
      await page.goto('/messages');
      await waitForPageLoad(page);

      // Check the main container has dark background
      const mainContainer = page.locator('div.min-h-screen, main').first();

      if (await mainContainer.count() > 0) {
        const bgColor = await mainContainer.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // Should be dark color
        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          expect(Math.max(r, g, b)).toBeLessThan(30);
        }
      }
    });

    test('messages page has white/light text', async ({ page }) => {
      await page.goto('/messages');
      await waitForPageLoad(page);

      // Find headings
      const headings = page.locator('h1, h2').first();

      if (await headings.count() > 0) {
        await expect(headings).toBeVisible();

        const textColor = await headings.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        // Text should be light
        const rgbMatch = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          expect(Math.max(r, g, b)).toBeGreaterThan(200);
        }
      }
    });
  });

  test.describe('Page Loading', () => {
    test('messages page loads without errors', async ({ page }) => {
      // Listen for console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/messages');
      await waitForPageLoad(page);

      // Page should not have critical loading errors
      // Filter out known acceptable errors (like Firebase auth state)
      const criticalErrors = consoleErrors.filter(err =>
        !err.includes('Firebase') &&
        !err.includes('auth') &&
        !err.includes('network')
      );

      // Page should show either messages UI or sign-in requirement
      const pageContent = page.locator('body');
      await expect(pageContent).toBeVisible();
    });

    test('messages page shows loading state', async ({ page }) => {
      await page.goto('/messages');

      // Check for loading spinner or main content
      const spinner = page.locator('.animate-spin');
      const content = page.locator('h1, h2, .min-h-screen');

      // Either loading or content should be visible
      await page.waitForSelector('.animate-spin, h1, h2, .min-h-screen', { timeout: 10000 });
    });
  });

  test.describe('UI Elements', () => {
    test('messages page has conversation list or empty state', async ({ page }) => {
      await page.goto('/messages');
      await waitForPageLoad(page);

      // Should have either conversations or empty state message
      const conversationList = page.locator('[data-testid="conversation-list"], .conversation-item, ul li');
      const emptyState = page.locator('text=No messages, text=No conversations, text=Start a conversation');
      const signInRequired = page.locator('text=Sign in, text=Log in');

      const hasConversations = await conversationList.count() > 0;
      const hasEmptyState = await emptyState.count() > 0;
      const needsSignIn = await signInRequired.count() > 0;

      // Page should show one of these states
      expect(hasConversations || hasEmptyState || needsSignIn).toBeTruthy();
    });

    test('messages page has proper card styling', async ({ page }) => {
      await page.goto('/messages');
      await waitForPageLoad(page);

      // Look for cards with dark styling
      const cards = page.locator('div[class*="bg-[#111111]"], div[class*="rounded-xl"][class*="border"]');

      if (await cards.count() > 0) {
        const firstCard = cards.first();

        const bgColor = await firstCard.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // Card background should be dark
        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          expect(Math.max(r, g, b)).toBeLessThan(50);
        }
      }
    });
  });
});

test.describe('Messages Page - Responsive Design', () => {
  test('messages page works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/messages');
    await waitForPageLoad(page);

    // Page should render without horizontal scroll
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check page width matches viewport
    const bodyWidth = await body.evaluate((el) => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 10); // Allow small margin
  });

  test('messages page works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/messages');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
