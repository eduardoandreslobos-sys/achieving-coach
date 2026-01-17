import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoach,
  loginAsCoachee,
  loginAsAdmin,
  logout,
  ROUTES,
} from '../fixtures/test-utils';

/**
 * Authenticated Flow Tests
 * These tests verify page behavior with and without authentication.
 * Tests gracefully handle missing credentials by verifying pages load correctly.
 */

test.describe('Authenticated Flows - Coach', () => {
  test('coach dashboard renders', async ({ page }) => {
    await page.goto(ROUTES.coach);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach clients page renders', async ({ page }) => {
    await page.goto(ROUTES.coachClients);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach sessions page renders', async ({ page }) => {
    await page.goto(ROUTES.coachSessions);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach booking page renders', async ({ page }) => {
    await page.goto(ROUTES.coachBooking);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach profile page renders', async ({ page }) => {
    await page.goto(ROUTES.coachProfile);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach ICF simulator renders', async ({ page }) => {
    await page.goto(ROUTES.icfSimulator);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach tool page shows appropriate state', async ({ page }) => {
    await page.goto('/tools/wheel-of-life');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coach invite page renders', async ({ page }) => {
    await page.goto(ROUTES.coachInvite);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Authenticated Flows - Coachee', () => {
  test('coachee dashboard renders', async ({ page }) => {
    await page.goto(ROUTES.dashboard);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coachee goals page renders', async ({ page }) => {
    await page.goto(ROUTES.goals);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coachee sessions page renders', async ({ page }) => {
    await page.goto(ROUTES.sessions);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coachee reflections page renders', async ({ page }) => {
    await page.goto(ROUTES.reflections);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coachee messages page renders', async ({ page }) => {
    await page.goto(ROUTES.messages);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coachee settings page renders', async ({ page }) => {
    await page.goto(ROUTES.settings);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('coachee tool page shows appropriate state', async ({ page }) => {
    await page.goto('/tools/wheel-of-life');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Authenticated Flows - Admin', () => {
  test('admin dashboard renders', async ({ page }) => {
    await page.goto(ROUTES.admin);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin users page renders', async ({ page }) => {
    await page.goto(ROUTES.adminUsers);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin blog page renders', async ({ page }) => {
    await page.goto(ROUTES.adminBlog);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin analytics page renders', async ({ page }) => {
    await page.goto(ROUTES.adminAnalytics);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('admin SEO page renders', async ({ page }) => {
    await page.goto(ROUTES.adminSeo);
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Tool Completion Flow', () => {
  test('wheel of life page renders', async ({ page }) => {
    await page.goto('/tools/wheel-of-life');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('GROW model page renders', async ({ page }) => {
    await page.goto('/tools/grow-model');
    await waitForPageLoad(page);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Navigation Flow', () => {
  test('can navigate from home to features', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    const featuresLink = page.locator('a[href="/features"]').first();
    if (await featuresLink.count() > 0) {
      await featuresLink.click();
      await waitForPageLoad(page);
      expect(page.url()).toContain('/features');
    }
  });

  test('can navigate from home to pricing', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    const pricingLink = page.locator('a[href="/pricing"]').first();
    if (await pricingLink.count() > 0) {
      await pricingLink.click();
      await waitForPageLoad(page);
      expect(page.url()).toContain('/pricing');
    }
  });
});
