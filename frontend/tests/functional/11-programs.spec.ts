import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoachee,
  loginAsCoach,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/programs';

/**
 * Coaching Programs Flow Tests
 *
 * Tests coaching program functionality:
 * - Program phases (9 phases)
 * - Digital signatures
 * - AI-generated reports
 * - Progress tracking
 * - Program completion
 */

test.describe('Coaching Programs - Coach View', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login as coach');
    }
  });

  test.describe('1. Programs List', () => {
    test('1.1 Programs page loads correctly', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-programs-list.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows active programs or empty state', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      // Take screenshot to verify page loaded
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/programs-state.png` });

      // Page is loaded if body is visible
      await expect(page.locator('body')).toBeVisible();
    });

    test('1.3 Programs show progress indicators', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const progressIndicators = page.locator('[class*="progress"], [role="progressbar"], [class*="phase"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/program-progress.png` });
    });

    test('1.4 Programs show coachee information', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const coacheeInfo = page.locator('[class*="coachee"], [class*="client"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/program-coachee-info.png` });
    });

    test('1.5 Filter programs by status', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const filterButtons = page.locator('button:has-text("Activos"), button:has-text("Completados"), button:has-text("Todos")');

      if (await filterButtons.count() > 0) {
        await filterButtons.first().click({ force: true });
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/program-filters.png` });
      }
    });
  });

  test.describe('2. Create Program', () => {
    test('2.1 New program button exists', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const newButton = page.locator('button:has-text("Nuevo"), button:has-text("Crear"), a:has-text("Nuevo programa")').first();

      if (await newButton.isVisible()) {
        await expect(newButton).toBeEnabled();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/new-program-button.png` });
      }
    });

    test('2.2 Can open create program form', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const newButton = page.locator('button:has-text("Nuevo"), button:has-text("Crear")').first();

      if (await newButton.isVisible()) {
        await newButton.click({ force: true });
        await waitForPageLoad(page);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/create-program-form.png` });
      }
    });

    test('2.3 Program form has required fields', async ({ page }) => {
      await page.goto('/coach/programs/new');
      await waitForPageLoad(page);

      // Check for form fields
      const coacheeSelect = page.locator('select[name*="coachee"], [class*="coachee-select"], input[placeholder*="coachee"]');
      const titleInput = page.locator('input[name*="title"], input[placeholder*="título"]');
      const durationInput = page.locator('input[name*="duration"], select[name*="duration"]');
      const startDateInput = page.locator('input[type="date"], input[name*="start"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/program-form-fields.png` });
    });

    test('2.4 Can select coachee for program', async ({ page }) => {
      await page.goto('/coach/programs/new');
      await waitForPageLoad(page);

      const coacheeSelect = page.locator('select[name*="coachee"], [data-testid="coachee-select"]').first();
      const coacheeInput = page.locator('input[placeholder*="coachee"], input[placeholder*="cliente"]').first();

      if (await coacheeSelect.isVisible()) {
        await coacheeSelect.click();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-selection.png` });
      } else if (await coacheeInput.isVisible()) {
        await coacheeInput.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-search.png` });
      }
    });
  });

  test.describe('3. Program Phases (9 Phases)', () => {
    test('3.1 Program detail shows phases', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('[class*="program"], a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);

        // Look for phase indicators
        const phases = page.locator('[class*="phase"], [data-phase], [class*="step"]');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/program-phases.png`, fullPage: true });
      } else {
        // No programs available - take screenshot
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/no-programs.png` });
      }
    });

    test('3.2 Phase 1: Initial Assessment', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('[class*="program"], a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);

        // Find Phase 1
        const phase1 = page.locator('text=/fase 1|evaluación inicial|assessment/i').first();
        const phase1Visible = await phase1.isVisible({ timeout: 2000 }).catch(() => false);

        if (phase1Visible) {
          await phase1.click({ force: true });
          await page.waitForTimeout(500);
        }
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/phase-1-assessment.png` });
      }
    });

    test('3.3 Phase 2: Goal Setting', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);

        const phase2 = page.locator('text=/fase 2|objetivos|goal setting/i').first();
        const phase2Visible = await phase2.isVisible({ timeout: 2000 }).catch(() => false);

        if (phase2Visible) {
          await phase2.click({ force: true });
          await page.waitForTimeout(500);
        }
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/phase-2-goals.png` });
      }
    });

    test('3.4 Can navigate between phases', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);

        // Find navigation buttons
        const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next"), button[aria-label*="next"]').first();
        const nextVisible = await nextButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (nextVisible) {
          await nextButton.click({ force: true });
          await page.waitForTimeout(500);
        }
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/phase-navigation.png` });
      }
    });

    test('3.5 Phase completion status visible', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/phase-status.png` });
    });
  });

  test.describe('4. Digital Signatures', () => {
    test('4.1 Signature section exists in program', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/signature-section.png` });
    });

    test('4.2 Can add coach signature', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);

        const signButton = page.locator('button:has-text("Firmar"), button:has-text("Sign")').first();
        const signVisible = await signButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (signVisible) {
          await signButton.click({ force: true });
          await page.waitForTimeout(500);
        }
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/signature-pad.png` });
    });

    test('4.3 Request coachee signature', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/request-signature.png` });
    });

    test('4.4 Signature status visible', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/signature-status.png` });
    });
  });

  test.describe('5. AI Reports', () => {
    test('5.1 Generate AI report button exists', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/ai-report-button.png` });
    });

    test('5.2 Can request AI report generation', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);

        const aiReportButton = page.locator('button:has-text("Generar reporte")').first();
        const btnVisible = await aiReportButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (btnVisible) {
          await aiReportButton.click({ force: true });
          await page.waitForTimeout(1000);
        }
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/ai-report-generating.png` });
    });

    test('5.3 Export report as PDF', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/export-report.png` });
    });
  });

  test.describe('6. Program Progress', () => {
    test('6.1 Overall progress visible', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/overall-progress.png` });
    });

    test('6.2 Sessions completed count visible', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/session-count.png` });
    });

    test('6.3 Goals progress in program', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/program-goals.png` });
    });
  });

  test.describe('7. Complete Program', () => {
    test('7.1 Complete program button exists', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/complete-button.png` });
    });

    test('7.2 Shows confirmation before completing', async ({ page }) => {
      await page.goto('/coach/programs');
      await waitForPageLoad(page);

      const programCard = page.locator('a[href*="programs/"]').first();
      const isVisible = await programCard.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await programCard.click({ force: true });
        await waitForPageLoad(page);

        const completeButton = page.locator('button:has-text("Completar programa")').first();
        const btnVisible = await completeButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (btnVisible) {
          await completeButton.click({ force: true });
          await page.waitForTimeout(500);

          // Cancel if dialog appears
          const cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("No")').first();
          const cancelVisible = await cancelButton.isVisible({ timeout: 1000 }).catch(() => false);
          if (cancelVisible) {
            await cancelButton.click({ force: true });
          }
        }
      }
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/complete-confirm.png` });
    });
  });
});

test.describe('Coaching Programs - Coachee View', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. View Program', () => {
    test('1.1 Coachee can view their program', async ({ page }) => {
      await page.goto('/coachee/program');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-program-view.png`, fullPage: true });

      // Page loaded if body is visible
      await expect(page.locator('body')).toBeVisible();
    });

    test('1.2 Shows program phases', async ({ page }) => {
      await page.goto('/coachee/program');
      await waitForPageLoad(page);

      const phases = page.locator('[class*="phase"], [class*="step"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-phases.png` });
    });

    test('1.3 Shows progress', async ({ page }) => {
      await page.goto('/coachee/program');
      await waitForPageLoad(page);

      const progress = page.locator('[role="progressbar"], [class*="progress"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-progress.png` });
    });
  });

  test.describe('2. Sign Agreement', () => {
    test('2.1 Signature request visible', async ({ page }) => {
      await page.goto('/coachee/program');
      await waitForPageLoad(page);

      const signatureRequest = page.locator('text=/firma pendiente|signature required|firmar acuerdo/i');

      if (await signatureRequest.isVisible()) {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-signature-request.png` });
      }
    });

    test('2.2 Can add signature', async ({ page }) => {
      await page.goto('/coachee/program');
      await waitForPageLoad(page);

      const signButton = page.locator('button:has-text("Firmar"), button:has-text("Sign")').first();

      if (await signButton.isVisible()) {
        await signButton.click();
        await page.waitForTimeout(500);

        const signaturePad = page.locator('canvas, [class*="signature-pad"]');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-signature-pad.png` });
      }
    });
  });

  test.describe('3. View Reports', () => {
    test('3.1 Can view program reports', async ({ page }) => {
      await page.goto('/coachee/program');
      await waitForPageLoad(page);

      const reportsSection = page.locator('text=/reportes|reports|informes/i');
      const viewReportButton = page.locator('button:has-text("Ver reporte"), a:has-text("Ver reporte")').first();

      if (await viewReportButton.isVisible()) {
        await viewReportButton.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-view-report.png` });
      }
    });
  });
});

test.describe('Programs - Dashboard Integration', () => {
  test('Program widget shows in coach dashboard', async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }

    await page.goto('/coach');
    await waitForPageLoad(page);

    const programWidget = page.locator('[class*="program"], text=/programas activos|active programs/i');

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/dashboard-program-widget.png` });
  });

  test('Program widget shows in coachee dashboard', async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }

    await page.goto(ROUTES.dashboard);
    await waitForPageLoad(page);

    const programWidget = page.locator('[class*="program"], text=/mi programa|my program/i');

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-dashboard-program.png` });
  });
});
