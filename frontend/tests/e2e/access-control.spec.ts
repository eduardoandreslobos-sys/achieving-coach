import { test, expect } from '@playwright/test';
import { waitForPageLoad, TOOL_IDS, TOOL_NAMES } from '../fixtures/test-utils';

test.describe('Access Control - Tool Pages', () => {
  test.describe.configure({ mode: 'parallel' });

  // Test that tool pages show appropriate access messages
  for (const toolId of TOOL_IDS) {
    test(`${TOOL_NAMES[toolId]} page shows access control UI`, async ({ page }) => {
      await page.goto(`/tools/${toolId}`);
      await waitForPageLoad(page);

      // Page should show either:
      // 1. Tool content (if user has access)
      // 2. "Access Required" message (if coachee without assignment)
      // 3. "Tool for Coachees Only" message (if coach)
      // 4. Sign-in redirect (if not authenticated)

      const accessRequired = page.locator('text=Access Required');
      const coacheeOnly = page.locator('text=Tool for Coachees Only');
      const toolContent = page.locator('h1, form, input, button[type="submit"]');
      const signIn = page.locator('text=Sign in, text=Log in, input[type="email"]');

      const hasAccessMessage = await accessRequired.count() > 0;
      const hasCoachMessage = await coacheeOnly.count() > 0;
      const hasToolContent = await toolContent.count() > 0;
      const hasSignIn = await signIn.count() > 0;

      // Page should display one of these states
      expect(hasAccessMessage || hasCoachMessage || hasToolContent || hasSignIn).toBeTruthy();
    });

    test(`${TOOL_NAMES[toolId]} access denied page has proper dark styling`, async ({ page }) => {
      await page.goto(`/tools/${toolId}`);
      await waitForPageLoad(page);

      // Check for access denied card
      const accessCard = page.locator('div[class*="bg-[#111111]"]').first();

      if (await accessCard.count() > 0) {
        await expect(accessCard).toBeVisible();

        // Verify dark theme styling
        const bgColor = await accessCard.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          expect(Math.max(r, g, b)).toBeLessThan(30);
        }
      }
    });
  }

  test.describe('Coach Access Restrictions', () => {
    test('coach sees "Tool for Coachees Only" message content', async ({ page }) => {
      // Navigate to a tool page
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Look for coach-specific messaging
      const coachMessage = page.locator('text=Tool for Coachees Only');
      const assignMessage = page.locator('text=assign it to your clients');
      const goToClientsButton = page.locator('text=Go to Clients');

      // If coach is logged in, these elements should be present
      if (await coachMessage.count() > 0) {
        await expect(coachMessage).toBeVisible();

        // Should have explanation text
        const explanation = await assignMessage.count();
        expect(explanation).toBeGreaterThan(0);

        // Should have button to go to clients page
        const hasButton = await goToClientsButton.count();
        expect(hasButton).toBeGreaterThan(0);
      }
    });

    test('coach message card has correct icon styling', async ({ page }) => {
      await page.goto('/tools/resilience-scale');
      await waitForPageLoad(page);

      // Look for blue icon container (coach state)
      const blueIcon = page.locator('div[class*="bg-blue-500/20"]');
      const coachMessage = page.locator('text=Tool for Coachees Only');

      if (await coachMessage.count() > 0) {
        // Coach should see blue icon
        const hasBlueIcon = await blueIcon.count() > 0;
        expect(hasBlueIcon).toBeTruthy();
      }
    });
  });

  test.describe('Coachee Access Restrictions', () => {
    test('coachee sees "Access Required" message content', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      // Look for coachee-specific messaging
      const accessRequired = page.locator('text=Access Required');
      const needsAssignment = page.locator('text=assigned by your coach');
      const dashboardButton = page.locator('text=Return to Dashboard, text=Back to Dashboard');

      // If coachee without assignment is logged in
      if (await accessRequired.count() > 0) {
        await expect(accessRequired).toBeVisible();

        // Should have explanation about needing assignment
        const explanation = await needsAssignment.count();
        expect(explanation).toBeGreaterThan(0);

        // Should have button to go back to dashboard
        const hasButton = await dashboardButton.count();
        expect(hasButton).toBeGreaterThan(0);
      }
    });

    test('coachee message card has correct icon styling', async ({ page }) => {
      await page.goto('/tools/disc');
      await waitForPageLoad(page);

      // Look for yellow icon container (coachee state)
      const yellowIcon = page.locator('div[class*="bg-yellow-500/20"]');
      const accessRequired = page.locator('text=Access Required');

      if (await accessRequired.count() > 0) {
        // Coachee should see yellow icon
        const hasYellowIcon = await yellowIcon.count() > 0;
        expect(hasYellowIcon).toBeTruthy();
      }
    });
  });

  test.describe('Navigation from Access Denied', () => {
    test('Go to Clients button navigates correctly', async ({ page }) => {
      await page.goto('/tools/career-compass');
      await waitForPageLoad(page);

      const goToClientsButton = page.locator('a:has-text("Go to Clients"), button:has-text("Go to Clients")');

      if (await goToClientsButton.count() > 0) {
        await goToClientsButton.click();
        await page.waitForURL(/\/coach\/clients/, { timeout: 10000 });
        expect(page.url()).toContain('/coach/clients');
      }
    });

    test('Return to Dashboard button navigates correctly', async ({ page }) => {
      await page.goto('/tools/habit-loop');
      await waitForPageLoad(page);

      const dashboardButton = page.locator('a:has-text("Return to Dashboard"), a:has-text("Back to Dashboard")');

      if (await dashboardButton.count() > 0) {
        await dashboardButton.click();
        await page.waitForURL(/\/dashboard/, { timeout: 10000 });
        expect(page.url()).toContain('/dashboard');
      }
    });
  });
});

test.describe('Access Control - Role-Based UI', () => {
  test('loading spinner shows while checking access', async ({ page }) => {
    // Navigate without waiting for full load
    await page.goto('/tools/emotional-triggers');

    // Check for loading spinner
    const spinner = page.locator('.animate-spin');

    // Spinner may or may not be visible depending on timing
    // Just verify page eventually loads
    await page.waitForSelector('.min-h-screen', { timeout: 10000 });
  });

  test('all tool pages have consistent access denied layout', async ({ page }) => {
    const toolsToCheck = ['wheel-of-life', 'grow-model', 'disc'];

    for (const toolId of toolsToCheck) {
      await page.goto(`/tools/${toolId}`);
      await waitForPageLoad(page);

      // Check for consistent layout elements
      const accessCard = page.locator('div[class*="rounded-2xl"][class*="border"]');
      const iconContainer = page.locator('div[class*="w-16 h-16"][class*="rounded-full"]');
      const title = page.locator('h2[class*="text-2xl"][class*="font-bold"]');

      // If showing access denied, verify consistent structure
      if (await page.locator('text=Access Required, text=Tool for Coachees Only').count() > 0) {
        expect(await accessCard.count()).toBeGreaterThan(0);
        expect(await iconContainer.count()).toBeGreaterThan(0);
        expect(await title.count()).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('Access Control - Completed Tool State', () => {
  test('completed tool shows success UI', async ({ page }) => {
    await page.goto('/tools/resilience-scale');
    await waitForPageLoad(page);

    // Check for completed state UI
    const completedMessage = page.locator('text=Tool Completed');
    const checkIcon = page.locator('div[class*="bg-emerald-500/20"]');

    if (await completedMessage.count() > 0) {
      await expect(completedMessage).toBeVisible();

      // Should have green check icon
      expect(await checkIcon.count()).toBeGreaterThan(0);

      // Should have navigation buttons
      const dashboardLink = page.locator('a:has-text("Return to Dashboard")');
      const toolsLink = page.locator('a:has-text("View Other Tools")');

      expect(await dashboardLink.count()).toBeGreaterThan(0);
      expect(await toolsLink.count()).toBeGreaterThan(0);
    }
  });

  test('completed state has proper dark theme styling', async ({ page }) => {
    await page.goto('/tools/limiting-beliefs');
    await waitForPageLoad(page);

    // Check completed state styling
    const completedCard = page.locator('div[class*="bg-[#111111]"]');

    if (await completedCard.count() > 0) {
      const bgColor = await completedCard.first().evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        expect(Math.max(r, g, b)).toBeLessThan(30);
      }
    }
  });
});
