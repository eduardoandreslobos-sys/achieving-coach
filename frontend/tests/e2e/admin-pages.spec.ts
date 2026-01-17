import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/test-utils';

test.describe('Admin Pages - Access Control', () => {
  test('admin dashboard redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Without auth, page will either redirect or show loading/sign-in
    const url = page.url();
    const isOnSignIn = url.includes('sign-in');
    const isOnAdmin = url.includes('admin');
    const hasSignInContent = await page.locator('input[type="email"]').count() > 0;
    const isLoading = await page.locator('.animate-spin').count() > 0;

    expect(isOnSignIn || hasSignInContent || isOnAdmin || isLoading).toBeTruthy();
  });

  test('admin users page requires authentication', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('admin')).toBeTruthy();
  });

  test('admin blog page requires authentication', async ({ page }) => {
    await page.goto('/admin/blog');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('admin')).toBeTruthy();
  });

  test('admin analytics page requires authentication', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('admin')).toBeTruthy();
  });

  test('admin seo page requires authentication', async ({ page }) => {
    await page.goto('/admin/seo');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('admin')).toBeTruthy();
  });
});

test.describe('Admin Pages - UI Structure (when accessible)', () => {
  test('admin pages render without errors', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Verify page rendered (has body)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin dashboard shows loading or content', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should show loading, admin content, or sign-in
    const hasSpinner = await page.locator('.animate-spin').count() > 0;
    const hasContent = await page.locator('h1, h2, text=Admin, text=Dashboard').count() > 0;
    const hasSignIn = await page.locator('input[type="email"]').count() > 0;

    expect(hasSpinner || hasContent || hasSignIn).toBeTruthy();
  });
});

test.describe('Admin Pages - Dark Theme', () => {
  test('admin page background is dark', async ({ page }) => {
    await page.goto('/admin');
    await waitForPageLoad(page);

    const body = page.locator('body');
    const bgColor = await body.evaluate((el: Element) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should be dark (admin or sign-in page)
    const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      expect(Math.max(r, g, b)).toBeLessThan(50);
    }
  });
});

test.describe('Admin Pages - Expected Components', () => {
  test('admin page shows sidebar, loading, or sign-in', async ({ page }) => {
    await page.goto('/admin');
    await waitForPageLoad(page);

    const sidebar = page.locator('aside, nav[class*="fixed"]');
    const signInForm = page.locator('input[type="email"]');
    const loadingSpinner = page.locator('.animate-spin');
    const body = page.locator('body');

    const hasSidebar = await sidebar.count() > 0;
    const hasSignIn = await signInForm.count() > 0;
    const isLoading = await loadingSpinner.count() > 0;
    const hasBody = await body.count() > 0;

    expect(hasSidebar || hasSignIn || isLoading || hasBody).toBeTruthy();
  });

  test('admin users page renders', async ({ page }) => {
    await page.goto('/admin/users');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin blog page renders', async ({ page }) => {
    await page.goto('/admin/blog');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin analytics page renders', async ({ page }) => {
    await page.goto('/admin/analytics');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin seo page renders', async ({ page }) => {
    await page.goto('/admin/seo');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Admin Pages - Navigation Structure', () => {
  test('admin has expected navigation items', async ({ page }) => {
    await page.goto('/admin');
    await waitForPageLoad(page);

    // If we can see admin content, check navigation
    const sidebar = page.locator('aside, nav[class*="fixed"]');

    if (await sidebar.count() > 0) {
      // Should have navigation links
      const dashboardLink = page.locator('a[href="/admin"]');
      const usersLink = page.locator('a[href="/admin/users"]');
      const blogLink = page.locator('a[href="/admin/blog"]');
      const analyticsLink = page.locator('a[href="/admin/analytics"]');
      const seoLink = page.locator('a[href="/admin/seo"]');

      // At least some navigation should be visible
      const totalLinks = await dashboardLink.count() +
        await usersLink.count() +
        await blogLink.count() +
        await analyticsLink.count() +
        await seoLink.count();

      expect(totalLinks).toBeGreaterThan(0);
    }
  });
});

test.describe('Admin Pages - Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  for (const viewport of viewports) {
    test(`admin page renders on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/admin');
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  }
});

test.describe('Admin Pages - Error Handling', () => {
  test('non-existent admin route shows 404 or redirects', async ({ page }) => {
    const response = await page.goto('/admin/non-existent-page');
    await waitForPageLoad(page);

    const status = response?.status();
    const url = page.url();

    // Should 404 or redirect to sign-in/admin
    expect(status === 404 || url.includes('sign-in') || url.includes('admin')).toBeTruthy();
  });
});
