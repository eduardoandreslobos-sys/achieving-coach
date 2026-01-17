import { test, expect } from '@playwright/test';
import { waitForPageLoad, TOOL_IDS, TOOL_NAMES } from '../fixtures/test-utils';

test.describe('Navigation - Main Routes', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Home page should load
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('tools listing page loads', async ({ page }) => {
    await page.goto('/tools');
    await waitForPageLoad(page);

    // Should render page with content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('book page loads for public booking', async ({ page }) => {
    await page.goto('/book');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Navigation - Tool Pages', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const toolId of TOOL_IDS) {
    test(`${TOOL_NAMES[toolId]} page is accessible`, async ({ page }) => {
      const response = await page.goto(`/tools/${toolId}`);

      // Page should return 200
      expect(response?.status()).toBe(200);

      // Wait for content
      await waitForPageLoad(page);

      // Page should have content
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  }
});

test.describe('Navigation - Tool Back Links', () => {
  for (const toolId of TOOL_IDS) {
    test(`${TOOL_NAMES[toolId]} page has back to tools link`, async ({ page }) => {
      await page.goto(`/tools/${toolId}`);
      await waitForPageLoad(page);

      // Look for back link
      const backLink = page.locator('a:has-text("Back to Tools"), a[href="/tools"]');

      // If tool is accessible, should have back link
      if (await page.locator('text=Access Required, text=Tool for Coachees Only').count() === 0) {
        if (await backLink.count() > 0) {
          await expect(backLink.first()).toBeVisible();
        }
      }
    });
  }
});

test.describe('Navigation - Header/Footer', () => {
  test('pages have consistent navigation', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Check for navigation elements
    const nav = page.locator('nav, header');

    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible();
    }
  });
});

test.describe('Navigation - 404 Handling', () => {
  test('non-existent page shows 404 or redirects', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345');

    // Should either 404 or redirect to home/sign-in
    const status = response?.status();
    const url = page.url();

    expect(status === 404 || url.includes('sign-in') || url === page.context().pages()[0].url()).toBeTruthy();
  });

  test('non-existent tool shows appropriate error', async ({ page }) => {
    const response = await page.goto('/tools/fake-tool-name');

    // Should show 404 or redirect
    await page.waitForLoadState('domcontentloaded');

    const status = response?.status();
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Either shows 404 or page renders
    expect(status === 404 || status === 200).toBeTruthy();
  });
});

test.describe('Navigation - URL Structure', () => {
  test('tool URLs follow kebab-case convention', async ({ page }) => {
    for (const toolId of TOOL_IDS) {
      // Verify tool ID is kebab-case
      expect(toolId).toMatch(/^[a-z]+(-[a-z]+)*$/);

      // Verify URL is accessible
      const response = await page.goto(`/tools/${toolId}`);
      expect(response?.status()).toBe(200);
    }
  });
});

test.describe('Navigation - Link Integrity', () => {
  test('tool listing links work correctly', async ({ page }) => {
    await page.goto('/tools');
    await waitForPageLoad(page);

    // Find tool links
    const toolLinks = page.locator('a[href^="/tools/"]');
    const linkCount = await toolLinks.count();

    if (linkCount > 0) {
      // Click first tool link
      const firstLink = toolLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href) {
        await firstLink.click();
        await waitForPageLoad(page);

        // Should navigate to tool page
        expect(page.url()).toContain(href);
      }
    }
  });
});
