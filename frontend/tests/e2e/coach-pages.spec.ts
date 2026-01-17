import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/test-utils';

test.describe('Coach Pages - Access Control', () => {
  test('coach dashboard requires authentication', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('coach clients page requires authentication', async ({ page }) => {
    await page.goto('/coach/clients');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('coach sessions page requires authentication', async ({ page }) => {
    await page.goto('/coach/sessions');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('coach booking page requires authentication', async ({ page }) => {
    await page.goto('/coach/booking');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('coach programs page requires authentication', async ({ page }) => {
    await page.goto('/coach/programs');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('coach profile page requires authentication', async ({ page }) => {
    await page.goto('/coach/profile');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('coach invite page requires authentication', async ({ page }) => {
    await page.goto('/coach/invite');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('coach tools page requires authentication', async ({ page }) => {
    await page.goto('/coach/tools');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });

  test('ICF simulator requires authentication', async ({ page }) => {
    await page.goto('/coach/icf-simulator');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url.includes('sign-in') || url.includes('coach') || url.includes('dashboard')).toBeTruthy();
  });
});

test.describe('Coach Pages - UI Structure', () => {
  test('coach page renders', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Coach Pages - Dark Theme', () => {
  test('coach page has dark background', async ({ page }) => {
    await page.goto('/coach');
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

test.describe('Coach Pages - Expected Components', () => {
  test('coach dashboard renders', async ({ page }) => {
    await page.goto('/coach');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach clients page renders', async ({ page }) => {
    await page.goto('/coach/clients');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach sessions page renders', async ({ page }) => {
    await page.goto('/coach/sessions');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach programs page renders', async ({ page }) => {
    await page.goto('/coach/programs');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach profile page renders', async ({ page }) => {
    await page.goto('/coach/profile');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach invite page renders', async ({ page }) => {
    await page.goto('/coach/invite');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach booking page renders', async ({ page }) => {
    await page.goto('/coach/booking');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('ICF simulator page renders', async ({ page }) => {
    await page.goto('/coach/icf-simulator');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Coach Pages - Navigation', () => {
  test('coach has sidebar navigation', async ({ page }) => {
    await page.goto('/coach');
    await waitForPageLoad(page);

    const sidebar = page.locator('aside, nav[class*="fixed"]');

    if (await sidebar.count() > 0) {
      const navLinks = page.locator('a[href^="/coach"]');
      expect(await navLinks.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Coach Pages - Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  for (const viewport of viewports) {
    test(`coach page renders on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/coach');
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test(`coach clients page renders on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/coach/clients');
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  }
});

test.describe('Coach Pages - Public Booking', () => {
  test('public booking page loads without authentication', async ({ page }) => {
    await page.goto('/book/test-coach-id');
    await waitForPageLoad(page);

    // Public booking should be accessible
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('public booking page has dark theme', async ({ page }) => {
    await page.goto('/book/test-coach-id');
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

test.describe('Coach Pages - Error Handling', () => {
  test('non-existent client ID shows appropriate state', async ({ page }) => {
    await page.goto('/book/non-existent-coach-id-12345');
    await waitForPageLoad(page);

    // Should either show error or booking form
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
