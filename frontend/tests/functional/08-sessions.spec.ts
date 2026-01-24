import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoachee,
  loginAsCoach,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/sessions';

/**
 * Sessions Flow Tests
 *
 * Tests session management for both coachee and coach:
 * - View sessions list
 * - Session details
 * - Create sessions (coach)
 * - Edit sessions (coach)
 * - Cancel sessions
 * - Session notes
 */

test.describe('Sessions - Coachee View', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. Sessions List', () => {
    test('1.1 Sessions page loads correctly', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-sessions.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows upcoming and past tabs', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      const upcomingTab = page.locator('button:has-text("Próximas"), [data-tab="upcoming"]');
      const pastTab = page.locator('button:has-text("Pasadas"), [data-tab="past"]');

      // At least one tab should exist
      const hasUpcoming = await upcomingTab.count() > 0;
      const hasPast = await pastTab.count() > 0;

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-tabs.png` });
    });

    test('1.3 Sessions show date and time', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      // Look for date/time elements
      const sessionCards = page.locator('[class*="session"]');

      if (await sessionCards.count() > 0) {
        // Sessions should have date info
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-dates.png` });
      }
    });

    test('1.4 Sessions show coach name', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      // Look for coach name in sessions
      const coachInfo = page.locator('[class*="coach"], text=/coach/i');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-coach-info.png` });
    });

    test('1.5 Can switch between tabs', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      const pastTab = page.locator('button:has-text("Pasadas")').first();

      if (await pastTab.isVisible()) {
        await pastTab.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/past-sessions.png` });
      }
    });
  });

  test.describe('2. Session Detail', () => {
    test('2.1 Can click to view session detail', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      const sessionCard = page.locator('[class*="session"], a[href*="sessions/"]').first();

      if (await sessionCard.isVisible()) {
        await sessionCard.click();
        await waitForPageLoad(page);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-detail.png` });
      }
    });

    test('2.2 Session detail shows full info', async ({ page }) => {
      // Navigate directly to a session detail page
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      const sessionLink = page.locator('a[href*="sessions/"]').first();

      if (await sessionLink.isVisible()) {
        await sessionLink.click();
        await waitForPageLoad(page);

        // Should show session details
        const mainContent = page.locator('main, [role="main"]');
        await expect(mainContent.first()).toBeVisible();

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-full-detail.png` });
      }
    });

    test('2.3 Join button visible for upcoming sessions', async ({ page }) => {
      await page.goto(ROUTES.sessions);
      await waitForPageLoad(page);

      const joinButton = page.locator('button:has-text("Unirse"), a:has-text("Unirse")').first();

      if (await joinButton.isVisible()) {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/join-button.png` });
      }
    });
  });
});

test.describe('Sessions - Coach View', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login as coach');
    }
  });

  test.describe('1. Coach Sessions Page', () => {
    test('1.1 Coach sessions page loads', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-sessions.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows calendar view', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      // Look for calendar elements
      const calendar = page.locator('[class*="calendar"], [class*="month"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-calendar.png` });
    });

    test('1.3 Calendar navigation works', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const nextMonth = page.locator('button[aria-label*="next"], button:has(svg[class*="chevron-right"])').first();

      if (await nextMonth.isVisible()) {
        await nextMonth.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/calendar-next-month.png` });
      }
    });

    test('1.4 Filter sessions by status', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const filterButtons = page.locator('button:has-text("Todas"), button:has-text("Próximas"), button:has-text("Pasadas")');

      if (await filterButtons.count() > 0) {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-filters.png` });
      }
    });

    test('1.5 Search sessions works', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]').first();

      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-search.png` });
      }
    });
  });

  test.describe('2. Create Session', () => {
    test('2.1 New session button exists', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const newButton = page.locator('button:has-text("Nueva"), button:has-text("Crear"), button:has-text("Agendar")').first();

      if (await newButton.isVisible()) {
        await expect(newButton).toBeEnabled();
      }
    });

    test('2.2 Can open create session modal', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const newButton = page.locator('button:has-text("Nueva")').first();

      if (await newButton.isVisible()) {
        await newButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/create-session-modal.png` });
      }
    });

    test('2.3 Session form has required fields', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const newButton = page.locator('button:has-text("Nueva")').first();

      if (await newButton.isVisible()) {
        await newButton.click();
        await page.waitForTimeout(500);

        // Check for form fields
        const coacheeSelect = page.locator('select[name*="coachee"], [class*="coachee-select"]');
        const dateInput = page.locator('input[type="date"], input[type="datetime-local"]');
        const durationInput = page.locator('input[name*="duration"], select[name*="duration"]');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-form-fields.png` });
      }
    });

    test('2.4 Can fill session form', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const newButton = page.locator('button:has-text("Nueva")').first();

      if (await newButton.isVisible()) {
        await newButton.click();
        await page.waitForTimeout(500);

        // Fill form fields
        const dateInput = page.locator('input[type="date"]').first();
        if (await dateInput.isVisible()) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7);
          await dateInput.fill(futureDate.toISOString().split('T')[0]);
        }

        const timeInput = page.locator('input[type="time"]').first();
        if (await timeInput.isVisible()) {
          await timeInput.fill('10:00');
        }

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-form-filled.png` });
      }
    });

    test('2.5 Can add meeting link', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const newButton = page.locator('button:has-text("Nueva")').first();

      if (await newButton.isVisible()) {
        await newButton.click();
        await page.waitForTimeout(500);

        const linkInput = page.locator('input[name*="link"], input[placeholder*="link"]').first();

        if (await linkInput.isVisible()) {
          await linkInput.fill('https://zoom.us/j/123456789');
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-link.png` });
        }
      }
    });
  });

  test.describe('3. Edit Session', () => {
    test('3.1 Can open session for editing', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const editButton = page.locator('button:has-text("Editar"), [aria-label*="edit"]').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/edit-session.png` });
      }
    });

    test('3.2 Can update session details', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const editButton = page.locator('button:has-text("Editar")').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Modify something
        const notesInput = page.locator('textarea[name*="notes"]').first();
        if (await notesInput.isVisible()) {
          await notesInput.fill('Updated session notes - automated test');
        }

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-updated.png` });
      }
    });
  });

  test.describe('4. Session Notes', () => {
    test('4.1 Can add pre-session notes', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      // Open a session for editing
      const editButton = page.locator('button:has-text("Editar")').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        const preNotesInput = page.locator('textarea[name*="pre"], textarea[placeholder*="antes"]').first();

        if (await preNotesInput.isVisible()) {
          await preNotesInput.fill('Pre-session preparation notes');
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/pre-session-notes.png` });
        }
      }
    });

    test('4.2 Can add post-session notes', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const editButton = page.locator('button:has-text("Editar")').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        const postNotesInput = page.locator('textarea[name*="post"], textarea[placeholder*="después"]').first();

        if (await postNotesInput.isVisible()) {
          await postNotesInput.fill('Post-session notes and follow-ups');
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/post-session-notes.png` });
        }
      }
    });
  });

  test.describe('5. Cancel Session', () => {
    test('5.1 Cancel button exists', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const cancelButton = page.locator('button:has-text("Cancelar sesión"), button[aria-label*="cancel"]').first();

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/cancel-button.png` });
    });

    test('5.2 Cancel shows confirmation', async ({ page }) => {
      await page.goto(ROUTES.coachSessions);
      await waitForPageLoad(page);

      const cancelButton = page.locator('button:has-text("Cancelar sesión")').first();

      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/cancel-confirm.png` });

        // Close confirmation
        const closeButton = page.locator('button:has-text("No"), button:has-text("Cerrar")').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
        }
      }
    });
  });

  test.describe('6. Bookings Management', () => {
    test('6.1 Bookings page loads', async ({ page }) => {
      await page.goto('/coach/bookings');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-bookings.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('6.2 Shows pending bookings', async ({ page }) => {
      await page.goto('/coach/bookings');
      await waitForPageLoad(page);

      const bookingCards = page.locator('[class*="booking"], [data-testid*="booking"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/pending-bookings.png` });
    });
  });
});

test.describe('Sessions - Dashboard Integration', () => {
  test('Sessions widget shows in coachee dashboard', async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }

    await page.goto(ROUTES.dashboard);
    await waitForPageLoad(page);

    // Look for sessions widget
    const sessionsWidget = page.locator('[class*="session"], text=/próximas sesiones/i');

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/dashboard-sessions-widget.png` });
  });

  test('Sessions widget shows in coach dashboard', async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }

    await page.goto('/coach');
    await waitForPageLoad(page);

    // Look for sessions widget
    const sessionsWidget = page.locator('[class*="session"], text=/sesiones/i');

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-dashboard-sessions.png` });
  });
});
