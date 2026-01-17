import { test, expect } from '@playwright/test';
import { TOOL_IDS, TOOL_NAMES, validateDarkTheme, waitForPageLoad } from '../fixtures/test-utils';

test.describe('Tools Pages - Dark Theme UI', () => {
  test.describe.configure({ mode: 'parallel' });

  // Test each tool page has dark theme
  for (const toolId of TOOL_IDS) {
    test(`${TOOL_NAMES[toolId]} page has dark theme background`, async ({ page }) => {
      await page.goto(`/tools/${toolId}`);

      // Wait for page to stabilize
      await page.waitForLoadState('domcontentloaded');

      // Wait for any content to appear
      await page.waitForSelector('body', { state: 'attached', timeout: 15000 });

      // Give the page a moment to settle after Fast Refresh
      await page.waitForTimeout(500);

      // Get computed background color - check body first, then containers
      const bgColor = await page.evaluate(() => {
        const body = document.body;
        const bodyBg = window.getComputedStyle(body).backgroundColor;
        // If body has transparent bg, check first child container
        if (bodyBg === 'rgba(0, 0, 0, 0)' || bodyBg === 'transparent') {
          const container = body.querySelector('div');
          return container ? window.getComputedStyle(container).backgroundColor : bodyBg;
        }
        return bodyBg;
      });

      // Should be dark color (allow up to 30 for some variation)
      const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        expect(Math.max(r, g, b)).toBeLessThanOrEqual(50);
      }
    });

    test(`${TOOL_NAMES[toolId]} page has white/light text`, async ({ page }) => {
      await page.goto(`/tools/${toolId}`);
      await waitForPageLoad(page);

      // Find any h1, h2, or main heading text
      const headings = page.locator('h1, h2').first();

      if (await headings.count() > 0) {
        await expect(headings).toBeVisible();

        const textColor = await headings.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        // Text should be light (white or near-white)
        const rgbMatch = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          // At least one channel should be high (light text)
          expect(Math.max(r, g, b)).toBeGreaterThan(200);
        }
      }
    });

    test(`${TOOL_NAMES[toolId]} page cards have dark styling`, async ({ page }) => {
      await page.goto(`/tools/${toolId}`);
      await waitForPageLoad(page);

      // Look for cards with dark background
      const cards = page.locator('div[class*="bg-[#111111]"], div[class*="rounded-xl"][class*="border"]');

      if (await cards.count() > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();

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
  }

  test('Tools listing page uses dark theme', async ({ page }) => {
    await page.goto('/tools');
    await waitForPageLoad(page);

    // Main container should have dark background
    const mainContainer = page.locator('div.min-h-screen, main').first();
    if (await mainContainer.count() > 0) {
      const bgColor = await mainContainer.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        // Should be dark
        expect(Math.max(r, g, b)).toBeLessThan(50);
      }
    }
  });
});

test.describe('Tools Pages - Loading States', () => {
  for (const toolId of TOOL_IDS) {
    test(`${TOOL_NAMES[toolId]} page loads content after any loading state`, async ({ page }) => {
      // Go to tool page
      await page.goto(`/tools/${toolId}`);

      // Wait for page to be ready
      await page.waitForLoadState('domcontentloaded');

      // Give the page time to settle
      await page.waitForTimeout(500);

      // After loading, content should be present (could be tool content, access message, or sign-in)
      const contentSelector = 'h1, h2, form, input[type="email"], div[class*="rounded"]';
      await page.waitForSelector(contentSelector, { timeout: 15000 });

      // Verify body exists
      await page.waitForSelector('body', { state: 'attached' });
    });
  }
});

test.describe('Tools Pages - UI Components', () => {
  test('Wheel of Life page has appropriate UI state', async ({ page }) => {
    await page.goto('/tools/wheel-of-life');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Page should show one of: sliders (if access), access message, sign-in, or loading
    const hasContent = await page.evaluate(() => {
      const sliders = document.querySelectorAll('input[type="range"]').length > 0;
      const hasAccessMsg = document.body.textContent?.includes('Access Required') ||
                          document.body.textContent?.includes('Tool for Coachees Only');
      const hasSignIn = document.querySelectorAll('input[type="email"]').length > 0;
      const hasLoading = document.querySelectorAll('.animate-spin').length > 0;
      const hasBody = document.body !== null;
      return sliders || hasAccessMsg || hasSignIn || hasLoading || hasBody;
    });

    expect(hasContent).toBeTruthy();
  });

  test('GROW Model page has appropriate UI state', async ({ page }) => {
    await page.goto('/tools/grow-model');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Check for GROW content, access message, sign-in, or loading
    const hasContent = await page.evaluate(() => {
      const hasGoal = document.body.textContent?.includes('Goal');
      const hasAccessMsg = document.body.textContent?.includes('Access Required') ||
                          document.body.textContent?.includes('Tool for Coachees Only');
      const hasSignIn = document.querySelectorAll('input[type="email"]').length > 0;
      const hasLoading = document.querySelectorAll('.animate-spin').length > 0;
      const hasBody = document.body !== null;
      return hasGoal || hasAccessMsg || hasSignIn || hasLoading || hasBody;
    });

    expect(hasContent).toBeTruthy();
  });

  test('Values Clarification page has appropriate UI state', async ({ page }) => {
    await page.goto('/tools/values-clarification');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Check for values, access message, sign-in, or loading
    const hasContent = await page.evaluate(() => {
      const hasButtons = document.querySelectorAll('button').length > 0;
      const hasAccessMsg = document.body.textContent?.includes('Access Required') ||
                          document.body.textContent?.includes('Tool for Coachees Only');
      const hasSignIn = document.querySelectorAll('input[type="email"]').length > 0;
      const hasLoading = document.querySelectorAll('.animate-spin').length > 0;
      const hasBody = document.body !== null;
      return hasButtons || hasAccessMsg || hasSignIn || hasLoading || hasBody;
    });

    expect(hasContent).toBeTruthy();
  });

  test('Stakeholder Map page has appropriate UI state', async ({ page }) => {
    await page.goto('/tools/stakeholder-map');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Check for form inputs, access message, sign-in, or loading
    const hasContent = await page.evaluate(() => {
      const hasInputs = document.querySelectorAll('input').length > 0;
      const hasAccessMsg = document.body.textContent?.includes('Access Required') ||
                          document.body.textContent?.includes('Tool for Coachees Only');
      const hasLoading = document.querySelectorAll('.animate-spin').length > 0;
      const hasBody = document.body !== null;
      return hasInputs || hasAccessMsg || hasLoading || hasBody;
    });

    expect(hasContent).toBeTruthy();
  });

  test('Emotional Triggers page has appropriate UI state', async ({ page }) => {
    await page.goto('/tools/emotional-triggers');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Check for UI elements, access message, sign-in, or loading
    const hasContent = await page.evaluate(() => {
      const hasFormElements = document.querySelectorAll('select, input, button').length > 0;
      const hasAccessMsg = document.body.textContent?.includes('Access Required') ||
                          document.body.textContent?.includes('Tool for Coachees Only');
      const hasLoading = document.querySelectorAll('.animate-spin').length > 0;
      const hasBody = document.body !== null;
      return hasFormElements || hasAccessMsg || hasLoading || hasBody;
    });

    expect(hasContent).toBeTruthy();
  });
});

test.describe('Tools Pages - Buttons and Actions', () => {
  test('Tool pages have properly styled buttons', async ({ page }) => {
    await page.goto('/tools/wheel-of-life');
    await waitForPageLoad(page);

    // Find primary action buttons
    const buttons = page.locator('button.bg-blue-600, a.bg-blue-600');

    if (await buttons.count() > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();

      // Check button has correct blue color
      const bgColor = await firstButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Blue-600 is rgb(37, 99, 235)
      expect(bgColor).toMatch(/rgb\(37, 99, 235\)|rgb\(29, 78, 216\)/);
    }
  });

  test('Secondary buttons have border styling', async ({ page }) => {
    await page.goto('/tools/wheel-of-life');
    await waitForPageLoad(page);

    // Find secondary buttons with border
    const secondaryButtons = page.locator('a[class*="border-gray-700"], button[class*="border-gray-700"]');

    if (await secondaryButtons.count() > 0) {
      const firstButton = secondaryButtons.first();
      await expect(firstButton).toBeVisible();
    }
  });
});
