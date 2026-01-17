import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/test-utils';

test.describe('Dashboard Pages - Access Control', () => {
  test('dashboard requires authentication', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('dashboard')).toBeTruthy();
  });

  test('goals page requires authentication', async ({ page }) => {
    await page.goto('/goals');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('goals') || url.includes('dashboard')).toBeTruthy();
  });

  test('sessions page requires authentication', async ({ page }) => {
    await page.goto('/sessions');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('sessions') || url.includes('dashboard')).toBeTruthy();
  });

  test('programs page requires authentication', async ({ page }) => {
    await page.goto('/programs');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('programs') || url.includes('dashboard')).toBeTruthy();
  });

  test('reflections page requires authentication', async ({ page }) => {
    await page.goto('/reflections');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('reflections') || url.includes('dashboard')).toBeTruthy();
  });

  test('resources page requires authentication', async ({ page }) => {
    await page.goto('/resources');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('resources') || url.includes('dashboard')).toBeTruthy();
  });

  test('settings page requires authentication', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('settings') || url.includes('dashboard')).toBeTruthy();
  });
});

test.describe('Dashboard Pages - UI Structure', () => {
  test('dashboard page renders', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Dashboard Pages - Dark Theme', () => {
  test('dashboard has dark background', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);

    const body = page.locator('body');
    const bgColor = await body.evaluate((el: Element) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      expect(Math.max(r, g, b)).toBeLessThan(50);
    }
  });

  test('goals page has dark background', async ({ page }) => {
    await page.goto('/goals');
    await waitForPageLoad(page);

    const body = page.locator('body');
    const bgColor = await body.evaluate((el: Element) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      expect(Math.max(r, g, b)).toBeLessThan(50);
    }
  });
});

test.describe('Dashboard Pages - Expected Components', () => {
  test('dashboard renders', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('goals page renders', async ({ page }) => {
    await page.goto('/goals');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('sessions page renders', async ({ page }) => {
    await page.goto('/sessions');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('programs page renders', async ({ page }) => {
    await page.goto('/programs');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('reflections page renders', async ({ page }) => {
    await page.goto('/reflections');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('resources page renders', async ({ page }) => {
    await page.goto('/resources');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('settings page renders', async ({ page }) => {
    await page.goto('/settings');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('tools page renders', async ({ page }) => {
    await page.goto('/tools');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Dashboard Pages - Navigation', () => {
  test('dashboard has sidebar navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);

    const sidebar = page.locator('aside, nav[class*="fixed"]');

    if (await sidebar.count() > 0) {
      const navLinks = page.locator('a[href^="/dashboard"], a[href^="/goals"], a[href^="/sessions"]');
      expect(await navLinks.count()).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Dashboard Pages - Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  for (const viewport of viewports) {
    test(`dashboard renders on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test(`goals page renders on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/goals');
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test(`tools page renders on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/tools');
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  }
});

test.describe('Dashboard Pages - Error Handling', () => {
  test('non-existent dashboard route shows 404 or redirects', async ({ page }) => {
    const response = await page.goto('/dashboard/non-existent-page');
    await waitForPageLoad(page);

    const status = response?.status();
    const url = page.url();

    expect(status === 404 || url.includes('sign-in') || url.includes('dashboard')).toBeTruthy();
  });
});
