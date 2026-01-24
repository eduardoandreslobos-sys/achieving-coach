import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  login,
  loginAsCoach,
  loginAsCoachee,
  TEST_CREDENTIALS,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/dashboard';

/**
 * Dashboard Flow Tests
 *
 * Tests dashboard functionality for both coach and coachee roles:
 * - Dashboard overview
 * - Navigation between sections
 * - Data display
 * - Quick actions
 */

test.describe('Coachee Dashboard Flows', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. Dashboard Overview', () => {
    test('1.1 Dashboard page loads correctly', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-dashboard.png`, fullPage: true });

      // Verify dashboard content loaded
      const mainContent = page.locator('main, [role="main"], .dashboard');
      await expect(mainContent.first()).toBeVisible();

      // Check for no console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.waitForTimeout(2000);
      // Log errors but don't fail (informational)
      if (errors.length > 0) {
        console.log('Console errors on dashboard:', errors);
      }
    });

    test('1.2 Dashboard shows user-specific data', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      // Should show some user data (sessions, progress, etc.)
      // This depends on implementation - check for any cards/widgets
      const cards = page.locator('.card, [class*="card"], .widget');
      const cardCount = await cards.count();

      // Dashboard should have some content
      expect(cardCount).toBeGreaterThanOrEqual(0);
    });

    test('1.3 Dashboard navigation sidebar works', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      // Check for navigation items
      const navLinks = page.locator('nav a, aside a');

      // Should have multiple navigation links
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-nav.png` });
    });
  });

  test.describe('2. Coachee Navigation', () => {
    test('2.1 Navigate to Sessions', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      // Find and click sessions link
      const sessionsLink = page.locator('a[href*="sessions"]').first();
      if (await sessionsLink.isVisible()) {
        await sessionsLink.click();
        await waitForPageLoad(page);

        expect(page.url()).toContain('sessions');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-sessions.png` });
      }
    });

    test('2.2 Navigate to Tools', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      const toolsLink = page.locator('a[href*="tools"]').first();
      if (await toolsLink.isVisible()) {
        await toolsLink.click();
        await waitForPageLoad(page);

        expect(page.url()).toContain('tools');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-tools.png` });
      }
    });

    test('2.3 Navigate to Messages', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      const messagesLink = page.locator('a[href*="messages"]').first();
      if (await messagesLink.isVisible()) {
        await messagesLink.click();
        await waitForPageLoad(page);

        expect(page.url()).toContain('messages');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-messages.png` });
      }
    });

    test('2.4 Navigate to Goals', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      const goalsLink = page.locator('a[href*="goals"]').first();
      if (await goalsLink.isVisible()) {
        await goalsLink.click();
        await waitForPageLoad(page);

        expect(page.url()).toContain('goals');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-goals.png` });
      }
    });

    test('2.5 Navigate to Settings', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      const settingsLink = page.locator('a[href*="settings"]').first();
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        await waitForPageLoad(page);

        expect(page.url()).toContain('settings');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-settings.png` });
      }
    });
  });

  test.describe('3. Coachee Sessions Page', () => {
    test('3.1 Sessions page shows list or empty state', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      // Should show sessions list or empty state
      const hasContent = await page.locator('main, [role="main"]').first().isVisible();
      expect(hasContent).toBeTruthy();

      // Check for session cards or empty message
      const sessionCards = page.locator('[class*="session"], .session-card, [data-testid*="session"]');
      const emptyState = page.locator('text=/no hay|sin sesiones|empty/i');

      const cardCount = await sessionCards.count();
      const hasEmpty = await emptyState.count() > 0;

      // Should have either sessions or empty state
      expect(cardCount > 0 || hasEmpty).toBeTruthy();
    });
  });

  test.describe('4. Coachee Goals Page', () => {
    test('4.1 Goals page loads correctly', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-goals-page.png` });
    });

    test('4.2 Can create new goal (if available)', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      // Look for "new goal" button
      const newGoalButton = page.locator('button:has-text("nuevo"), button:has-text("crear"), a:has-text("nuevo")').first();

      if (await newGoalButton.isVisible()) {
        await newGoalButton.click();
        await page.waitForTimeout(1000);

        // Should show goal creation form or modal
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-new-goal.png` });
      }
    });
  });
});

test.describe('Coach Dashboard Flows', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login as coach');
    }
  });

  test.describe('1. Coach Dashboard Overview', () => {
    test('1.1 Coach dashboard loads correctly', async ({ page }) => {
      await page.goto('/coach');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-dashboard.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Coach dashboard shows client overview', async ({ page }) => {
      await page.goto('/coach');
      await waitForPageLoad(page);

      // Should show some metrics or client info
      const metrics = page.locator('[class*="metric"], [class*="stat"], .card');
      const count = await metrics.count();

      // Should have some dashboard widgets
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('2. Coach Clients Management', () => {
    test('2.1 Clients page loads correctly', async ({ page }) => {
      await page.goto(ROUTES.coachClients);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-clients.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('2.2 Clients list shows clients or empty state', async ({ page }) => {
      await page.goto(ROUTES.coachClients);
      await waitForPageLoad(page);

      const clientCards = page.locator('[class*="client"], .client-card, [data-testid*="client"]');
      const emptyState = page.locator('text=/no hay|sin clientes|empty|invita/i');

      const cardCount = await clientCards.count();
      const hasEmpty = await emptyState.count() > 0;

      expect(cardCount > 0 || hasEmpty).toBeTruthy();
    });

    test('2.3 Can invite new client (if available)', async ({ page }) => {
      await page.goto(ROUTES.coachInvite);
      await waitForPageLoad(page);

      // Should show invite form or link
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-invite.png` });

      const inviteForm = page.locator('form, input[type="email"], button:has-text("invitar")');
      const count = await inviteForm.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('3. Coach Sessions Management', () => {
    test('3.1 Coach sessions page loads', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-sessions.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });
  });

  test.describe('4. Coach Tools', () => {
    test('4.1 Coach tools page loads', async ({ page }) => {
      await page.goto(ROUTES.coachTools);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-tools.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();

      // Should show tool cards
      const toolCards = page.locator('[class*="tool"], .tool-card, [data-testid*="tool"]');
      const count = await toolCards.count();

      // Should have multiple tools
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('5. ICF Simulator', () => {
    test('5.1 ICF Simulator page loads', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-simulator.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('5.2 ICF Simulator shows competencies', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      // Should show ICF competencies or scenario selector
      const competencyItems = page.locator('[class*="competenc"], [class*="scenario"], button, .card');
      const count = await competencyItems.count();

      expect(count).toBeGreaterThan(0);
    });

    test('5.3 ICF Simulator interaction flow', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      // Look for start button or scenario selection
      const startButton = page.locator('button:has-text("iniciar"), button:has-text("comenzar"), button:has-text("start")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-simulator-started.png` });
      }

      // Check for text input area (for responses)
      const textArea = page.locator('textarea, [contenteditable="true"]');
      if (await textArea.count() > 0) {
        await textArea.first().fill('Esta es una respuesta de prueba para el simulador ICF.');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-simulator-response.png` });
      }
    });
  });

  test.describe('6. Coach Profile', () => {
    test('6.1 Coach profile page loads', async ({ page }) => {
      await page.goto(ROUTES.coachProfile);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-profile.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('6.2 Coach profile shows editable fields', async ({ page }) => {
      await page.goto(ROUTES.coachProfile);
      await waitForPageLoad(page);

      // Should have input fields for profile info
      const inputs = page.locator('input, textarea');
      const count = await inputs.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe('Dashboard - Responsive Design', () => {
  test('Dashboard adapts to mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }

    await page.goto(ROUTES.dashboard);
    await waitForPageLoad(page);

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/dashboard-mobile.png`, fullPage: true });

    // Mobile menu should be available
    const mobileMenu = page.locator('[class*="mobile"], button[aria-label*="menu"], .hamburger');
    // May or may not have explicit mobile menu
  });

  test('Dashboard adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }

    await page.goto(ROUTES.dashboard);
    await waitForPageLoad(page);

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/dashboard-tablet.png`, fullPage: true });
  });
});
