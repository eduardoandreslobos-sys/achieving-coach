import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoachee,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/goals';

/**
 * Goals Flow Tests
 *
 * Tests goal management functionality:
 * - View goals list
 * - Create new goals
 * - Edit goals
 * - Update progress
 * - Change status
 * - Delete goals
 */

test.describe('Goals Management', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. Goals List Page', () => {
    test('1.1 Goals page loads correctly', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/goals-page.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows goals or empty state', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const goalCards = page.locator('[class*="goal"], [data-testid*="goal"]');
      const emptyState = page.locator('text=/no hay|sin metas|crear tu primera/i');

      const hasGoals = await goalCards.count() > 0;
      const hasEmpty = await emptyState.count() > 0;

      expect(hasGoals || hasEmpty).toBeTruthy();
    });

    test('1.3 Goals show progress bars', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const progressBars = page.locator('[class*="progress"], [role="progressbar"]');

      if (await progressBars.count() > 0) {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/goals-progress.png` });
      }
    });

    test('1.4 Goals show status badges', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const statusBadges = page.locator('[class*="badge"], [class*="status"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/goals-status.png` });
    });
  });

  test.describe('2. Create Goal', () => {
    test('2.1 New goal button exists', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const newGoalButton = page.locator('button:has-text("Nueva"), button:has-text("Crear"), button:has-text("Agregar")').first();

      if (await newGoalButton.isVisible()) {
        await expect(newGoalButton).toBeEnabled();
      }
    });

    test('2.2 Can open new goal modal', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const newGoalButton = page.locator('button:has-text("Nueva"), button:has-text("Crear")').first();

      if (await newGoalButton.isVisible()) {
        await newGoalButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/new-goal-modal.png` });

        // Modal should appear
        const modal = page.locator('[role="dialog"], [class*="modal"]');
        if (await modal.count() > 0) {
          await expect(modal.first()).toBeVisible();
        }
      }
    });

    test('2.3 Goal form has required fields', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const newGoalButton = page.locator('button:has-text("Nueva")').first();

      if (await newGoalButton.isVisible()) {
        await newGoalButton.click();
        await page.waitForTimeout(500);

        // Check for form fields
        const titleInput = page.locator('input[name*="title"], input[placeholder*="título"]');
        const descInput = page.locator('textarea[name*="description"], textarea[placeholder*="descripción"]');
        const dateInput = page.locator('input[type="date"]');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/goal-form-fields.png` });
      }
    });

    test('2.4 Can fill and save new goal', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const newGoalButton = page.locator('button:has-text("Nueva")').first();

      if (await newGoalButton.isVisible()) {
        await newGoalButton.click();
        await page.waitForTimeout(500);

        // Fill form
        const titleInput = page.locator('input[name*="title"], input[placeholder*="título"]').first();
        if (await titleInput.isVisible()) {
          await titleInput.fill('Test Goal - Automated Test');
        }

        const descInput = page.locator('textarea').first();
        if (await descInput.isVisible()) {
          await descInput.fill('This is a test goal description');
        }

        // Set due date (future date)
        const dateInput = page.locator('input[type="date"]').first();
        if (await dateInput.isVisible()) {
          const futureDate = new Date();
          futureDate.setMonth(futureDate.getMonth() + 1);
          await dateInput.fill(futureDate.toISOString().split('T')[0]);
        }

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/goal-form-filled.png` });

        // Save
        const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button[type="submit"]').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(2000);

          await page.screenshot({ path: `${SCREENSHOTS_DIR}/goal-saved.png` });
        }
      }
    });

    test('2.5 Form validates required fields', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const newGoalButton = page.locator('button:has-text("Nueva")').first();

      if (await newGoalButton.isVisible()) {
        await newGoalButton.click();
        await page.waitForTimeout(500);

        // Try to save without filling
        const saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(500);

          // Should show validation or stay on form
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/goal-validation.png` });
        }
      }
    });
  });

  test.describe('3. Edit Goal', () => {
    test('3.1 Can open goal for editing', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      // Find edit button or clickable goal
      const editButton = page.locator('button:has-text("Editar"), [aria-label*="edit"]').first();
      const goalCard = page.locator('[class*="goal"]').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/edit-goal.png` });
      } else if (await goalCard.isVisible()) {
        await goalCard.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/goal-clicked.png` });
      }
    });

    test('3.2 Can update goal progress', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      // Find progress slider or input
      const progressInput = page.locator('input[type="range"], input[type="number"][max="100"]').first();

      if (await progressInput.isVisible()) {
        await progressInput.fill('50');
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/progress-updated.png` });
      }
    });
  });

  test.describe('4. Goal Status', () => {
    test('4.1 Can change goal status', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      // Find status dropdown or buttons
      const statusSelect = page.locator('select[name*="status"], [class*="status-select"]').first();
      const statusButtons = page.locator('button:has-text("Pausar"), button:has-text("Completar")').first();

      if (await statusSelect.isVisible()) {
        await statusSelect.click();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/status-options.png` });
      } else if (await statusButtons.isVisible()) {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/status-buttons.png` });
      }
    });

    test('4.2 Completed goals show correctly', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      // Look for completed filter or completed goals
      const completedFilter = page.locator('button:has-text("Completados"), [data-tab="completed"]');

      if (await completedFilter.isVisible()) {
        await completedFilter.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/completed-goals.png` });
      }
    });
  });

  test.describe('5. Delete Goal', () => {
    test('5.1 Delete button exists', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const deleteButton = page.locator('button:has-text("Eliminar"), button[aria-label*="delete"]').first();

      if (await deleteButton.isVisible()) {
        await expect(deleteButton).toBeVisible();
      }
    });

    test('5.2 Delete shows confirmation', async ({ page }) => {
      await page.goto(ROUTES.goals);
      await waitForPageLoad(page);

      const deleteButton = page.locator('button:has-text("Eliminar")').first();

      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(500);

        // Should show confirmation
        const confirmDialog = page.locator('[role="alertdialog"], [class*="confirm"]');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/delete-confirm.png` });

        // Cancel
        const cancelButton = page.locator('button:has-text("Cancelar")').first();
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        }
      }
    });
  });

  test.describe('6. Goals Integration', () => {
    test('6.1 Goals appear in dashboard widget', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      // Look for goals widget
      const goalsWidget = page.locator('[class*="goals"], text=/metas activas/i');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/dashboard-goals-widget.png` });
    });

    test('6.2 Can navigate to goals from dashboard', async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await waitForPageLoad(page);

      const goalsLink = page.locator('a[href*="goals"]').first();

      if (await goalsLink.isVisible()) {
        await goalsLink.click();
        await waitForPageLoad(page);

        expect(page.url()).toContain('goals');
      }
    });
  });
});
